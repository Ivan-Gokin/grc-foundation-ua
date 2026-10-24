#!/usr/bin/env python3
"""Validate the data: the CSV files in data/ and the mapping workbooks in mappings/*.xlsx. Runs in CI.

Errors (exit code 1): broken IDs, unknown references, invalid enum values, bad dates/URLs.
Warnings (exit code 0): things a maintainer should look at, e.g. unverified rows.

Usage:  python3 scripts/validate.py            # validate
        python3 scripts/validate.py --stats    # also print coverage statistics
Needs openpyxl (pip install openpyxl) to read the workbooks.
"""
import csv
import re
import sys
from collections import Counter
from pathlib import Path

import mapdata

DATA = Path(__file__).resolve().parent.parent / "data"
errors, warnings = [], []

ENUMS = {
    "status": {"in_force", "repealed", "not_yet_in_force", "draft", "unknown"},
    "binding": {"mandatory", "recommended"},
    "role": {"requirements", "context", "procedural", "amending"},
    "text_access": {"public", "restricted"},
    # ELI ontology 1.5 properties (eli:) plus ELI-DL "adopts" (eli-dl:) for a law adopted from a bill
    "relation": {"based_on", "amends", "repeals", "transposes", "applies", "ensures_implementation_of",
                 "commences", "cites", "related_to", "adopts"},
    "scope": {"core", "reference"},
    "domain": {"cybersecurity", "records"},
    "confidence": {"high", "medium", "low", ""},
    "provision_type": {"substantive", "delegating", "definitional"},
    "relationship": {"equal", "subset_of", "superset_of", "intersects_with", "no_relationship"},
    "rationale": {"semantic", "syntactic", "functional"},
    "coverage": {"full", "partial", "none"},
    "review_status": {"ai_draft", "draft", "imported", "reviewed"},
    "yesno": {"yes", "no"},
}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9.\-]*$")
PROV_RE = re.compile(r"^[a-z0-9][a-z0-9.\-]*:[A-Za-z0-9.:\-]+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
ELI_OFFICIAL_RE = re.compile(r"^http://data\.europa\.eu/eli/[a-z_]+/\d{4}/\d+/oj$")
ELI_LOCAL_RE = re.compile(r"^eli/(ua|int|nato|eu)/[a-z0-9.\-]+(/[a-z0-9.\-]+)+$")


def load(name):
    path = DATA / name
    if not path.exists():
        errors.append(f"{name}: file missing")
        return []
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        errors.append(f"{name}: remove the UTF-8 BOM (the site adds it to downloads only)")
    with open(path, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))
    for i, r in enumerate(rows, start=2):
        if None in r:
            errors.append(f"{name}:{i}: more fields than header columns (unquoted comma?)")
        r["_line"] = i
    return rows


def err(name, row, msg):
    # rows from the workbooks carry their own location ("nbu.xlsx / Вимоги, row 12")
    errors.append(f"{row['_where']}: {msg}" if "_where" in row else f"{name}:{row['_line']}: {msg}")


def check_enum(name, row, field, enum=None):
    v = row.get(field, "")
    if v not in ENUMS[enum or field]:
        err(name, row, f"{field}='{v}' not in {sorted(ENUMS[enum or field])}")


def unique(name, rows, key="id", pattern=ID_RE):
    seen = set()
    for r in rows:
        v = r.get(key, "")
        if not v:
            err(name, r, f"empty {key}")
        elif pattern and not pattern.match(v):
            err(name, r, f"{key}='{v}' has invalid characters (use lowercase a-z, 0-9, '.', '-')")
        if v in seen:
            err(name, r, f"duplicate {key} '{v}'")
        seen.add(v)
    return seen


