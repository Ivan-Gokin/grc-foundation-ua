#!/usr/bin/env python3
"""One-off import of the legacy workbooks from grc-one-stop-shop-ua into the CSV data model.

Kept in the repo for provenance: it documents how every row in data/ was first derived.
After the initial import, data/*.csv are the source of truth and are edited directly.
SUPERSEDED: sources.csv, applicability.csv, source_relations.csv and sectors.csv were
replaced by scripts/merge_register_2026_10.py (2026-10-16). Do not re-run this script:
it would overwrite the merged register and the manual edits made since.

Usage:
    python3 scripts/import_legacy.py /path/to/grc-one-stop-shop-ua
"""
import csv
import datetime as dt
import re
import sys
import urllib.parse
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

LEGACY_LAWS = "Застосовне законодавство.xlsx"
LEGACY_CSF = "Матриця інтеграції NIST CSFv2.xlsx"
LEGACY_53 = "Базові профілі NIST SP 800-53r5.xlsx"

IMPORT_TAG = "legacy-import-2026-10"

# --------------------------------------------------------------------------- helpers

def clean(s):
    if s is None:
        return ""
    s = str(s).replace("\xa0", " ").replace("\r", "")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def one_line(s):
    return re.sub(r"\s*\n\s*", " ", clean(s)).strip()


def iso_date(v):
    if v is None or v == "":
        return ""
    if isinstance(v, (dt.datetime, dt.date)):
        return v.strftime("%Y-%m-%d")
    m = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", str(v))
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    return ""


UA_MONTHS = {
    "січня": 1, "лютого": 2, "березня": 3, "квітня": 4, "травня": 5, "червня": 6,
    "липня": 7, "серпня": 8, "вересня": 9, "жовтня": 10, "листопада": 11, "грудня": 12,
}


def date_from_title(t):
    m = re.search(r"від\s*(\d{1,2})\.(\d{1,2})\.(\d{4})", t)
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    m = re.search(r"(\d{1,2})\s*(" + "|".join(UA_MONTHS) + r")\s*(\d{4})", t)
    if m:
        return f"{m.group(3)}-{UA_MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}"
    return ""


def number_from_title(t):
    m = re.search(r"(?:№|N)\s*([0-9][0-9A-Za-zА-Яа-яІі/\-]*)", t)
    return m.group(1).rstrip("-/") if m else ""


def ddmmyyyy(iso):
    return f"{iso[8:10]}.{iso[5:7]}.{iso[0:4]}" if iso else ""


