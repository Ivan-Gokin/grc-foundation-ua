"""Export the mappings as CISO Assistant libraries (YAML, library format v2).

For every act with provisions it writes two libraries into <out>/ciso-assistant/:
  <act>.yaml            the act as a framework: one requirement node per provision
  mapping-<act>.yaml    mapping sets between the act and ISO/IEC 27001:2022 and NIST CSF 2.0,
                        in both directions (CISO Assistant applies a mapping set in one direction only)
The target frameworks are the ones CISO Assistant ships (urn:intuitem:risk:framework:iso27001-2022,
urn:intuitem:risk:framework:nist-csf-2.0), so an ISO 27001 audit can pre-fill an audit of a Ukrainian act.

Choices (owner's decisions of 2026-11-14):
- A link whose row carries a legal value («Параметр за законом») is at most `intersect` when mapping INTO
  the act: the control alone does not prove the legal value is met, so CISO Assistant pre-fills
  "partially compliant" and the value stays to be checked (it is in the link's annotation).
- `applies_to` becomes implementation groups. A group list can only say "any of", so each term keeps its
  first sector without "!" (slightly wider than the act); the exact condition is in the node's annotation.
  A provision for everyone gets every group of its act, because CISO Assistant leaves a requirement without
  groups out of an audit once any group is selected.
- AI-drafted rows keep their mark: «ШІ, не вичитано» in the link annotation, and a line in the node
  annotation. CISO Assistant has no review-status field.
- «—» rows (no counterpart) produce no link: the provision is assessed directly in the act's audit.

Versions (so CISO Assistant's "update library" works): CISO Assistant updates a loaded library when a file with
the same URN and a higher `version` is uploaded; requirements are matched by URN, so node URNs are the permanent
provision IDs. Each library has its own version, raised only when its content changes, as YYYYMMDD00 of the data
date (or the previous version + 1 if that is not higher). The state is kept in mappings/ciso-assistant-versions.json
(written by build.py, committed like mappings/*.csv): per library its version, a content fingerprint, the data
version and date it last changed, and a short "what changed" note that goes into the library's description.
An unchanged library is written byte for byte as before, so it never shows "update available".

usage: python3 scripts/export_ciso_assistant.py [outdir=_site/data] [--state] [--ca-libraries DIR]
       --state: read and update mappings/ciso-assistant-versions.json (build.py always does).
       --ca-libraries: a checkout of ciso-assistant-community/backend/library/libraries, to check that every
       target requirement exists and is assessable. build.py calls export() without the check.
"""
import csv, hashlib, json, re, sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
import mapdata  # noqa: E402

PACKAGER = "grc-foundation-ua"
TARGETS = {  # our framework id -> CISO Assistant framework ref used in its URNs
    "iso27001-2022": ("iso27001-2022", "ISO/IEC 27001:2022"),
    "csf-2.0": ("nist-csf-2.0", "NIST CSF 2.0"),
}
# ISO clauses that are headings in CISO Assistant: a link to them goes to their sub-clauses, as intersect.
ISO_SPLIT = {"7.5": ["7.5.1", "7.5.2", "7.5.3"], "9.2": ["9.2.1", "9.2.2"], "9.3": ["9.3.1", "9.3.2", "9.3.3"]}
REL = {"equal": "equal", "subset_of": "subset", "superset_of": "superset", "intersects_with": "intersect",
       "no_relationship": "not_related"}
INVERSE = {"equal": "equal", "subset": "superset", "superset": "subset", "intersect": "intersect",
           "not_related": "not_related"}
AI_UK = "ШІ, не вичитано"
STATE = ROOT / "mappings" / "ciso-assistant-versions.json"
LIST_MAX = 10  # refs listed in a change note


