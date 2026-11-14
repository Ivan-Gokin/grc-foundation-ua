"""Set act-level fields in data/sources.csv. usage: set_act_cond.py <repo> <source_id> <field>=<value> ...
Rewrites the file with the csv module and checks the round trip leaves other rows byte-identical."""
import sys, csv, io
repo, sid = sys.argv[1], sys.argv[2]
p = f"{repo}/data/sources.csv"
raw = open(p, encoding="utf-8", newline="").read()
rows = list(csv.DictReader(io.StringIO(raw)))
fields = list(rows[0].keys())
def dump(rs):
    b = io.StringIO(); w = csv.DictWriter(b, fieldnames=fields, lineterminator="\n"); w.writeheader(); w.writerows(rs); return b.getvalue()
assert dump(rows) == raw, "round trip differs; refusing to rewrite"
hit = [r for r in rows if r["id"] == sid]; assert len(hit) == 1
for kv in sys.argv[3:]:
    k, v = kv.split("=", 1); assert k in fields, k; hit[0][k] = v
open(p, "w", encoding="utf-8", newline="").write(dump(rows)); print("ok", sid)