def roman(n):
    vals = [(10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
    out = ""
    for v, r in vals:
        while n >= v:
            out += r
            n -= v
    return out


TRANSLIT = str.maketrans({
    "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ie", "ж": "zh",
    "з": "z", "и": "y", "і": "i", "ї": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts",
    "ч": "ch", "ш": "sh", "щ": "shch", "ь": "", "ю": "iu", "я": "ia", "’": "", "'": "",
})


def slug(s):
    s = s.lower().translate(TRANSLIT)
    s = re.sub(r"[^a-z0-9.]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-.")


def extract_title(t):
    t1 = one_line(t)
    for pat in (r"«(.+?)»", r"\"(.+?)\"", r"“(.+?)”", r"„(.+?)“"):
        m = re.search(pat, t1)
        if m and len(m.group(1)) > 8:
            return m.group(1).strip(" ;.")
    return t1.strip(" ;")


def write_csv(path, header, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(header)
        for r in rows:
            w.writerow([r.get(h, "") for h in header])
    print(f"wrote {path.relative_to(ROOT)}: {len(rows)} rows")


# --------------------------------------------------------------------------- sources

CATEGORY_TYPE = {
    "Закони України": "law",
    "Укази Президента України": "presidential_decree",
    "Постанови Кабінету Міністрів України": "cmu_resolution",
    "Накази Адміністрації Держспецзв’язку": "ssscip_order",
    "Постанови Правління Національного банку України": "nbu_resolution",
    "Накази СБУ": "sbu_order",
    "Протоколи НКЦК": "nccc_decision",
    "НД ТЗІ": "nd_tzi",
    "ДСТУ": "dstu",
    "ВСТ": "vst",
    "Стандарти та політики НАТО": "nato_policy",
}
EXCLUDED_CATEGORIES = {"Закони Євросоюзу"}  # project scope: Ukraine-only operations

SHORT_REF = {  # type -> (uk, en) patterns
    "law": ("Закон України № {num}", "Law of Ukraine No. {num}"),
    "presidential_decree": ("Указ Президента України № {num}", "Presidential Decree No. {num}"),
    "cmu_resolution": ("Постанова КМУ № {num} від {date}", "CMU Resolution No. {num} of {date}"),
    "ssscip_order": ("Наказ Держспецзв’язку № {num} від {date}", "SSSCIP Order No. {num} of {date}"),
    "nbu_resolution": ("Постанова Правління НБУ № {num} від {date}", "NBU Board Resolution No. {num} of {date}"),
    "sbu_order": ("Наказ СБУ № {num} від {date}", "SBU Order No. {num} of {date}"),
    "nccc_decision": ("Протокол НКЦК № {num} від {date}", "NCCC Protocol No. {num} of {date}"),
}

TAG_MAP = [
    ("Національна_система_кібербезпеки", "national-cyber-system"),
    ("Критична_інфраструктура", "critical-infrastructure"),
    ("ОКІІ", "critical-infrastructure"),
    ("ОКІ", "critical-infrastructure"),
    ("Виявлення закладних", "tscm"),
    ("Оцінювання захищеності інформації усіх видів", "assessment-incl-state-secrets"),
    ("Оцінювання захищеності", "assessment-non-secret"),
    ("Відкриті_дані", "open-data"),
    ("Приватність", "privacy"),
    ("Хмара", "cloud"),
    ("НАТО", "nato"),
    ("ДСК", "restricted-info"),
    ("ТЗІ", "tzi"),
]


def map_tags(*cells):
    out = []
    for cell in cells:
        for part in clean(cell).split("#")[1:]:
            part = part.replace("\xa0", " ")
            for key, tag in TAG_MAP:
                if part.strip().startswith(key):
                    if tag not in out:
                        out.append(tag)
                    break
    return ";".join(out)


# Applicability overrides for core acts, keyed by legacy row number. Everything here is a
# DRAFT for the maintainer to verify (applicability.csv: verified=no).
APPLICABILITY_OVERRIDE = {
    "18": ["cii", "public"], "19": ["public"], "20": ["public"], "21": ["cii"],
    "22": ["telecom"], "23": ["public", "defence"], "24": ["trust"], "25": ["general"],
    "26": ["public"], "27": ["public", "cloud"], "28": ["public"], "29": ["public", "defence"],
    "30": ["public", "defence"], "31": ["public", "defence"], "32": ["public"],
    "33": ["cii"], "34": ["cii"], "35": ["cii"], "36": ["cii"], "37": ["public", "cii"],
    "38": ["public"], "39": ["public", "cii"], "41": ["public"], "42": ["public", "defence"],
    "43": ["public"], "45": ["public-restricted", "defence"], "46": ["public-restricted", "defence"],
    "47": ["public"], "48": ["public-restricted", "defence"], "50": ["public-restricted"],
    "52": ["public-restricted", "defence"], "53": ["public"], "54": ["public"], "55": ["cii"],
    "58": ["public", "cii"], "216": ["trust"], "201": ["trust"], "215": ["telecom"],
}

# Per-row corrections of parsing results (legacy row number -> field values)
ROW_FIX = {
    "211": {"binding": "mandatory"},  # catalogue + baseline measures; recommendations are an annex
    "174": {"binding": "mandatory"},
    "179": {"id": "ua-ssscip-er-09-2025", "type": "guidance", "number": "09-2025",
            "short_ref_uk": "Протокол ЕР з питань держекспертизи у сфері ТЗІ № 09-2025 від 14.03.2025",
            "short_ref_en": "TZI State Expertise Council Protocol No. 09-2025 of 14.03.2025"},
    "147": {"title_uk": "Directive on Personnel Security"},
    "148": {"title_uk": "Directive on Personnel Security"},
    "149": {"id": "nato-ac-35-d-2001-rev2", "number": "AC/35-D/2001-REV2",
            "short_ref_uk": "AC/35-D/2001-REV2", "short_ref_en": "AC/35-D/2001-REV2",
            "title_uk": "Directive on Physical Security"},
}

ROLE_OVERRIDE = {  # legacy no -> role
    "19": "context", "20": "context", "28": "context", "29": "context", "32": "context",
    "43": "context", "53": "context", "37": "context", "39": "context", "68": "context",
    "74": "context", "181": "amending",
}


def guess_applicability(no, typ, title, industry, tags):
    if no in APPLICABILITY_OVERRIDE:
        return APPLICABILITY_OVERRIDE[no], "draft: maintainer override"
    t = title.lower()
    ind = industry or ""
    if typ in ("nato_policy", "vst") or "Сили оборони" in ind:
        return ["defence"], "draft: legacy 'Галузь' / category"
    if typ == "nbu_resolution" or "Банки" in ind:
        return ["banking"], "draft: legacy 'Галузь' / category"
    if "Інтернет провайдери" in ind:
        return ["telecom"], "draft: legacy 'Галузь'"
    if "Надавачі електронних довірчих послуг" in ind or "довірч" in t or "електронної ідентифікац" in t:
        return ["trust"], "draft: legacy 'Галузь' / title keywords"
    if typ in ("nd_tzi", "dstu"):
        return ["public", "defence"], "draft: TZI/KSZI scope"
    out = []
    if "ОКІ" in ind or "critical-infrastructure" in tags or "критичн" in t:
        out.append("cii")
    if "нато" in t:
        out.append("defence")
    if "службов" in t or "обмеженим доступом" in t:
        out.append("public-restricted")
    if "державних інформаційних ресурс" in t or "державн" in t or "tzi" in tags:
        out.append("public")
    if "national-cyber-system" in tags or "кіберінцидент" in t or "кіберзахист" in t:
        for s in ("public", "cii"):
            if s not in out:
                out.append(s)
    if not out:
        out = ["public"]
    return out, "draft: title keywords / tags"


def source_id(typ, title, url, num, date, used):
    t = one_line(title)
    sid = ""
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path) if url.startswith("http") else ""
    if typ == "law":
        m = re.search(r"/show/(\d+)-(\d{2})(?:/|$|#)", path + "/")
        if m:
            sid = f"ua-law-{m.group(1)}-{roman(int(m.group(2)) - 11).lower()}"
            num = f"{m.group(1)}-{roman(int(m.group(2)) - 11)}"
        elif "80/94" in path:
            sid, num = "ua-law-80-94-vr", "80/94-ВР"
    elif typ == "presidential_decree":
        m = re.search(r"/show/(\d+)/(\d{2,4})", path)
        if m:
            yr = m.group(2)
            yr = yr if len(yr) == 4 else ("19" + yr if int(yr) > 50 else "20" + yr)
            sid, num = f"ua-pres-{m.group(1)}-{yr}", f"{m.group(1)}/{yr}"
    elif typ in ("nd_tzi", "dstu", "vst"):
        m = re.search(r"(НД ТЗІ|ДСТУ|ВСТ)\s*([0-9][0-9.\-]*[0-9])", t)
        if m:
            sid = {"nd_tzi": "ua-ndtzi-", "dstu": "ua-dstu-", "vst": "ua-vst-"}[typ] + m.group(2)
            num = m.group(2)
    elif typ == "nato_policy":
        code = re.split(r"[,.]\s|\s\(|\s[A-Z][a-z]", t.replace("АС/", "AC/"))[0]
        sid, num = "nato-" + slug(code), code.strip()
    if not sid:
        prefix = {
            "cmu_resolution": "ua-cmu-", "ssscip_order": "ua-ssscip-", "nbu_resolution": "ua-nbu-",
            "sbu_order": "ua-sbu-", "nccc_decision": "ua-nccc-",
        }.get(typ, "ua-src-")
        n = slug(num.split("/")[0]) if num else ""
        sid = f"{prefix}{n}-{date[:4]}" if n and date else ""
    if not sid:
        sid = "ua-src-" + slug(t[:40])
    base, k = sid, 2
    while sid in used:
        sid = f"{base}-{k}"
        k += 1
    used.add(sid)
    return sid, num


def import_sources(legacy_dir):
    wb = openpyxl.load_workbook(legacy_dir / LEGACY_LAWS, data_only=True)
    ws = wb.worksheets[0]
    rows = [r[1:11] for r in ws.iter_rows(min_row=19, values_only=True)]
    rows = [r for r in rows if any(v is not None for v in r)]

    sources, applic, used = [], [], set()
    for r in rows:
        no, title, url, comment, cat, appl, tags_cell, adopted, industry, registered = [
            r[i] if i < len(r) else None for i in range(10)
        ]
        no, cat = clean(no), clean(cat)
        if cat in EXCLUDED_CATEGORIES:
            continue
        typ = CATEGORY_TYPE.get(cat, "other")
        title_raw = clean(title)
        url = clean(url)
        url = "" if url in ("Н/З", "None") else url
        comment = clean(comment)
        date = iso_date(adopted) or date_from_title(title_raw)
        if typ == "nato_policy" and date.endswith("-01-01"):
            date = ""  # legacy placeholders (year only); real dates unknown
        num = number_from_title(one_line(title_raw))
        sid, num = source_id(typ, title_raw, url, num, date, used)

        repealed = clean(appl) == "Втратив чинність" or re.search(r"Втратив чинність", comment)
        title_uk = extract_title(title_raw)
        if typ in ("nd_tzi", "dstu", "vst"):
            title_uk = re.sub(r"^(Національний стандарт\s*)?(НД ТЗІ|ДСТУ|ВСТ)\s*[0-9][0-9.\-]*[0-9]\s*(\(01\)\.?)?\s*", "", one_line(title_raw)).strip(" .«»\"")
        if typ == "nato_policy":
            title_uk = re.sub(r"^" + re.escape(num) + r"[\s,.]*", "", one_line(title_raw)).strip(" .;") or num
            title_uk = re.sub(r"\.?\s*NATO Unclassified;?$", "", title_uk).strip(" .;")
            title_uk = re.sub(r"^\((INV|CISS)\)[\s,.]*", "", title_uk).strip(" .;")

        ref_uk = ref_en = ""
        if typ in SHORT_REF and num:
            pu, pe = SHORT_REF[typ]
            if not date:
                pu, pe = pu.replace(" від {date}", ""), pe.replace(" of {date}", "")
            ref_uk = pu.format(num=num, date=ddmmyyyy(date))
            ref_en = pe.format(num=num, date=ddmmyyyy(date))
        elif typ == "nd_tzi":
            ref_uk, ref_en = f"НД ТЗІ {num}", f"ND TZI {num}"
        elif typ == "dstu":
            ref_uk, ref_en = f"ДСТУ {num}", f"DSTU {num}"
        elif typ == "vst":
            ref_uk, ref_en = f"ВСТ {num}", f"VST {num}"
        elif typ == "nato_policy":
            ref_uk = ref_en = num
        if not ref_uk:
            ref_uk = one_line(title_raw)[:90]

        low = (title_uk + " " + one_line(title_raw)).lower()
        binding = "mandatory"
        if typ == "dstu" or re.search(r"методичн|рекомендац|примірн", low):
            binding = "recommended"

        if typ == "nato_policy":
            text_access = "public" if url else "restricted"
        elif not url or comment.upper().startswith("ДСК") or "/ДСК" in title_raw:
            text_access = "restricted"
        else:
            text_access = "public"

        tags = map_tags(tags_cell, industry)
        role = ROLE_OVERRIDE.get(no, "requirements")
        if re.search(r"Процедурний документ", comment):
            role = "procedural"

        desc = comment
        if desc.upper() in ("ДСК",):
            desc = ""
        fix = ROW_FIX.get(no, {})
        if "id" in fix:
            used.discard(sid)
            sid = fix["id"]
            used.add(sid)
        num = fix.get("number", num)
        ref_uk = fix.get("short_ref_uk", ref_uk)
        ref_en = fix.get("short_ref_en", ref_en)
        title_uk = fix.get("title_uk", title_uk)
        binding = fix.get("binding", binding)
        typ = fix.get("type", typ)
        sources.append({
            "id": sid, "legacy_no": no, "type": typ, "number": num, "adopted": date,
            "registered": iso_date(registered), "short_ref_uk": ref_uk, "short_ref_en": ref_en,
            "title_uk": title_uk, "title_en": title_uk if typ == "nato_policy" else "",
            "description_uk": desc, "description_en": "",
            "status": "repealed" if repealed else "in_force", "binding": binding, "role": role,
            "text_access": text_access, "url": url, "tags": tags, "last_verified": "",
            "notes": IMPORT_TAG,
        })
        sectors, basis = guess_applicability(no, typ, one_line(title_raw), clean(industry), tags)
        for s in sectors:
            applic.append({"source_id": sid, "sector_id": s, "basis": basis, "verified": "no"})
    return sources, applic


# --------------------------------------------------------------------------- CSF 2.0

CSF_FUNCTIONS_UK = {
    "GV": "Управління (Govern)", "ID": "Ідентифікація (Identify)", "PR": "Захист (Protect)",
    "DE": "Виявлення (Detect)", "RS": "Реагування (Respond)", "RC": "Відновлення (Recover)",
}
CSF_NAMES_EN = {
    "GV": "Govern", "ID": "Identify", "PR": "Protect", "DE": "Detect", "RS": "Respond", "RC": "Recover",
    "GV.OC": "Organizational Context", "GV.RM": "Risk Management Strategy",
    "GV.RR": "Roles, Responsibilities, and Authorities", "GV.PO": "Policy", "GV.OV": "Oversight",
    "GV.SC": "Cybersecurity Supply Chain Risk Management", "ID.AM": "Asset Management",
    "ID.RA": "Risk Assessment", "ID.IM": "Improvement",
    "PR.AA": "Identity Management, Authentication, and Access Control",
    "PR.AT": "Awareness and Training", "PR.DS": "Data Security", "PR.PS": "Platform Security",
    "PR.IR": "Technology Infrastructure Resilience", "DE.CM": "Continuous Monitoring",
    "DE.AE": "Adverse Event Analysis", "RS.MA": "Incident Management", "RS.AN": "Incident Analysis",
    "RS.CO": "Incident Response Reporting and Communication", "RS.MI": "Incident Mitigation",
    "RC.RP": "Incident Recovery Plan Execution", "RC.CO": "Incident Recovery Communication",
}
CSF_NAMES_UK = {
    "GV": "Управління", "ID": "Ідентифікація", "PR": "Захист", "DE": "Виявлення", "RS": "Реагування",
    "RC": "Відновлення",
    "GV.OC": "Контекст організації", "GV.RM": "Стратегія управління ризиками",
    "GV.RR": "Ролі, обов’язки та повноваження", "GV.PO": "Політика", "GV.OV": "Нагляд",
    "GV.SC": "Управління ризиками ланцюга постачання", "ID.AM": "Управління активами",
    "ID.RA": "Оцінювання ризиків", "ID.IM": "Удосконалення",
    "PR.AA": "Керування ідентифікаторами, автентифікація та контроль доступу",
    "PR.AT": "Обізнаність і навчання", "PR.DS": "Безпека даних", "PR.PS": "Безпека платформ",
    "PR.IR": "Стійкість технологічної інфраструктури", "DE.CM": "Безперервний моніторинг",
    "DE.AE": "Аналіз несприятливих подій", "RS.MA": "Управління інцидентами",
    "RS.AN": "Аналіз інцидентів", "RS.CO": "Звітування та комунікація під час реагування",
    "RS.MI": "Пом’якшення наслідків інцидентів", "RC.RP": "Виконання плану відновлення",
    "RC.CO": "Комунікація під час відновлення",
}


def norm53(cid):
    cid = clean(cid).upper().replace(" ", "")
    m = re.match(r"^([A-Z]{2})-0*(\d+)(?:\(0*(\d+)\))?$", cid)
    if not m:
        return cid
    return f"{m.group(1)}-{int(m.group(2))}" + (f"({int(m.group(3))})" if m.group(3) else "")


def import_csf(legacy_dir, sources_by_legacy):
    wb = openpyxl.load_workbook(legacy_dir / LEGACY_CSF, data_only=True)
    ws = wb["NIST CSF 2.0"]
    rows = list(ws.iter_rows(values_only=True))[1:]
    ws2 = wb["NIST CSF 2.0->NIST SP 800-53"]
    rows2 = list(ws2.iter_rows(values_only=True))[2:]

    desc_en = {}
    for r in rows2:
        if r[0] and r[1]:
            desc_en.setdefault(clean(r[0]), one_line(r[1]))

    controls, provisions, mappings, csf53 = [], [], [], []
    seen_parent = set()
    for r in rows:
        cid = clean(r[0])
        if not cid:
            continue
        fn, cat = cid[:2], cid.split("-")[0]
        for pid in (fn, cat):
            if pid not in seen_parent:
                seen_parent.add(pid)
                controls.append({
                    "id": pid, "level": "function" if pid == fn else "category",
                    "parent": "" if pid == fn else fn, "sort": len(controls),
                    "name_en": CSF_NAMES_EN[pid], "name_uk": CSF_NAMES_UK[pid],
                    "text_en": desc_en.get(pid, ""), "text_uk": "",
                    "text_uk_source": "",
                })
        controls.append({
            "id": cid, "level": "subcategory", "parent": cat, "sort": len(controls),
            "name_en": "", "name_uk": "", "text_en": one_line(r[1]), "text_uk": one_line(r[2]),
            "text_uk_source": "ua-ssscip-75-2026",
        })
        # Regulator baseline (stars in legacy columns 24-27) -> provisions of SSSCIP order 75/2026
        if clean(r[23]) == "Так":
            applies = []
            if clean(r[24]):
                applies.append("cii-1-2")
            if clean(r[25]):
                applies.append("cii-3-4")
            if clean(r[26]):
                applies.append("public-sir")
            if clean(r[27]):
                applies.append("public-restricted")
            pid = f"ua-ssscip-75-2026:base:{cid}"
            provisions.append({
                "id": pid, "source_id": "ua-ssscip-75-2026",
                "ref_uk": f"Базові заходи з кіберзахисту, {cid}",
                "ref_en": f"Baseline cybersecurity measures, {cid}",
                "summary_uk": one_line(r[2]), "summary_en": one_line(r[1]),
                "provision_type": "substantive", "applies_to": ";".join(applies),
                "notes": IMPORT_TAG,
            })
            mappings.append({
                "provision_id": pid, "framework_id": "csf-2.0", "control_id": cid,
                "relationship": "equal", "rationale": "semantic", "strength": "10",
                "coverage": "full", "parameter_uk": "", "parameter_en": "",
                "notes_uk": "Базовий захід є адаптованим перекладом підкатегорії CSF 2.0",
                "notes_en": "The baseline measure is an adapted translation of the CSF 2.0 subcategory",
                "mapped_by": "legacy matrix (I. Gokin)", "reviewed_by": "",
                "review_status": "imported", "date": "2026-10-16",
            })

    for r in rows2:
        if not r[0] or not r[2]:
            continue
        for part in re.split(r"[,\n]+", str(r[2])):
            if part.strip():
                csf53.append({
                    "csf_id": clean(r[0]), "sp800_53_id": norm53(part),
                    "relationship": "", "source": "NIST CSF 2.0 to SP 800-53 Rev. 5 informative reference",
                })
    # de-duplicate
    seen, out53 = set(), []
    for m in csf53:
        k = (m["csf_id"], m["sp800_53_id"])
        if k not in seen:
            seen.add(k)
            out53.append(m)
    return controls, provisions, mappings, out53


def param(v):
    v = one_line(v)
    return "" if v in ("0", "None", "#N/A") else v  # legacy formula placeholders


def import_53(legacy_dir):
    wb = openpyxl.load_workbook(legacy_dir / LEGACY_53, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    out = []
    for r in list(ws.iter_rows(values_only=True))[1:]:
        if not r[0]:
            continue
        cid = norm53(r[0])
        name_en = clean(r[1])
        out.append({
            "id": cid, "family": cid[:2], "enhancement": "yes" if "(" in cid else "no",
            "name_en": name_en, "name_uk_machine": clean(r[2]),
            "withdrawn": "yes" if name_en.lower().startswith("withdrawn") or "[withdrawn" in name_en.lower() else "no",
            "open": "yes" if clean(r[8]) else "", "open_params_uk": param(r[9]),
            "dsk": "yes" if clean(r[10]) else "", "dsk_params_uk": param(r[11]),
            "nato": "yes" if clean(r[12]) else "", "nato_params_uk": param(r[13]),
        })
    return out


# --------------------------------------------------------------------------- seed (not legacy)
# Everything below was drafted during the import as a starting point, NOT taken from the
# legacy workbooks. It is marked review_status=draft / verified=no and must be reviewed.

SEED_RELATIONS = [  # (source_id, relation, related_id, basis)
    ("ua-ssscip-75-2026", "replaces", "ua-ssscip-54-2025", "legacy comment on order 54/2025"),
    ("ua-ssscip-143-2026", "replaces", "ua-ssscip-570-2023", "legacy comment: replaces 2023 recommendations"),
    ("ua-cmu-518-2019", "issued_under", "ua-law-2163-viii", "draft"),
    ("ua-cmu-943-2020", "issued_under", "ua-law-2163-viii", "draft"),
    ("ua-cmu-1176-2020", "issued_under", "ua-law-2163-viii", "draft"),
    ("ua-cmu-1426-2021", "issued_under", "ua-law-2163-viii", "draft"),
    ("ua-cmu-415-2023", "issued_under", "ua-law-1882-ix", "draft"),
    ("ua-cmu-373-2006", "issued_under", "ua-law-80-94-vr", "draft"),
    ("ua-law-4336-ix", "amends", "ua-law-2163-viii", "draft: title of law 4336-IX"),
    ("ua-law-4336-ix", "amends", "ua-law-80-94-vr", "draft: title of law 4336-IX"),
]

# Provisions taken from paragraph notes in the legacy 'Коментар' column.
SEED_PROVISIONS = [  # id, source, ref_uk, ref_en, summary_uk, summary_en, type
    ("ua-cmu-373-2006:p4", "ua-cmu-373-2006", "п. 4", "para. 4",
     "Вимоги до захисту інформації в системі", "Requirements for protecting information in the system", "substantive"),
    ("ua-cmu-373-2006:p7", "ua-cmu-373-2006", "п. 7", "para. 7",
     "Ідентифікація, автентифікація та авторизація користувачів", "User identification, authentication and authorisation", "substantive"),
    ("ua-cmu-373-2006:p11", "ua-cmu-373-2006", "п. 11", "para. 11",
     "Реєстрація (логування) дій користувачів", "Logging of user actions", "substantive"),
    ("ua-cmu-373-2006:p16", "ua-cmu-373-2006", "п. 16", "para. 16",
     "Створення комплексної системи захисту інформації (КСЗІ)", "Implementing a comprehensive information protection system (KSZI)", "substantive"),
    ("ua-cmu-373-2006:p17", "ua-cmu-373-2006", "п. 17", "para. 17",
     "Відповідальність за забезпечення захисту інформації", "Responsibility for information protection", "substantive"),
    ("ua-cmu-736-2016:p34-41", "ua-cmu-736-2016", "пп. 34–41", "paras. 34–41",
     "Облік і використання зовнішніх (знімних) носіїв", "Registration and use of external (removable) media", "substantive"),
    ("ua-cmu-736-2016:p42-53", "ua-cmu-736-2016", "пп. 42–53", "paras. 42–53",
     "Обмеження друку документів зі службовою інформацією", "Restrictions on printing documents containing official information", "substantive"),
    ("ua-cmu-736-2016:p54-62", "ua-cmu-736-2016", "пп. 54–62", "paras. 54–62",
     "Обмеження надсилання документів зі службовою інформацією", "Restrictions on sending documents containing official information", "substantive"),
    ("ua-cmu-736-2016:p92", "ua-cmu-736-2016", "п. 92", "para. 92",
     "Знищення документів", "Destruction of documents", "substantive"),
    ("ua-cmu-736-2016:p100", "ua-cmu-736-2016", "п. 100", "para. 100",
     "Фізичний доступ до приміщень і документів", "Physical access to premises and documents", "substantive"),
]

# Draft mappings (provision, framework, control, relationship, coverage)
SEED_MAPPINGS = [
    ("ua-cmu-373-2006:p7", "iso27001-2022", "A.5.15", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p7", "iso27001-2022", "A.8.5", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p7", "csf-2.0", "PR.AA-03", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p7", "csf-2.0", "PR.AA-05", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p11", "iso27001-2022", "A.8.15", "subset_of", "full"),
    ("ua-cmu-373-2006:p11", "csf-2.0", "PR.PS-04", "subset_of", "full"),
    ("ua-cmu-373-2006:p16", "iso27001-2022", "A.5.31", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p16", "csf-2.0", "GV.OC-03", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p17", "iso27001-2022", "5.3", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p17", "iso27001-2022", "A.5.2", "intersects_with", "partial"),
    ("ua-cmu-373-2006:p17", "csf-2.0", "GV.RR-02", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p34-41", "iso27001-2022", "A.7.10", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p34-41", "csf-2.0", "PR.DS-01", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p42-53", "iso27001-2022", "A.8.12", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p42-53", "csf-2.0", "PR.DS-01", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p54-62", "iso27001-2022", "A.5.14", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p54-62", "csf-2.0", "PR.DS-02", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p92", "iso27001-2022", "A.7.10", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p92", "iso27001-2022", "A.8.10", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p92", "csf-2.0", "ID.AM-08", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p100", "iso27001-2022", "A.7.2", "intersects_with", "partial"),
    ("ua-cmu-736-2016:p100", "csf-2.0", "PR.AA-06", "intersects_with", "partial"),
]
SEED_NOTE_UK = {
    "ua-cmu-373-2006:p16": "КСЗІ з державною експертизою не має прямого відповідника в ISO/CSF і залишається окремим обов’язком",
}
SEED_NOTE_EN = {
    "ua-cmu-373-2006:p16": "A KSZI with state expertise has no direct ISO/CSF equivalent and remains a separate obligation",
}


def seed_rows():
    rel = [{"source_id": a, "relation": b, "related_id": c, "basis": d, "verified": "no"}
           for a, b, c, d in SEED_RELATIONS]
    prov = [{"id": i, "source_id": s, "ref_uk": ru, "ref_en": re_, "summary_uk": su, "summary_en": se,
             "provision_type": t, "applies_to": "", "notes": "paragraph from legacy comment"}
            for i, s, ru, re_, su, se, t in SEED_PROVISIONS]
    maps = [{"provision_id": p, "framework_id": f, "control_id": c, "relationship": r,
             "rationale": "semantic", "strength": "", "coverage": cov, "parameter_uk": "",
             "parameter_en": "", "notes_uk": SEED_NOTE_UK.get(p, ""), "notes_en": SEED_NOTE_EN.get(p, ""),
             "mapped_by": "draft (Claude)", "reviewed_by": "", "review_status": "draft",
             "date": "2026-10-16"} for p, f, c, r, cov in SEED_MAPPINGS]
    return rel, prov, maps


# --------------------------------------------------------------------------- main

def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    legacy = Path(sys.argv[1])
    sources, applic = import_sources(legacy)
    tr_file = Path(__file__).with_name("legacy_translations_en.csv")
    if tr_file.exists():  # machine translations made during the import (review needed)
        tr = {r["id"]: r for r in csv.DictReader(open(tr_file, encoding="utf-8"))}
        for src in sources:
            if src["id"] in tr:
                src["title_en"] = src["title_en"] or tr[src["id"]]["title_en"]
                src["description_en"] = tr[src["id"]]["description_en"]
    by_legacy = {s["legacy_no"]: s for s in sources}
    controls, csf_prov, csf_maps, csf53 = import_csf(legacy, by_legacy)
    b53 = import_53(legacy)

    write_csv(DATA / "sources.csv", [
        "id", "legacy_no", "type", "number", "adopted", "registered", "short_ref_uk", "short_ref_en",
        "title_uk", "title_en", "description_uk", "description_en", "status", "binding", "role",
        "text_access", "url", "tags", "last_verified", "notes"], sources)
    write_csv(DATA / "applicability.csv", ["source_id", "sector_id", "basis", "verified"], applic)
    write_csv(DATA / "controls_csf-2.0.csv", [
        "id", "level", "parent", "sort", "name_en", "name_uk", "text_en", "text_uk", "text_uk_source"], controls)
    rel, seed_prov, seed_maps = seed_rows()
    write_csv(DATA / "source_relations.csv", ["source_id", "relation", "related_id", "basis", "verified"], rel)
    write_csv(DATA / "provisions.csv", [
        "id", "source_id", "ref_uk", "ref_en", "summary_uk", "summary_en", "provision_type",
        "applies_to", "notes"], seed_prov + csf_prov)
    write_csv(DATA / "mappings.csv", [
        "provision_id", "framework_id", "control_id", "relationship", "rationale", "strength",
        "coverage", "parameter_uk", "parameter_en", "notes_uk", "notes_en", "mapped_by",
        "reviewed_by", "review_status", "date"], seed_maps + csf_maps)
    write_csv(DATA / "sp800-53" / "map_csf-2.0_sp800-53r5.csv",
              ["csf_id", "sp800_53_id", "relationship", "source"], csf53)
    write_csv(DATA / "sp800-53" / "baselines_ua.csv", [
        "id", "family", "enhancement", "name_en", "name_uk_machine", "withdrawn", "open",
        "open_params_uk", "dsk", "dsk_params_uk", "nato", "nato_params_uk"], b53)


if __name__ == "__main__":
    main()