def digest(obj, n=64):
    return hashlib.sha256(json.dumps(obj, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()[:n]


def ref_list(refs, lang):
    refs = list(refs)
    more = len(refs) - LIST_MAX
    tail = (f" і ще {more}" if lang == "uk" else f" and {more} more") if more > 0 else ""
    return "; ".join(refs[:LIST_MAX]) + tail


def change_note(prev, items, refs, kind, version, data):
    """The note for a library that changed: what changed against the previous state (items: code -> hash)."""
    head_uk, head_en = f"Зміни у версії {version} (дані {data})", f"Changes in version {version} (data {data})"
    if prev is None:
        return (f"{head_uk}: перша версія з журналом змін.", f"{head_en}: first version with a change log.")
    old = prev.get("items", {})
    added = [refs[k] for k in items if k not in old]
    changed = [refs[k] for k in items if k in old and old[k].split(" ", 1)[0] != items[k]]
    removed = [old[k].split(" ", 1)[1] for k in old if k not in items]
    if kind == "framework":
        what_uk, what_en = "вимоги", "requirements"
    else:
        what_uk, what_en = "зіставлення положень", "mappings of provisions"
    if not (added or changed or removed):
        rest_uk = "вимоги без змін, змінено опис акта або групи впровадження" if kind == "framework" else \
            "зіставлення без змін, змінено опис"
        rest_en = "requirements unchanged; the act's description or implementation groups changed" \
            if kind == "framework" else "mappings unchanged; the description changed"
        return (f"{head_uk}: {rest_uk}.", f"{head_en}: {rest_en}.")
    uk, en = [], []
    for words_uk, words_en, lst in (("додано", "added", added), ("змінено", "changed", changed),
                                    ("вилучено", "removed", removed)):
        if lst:
            uk.append(f"{words_uk} {len(lst)} ({ref_list(lst, 'uk')})")
            en.append(f"{len(lst)} {words_en} ({ref_list(lst, 'en')})")
    return (f"{head_uk}, {what_uk}: " + "; ".join(uk) + ".", f"{head_en}, {what_en}: " + "; ".join(en) + ".")


def settle(state, lib_urn, body, items, refs, kind, meta):
    """Give a library its version: keep the stored one if the content is the same, else raise it and note why."""
    fp = digest(body)
    prev = state.get(lib_urn)
    if prev and prev["fingerprint"] == fp:
        return prev
    base = int(re.sub(r"\D", "", meta["date"])) * 100
    version = max(base, prev["version"] + 1) if prev else base
    note_uk, note_en = change_note(prev, items, refs, kind, version, meta["version"])
    rec = {"version": version, "fingerprint": fp, "data": meta["version"], "date": meta["date"],
           "note_uk": note_uk, "note_en": note_en,
           "items": {k: f"{h} {short(refs[k], 60)}" for k, h in items.items()}}  # "hash ref"
    state[lib_urn] = rec
    return rec


def clean(s):
    """A URN suffix as CISO Assistant's converter cleans it."""
    return re.sub(r"[^a-z0-9_\-\.\[\]\(\):]", "_", s.strip().lower().replace(" ", "-"))


def urn(kind, *parts):
    return f"urn:{PACKAGER}:risk:{kind}:" + ":".join(clean(p) for p in parts)


def target_urn(fw, control):
    return f"urn:intuitem:risk:req_node:{TARGETS[fw][0]}:{control.lower()}"


def short(text, n=140):
    text = " ".join((text or "").split())
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(" ", 1)[0]
    return cut.rstrip(",;:") + "…"


def groups_of(applies_to):
    """Implementation groups for an applies_to expression: per ';' term, its first sector without '!'."""
    out = []
    for term in filter(None, (applies_to or "").split(";")):
        pos = [x for x in term.split("+") if x and not x.startswith("!")]
        if pos and pos[0] not in out:
            out.append(pos[0])
    return out


def applies_words(a, sectors, lang):
    def part(x):
        neg = x.startswith("!")
        sid = x[1:] if neg else x
        label = sectors.get(sid, {}).get(f"label_{lang}") or sid
        return (("не " if lang == "uk" else "not ") if neg else "") + label
    joiner = " і " if lang == "uk" else " and "
    return "; ".join(joiner.join(part(x) for x in t.split("+")) for t in a.split(";") if t)


def exclusions(sid, appl, sectors):
    """Act-level exceptions from applicability.csv, in words: 'Public sector — except Banks (but applies if also State secrets)'."""
    lab = lambda x, lang: sectors.get(x, {}).get(f"label_{lang}") or x
    out = {"uk": [], "en": []}
    for a in appl:
        if a["source_id"] != sid or not a.get("except"):
            continue
        exc, unl = [x for x in a["except"].split(";") if x], [x for x in (a.get("unless") or "").split(";") if x]
        for lang, no, but in (("uk", "крім:", "але стосується, якщо є:"), ("en", "except", "but applies if also")):
            s = f"{lab(a['sector_id'], lang)} — {no} {', '.join(lab(x, lang) for x in exc)}"
            if unl:
                s += f" ({but} {', '.join(lab(x, lang) for x in unl)})"
            if a.get("decisions"):
                s += f" [{a['decisions']}]"
            out[lang].append(s)
    return "; ".join(out["uk"]) + ("." if out["uk"] else ""), "; ".join(out["en"]) + ("." if out["en"] else "")


def decision_line(d, lang):
    """One decision from data/decisions.csv, as a sentence for an annotation."""
    text = d.get(f"statement_{lang}") or d["statement_uk"]
    if lang == "uk":
        return f"Рішення {d['id']} ({d['date']}{', пропозиція, чекає підтвердження' if d['status'] == 'proposed' else ''}): {text}"
    return f"Decision {d['id']} ({d['date']}{', proposed, awaits confirmation' if d['status'] == 'proposed' else ''}): {text}"


def dump(path, data):
    path.write_text(yaml.safe_dump(data, allow_unicode=True, sort_keys=False, width=110), encoding="utf-8")


def export(out_dir, meta, sources, types, sectors, provisions, mappings, appl=(), decisions=(), policies=(),
           state_path=None):
    """Write the libraries; return the list of written file names.
    state_path: the versions file to read and update (see the module docstring); None keeps every version at
    YYYYMMDD00 of the data date and writes no state."""
    out = Path(out_dir) / "ciso-assistant"
    out.mkdir(parents=True, exist_ok=True)
    dec = {d["id"]: d for d in decisions}
    pol = {r["id"]: r["name_uk"] for r in policies}
    state = json.loads(Path(state_path).read_text(encoding="utf-8")) if state_path and Path(state_path).exists() else {}
    bumped = []
    by_src = {s["id"]: s for s in sources}
    links = {}
    for m in mappings:
        links.setdefault(m["provision_id"], []).append(m)
    written = []
    for sid in dict.fromkeys(p["source_id"] for p in provisions):
        s = by_src[sid]
        provs = [p for p in provisions if p["source_id"] == sid]
        issuer = types.get(s["type"], {})
        fw_urn = urn("framework", sid)
        lib_urn = urn("library", sid)

        # implementation groups used in this act
        used = []
        for p in provs:
            for g in groups_of(p["applies_to"]):
                if g not in used:
                    used.append(g)
        nodes = []
        for p in provs:
            ls = [m for m in links.get(p["id"], []) if m["framework_id"] in TARGETS]
            n_ai = sum(m["review_status"] == "ai_draft" for m in ls)
            ann_uk, ann_en = [], []
            if len(p["ref_uk"]) > 95:
                ann_uk.append("Пункт: " + p["ref_uk"])
                ann_en.append("Paragraph: " + (p.get("ref_en") or p["ref_uk"]))
            if p["applies_to"]:
                ann_uk.append("Стосується лише: " + applies_words(p["applies_to"], sectors, "uk") + ".")
                ann_en.append("Applies only to: " + applies_words(p["applies_to"], sectors, "en") + ".")
            if p.get("grounds") not in ("", "text", None):
                ann_uk.append("Підстава: " + mapdata.GROUNDS.get(p["grounds"], p["grounds"]) + ".")
                ann_en.append(f"Grounds: {p['grounds']}.")
                for i in mapdata.split_ids(p.get("decisions")):
                    if i in dec:
                        ann_uk.append(decision_line(dec[i], "uk"))
                        ann_en.append(decision_line(dec[i], "en"))
            if n_ai:
                ann_uk.append(f"Статус: {AI_UK} — {n_ai} з {len(ls)} зіставлень згенеровано ШІ, людина їх ще не перевірила.")
                ann_en.append(f"Status: AI draft — {n_ai} of {len(ls)} mappings were generated by AI and not yet reviewed by a person.")
            docs = list(dict.fromkeys(pol.get(i, i) for m in ls for i in mapdata.split_ids(m.get("policies"))))
            node = {
                "urn": urn("req_node", sid, p["id"].split(":", 1)[1]),
                "assessable": p["provision_type"] in ("substantive", "recommendation"),
                "depth": 1,
                "ref_id": short(p["ref_uk"], 95),  # CISO Assistant keeps ref_id to 100 characters
                "name": short(p["summary_uk"]),
                "description": p["summary_uk"],
            }
            if ann_uk:
                node["annotation"] = "\n".join(ann_uk)
            if docs:
                node["typical_evidence"] = "Куди внести (базовий перелік документів, не шаблони): " + "; ".join(docs)
            if node["assessable"]:
                node["importance"] = "mandatory" if s.get("binding") == "mandatory" else "recommended"
            if used:
                node["implementation_groups"] = groups_of(p["applies_to"]) or list(used)
            en = {}
            if p.get("summary_en"):
                en["name"], en["description"] = short(p["summary_en"]), p["summary_en"]
            if ann_en:
                en["annotation"] = "\n".join(ann_en)
            if en:
                node["translations"] = {"en": en}
            nodes.append(node)

        exc_uk, exc_en = exclusions(sid, appl, sectors)
        exc_ids = list(dict.fromkeys(i for a in appl if a["source_id"] == sid for i in mapdata.split_ids(a.get("decisions"))))
        exc_uk += "".join("\n" + decision_line(dec[i], "uk") for i in exc_ids if i in dec)
        exc_en += "".join("\n" + decision_line(dec[i], "en") for i in exc_ids if i in dec)
        desc_uk = s.get("description_uk", "")
        if s.get("act_condition_uk"):
            desc_uk += "\n\nУмова для всього акта: " + s["act_condition_uk"]
        if exc_uk:
            desc_uk += "\n\nВинятки: " + exc_uk
        src_uk = f"\n\nДжерело: Кресленик відповідності СУІБ ({meta['site_url']}), дані {{data}}. Офіційний текст: {s.get('url', '')}"
        desc_en = s.get("description_en", "")
        if s.get("act_condition_en"):
            desc_en += "\n\nCondition for the whole act: " + s["act_condition_en"]
        if exc_en:
            desc_en += "\n\nExceptions: " + exc_en
        src_en = f"\n\nSource: Compliant ISMS Kreslenyk ({meta['site_url']}), data {{data}}. Official text: {s.get('url', '')}"
        # CISO Assistant keeps names to 200 characters; the full title stays in the description
        name_uk = short(f"{s['short_ref_uk']}: {s['title_uk']}", 195)
        name_en = short(f"{s.get('short_ref_en') or s['short_ref_uk']}: {s.get('title_en') or s['title_uk']}", 195)
        framework = {"urn": fw_urn, "ref_id": sid, "name": name_uk, "description": desc_uk,
                     "translations": {"en": {"name": name_en, "description": desc_en}}}
        if used:
            framework["implementation_groups_definition"] = [
                {"ref_id": g, "name": sectors.get(g, {}).get("label_uk", g),
                 "description": sectors.get(g, {}).get("description_uk", ""),
                 "translations": {"en": {"name": sectors.get(g, {}).get("label_en", g),
                                         "description": sectors.get(g, {}).get("description_en", "")}}}
                for g in used]
        framework["requirement_nodes"] = nodes
        provider = issuer.get("issuer_uk") or ""
        lib = {"urn": lib_urn, "locale": "uk", "ref_id": sid, "name": name_uk, "description": desc_uk,
               "copyright": "Тексти офіційних документів України не є об'єктами авторського права. Структура, "
                            "короткі формулювання і зіставлення: Кресленик відповідності СУІБ, CC BY 4.0.",
               "version": 0, "publication_date": "", "provider": provider, "packager": PACKAGER,
               "translations": {"en": {"name": name_en, "description": desc_en,
                                       "copyright": "Ukrainian official texts are not subject to copyright. Structure, "
                                                    "short wording and mappings: Compliant ISMS Kreslenyk, CC BY 4.0."}},
               "objects": {"framework": framework}}
        code = {n["urn"]: n["urn"].rsplit(":", 1)[1] for n in nodes}
        items = {code[n["urn"]]: digest(n, 10) for n in nodes}
        refs = {code[n["urn"]]: n["ref_id"] for n in nodes}
        rec = stamp(state, lib, items, refs, "framework", meta, src_uk, src_en, bumped, state_path)
        framework["description"], framework["translations"]["en"]["description"] = \
            lib["description"], lib["translations"]["en"]["description"]
        dump(out / f"{sid}.yaml", lib)
        written.append(f"{sid}.yaml")

        refs_all = {n["urn"]: n["ref_id"] for n in nodes}
        # mapping sets: act -> target and target -> act, for each target framework
        sets = []
        node_urn = {p["id"]: urn("req_node", sid, p["id"].split(":", 1)[1]) for p in provs}
        for fw, (ca_ref, ca_name) in TARGETS.items():
            fwd, back = [], []
            for p in provs:
                if p["provision_type"] not in ("substantive", "recommendation"):
                    continue
                for m in links.get(p["id"], []):
                    c = (m["control_id"] or "").strip()
                    if m["framework_id"] != fw or not c or c in mapdata.NONE_CONTROL:
                        continue
                    rel = REL.get(m["relationship"])
                    if not rel or rel == "not_related":
                        continue
                    split = ISO_SPLIT.get(c) if fw == "iso27001-2022" else None
                    tgts = [(target_urn(fw, x), "intersect") for x in split] if split else [(target_urn(fw, c), rel)]
                    param = (m.get("parameter_uk") or "").strip()
                    note = []
                    if m["review_status"] == "ai_draft":
                        note.append(f"[{AI_UK}]")
                    if param:
                        note.append("Параметр за законом: " + param)
                    note += [decision_line(dec[i], "uk") for i in mapdata.split_ids(m.get("decisions")) if i in dec]
                    ann = "\n".join(note)
                    for t, r in tgts:
                        row = {"source_requirement_urn": node_urn[p["id"]], "target_requirement_urn": t,
                               "relationship": r, "rationale": m.get("rationale") or "semantic"}
                        if ann:
                            row["annotation"] = ann
                        fwd.append(row)
                        inv = INVERSE[r]
                        if param and inv in ("equal", "superset"):
                            inv = "intersect"  # the control alone does not prove the legal value
                        back.append({**row, "source_requirement_urn": t, "target_requirement_urn": node_urn[p["id"]],
                                     "relationship": inv})
            if not fwd:
                continue
            tfw = f"urn:intuitem:risk:framework:{ca_ref}"
            sets.append({"urn": urn("req_mapping_set", f"{sid}-to-{ca_ref}"), "ref_id": f"{sid}-to-{ca_ref}",
                         "name": f"{s['short_ref_uk']} → {ca_name}",
                         "description": f"Зіставлення положень акта з {ca_name} (NIST IR 8477).",
                         "source_framework_urn": fw_urn, "target_framework_urn": tfw, "requirement_mappings": fwd})
            sets.append({"urn": urn("req_mapping_set", f"{ca_ref}-to-{sid}"), "ref_id": f"{ca_ref}-to-{sid}",
                         "name": f"{ca_name} → {s['short_ref_uk']}",
                         "description": f"Зворотне зіставлення: аудит за {ca_name} попередньо заповнює аудит акта. "
                                        "Рядок із параметром за законом не дає повного покриття: значення треба перевірити.",
                         "source_framework_urn": tfw, "target_framework_urn": fw_urn, "requirement_mappings": back})
        if sets:
            mlib = {"urn": urn("library", f"mapping-{sid}"), "locale": "uk", "ref_id": f"mapping-{sid}",
                    "name": short(f"Зіставлення: {s['short_ref_uk']} ↔ ISO/IEC 27001:2022, NIST CSF 2.0", 195),
                    "description": "Зіставлення положень акта із заходами ISO/IEC 27001:2022 і підкатегоріями NIST CSF 2.0 "
                                   "(NIST IR 8477), в обидва боки.",
                    "copyright": "Кресленик відповідності СУІБ, CC BY 4.0.",
                    "version": 0, "publication_date": "", "provider": provider, "packager": PACKAGER,
                    "dependencies": [lib_urn, "urn:intuitem:risk:library:iso27001-2022",
                                     "urn:intuitem:risk:library:nist-csf-2.0"],
                    "objects": {"requirement_mapping_sets": sets}}
            fwd_by = {}
            for ms in sets:
                for m in ms["requirement_mappings"]:
                    if m["source_requirement_urn"].startswith(f"urn:{PACKAGER}:"):
                        fwd_by.setdefault(m["source_requirement_urn"], []).append(m)
            items = {code[u]: digest(ms, 10) for u, ms in fwd_by.items()}
            refs = {code[u]: refs_all[u] for u in fwd_by}
            stamp(state, mlib, items, refs, "mapping", meta, f" Джерело: {meta['site_url']}, дані {{data}}.",
                  f" Source: {meta['site_url']}, data {{data}}.", bumped, state_path)
            dump(out / f"mapping-{sid}.yaml", mlib)
            written.append(f"mapping-{sid}.yaml")
    if state_path:
        Path(state_path).write_text(json.dumps(state, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
                                    encoding="utf-8")
    if bumped:
        print(f"CISO Assistant: {len(bumped)} libraries changed, new version: " + ", ".join(bumped[:8])
              + (" …" if len(bumped) > 8 else ""))
    return written


def stamp(state, lib, items, refs, kind, meta, src_uk, src_en, bumped, state_path):
    """Settle the library's version and add the volatile parts: version, date, source line, change note."""
    if state_path:
        before = state.get(lib["urn"], {}).get("version")
        rec = settle(state, lib["urn"], lib, items, refs, kind, meta)
        if rec["version"] != before:
            bumped.append(lib["ref_id"])
    else:
        rec = {"version": int(re.sub(r"\D", "", meta["date"])) * 100, "data": meta["version"], "date": meta["date"],
               "note_uk": "", "note_en": ""}
    lib["version"], lib["publication_date"] = rec["version"], rec["date"]
    lib["description"] += src_uk.format(data=rec["data"]) + (("\n\n" + rec["note_uk"]) if rec["note_uk"] else "")
    en = lib.get("translations", {}).get("en")
    if en:
        en["description"] += src_en.format(data=rec["data"]) + (("\n\n" + rec["note_en"]) if rec["note_en"] else "")
    return rec


def check(out_dir, ca_dir):
    """Check our files against a checkout of CISO Assistant's libraries: targets exist and are assessable."""
    ca = {}
    for f in ("iso27001-2022.yaml", "nist-csf-2.0.yaml"):
        d = yaml.safe_load((Path(ca_dir) / f).read_text(encoding="utf-8"))
        fw = d["objects"].get("framework") or d["objects"]["frameworks"][0]
        ca.update({n["urn"]: n for n in fw["requirement_nodes"]})
    problems, urns = [], set()
    for f in sorted((Path(out_dir) / "ciso-assistant").glob("*.yaml")):
        d = yaml.safe_load(f.read_text(encoding="utf-8"))
        own = {n["urn"] for n in (d["objects"].get("framework") or {}).get("requirement_nodes", [])}
        dup = own & urns
        if dup:
            problems.append(f"{f.name}: duplicate node URNs {sorted(dup)[:3]}")
        urns |= own
        for ms in d["objects"].get("requirement_mapping_sets", []):
            for m in ms["requirement_mappings"]:
                for k in ("source_requirement_urn", "target_requirement_urn"):
                    u = m[k]
                    if u.startswith("urn:intuitem:") and (u not in ca or not ca[u]["assessable"]):
                        problems.append(f"{f.name}: {u} is not an assessable CISO Assistant requirement")
    for f in sorted((Path(out_dir) / "ciso-assistant").glob("mapping-*.yaml")):
        d = yaml.safe_load(f.read_text(encoding="utf-8"))
        for ms in d["objects"]["requirement_mapping_sets"]:
            for m in ms["requirement_mappings"]:
                for k in ("source_requirement_urn", "target_requirement_urn"):
                    u = m[k]
                    if u.startswith(f"urn:{PACKAGER}:") and u not in urns:
                        problems.append(f"{f.name}: {u} is not a node of any exported framework")
    return problems


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = Path(args[0]) if args else ROOT / "_site" / "data"
    read = lambda n: list(csv.DictReader(open(ROOT / "data" / n, encoding="utf-8")))  # noqa: E731
    meta = json.loads((ROOT / "data" / "meta.json").read_text(encoding="utf-8"))
    frameworks = {f["id"] for f in read("frameworks.csv") if f["tier"] == "organisation"}
    provisions, mappings, errors = mapdata.read_all(frameworks)
    if errors:
        raise SystemExit("mappings/*.xlsx have errors, run scripts/validate.py")
    sources = read("sources.csv")
    by_src = {s["id"]: s for s in sources}
    for p in provisions:
        for f in ("act_condition_uk", "act_condition_en"):
            p[f] = by_src.get(p["source_id"], {}).get(f, "")
    files = export(out, meta, sources, {r["id"]: r for r in read("source_types.csv")},
                   {r["id"]: r for r in read("sectors.csv")}, provisions, mappings, read("applicability.csv"),
                   read("decisions.csv"), read("policies.csv"), state_path=STATE if "--state" in sys.argv else None)
    print(f"{len(files)} CISO Assistant libraries -> {out / 'ciso-assistant'}")
    if "--ca-libraries" in sys.argv:
        problems = check(out, sys.argv[sys.argv.index("--ca-libraries") + 1])
        print("\n".join(problems) if problems else "check: every target is an assessable CISO Assistant requirement")
        sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
