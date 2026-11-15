"""Draw a reproducible stratified random sample of mapping rows for a lawyer's check.
usage: lawyer_sample.py <repo> <out.xlsx> [n=50] [seed=20261113]
Strata: act (proportional to its mapping rows, at least 2 per act), and within an act a mix of
locked rows (equal/subset_of/intersects_with/superset_of) and «—» rows. The workbook has one row per
sampled mapping with the provision, the control, the claim (relationship, coverage, legal minimum)
and empty columns for the lawyer's verdict."""
import sys, os, csv, random
sys.path.insert(0, os.path.dirname(__file__)); import wbio
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

repo, out = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 50
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 20261113
rnd = random.Random(seed)
data = wbio.load(repo)
src = {r["id"]: r for r in csv.DictReader(open(f"{repo}/data/sources.csv", encoding="utf-8"))}
names = {}
for f in ("iso27001-2022", "csf-2.0"):
    for r in csv.DictReader(open(f"{repo}/data/controls_{f}.csv", encoding="utf-8")):
        names[(f, r["id"])] = r.get("name_uk") or r.get("text_uk") or r.get("name_en", "")
prov, rows = {}, []
for w in data.values():
    for p in w["provisions"]:
        prov[p["id"]] = p
    for fw, rr in w["links"].items():
        rows += [(fw, r) for r in rr]
by_act = {}
for fw, r in rows:
    by_act.setdefault(prov[r["provision_id"]]["source_id"], []).append((fw, r))
total = sum(len(v) for v in by_act.values())
quota = {a: max(2, round(n * len(v) / total)) for a, v in by_act.items()}
while sum(quota.values()) > n:  # trim the largest quotas until the sample is n
    a = max((k for k in quota if quota[k] > 2), key=lambda k: quota[k] - len(by_act[k]) / total * n)
    quota[a] -= 1
sample = []
for a in sorted(by_act):
    pool = by_act[a][:]
    rnd.shuffle(pool)
    none = [x for x in pool if not x[1]["control_id"]]
    locked = [x for x in pool if x[1]["control_id"]]
    k = quota[a]
    k_none = min(len(none), max(1 if none else 0, round(k * len(none) / len(pool))))
    sample += none[:k_none] + locked[:k - k_none]
REL = {"equal": "= збігається", "subset_of": "⊂ вужче за захід (захід покриває)", "superset_of": "⊃ ширше за захід",
       "intersects_with": "∩ перетинається", "no_relationship": "— немає відповідника"}
GR = {"assumption": "припущення автора", "regulator": "позиція регулятора", "practice": "усталена практика"}
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Вибірка"
head = ["№", "Акт", "Пункт", "Вимога (як записано)", "Стосується лише", "Стандарт", "Захід", "Назва заходу", "Твердження: відношення",
        "Покриття", "Параметр за законом", "Підстава", "Примітка", "Офіційний текст",
        "Вимога записана правильно? (так / ні / частково)", "Зв'язок із заходом правильний? (так / ні / частково)",
        "Параметр правильний і повний? (так / ні / н/з)", "Що не так", "Як має бути", "Джерело (акт, пункт)", "id"]
ws.append(head)
for i, (fw, r) in enumerate(sorted(sample, key=lambda x: (prov[x[1]["provision_id"]]["source_id"], x[1]["provision_id"])), 1):
    p = prov[r["provision_id"]]
    s = src.get(p["source_id"], {})
    g = r.get("grounds") if r.get("grounds") not in ("", "text", None) else p.get("grounds", "")
    ws.append([i, s.get("short_ref_uk", p["source_id"]), p["ref_uk"], p["summary_uk"], p.get("applies_to", ""),
               "ISO/IEC 27001:2022" if fw == "iso27001-2022" else "NIST CSF 2.0", r["control_id"] or "—",
               names.get((fw, r["control_id"]), "") if r["control_id"] else "немає відповідника",
               REL.get(r["relationship"] or "no_relationship", r["relationship"]), r.get("coverage", ""), r.get("parameter_uk", ""),
               GR.get(g, "") + (f" ({ids})" if (ids := "; ".join(dict.fromkeys(x for x in (r.get("decisions", "") + ";" + p.get("decisions", "")).split(";") if x))) else ""),
               r.get("notes_uk", ""), s.get("url", ""), "", "", "", "", "", "", f"{r['provision_id']} | {fw} | {r['control_id'] or '—'}"])
widths = [5, 26, 20, 60, 18, 16, 9, 34, 22, 10, 34, 14, 50, 30, 18, 18, 18, 40, 40, 24, 30]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width = w
for c in ws[1]:
    c.font, c.fill = Font(bold=True), PatternFill("solid", fgColor="E8E9F6")
for row in ws.iter_rows():
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical="top")
for col in ("O", "P"):
    dv = DataValidation(type="list", formula1='"так,ні,частково"', allow_blank=True); dv.add(f"{col}2:{col}{len(sample) + 1}"); ws.add_data_validation(dv)
dv = DataValidation(type="list", formula1='"так,ні,частково,н/з"', allow_blank=True); dv.add(f"Q2:Q{len(sample) + 1}"); ws.add_data_validation(dv)
ws.freeze_panes = "E2"
about = wb.create_sheet("Як перевіряти", 0)
for line in [
    ["Вибіркова перевірка зіставлень юристом"],
    [f"Випадкова стратифікована вибірка: {len(sample)} рядків з {total} (зерно {seed}); кожен акт представлено пропорційно, щонайменше 2 рядки; є рядки «—» (немає відповідника)."],
    ["Для кожного рядка звірте з офіційним текстом акта (посилання в стовпці «Офіційний текст»):"],
    ["1. Чи правильно записано вимогу: пункт, зміст, кого стосується."],
    ["2. Чи справді положення вимагає того, про що захід (або чи справді відповідника немає для «—»); чи правильне відношення і покриття."],
    ["3. Чи правильно і повністю перенесено значення, строк, частоту, умову чи заборону в «Параметр за законом»."],
    ["Відповіді - у стовпцях O-Q; деталі - у «Що не так», «Як має бути», «Джерело». «н/з» - параметра немає і він не потрібен."],
    ["Частка рядків з «ні» або «частково» в будь-якому з трьох питань - оцінка рівня помилок для всього набору."],
]:
    about.append(line)
about.column_dimensions["A"].width = 130
about["A1"].font = Font(bold=True, size=13)
wb.save(out)
print(f"{len(sample)} rows from {len(by_act)} acts -> {out}")