def main():
    stats = "--stats" in sys.argv

    types = unique("source_types.csv", load("source_types.csv"), pattern=re.compile(r"^[a-z_]+$"))
    groups = unique("sector_groups.csv", load("sector_groups.csv"))
    sector_rows = load("sectors.csv")
    sectors = unique("sectors.csv", sector_rows)
    for r in sector_rows:
        for parent in filter(None, r["parent"].split(";")):
            if parent not in sectors:
                err("sectors.csv", r, f"unknown parent '{parent}'")
        if r["group"] and r["group"] not in groups:
            err("sectors.csv", r, f"unknown group '{r['group']}'")
        check_enum("sectors.csv", r, "selectable", "yesno")

    fw_rows = load("frameworks.csv")
    frameworks = unique("frameworks.csv", fw_rows)
    controls = {}
    for fw in fw_rows:
        if fw["tier"] != "organisation":
            continue
        name = fw["controls_file"]
        rows = load(name)
        ids = unique(name, rows, pattern=None)
        for r in rows:
            if r["parent"] and r["parent"] not in ids:
                err(name, r, f"unknown parent '{r['parent']}'")
        controls[fw["id"]] = {r["id"]: r for r in rows}

    src_rows = load("sources.csv")
    sources = unique("sources.csv", src_rows)
    numbers, elis = set(), set()
    for r in src_rows:
        e = r["eli"]
        if r["type"] == "eu_act" and not ELI_OFFICIAL_RE.match(e):
            err("sources.csv", r, f"EU acts use their official ELI (http://data.europa.eu/eli/<type>/<year>/<number>/oj), got '{e}'")
        elif r["type"] != "eu_act" and not ELI_LOCAL_RE.match(e):
            err("sources.csv", r, f"eli '{e}' must follow the project template eli/<jurisdiction>/<agent>/<type>/<year>/<number> (see BLUEPRINT 3.1)")
        if e in elis:
            err("sources.csv", r, f"eli '{e}' is used twice")
        elis.add(e)
        if r["type"] not in types:
            err("sources.csv", r, f"unknown type '{r['type']}'")
        for f in ("status", "binding", "role", "text_access", "scope", "domain"):
            check_enum("sources.csv", r, f)
        n = r["register_no"]
        if not n.isdigit():
            err("sources.csv", r, f"register_no '{n}' must be a whole number")
        elif n in numbers:
            err("sources.csv", r, f"register_no {n} is used twice (numbers are never reused)")
        numbers.add(n)
        if r["scope"] == "reference" and r["type"] not in ("eu_act", "eu_proposal"):
            warnings.append(f"sources.csv:{r['_line']}: '{r['id']}' is in the reference scope but is not an EU act")
        if not r["description_en"] or not r["concerns_en"]:
            warnings.append(f"sources.csv:{r['_line']}: '{r['id']}' has no English description or concerns")
        for f in ("adopted", "registered", "last_verified"):
            if r[f] and not DATE_RE.match(r[f]):
                err("sources.csv", r, f"{f}='{r[f]}' must be YYYY-MM-DD")
        if r["url"] and not r["url"].startswith(("https://", "http://")):
            err("sources.csv", r, f"url must start with http(s):// ('{r['url'][:40]}')")
        if not r["title_uk"] and not r["short_ref_uk"]:
            err("sources.csv", r, "needs title_uk or short_ref_uk")
        if r["text_access"] == "public" and not r["url"]:
            warnings.append(f"sources.csv:{r['_line']}: public text but no url ({r['id']})")

    appl = load("applicability.csv")
    covered = set()
    for r in appl:
        if r["source_id"] not in sources:
            err("applicability.csv", r, f"unknown source '{r['source_id']}'")
        if r["sector_id"] not in sectors:
            err("applicability.csv", r, f"unknown sector '{r['sector_id']}'")
        check_enum("applicability.csv", r, "verified", "yesno")
        for req in filter(None, (r.get("requires") or "").split(";")):
            if req not in sectors:
                err("applicability.csv", r, f"unknown sector '{req}' in requires")
        covered.add(r["source_id"])
    for r in src_rows:
        if r["id"] not in covered and r["status"] != "repealed" and r["role"] == "requirements":
            warnings.append(f"sources.csv:{r['_line']}: '{r['id']}' has no applicability rows (will not show for any sector)")

    rel_seen = set()
    by_src = {r["id"]: r for r in src_rows}
    for r in load("source_relations.csv"):
        for f in ("source_id", "related_id"):
            if r[f] not in sources:
                err("source_relations.csv", r, f"unknown {f} '{r[f]}'")
        if r["source_id"] == r["related_id"]:
            err("source_relations.csv", r, "an act cannot be linked to itself")
        check_enum("source_relations.csv", r, "relation")
        check_enum("source_relations.csv", r, "confidence")
        check_enum("source_relations.csv", r, "verified", "yesno")
        if r["source_id"] in sources and r["related_id"] in sources:
            a, b = by_src[r["source_id"]], by_src[r["related_id"]]
            if r["relation"] == "adopts" and not (b["status"] == "draft" and a["status"] != "draft"):
                err("source_relations.csv", r, "adopts links an adopted act (source_id) to the draft it was adopted from (related_id)")
            if r["relation"] == "transposes" and not b["id"].startswith("eu-dir-"):
                warnings.append(f"source_relations.csv:{r['_line']}: transposes is meant for EU directives; for a regulation use applies, for a treaty ensures_implementation_of")
        if r["source_url"] and not r["source_url"].startswith(("https://", "http://")):
            err("source_relations.csv", r, "source_url must start with http(s)://")
        k = (r["source_id"], r["relation"], r["related_id"])
        if k in rel_seen:
            err("source_relations.csv", r, "duplicate relation")
        rel_seen.add(k)

    # key chains: a narrated path through the register (chains.csv + chain_steps.csv)
    chain_rows = load("chains.csv")
    chains = unique("chains.csv", chain_rows)
    step_seen = set()
    for r in load("chain_steps.csv"):
        if r["chain_id"] not in chains:
            err("chain_steps.csv", r, f"unknown chain_id '{r['chain_id']}'")
        if r["source_id"] not in sources:
            err("chain_steps.csv", r, f"unknown source_id '{r['source_id']}'")
        if not r["step"].isdigit():
            err("chain_steps.csv", r, "step must be a whole number")
        if (r["chain_id"], r["step"]) in step_seen:
            err("chain_steps.csv", r, "duplicate step")
        step_seen.add((r["chain_id"], r["step"]))
        if not r["role_uk"].strip():
            err("chain_steps.csv", r, "role_uk is required")

    prov_rows, map_rows, wb_errors = mapdata.read_all(set(controls))
    errors.extend(wb_errors)
    provisions = {r["id"] for r in prov_rows}
    for r in prov_rows:
        if not PROV_RE.match(r["id"]):
            err("", r, f"code '{r['id'].split(':', 1)[-1]}' has invalid characters (use a-z, 0-9, '.', ':', '-')")
    for r in prov_rows:
        if r["source_id"] not in sources:
            err("provisions.csv", r, f"unknown source '{r['source_id']}'")
        elif not r["id"].startswith(r["source_id"] + ":"):
            err("provisions.csv", r, f"id must start with '{r['source_id']}:'")
        check_enum("provisions.csv", r, "provision_type")
        for s in filter(None, r["applies_to"].split(";")):
            if s not in sectors:
                err("provisions.csv", r, f"unknown sector '{s}' in applies_to")

    seen, mapped = set(), set()
    for r in map_rows:
        if r["provision_id"] not in provisions:
            err("mappings.csv", r, f"unknown provision '{r['provision_id']}'")
        if r["framework_id"] not in controls:
            err("mappings.csv", r, f"unknown framework '{r['framework_id']}'")
        elif not r["control_id"]:
            # empty control_id = the provision was checked against the whole framework: no counterpart
            if r["relationship"] != "no_relationship":
                err("mappings.csv", r, "an empty control_id is only allowed with relationship=no_relationship")
        else:
            c = controls[r["framework_id"]].get(r["control_id"])
            if not c:
                err("mappings.csv", r, f"unknown control '{r['control_id']}' in {r['framework_id']}")
            elif c["level"] not in ("subcategory", "requirement", "control"):
                err("mappings.csv", r, f"map to a subcategory/requirement/control, not a {c['level']} ('{r['control_id']}')")
        for f in ("relationship", "rationale", "coverage", "review_status"):
            check_enum("mappings.csv", r, f)
        if r["strength"] and not (r["strength"].isdigit() and 1 <= int(r["strength"]) <= 10):
            err("mappings.csv", r, "strength must be an integer 1-10 or empty")
        if r["relationship"] == "no_relationship" and r["coverage"] != "none":
            err("mappings.csv", r, "no_relationship requires coverage=none")
        if r["date"] and not DATE_RE.match(r["date"]):
            err("mappings.csv", r, "date must be YYYY-MM-DD")
        if r["review_status"] == "reviewed" and not r["reviewed_by"]:
            err("mappings.csv", r, "reviewed mappings need reviewed_by")
        k = (r["provision_id"], r["framework_id"], r["control_id"])
        if k in seen:
            err("mappings.csv", r, "duplicate provision/framework/control triple")
        seen.add(k)
        mapped.add(r["provision_id"])

    b53_rows = load("sp800-53/baselines_ua.csv")
    b53 = {r["id"] for r in b53_rows}
    b53_cols = set(b53_rows[0]) if b53_rows else set()
    for r in load("sp800-53/profiles.csv"):
        if r["kind"] not in ("baseline", "sector", "plan"):
            err("sp800-53/profiles.csv", r, f"kind='{r['kind']}' must be baseline, sector or plan")
        if r["source_id"] not in sources:
            err("sp800-53/profiles.csv", r, f"unknown source '{r['source_id']}'")
        if r["kind"] in ("baseline", "sector") and not {r["id"], r["id"] + "_params_uk"} <= b53_cols:
            err("sp800-53/profiles.csv", r, f"baselines_ua.csv needs the columns '{r['id']}' and '{r['id']}_params_uk'")
    csf = controls.get("csf-2.0", {})
    for r in load("sp800-53/map_csf-2.0_sp800-53r5.csv"):
        if r["csf_id"] not in csf:
            err("sp800-53/map_csf-2.0_sp800-53r5.csv", r, f"unknown CSF id '{r['csf_id']}'")
        sid = r["sp800_53_id"]
        if sid not in b53 and not re.match(r"^[A-Z]{2}$", sid):  # 2 letters = whole family
            # e.g. IA-13 was added in SP 800-53 Release 5.2 and is not in the baseline file yet
            warnings.append(f"sp800-53/map_csf-2.0_sp800-53r5.csv:{r['_line']}: '{sid}' not in baselines_ua.csv")

    unverified = sum(1 for r in src_rows if r["status"] != "repealed" and not r["last_verified"])
    if unverified:
        warnings.append(f"{unverified} in-force sources have no last_verified date")
    unv_appl = sum(1 for r in appl if r["verified"] != "yes")
    if unv_appl:
        warnings.append(f"{unv_appl} applicability rows are not verified")
    drafts = Counter(r["review_status"] for r in map_rows)
    if drafts.get("draft"):
        warnings.append(f"{drafts['draft']} mappings are drafts")
    if drafts.get("ai_draft"):
        warnings.append(f"{drafts['ai_draft']} mappings are AI-generated and not yet reviewed by a person")

    if stats:
        print("Sources by scope:", dict(Counter(r["scope"] for r in src_rows)))
        print("Sources by type:", dict(Counter(r["type"] for r in src_rows)))
        print("Sources by status:", dict(Counter(r["status"] for r in src_rows)))
        print("Applicability by sector:", dict(Counter(r["sector_id"] for r in appl)))
        print(f"Provisions: {len(provisions)} ({len(provisions - mapped)} unmapped)")
        print("Mappings by framework:", dict(Counter(r["framework_id"] for r in map_rows)))
        print("Mappings by review status:", dict(drafts))
        no_prov = sorted(sources - {r["source_id"] for r in prov_rows})
        print(f"Sources without any provisions: {len(no_prov)} of {len(sources)}")

    for w in warnings[:40]:
        print("WARNING", w)
    if len(warnings) > 40:
        print(f"... and {len(warnings) - 40} more warnings")
    for e in errors:
        print("ERROR", e)
    print(f"\n{len(errors)} errors, {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
