#!/usr/bin/env python3
"""One-off merge (2026-10-16) of the register work done in a parallel project build.

That build extended the legacy register to 288 acts and added, per act:
annotations in Ukrainian and English ("what it is" + "who it concerns"), 23 entity
tags, corrected statuses/dates/links, international agreements, Ukrainian bills,
EU acts (kept here as a separate reference list) and 159 regulatory links with
their legal basis.

Inputs (not committed, they are build artefacts of that project):
  <preview>/legislation.html, <preview>/en/legislation.html   rendered register (UK, EN)
  <links.csv>   parent, child, type, basis, source, confidence (register numbers)

Kept for provenance; data/*.csv are the source of truth after this merge.
Do not re-run it: it reads the pre-merge sources.csv and OVERWRITES sources.csv,
applicability.csv and source_relations.csv, losing every edit made since.

Usage: python3 scripts/merge_register_2026_10.py <preview_dir> <links.csv>
"""
import csv
import html
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from import_legacy import extract_title, slug, write_csv  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
NOTE = "merge-2026-10"

# ------------------------------------------------------------------ vocabularies

ENTITY = {  # Ukrainian tag in the register -> sector id
    "Усі організації": "general", "Оператори КІ": "ki", "ОКІІ": "kii",
    "Державний сектор": "public-sector", "Основні суб'єкти НСК": "ncs-bodies",
    "Державні ІР і ІзОД": "state-ir", "Державна таємниця": "state-secrets",
    "Інформація НАТО": "nato-info", "Сили оборони": "defence",
    "Оборонна промисловість": "defence-industry", "Фінансовий сектор": "finance",
    "Електронні комунікації": "telecom", "Довірчі послуги та ідентифікація": "trust",
    "Хмарні послуги та ЦОД": "cloud", "Цифрові платформи": "platforms",
    "Охорона здоров'я": "health", "Промислові системи керування": "ics",
    "Системи ШІ": "ai", "Обробники персональних даних": "personal-data",
    "Виробники ПЗ та обладнання": "vendors", "Постачальники ІКТ": "ict-suppliers",
    "Надавачі послуг кібербезпеки": "security-services",
    "Загальна рамка": None,  # not an entity type: marks acts without direct duties
}
CATEGORY_TYPE = {
    "Закони України": "law", "Укази Президента України": "presidential_decree",
    "Постанови Кабінету Міністрів України": "cmu_resolution",
    "Накази Адміністрації Держспецзв'язку": "ssscip_order",
    "Постанови Правління Національного банку України": "nbu_resolution",
    "Накази СБУ": "sbu_order", "Протоколи НКЦК": "nccc_decision", "НД ТЗІ": "nd_tzi",
    "ДСТУ": "dstu", "ВСТ": "vst", "Стандарти та політики НАТО": "nato_policy",
    "Міжнародні договори": "international_agreement", "Закони Євросоюзу": "eu_act",
    "Проєкти актів ЄС": "eu_proposal", "Законопроєкти України": "ua_bill",
    "Накази Міністерства юстиції України": "moj_order",
    "Накази інших центральних органів виконавчої влади": "other_order",
}
REFERENCE_TYPES = {"eu_act", "eu_proposal"}
DOMAIN = {"Кібербезпека": "cybersecurity", "Управління якістю та діловодство": "records"}

# Fixed ids/refs for acts the generic rules cannot name well (register number -> fields)
FIX = {
    229: dict(id="intl-eu-ua-association-agreement", short_ref_uk="Угода про асоціацію Україна - ЄС",
              short_ref_en="EU-Ukraine Association Agreement"),
    230: dict(id="intl-coe-ets-185", short_ref_uk="Конвенція про кіберзлочинність (ETS 185)",
              short_ref_en="Budapest Convention on Cybercrime (ETS 185)"),
    231: dict(id="intl-coe-cets-224", short_ref_uk="Другий додатковий протокол до Будапештської конвенції (CETS 224)",
              short_ref_en="Second Additional Protocol to the Budapest Convention (CETS 224)"),
    232: dict(id="intl-coe-ets-108", short_ref_uk="Конвенція 108 Ради Європи (ETS 108)",
              short_ref_en="Council of Europe Convention 108 (ETS 108)"),
    233: dict(id="intl-coe-cets-225", short_ref_uk="Рамкова конвенція Ради Європи про ШІ (CETS 225)",
              short_ref_en="Council of Europe Framework Convention on AI (CETS 225)"),
    234: dict(id="intl-ua-nato-security-agreement", short_ref_uk="Угода про безпеку між Україною і НАТО",
              short_ref_en="Ukraine-NATO Security Agreement"),
    255: dict(id="ua-law-679-xiv", number="679-XIV"),
    256: dict(id="ua-law-2121-iii", number="2121-III"),
    257: dict(id="ua-law-3855-xii", number="3855-XII"),
    258: dict(id="ua-law-74-98-vr", number="74/98-ВР", short_ref_uk="Закон України № 74/98-ВР",
              short_ref_en="Law of Ukraine No. 74/98-VR"),
    286: dict(id="ua-egov-60-2018", short_ref_uk="Наказ Держагентства з питань електронного урядування № 60 від 07.09.2018",
              short_ref_en="State Agency for E-Government Order No. 60 of 07.09.2018"),
    288: dict(id="ua-law-pravotvorcha-diialnist", short_ref_uk="Закон України \"Про правотворчу діяльність\"",
              short_ref_en="Law of Ukraine \"On Law-Making Activity\""),
    271: dict(id="ua-nbu-70-2026", number="70, 72, 73",
              short_ref_uk="Постанови Правління НБУ № 70, 72, 73 від 30.06.2026",
              short_ref_en="NBU Board Resolutions No. 70, 72, 73 of 30.06.2026",
              title_uk="Щодо управління ризиком третіх сторін (банки, надавачі платіжних послуг, страховики)",
              title_en="On third-party risk management (banks, payment service providers, insurers)"),
}
STATUS = {"Чинний": "in_force", "Втратив чинність": "repealed"}

