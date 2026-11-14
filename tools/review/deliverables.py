"""Build the review deliverables into <repo>/<outdir>/.
usage: deliverables.py <repo> <workspace> <outdir>   (outdir relative to repo, e.g. docs/review-2026-11)
Writes: changes.csv (row-level diff v0 -> now), responses.md (every ruling, grouped by round and segment),
open-issues.md (AUTHOR rulings not superseded, follow-ups, [ПЕРЕВІРИТИ] markers), decisions.md (ledger copy),
author-decisions.md, log.md (rounds), contract.md."""
import sys, os, json, glob, re, csv, subprocess, shutil, collections
repo, R = sys.argv[1], sys.argv[2]
out = f"{repo}/{sys.argv[3] if len(sys.argv) > 3 else 'docs/review'}"
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(out, exist_ok=True)
sys.path.insert(0, HERE); import wbio

# 1. change log
subprocess.run([sys.executable, f"{HERE}/changelog.py", repo, f"{R}/v0", f"{out}/changes.csv"], check=True,
               stdout=open(f"{out}/changes-summary.txt", "w"))

# 2. responses
SEGNAME = {"A1": "Закон 80/94", "A2": "ПКМУ 373 + 736", "A": "Закон 80/94, ПКМУ 373, 736", "B": "Наказ Держспецзв'язку 75",
           "C": "НБУ 95", "C1": "НБУ 95 (перша половина)", "C2": "НБУ 95 (друга половина)", "D": "НБУ 43",
           "D1": "НБУ 43 (перша половина)", "D2": "НБУ 43 (друга половина)", "E": "НБУ 88, 64, 67", "E1": "НБУ 88",
           "E2": "НБУ 64 + 67", "F": "НБУ 178, 4, 99", "F1": "НБУ 178", "F2": "НБУ 4 + 99",
           "E2a": "НБУ 64 (перша половина)", "E2b": "НБУ 64 (друга половина) + НБУ 67",
           "A1a": "Закон 80/94 (ст. 1 – ст. 8 ч. 11)", "A1b": "Закон 80/94 (ст. 8 ч. 12 і далі)", "373a": "ПКМУ 373 (p4–p17-2025)",
           "373b": "ПКМУ 373 (p19–p33)", "736": "ПКМУ 736", "Ba": "Наказ 75 (перша половина)", "Bb": "Наказ 75 (друга половина)",
           "Bb2": "Наказ 75 (друга половина, переклади)", "FU": "наскрізні доповнення", "CC": "усі акти", "CC2A": "ПКМУ 373, Наказ 75", "CC2B": "акти НБУ"}
STAGE = {"sw": "Суцільна звірка умов", "cc": "Фінальна перевірка змінених рядків", "cc2": "Повторна перевірка після фінальної"}
def stage_key(d):
    m = re.fullmatch(r"r(\d+)", d)
    return (0, int(m.group(1))) if m else (1, ["sw", "cc", "cc2"].index(d) if d in ("sw", "cc", "cc2") else 9)
RUL = {"VALID": "прийнято", "CLARIFY": "уточнено", "DOWNGRADE": "знижено до незначного", "INVALID": "відхилено",
       "SETTLED": "вирішено раніше", "AUTHOR": "до рішення автора"}
