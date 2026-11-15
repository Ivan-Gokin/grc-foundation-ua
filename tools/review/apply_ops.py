"""Apply edit operations (JSON Lines) to mappings/*.xlsx.

usage: apply_ops.py <repo> <ops.jsonl> [--dry]

Each line is one op with "op", a ledger "id" and "why", plus:
  set_prov   pid, set{field: value}                 field in PROV_COLS fields (summary_uk, provision_type, applies_to, notes, ref_uk, ...)
  add_prov   wb (workbook file name), row{source_id, code, ref_uk, summary_uk, provision_type, applies_to, notes, ref_en, summary_en}
  del_prov   pid                                     also deletes its links
  set_link   pid, fw, control ("" or "—" for a no-counterpart row), set{field: value}
  del_link   pid, fw, control
  add_link   pid, fw, row{control_id, relationship, rationale, parameter_uk, policies, notes_uk, decisions, ...}
Codes, not labels: relationship equal|subset_of|superset_of|intersects_with|no_relationship (coverage follows it);
provision_type substantive|delegating|definitional; review_status ai_draft|draft|imported|reviewed.
Field "append_notes_uk" in set_link appends to notes_uk instead of replacing.
Defaults for add_link: review_status ai_draft, mapped_by AI (Claude, hostile review 2026-11), date 2026-11-11, rationale semantic.
Edits to existing links set date 2026-11-11; an edited imported/reviewed row is reported.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import wbio

DATE = "2026-11-14"
BY = "AI (Claude, hostile review 2026-11)"
REL = {"equal", "subset_of", "superset_of", "intersects_with", "no_relationship"}
COV = {"full", "partial", "none", ""}
TYPES = {"substantive", "delegating", "definitional"}


def norm_ctl(c):
    return "" if c in ("", "—", "–", "-", None) else c


def main():
    repo, opsf = sys.argv[1], sys.argv[2]
    dry = "--dry" in sys.argv
    data = wbio.load(repo)
    import csv
    controls = {}
    for f in ["iso27001-2022", "csf-2.0"]:
        controls[f] = {r["id"]: r["level"] for r in csv.DictReader(open(f"{repo}/data/controls_{f}.csv"))}
    pidx = {}
    for wb, d in data.items():
        for p in d["provisions"]:
            pidx[p["id"]] = (wb, p)
    errors, warnings, done = [], [], 0
    for n, line in enumerate(open(opsf), 1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        try:
            op = json.loads(line)
        except Exception as e:
            errors.append(f"line {n}: bad JSON {e}")
            continue
        kind, oid = op.get("op"), op.get("id", f"line{n}")
        try:
            if kind == "add_prov":
                wb, row = op["wb"], dict(op["row"])
                pid = f"{row['source_id']}:{row['code']}"
                if pid in pidx:
                    raise ValueError(f"provision {pid} exists")
                row.setdefault("provision_type", "substantive")
                if row["provision_type"] not in TYPES:
                    raise ValueError("bad provision_type")
                row["id"] = pid
                data.setdefault(wb, {"provisions": [], "links": {}, "sheets": []})["provisions"].append(row)
                pidx[pid] = (wb, row)
            elif kind in ("set_prov", "del_prov"):
                pid = op["pid"]
                if pid not in pidx:
                    raise ValueError(f"no provision {pid}")
                wb, p = pidx[pid]
                if kind == "del_prov":
                    data[wb]["provisions"].remove(p)
                    for fw in data[wb]["links"]:
                        data[wb]["links"][fw] = [r for r in data[wb]["links"][fw] if r["provision_id"] != pid]
                    del pidx[pid]
                else:
                    for k, v in op["set"].items():
                        if k == "provision_type" and v not in TYPES:
                            raise ValueError("bad provision_type")
                        if k in ("code", "id", "source_id"):
                            raise ValueError("ids are permanent")
                        old_ref = p.get("ref_uk")
                        p[k] = v
                        if k == "ref_uk":
                            for fw in data[wb]["links"]:
                                for r in data[wb]["links"][fw]:
                                    if r["provision_id"] == pid:
                                        r["ref_uk"] = v
            else:
                pid, fw = op["pid"], op["fw"]
                if pid not in pidx:
                    raise ValueError(f"no provision {pid}")
                wb, p = pidx[pid]
                links = data[wb]["links"].setdefault(fw, [])
                if fw not in data[wb].setdefault("sheets", []):
                    data[wb]["sheets"].append(fw)
                if kind == "add_link":
                    row = dict(op["row"])
                    row["control_id"] = norm_ctl(row.get("control_id"))
                    c = row["control_id"]
                    if c and c not in controls[fw]:
                        raise ValueError(f"unknown control {fw} {c}")
                    if c and controls[fw][c] not in ("subcategory", "control", "requirement"):
                        raise ValueError(f"{fw} {c} is a {controls[fw][c]}, map to a leaf")
                    if not c:
                        row["relationship"] = "no_relationship"
                    if row.get("relationship") not in REL:
                        raise ValueError("bad relationship")
                    if any(norm_ctl(r["control_id"]) == c and r["provision_id"] == pid for r in links):
                        warnings.append(f"{oid}: {pid} {fw} {c or '—'} already mapped, add skipped")
                        continue
                    row.setdefault("rationale", "semantic")
                    row.setdefault("review_status", "ai_draft")
                    row.setdefault("mapped_by", BY)
                    row.setdefault("date", DATE)
                    row.update(provision_id=pid, source_id=p["source_id"], ref_uk=p["ref_uk"])
                    links.append(row)
                else:
                    c = norm_ctl(op.get("control"))
                    hits = [r for r in links if r["provision_id"] == pid and norm_ctl(r["control_id"]) == c]
                    if not hits:
                        raise ValueError(f"no link {pid} {fw} {c or '—'}")
                    if kind == "del_link":
                        for h in hits:
                            links.remove(h)
                    elif kind == "set_link":
                        for h in hits:
                            if h.get("review_status") in ("imported", "reviewed"):
                                warnings.append(f"{oid}: edited a {h['review_status']} row {pid} {fw} {c}; set to draft-by-AI")
                                h["review_status"] = "ai_draft"
                            for k, v in op["set"].items():
                                if k == "append_notes_uk":
                                    h["notes_uk"] = (h.get("notes_uk", "") + " " + v).strip()
                                else:
                                    if k == "relationship" and v not in REL:
                                        raise ValueError("bad relationship")
                                    if k == "coverage":
                                        warnings.append(f"{oid}: coverage is derived from the relationship; ignored")
                                        continue
                                    if k == "control_id":
                                        v = norm_ctl(v)
                                        if v and v not in controls[fw]:
                                            raise ValueError(f"unknown control {v}")
                                    h[k] = v
                            h["date"] = DATE
                    else:
                        raise ValueError(f"unknown op {kind}")
            done += 1
        except Exception as e:
            errors.append(f"{oid} (line {n}, {kind}): {e}")
    print(f"applied {done}; errors {len(errors)}; warnings {len(warnings)}")
    for e in errors:
        print("ERROR", e)
    for w in warnings:
        print("WARN", w)
    if not dry:
        wbio.save(repo, data)


if __name__ == "__main__":
    main()
