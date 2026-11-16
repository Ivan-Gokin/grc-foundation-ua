"""Turn triage.csv + the register's links into a chain plan: chains, the act to map in each, texts needed."""
import csv, sys, collections, re, json
from pathlib import Path
REPO, D = Path(sys.argv[1]), Path(sys.argv[2])
rd = lambda p: list(csv.DictReader(open(p, encoding="utf-8")))
src = {r["id"]: r for r in rd(REPO / "data/sources.csv")}
rel = rd(REPO / "data/source_relations.csv")
tri = {r["id"]: r for r in rd(D / "triage.csv")}
lib = {p.name for p in (REPO / "library").glob("*/*") if p.is_dir()}
steps = rd(REPO / "data/chain_steps.csv")
sys.path.insert(0, str(REPO / "scripts")); import mapdata
P, M, _ = mapdata.read_all([r["id"] for r in rd(REPO / "data/frameworks.csv")]); mapped = {p["source_id"] for p in P}

UP = ("based_on", "ensures_implementation_of", "applies", "transposes")
parents = collections.defaultdict(list)
for r in rel:
    if r["relation"] in UP and r["source_id"] in src and r["related_id"] in src:
        parents[r["source_id"]].append(r["related_id"])
for k, t in tri.items():  # the triage's parent column adds links the register lacks
    for p in filter(None, (t.get("parent") or "").split(";")):
        p = p.strip()
        if p in src and p not in parents[k]:
            parents[k].append(p)

def is_ua(i): return src.get(i, {}).get("id", "").startswith("ua-")
def path_up(k, seen=()):
    """The longest Ukrainian parent path from an act up to its root law (EU acts are not part of a chain)."""
    best = [k]
    for p in parents.get(k, []):
        if p in seen or not is_ua(p): continue
        cand = [k] + path_up(p, seen + (k,))
        if len(cand) > len(best): best = cand
    return best

def print_url(r):
    u = (r.get("url") or "").split("#")[0]
    m = re.search(r"zakon\.rada\.gov\.ua/laws/show/([^/?#]+)", u)
    return f"https://zakon.rada.gov.ua/laws/show/{m.group(1)}/print" if m else u

chains = collections.defaultdict(lambda: {"leaves": [], "path": set()})
for k, t in tri.items():
    if t["verdict"] != "map" or k not in src: continue
    path = path_up(k)
    root = path[-1]
    key = (t["topic"] or "other", root)
    chains[key]["leaves"].append(k)
    chains[key]["path"].update(path)

out = []
for (topic, root), c in chains.items():
    acts = sorted(c["path"], key=lambda i: (len(path_up(i)), i))  # root first
    pr = min(int(tri[l]["priority"] or 3) for l in c["leaves"])
    out.append({"topic": topic, "root": root, "priority": pr,
                "leaves": sorted(c["leaves"]), "acts": acts,
                "already_mapped": sorted(a for a in acts if a in mapped),
                "texts_missing": [a for a in acts if a not in lib and src[a]["text_access"] == "public"],
                "texts_restricted": [a for a in acts if src[a]["text_access"] != "public"]})
out.sort(key=lambda c: (c["priority"], -len(c["leaves"]), c["topic"]))
json.dump(out, open(D / "chains.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "chains;", sum(len(c["leaves"]) for c in out), "acts to map;",
      len({a for c in out for a in c["texts_missing"]}), "texts to fetch")