FIELDS = ["id", "register_no", "scope", "domain", "type", "number", "adopted", "registered",
          "short_ref_uk", "short_ref_en", "title_uk", "title_en", "description_uk", "description_en",
          "concerns_uk", "concerns_en", "comment_uk", "status", "binding", "role", "text_access",
          "url", "tags", "last_verified", "notes"]


def unesc(s):
    return html.unescape(s or "").strip()


def parse_page(path):
    """Register number -> dict of what the rendered row shows."""
    text = Path(path).read_text(encoding="utf-8")
    data = json.loads(re.search(r'<script type="application/json" id="reg-data">(.*?)</script>',
                                text, re.S).group(1).replace("<\\/", "</"))
    pay = {r[0]: r for r in data["rows"]}
    out = {}
    for body, num in re.findall(r'(<tr id="r-(\d+)".*?</tr>)', text, re.S):
        a = re.search(r'data-domain="([^"]*)" data-cat="([^"]*)" data-status="([^"]*)" data-ents="([^"]*)"', body)
        doc = re.search(r'<td class="reg-doc">(.*?)</td>', body, re.S).group(1)
        m = re.match(r'\s*(?:<a [^>]*>(.*?)</a>|([^<]*))', doc, re.S)
        title = unesc(m.group(1) if m.group(1) is not None else m.group(2))
        sub = re.search(r'<p class="reg-sub">(.*?)</p>', doc, re.S)
        p = pay[num]
        ann = p[8]
        marker = "Concerns:" if "Concerns:" in ann else "Стосується:"
        what, _, who = ann.partition(marker)
        out[int(num)] = dict(
            domain=unesc(a.group(1)), category=unesc(a.group(2)), status=unesc(a.group(3)),
            entities=[unesc(x) for x in a.group(4).split("|") if x], title=title,
            subtitle=unesc(sub.group(1)) if sub else "", date=p[4], url=p[6],
            what=what.strip(), who=who.strip(), comment=p[9])
    return out


def num_date(title):
    m = re.search(r"(?:№|N|No\.)\s*([0-9][0-9A-Za-zА-Яа-яІі/\-]*)", title)
    num = m.group(1).rstrip("-/,") if m else ""
    return num


def ddmmyyyy(d):
    return f"{d[8:10]}.{d[5:7]}.{d[0:4]}" if d else ""


def new_id(no, typ, uk, en, used):
    if no in FIX and "id" in FIX[no]:
        return FIX[no]["id"]
    title, sub, url, date = uk["title"], uk["subtitle"], uk["url"], uk["date"]
    full = f"{title} {sub}"
    sid = ""
    if typ == "eu_act":
        m = re.search(r"/eli/(reg|dir|reg_del|reg_impl)/(\d{4})/(\d+)", url)
        if m:
            sid = f"eu-{m.group(1).replace('_', '-')}-{m.group(2)}-{m.group(3)}"
    elif typ == "eu_proposal":
        m = re.search(r"COM\((\d{4})\)\s*(\d+)", full)
        if m:
            sid = f"eu-com-{m.group(1)}-{m.group(2)}"
    elif typ == "ua_bill":
        m = re.search(r"№\s*([0-9]+(?:-\d+)?)", title)
        sid = f"ua-bill-{m.group(1)}" if m else ""
    elif typ == "law":
        m = re.search(r"№\s*(\d+)-([IVXLC]+)", title)
        sid = f"ua-law-{m.group(1)}-{m.group(2).lower()}" if m else ""
    else:
        prefix = {"cmu_resolution": "ua-cmu-", "ssscip_order": "ua-ssscip-", "nbu_resolution": "ua-nbu-",
                  "moj_order": "ua-moj-", "other_order": "ua-order-", "dstu": "ua-dstu-"}.get(typ, "ua-src-")
        n = num_date(title)
        if typ == "dstu":
            m = re.search(r"ДСТУ\s*([0-9][0-9.:\-]*\d)", title)
            n = m.group(1).replace(":", "-") if m else n
            sid = prefix + slug(n)
        elif n and date:
            sid = f"{prefix}{slug(n.split('/')[0])}-{date[:4]}"
    if not sid:
        sid = "ua-src-" + slug(title[:40])
    base, k = sid, 2
    while sid in used:
        sid = f"{base}-{k}"
        k += 1
    return sid


