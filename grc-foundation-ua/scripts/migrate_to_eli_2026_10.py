#!/usr/bin/env python3
"""One-off migration (2026-10-16) of the register to the European Legislation Identifier (ELI).

1. sources.csv gets an `eli` column:
   - EU acts: the official ELI assigned by the Publications Office (http://data.europa.eu/eli/...),
     taken from the EUR-Lex link;
   - everything else: an ELI-pattern path of this project, relative to the site root
     (eli/{jurisdiction}/{agent}/{type}/{year}/{natural identifier}). Ukraine has no official ELI
     yet, so these are NOT official identifiers; they follow the ELI URI template (pillar I) so they
     can be swapped for official ones later.
2. source_relations.csv: the project's own relation names are replaced with ELI ontology 1.5
   properties (and one ELI-DL property for bills):
     issued_under -> based_on (empowerment), or ensures_implementation_of for plans/orders that
                     implement a strategy or a treaty, or related_to where nothing fits
     implements   -> transposes (EU directive), applies (EU regulation: conforms with it),
                     ensures_implementation_of (international agreement)
     replaces     -> repeals
     amends       -> amends
     see_also     -> related_to

Kept for provenance; do not re-run (it expects the old relation names).
Usage: python3 scripts/migrate_to_eli_2026_10.py
"""
import csv
import re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"

AGENT_TYPE = {
    "law": "vru/law", "ua_bill": "vru/bill", "presidential_decree": "president/decree",
    "cmu_resolution": "cmu/resolution", "nbu_resolution": "nbu/resolution", "ssscip_order": "ssscip/order",
    "sbu_order": "sbu/order", "nccc_decision": "nccc/decision", "moj_order": "moj/order",
    "guidance": "ssscip/guidance", "nd_tzi": "ssscip/nd-tzi", "dstu": "dstu/standard", "vst": "mod/vst",
}
TREATIES = {
    "intl-eu-ua-association-agreement": "eli/int/eu-ua/agreement/2014/association",
    "intl-ua-nato-security-agreement": "eli/int/ua-nato/agreement/1995/security",
    "intl-coe-ets-108": "eli/int/coe/ets/108",
    "intl-coe-ets-185": "eli/int/coe/ets/185",
    "intl-coe-cets-224": "eli/int/coe/cets/224",
    "intl-coe-cets-225": "eli/int/coe/cets/225",
}
# relation overrides: (source_id, old relation, related_id) -> new relation
OVERRIDES = {
    ("ua-law-4336-ix", "issued_under", "eu-reg-2024-792"): "related_to",          # Ukraine Facility plan step, not an empowerment
    ("ua-ssscip-843-2025", "issued_under", "intl-ua-nato-security-agreement"): "ensures_implementation_of",
    ("ua-pres-37-2022", "issued_under", "ua-pres-447-2021"): "ensures_implementation_of",  # implementation plan of the Strategy
}
TRANSLIT = str.maketrans({"В": "v", "Р": "r", "в": "v", "р": "r", "І": "i", "і": "i", "П": "p", "п": "p"})


UA = dict(zip("абвгґдеєжзиіїйклмнопрстуфхцчшщьюя", ["a", "b", "v", "h", "g", "d", "e", "ie", "zh", "z", "y", "i", "i", "i", "k", "l", "m",
              "n", "o", "p", "r", "s", "t", "u", "f", "kh", "ts", "ch", "sh", "shch", "", "iu", "ia"]))


def translit(s):
    """Ukrainian -> Latin (simplified national transliteration, CMU Resolution 55/2010)."""
    return "".join(UA.get(c.lower(), c) for c in s)


def slug(s):
    s = s.translate(TRANSLIT).lower()
    s = re.sub(r"[^a-z0-9.]+", "-", s)
    return s.strip("-")


def eli_for(r):
    t, n, y = r["type"], r["number"], (r["adopted"] or "")[:4]
    if t == "eu_act":
        m = re.search(r"/eli/(.+?/oj)", r["url"])
        return "http://data.europa.eu/eli/" + m.group(1)
    if not y:
        y = (re.search(r"(19|20)\d\d", r["id"]) or [""])[0]
    if t == "eu_proposal":
        num = re.search(r"\((\d{4})\)\s*(\d+)", n)
        return f"eli/eu/com/proposal/{num.group(1)}/{num.group(2)}"
    if t == "international_agreement":
        return TREATIES[r["id"]]
    if t == "nato_policy":
        return "eli/nato/doc/" + r["id"].split("-", 1)[1]
    if t == "other_order":
        agent = r["id"].split("-")[1]
        num = n or r["id"].split("-")[2]
        return f"eli/ua/{agent}/order/{y}/{slug(num)}"
    num = n or r["id"].split("-")[2]
    if t == "presidential_decree":
        num = num.split("/")[0]
    return f"eli/ua/{AGENT_TYPE[t]}/{y}/{slug(num)}"


def new_relation(rel, src, dst):
    key = (src["id"], rel, dst["id"])
    if key in OVERRIDES:
        return OVERRIDES[key]
    if rel == "issued_under":
        return "based_on"
    if rel == "replaces":
        return "repeals"
    if rel == "see_also":
        return "related_to"
    if rel == "implements":
        if dst["type"] == "international_agreement":
            return "ensures_implementation_of"
        if dst["id"].startswith("eu-dir-"):
            return "transposes"
        return "applies"
    return rel


def main():
    with open(DATA / "sources.csv", encoding="utf-8", newline="") as fh:
        rd = csv.DictReader(fh)
        fields, sources = rd.fieldnames, list(rd)
    if "eli" not in fields:
        fields.insert(fields.index("register_no") + 1, "eli")
    for r in sources:
        r["eli"] = eli_for(r)
    # several documents share one number: parts (Т1, Т2...) become subdivisions, others use the full designation
    groups = {}
    for r in sources:
        groups.setdefault(r["eli"], []).append(r)
    for eli, rs in groups.items():
        if len(rs) < 2:
            continue
        for r in rs:
            part = re.match(r"^Т(\d+)\b", r["title_uk"])
            if part:
                r["eli"] = f"{eli}/t{part.group(1)}"
            else:
                code = re.match(r"^([А-ЯІЇЄҐ0-9 \-–]+?)\s+[А-ЯІЇЄҐ][а-яіїєґ']", r["title_uk"])
                designation = f"{r['number']} {code.group(1) if code else r['id'].rsplit('-', 1)[-1]}"
                r["eli"] = eli.rsplit("/", 1)[0] + "/" + slug(translit(designation))
    seen = {}
    for r in sources:
        assert r["eli"] not in seen, (r["id"], seen.get(r["eli"]), r["eli"])
        seen[r["eli"]] = r["id"]
    with open(DATA / "sources.csv", "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(sources)

    by_id = {r["id"]: r for r in sources}
    with open(DATA / "source_relations.csv", encoding="utf-8", newline="") as fh:
        rd = csv.DictReader(fh)
        rfields, rels = rd.fieldnames, list(rd)
    for r in rels:
        r["relation"] = new_relation(r["relation"], by_id[r["source_id"]], by_id[r["related_id"]])
    with open(DATA / "source_relations.csv", "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=rfields, lineterminator="\n")
        w.writeheader()
        w.writerows(rels)
    print(f"{len(sources)} sources with eli, {len(rels)} relations migrated")


if __name__ == "__main__":
    main()