allr = []
for f in sorted(glob.glob(f"{R}/*/ac_*.jsonl"), key=lambda f: (stage_key(os.path.basename(os.path.dirname(f))), f)):
    rnd = os.path.basename(os.path.dirname(f))
    if not (re.fullmatch(r"r\d+", rnd) or rnd in STAGE):
        continue
    seg = os.path.basename(f)[3:-6]
    for line in open(f, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        try:
            r = json.loads(line)
        except Exception:
            continue
        r["_rnd"], r["_seg"] = rnd, seg
        allr.append(r)
with open(f"{out}/responses.md", "w", encoding="utf-8") as fh:
    fh.write("# Відповіді на коментарі рецензентів (hostile review, 2026-11)\n\n"
             "Кожен коментар трьох рецензентів (CISO, GRC-аналітик, регулятор) розглянуто головою секції. "
             "Рішення: прийнято / уточнено / знижено / відхилено / вирішено раніше / до рішення автора. "
             "Ідентифікатори (R<раунд>-<секція>-<номер>) - ті самі, що в примітках до рядків.\n\n")
    cnt = collections.Counter(r.get("ruling") for r in allr)
    fh.write("Разом: " + ", ".join(f"{RUL.get(k, k)} {v}" for k, v in cnt.most_common()) + f" (усього {len(allr)}).\n")
    cur = None
    for r in allr:
        key = (r["_rnd"], r["_seg"])
        if key != cur:
            cur = key
            title = STAGE.get(r['_rnd']) or f"Раунд {r['_rnd'][1:]}"
            fh.write(f"\n## {title}, {SEGNAME.get(r['_seg'], r['_seg'])}\n\n")
        fh.write(f"- **{r.get('rid', '?')}** ({r.get('sev', '')}, {r.get('crit', '')}; {', '.join(r.get('from', []))}) "
                 f"`{r.get('loc', '')[:160]}` — **{RUL.get(r.get('ruling'), r.get('ruling'))}**. "
                 f"{(r.get('rationale') or '').strip()[:700]}"
                 + (f" *Дія:* {(r.get('action') or '').strip()[:500]}" if r.get("action") else "") + "\n")

# 3. open issues
later_text = "\n".join(json.dumps(r, ensure_ascii=False) for r in allr)
AD = next((x for x in (f"{R}/author_decisions.md", f"{R}/dp/author_decisions.md") if os.path.exists(x)), None)
auth_dec = open(AD, encoding="utf-8").read() if AD else ""
author = [r for r in allr if r.get("ruling") == "AUTHOR"]
open_items = []
for r in author:
    rid = r.get("rid", "")
    closed = rid and (rid in auth_dec)
    open_items.append((r, closed))
data = wbio.load(repo)
markers = []
for w in data.values():
    for p in w["provisions"]:
        for f in ("notes", "summary_uk"):
            for m in re.finditer(r"\[ПЕРЕВІРИТИ[^\]]*\]", p.get(f) or ""):
                markers.append((p["id"], "положення", m.group(0)))
    for fw, rr in w["links"].items():
        for r in rr:
            for f in ("notes_uk", "parameter_uk"):
                for m in re.finditer(r"\[ПЕРЕВІРИТИ[^\]]*\]", r.get(f) or ""):
                    markers.append((r["provision_id"], f"{fw} {r['control_id'] or '—'}", m.group(0)))
seen = set(); um = []
for x in markers:
    if (x[0], x[2]) in seen:
        continue
    seen.add((x[0], x[2])); um.append(x)
grounds = collections.Counter()
for w in data.values():
    for p in w["provisions"]:
        if p.get("grounds") not in (None, "", "text"): grounds[p["grounds"]] += 1
    for rr in w["links"].values():
        for r in rr:
            if r.get("grounds") not in (None, "", "text"): grounds[r["grounds"]] += 1
with open(f"{out}/open-issues.md", "w", encoding="utf-8") as fh:
    fh.write("# Відкриті питання після рецензії (2026-11)\n\n")
    fh.write("## 1. Питання до автора, які рецензія не могла вирішити\n\n")
    for r, closed in open_items:
        if closed:
            continue
        fh.write(f"- **{r.get('rid')}** `{r.get('loc', '')[:140]}`: {(r.get('action') or r.get('rationale') or '').strip()[:600]}\n")
    fu = f"{R}/r6/followups.md"
    if os.path.exists(fu):
        fh.write("\n## 2. Наскрізні питання, виявлені в раунді 6\n\n" + open(fu, encoding="utf-8").read() + "\n")
    fu7 = f"{R}/r7/followups.md"
    if os.path.exists(fu7):
        fh.write("\n## 2a. Наскрізні питання, виявлені в раунді 7\n\n" + open(fu7, encoding="utf-8").read() + "\n")
    fu8 = f"{R}/r8/followups.md"
    if os.path.exists(fu8):
        fh.write("\n## 2b. Наскрізні питання, виявлені в раунді 8\n\n" + open(fu8, encoding="utf-8").read() + "\n")
    np_ = f"{R}/next_phase.md"
    if os.path.exists(np_):
        fh.write("\n## 2c. Наступна фаза (ПКМУ 1533, 1799, 1281, 518, 205)\n\n" + open(np_, encoding="utf-8").read() + "\n")
    fh.write(f"\n## 3. Рядки, що спираються на тлумачення (поле «Підстава»)\n\n"
             + ", ".join(f"{k}: {v}" for k, v in sorted(grounds.items())) +
             ". Коли регулятор опублікує позицію, змініть «Підстава» на «позиція регулятора» з джерелом.\n")
    fh.write(f"\n## 4. Позначки [ПЕРЕВІРИТИ] у даних ({len(um)})\n\n")
    for pid, where, m in um:
        fh.write(f"- `{pid}` ({where}): {m[:300]}\n")
    fh.write("\n## 5. Перевірка людиною\n\nУсі зіставлення, змінені або додані ШІ, мають статус «ШІ (не вичитано)». "
             "Вибірка з 50 рядків для юриста: `lawyer-sample.xlsx`.\n")
for name in ("decisions.md", "log.md", "contract.md"):
    shutil.copy(f"{R}/{name}", f"{out}/{name}")
if AD: shutil.copy(AD, f"{out}/author-decisions.md")
print(f"responses {len(allr)}; open AUTHOR {sum(1 for _, c in open_items if not c)}; markers {len(um)}; grounds {dict(grounds)}")