def short_refs(no, typ, uk, en):
    f = FIX.get(no, {})
    if "short_ref_uk" in f:
        return f["short_ref_uk"], f["short_ref_en"], f.get("number", "")
    title, sub, date = uk["title"], uk["subtitle"], uk["date"]
    if typ in REFERENCE_TYPES:
        full = f"{title} {sub}"
        m = (re.search(r"COM\(\d{4}\)\s*\d+", full) if typ == "eu_proposal" else None) or (
             re.search(r"(Regulation|Directive|Delegated Regulation|Implementing Regulation)"
                       r" \((?:EU|EU, Euratom)\)(?: No)? \d{2,4}/\d+", full)
             or re.search(r"(?:Directive|Regulation) \d{4}/\d+/E[CU]", full)
             or re.search(r"COM\(\d{4}\)\s*\d+", full))
        number = m.group(0) if m else ""
        def ref(t):
            short = re.sub(r"\s*\((проєкти?|proposals?)\)", "", t).strip()
            if number and short.startswith(number[:12]):
                return number
            return f"{short} ({number})" if number and number not in short else short
        return ref(title), ref(en["title"] or title), number
    if typ == "ua_bill":
        n = re.search(r"№\s*([0-9]+(?:-\d+)?)", title).group(1)
        return f"Законопроєкт № {n}", f"Draft Law No. {n}", n
    n = f.get("number") or num_date(title)
    if typ == "dstu":
        m = re.search(r"ДСТУ\s*[0-9][0-9.:\-]*\d", title)
        return m.group(0), m.group(0).replace("ДСТУ", "DSTU"), m.group(0)[5:]
    pat = {
        "law": ("Закон України № {n}", "Law of Ukraine No. {n}"),
        "cmu_resolution": ("Постанова КМУ № {n} від {d}", "CMU Resolution No. {n} of {d}"),
        "ssscip_order": ("Наказ Держспецзв’язку № {n} від {d}", "SSSCIP Order No. {n} of {d}"),
        "nbu_resolution": ("Постанова Правління НБУ № {n} від {d}", "NBU Board Resolution No. {n} of {d}"),
        "moj_order": ("Наказ Мін'юсту № {n} від {d}", "Ministry of Justice Order No. {n} of {d}"),
        "other_order": ("Наказ № {n} від {d}", "Order No. {n} of {d}"),
    }.get(typ)
    if pat and n:
        return pat[0].format(n=n, d=ddmmyyyy(date)), pat[1].format(n=n, d=ddmmyyyy(date)), n
    return title[:90], (en["title"] or title)[:90], n


def quoted(t):
    m = re.search(r'["«“](.+?)["»”]', t)
    if m and len(m.group(1)) > 8:
        return m.group(1).strip()
    m = re.search(r"\(([^()]{12,})\)\s*$", t)  # "Resolution No. 1470 (new edition of ...)"
    return (m.group(1)[0].upper() + m.group(1)[1:]).strip() if m else ""


