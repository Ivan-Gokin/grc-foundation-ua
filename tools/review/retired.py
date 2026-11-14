"""Write data/retired_provisions.csv: provision codes deleted during the review, so they are never reused.
usage: retired.py <repo> <review_dir>
Sources: every del_prov op in <review_dir>/<stage>/ops*.jsonl that was applied
(the provision is gone from the workbooks now). replaced_by: the provision of the same act whose notes say
«Раніше також <code>»."""
import sys, os, glob, json, csv, re
sys.path.insert(0, os.path.dirname(__file__)); import wbio

repo, rev = sys.argv[1], sys.argv[2]
data = wbio.load(repo)
provs = {p["id"]: p for w in data.values() for p in w["provisions"]}
dels = {}
for f in sorted(set(glob.glob(f"{rev}/*/ops*.jsonl"))):
    for line in open(f, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        try:
            op = json.loads(line)
        except Exception:
            continue
        if op.get("op") == "del_prov":
            dels.setdefault(op["pid"], (op.get("id", ""), os.path.basename(os.path.dirname(f))))
rows = []
for pid, (oid, rnd) in sorted(dels.items()):
    if pid in provs:  # re-added or never applied
        continue
    act, code = pid.split(":", 1)
    pat = re.compile(r"Раніше також[^.]*\b" + re.escape(code) + r"\b")
    by = [q for q, p in provs.items() if p["source_id"] == act and pat.search(p.get("notes", "") + " " + p.get("summary_uk", ""))]
    rows.append({"id": pid, "retired": "2026-11-13" if rnd in ("dp", "r7") else "2026-11-11", "replaced_by": ";".join(sorted(by)),
                 "decision": oid, "note_uk": "дубль; вміст перенесено" if by else "вилучено (не обов'язок або дубль без окремого вмісту)"})
out = os.path.join(repo, "data", "retired_provisions.csv")
with open(out, "w", encoding="utf-8", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["id", "retired", "replaced_by", "decision", "note_uk"], lineterminator="\n")
    w.writeheader(); w.writerows(rows)
print(f"{len(rows)} retired codes -> {out}; without replaced_by: {sum(1 for r in rows if not r['replaced_by'])}")