def main():
    preview, links_path = Path(sys.argv[1]), Path(sys.argv[2])
    uk_rows, en_rows = parse_page(preview / "legislation.html"), parse_page(preview / "en" / "legislation.html")
    old = list(csv.DictReader(open(DATA / "sources.csv", encoding="utf-8")))
    by_legacy = {int(r["legacy_no"]): r for r in old if r["legacy_no"]}
    used = {r["id"] for r in old}

    sources, applic, num2id = [], [], {}
    for no in sorted(uk_rows):
        uk, en = uk_rows[no], en_rows[no]
        typ = CATEGORY_TYPE[uk["category"]]
        prev = by_legacy.get(no)
        if prev:
            r = dict(prev)
            r["comment_uk"] = r.pop("description_uk", "")
            r.pop("description_en", None)
            r.pop("legacy_no", None)
            r["type"] = r["type"] if r["type"] != "other" else typ
        else:
            sid = new_id(no, typ, uk, en, used)
            used.add(sid)
            ref_uk, ref_en, number = short_refs(no, typ, uk, en)
            if typ in REFERENCE_TYPES:
                title_uk, title_en = uk["subtitle"] or uk["title"], en["subtitle"] or en["title"]
            else:
                title_uk = quoted(uk["title"]) or extract_title(uk["title"])
                title_en = quoted(en["title"]) or en["title"]
            low = (uk["title"] + " " + uk["what"]).lower()
            r = dict(id=sid, type=typ, number=number, adopted="", registered="",
                     short_ref_uk=ref_uk, short_ref_en=ref_en, title_uk=title_uk, title_en=title_en,
                     comment_uk="", binding="recommended" if re.search(r"методичн|рекомендац", low) else "mandatory",
                     role="requirements", text_access="public" if uk["url"] else "restricted",
                     tags="", last_verified="")
        # values from the merged register win for these fields
        r["register_no"] = str(no)
        r["scope"] = "reference" if typ in REFERENCE_TYPES else "core"
        r["domain"] = DOMAIN[uk["domain"]]
        r["adopted"] = uk["date"] or r.get("adopted", "")
        r["url"] = uk["url"]
        r["comment_uk"] = uk["comment"] or r.get("comment_uk", "")
        if not prev and typ in REFERENCE_TYPES:
            r["title_en"] = r["title_en"] or r["title_uk"]
        if prev and not r.get("title_en"):
            r["title_en"] = quoted(en["title"]) if typ not in ("nd_tzi", "dstu", "vst") else ""
        r["description_uk"], r["concerns_uk"] = uk["what"], uk["who"]
        r["description_en"], r["concerns_en"] = en["what"], en["who"]
        st = STATUS.get(uk["status"])
        if not st:  # "not yet in force": bills and EU proposals are drafts, treaties are not ratified
            st = "draft" if typ in ("ua_bill", "eu_proposal") else "not_yet_in_force"
        r["status"] = st
        ents = [ENTITY[e] for e in uk["entities"]]
        if None in ents and not [e for e in ents if e not in (None, "ncs-bodies")] and r["role"] == "requirements":
            r["role"] = "context"
        if no == 181:
            r["role"] = "amending"
        for k in ("title_uk", "title_en"):
            if k in FIX.get(no, {}):
                r[k] = FIX[no][k]
        if typ == "dstu":
            r["title_uk"] = re.sub(r"^ДСТУ\s*[0-9][0-9.:\-]*\d\s*", "", r["title_uk"])
            r["title_en"] = re.sub(r"^DSTU\s*[0-9][0-9.:\-]*\d\s*", "", r["title_en"])
        r["notes"] = ";".join(x for x in (r.get("notes", ""), NOTE) if x)
        sources.append(r)
        num2id[no] = r["id"]
        for e in dict.fromkeys(e for e in ents if e):
            applic.append(dict(source_id=r["id"], sector_id=e, basis="entity tags, register 2026-10", verified="no"))

    # ---------------------------------------------------------------- relations
    adopted = {num2id[n]: (s["adopted"], s["status"]) for n, s in zip(sorted(uk_rows), sources)}
    rel = []
    for p, c, t, basis, src, conf in list(csv.reader(open(links_path, encoding="utf-8")))[1:]:
        a, b = num2id[int(p)], num2id[int(c)]
        kind = t.replace(" (проєкт)", "")
        if kind in ("на виконання", "імплементує"):
            row = dict(source_id=b, relation="issued_under" if kind == "на виконання" else "implements", related_id=a)
        else:
            # the actor (amending/replacing act) is the draft, or else the later act
            def key(x):
                d, s = adopted[x]
                return (s in ("draft", "not_yet_in_force"), d or "0000")
            actor, target = (a, b) if (t.endswith("(проєкт)") or key(a) >= key(b)) else (b, a)
            row = dict(source_id=actor, relation="amends" if kind == "змінює" else "replaces", related_id=target)
        row.update(basis_uk=basis, source_url=src,
                   confidence={"висока": "high", "середня": "medium"}.get(conf, ""), verified="no")
        rel.append(row)

    write_csv(DATA / "sources.csv", FIELDS, sources)
    write_csv(DATA / "applicability.csv", ["source_id", "sector_id", "basis", "verified"], applic)
    write_csv(DATA / "source_relations.csv",
              ["source_id", "relation", "related_id", "basis_uk", "source_url", "confidence", "verified"], rel)


if __name__ == "__main__":
    main()
