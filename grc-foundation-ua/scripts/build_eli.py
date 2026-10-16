#!/usr/bin/env python3
"""Build data/eli.jsonld: the register and its regulatory chains as ELI metadata (JSON-LD).

Vocabulary: ELI ontology 1.5 (http://data.europa.eu/eli/ontology#) and, for bills and EU proposals,
ELI-DL (http://data.europa.eu/eli/eli-draft-legislation-ontology#).

- Every source is an eli:LegalResource; bills and EU proposals are eli:Work (they are not law yet).
- Identifiers: the `eli` column of sources.csv. Official ELIs (EU acts) are absolute; this project's
  ELI-pattern identifiers are written relative to the file ("../eli/ua/..."), so they resolve against
  wherever the site is published (https://<owner>.github.io/grc-foundation-ua/eli/...).
- Links: source_relations.csv, `source_id <relation> related_id`, where `relation` is an ELI property.
  Links that start from a draft are written as eli-dl:foresees_change_of (a draft changes nothing yet),
  except eli-dl:adopts.
- Titles: eli:title on a LegalExpression in the official language; translations made by this project
  go to rdfs:label only.

Run after editing sources.csv or source_relations.csv. CI runs it with --check.
Usage: python3 scripts/build_eli.py [--check]
"""
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = DATA / "eli.jsonld"

ELI_PROPS = {"based_on", "amends", "repeals", "transposes", "applies", "ensures_implementation_of",
             "commences", "cites", "related_to"}
DL_PROPS = {"adopts"}
IN_FORCE = {"in_force": "eli:InForce-inForce", "repealed": "eli:InForce-notInForce",
            "not_yet_in_force": "eli:InForce-notInForce"}
UKR = "http://publications.europa.eu/resource/authority/country/UKR"
LANG = {"uk": "http://publications.europa.eu/resource/authority/language/UKR",
        "en": "http://publications.europa.eu/resource/authority/language/ENG"}
APPROX_DATE_TYPES = {"nd_tzi", "dstu", "vst", "nato_policy"}  # adoption date known only to the year

CONTEXT = {
    "eli": "http://data.europa.eu/eli/ontology#",
    "eli-dl": "http://data.europa.eu/eli/eli-draft-legislation-ontology#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "dct": "http://purl.org/dc/terms/",
    "owl": "http://www.w3.org/2002/07/owl#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "date_document": {"@id": "eli:date_document", "@type": "xsd:date"},
    **{p: {"@id": f"eli:{p}", "@type": "@id"} for p in sorted(ELI_PROPS | {"in_force", "jurisdiction", "type_document",
                                                                          "passed_by", "language", "is_realized_by"})},
    "adopts": {"@id": "eli-dl:adopts", "@type": "@id"},
    "foresees_change_of": {"@id": "eli-dl:foresees_change_of", "@type": "@id"},
    "id_local": "eli:id_local",
    "number": "eli:number",
    "title": "eli:title",
    "title_short": "eli:title_short",
    "label": "rdfs:label",
    "seeAlso": {"@id": "rdfs:seeAlso", "@type": "@id"},
    "prefLabel": "skos:prefLabel",
}


def read(name):
    with open(DATA / name, encoding="utf-8", newline="") as fh:
        return list(csv.DictReader(fh))


def iri(eli):
    return eli if eli.startswith("http") else "../" + eli


def lang_values(row, base):
    return [{"@value": row[f"{base}_{l}"], "@language": l} for l in ("uk", "en") if row.get(f"{base}_{l}")]


def build():
    meta = json.loads((DATA / "meta.json").read_text(encoding="utf-8"))
    sources = read("sources.csv")
    types = {r["id"]: r for r in read("source_types.csv")}
    by_id = {s["id"]: s for s in sources}
    links = {}
    for r in read("source_relations.csv"):
        src = by_id[r["source_id"]]
        prop = r["relation"]
        if src["status"] == "draft" and prop not in DL_PROPS:
            prop = "foresees_change_of"
        links.setdefault(r["source_id"], {}).setdefault(prop, []).append(iri(by_id[r["related_id"]]["eli"]))

    graph = [{
        "@id": "",
        "@type": "dct:Dataset",
        "dct:title": [{"@value": "Реєстр нормативних джерел GRC-фундаменту", "@language": "uk"},
                      {"@value": "GRC foundation register of legal sources", "@language": "en"}],
        "dct:conformsTo": [{"@id": "http://data.europa.eu/eli/ontology"}, {"@id": "http://data.europa.eu/eli/eli-draft-legislation-ontology"}],
        "owl:versionInfo": meta.get("version", ""),
        "dct:modified": {"@value": meta.get("date", ""), "@type": "xsd:date"},
        "rdfs:comment": [{"@value": "Ідентифікатори, що не починаються з http://data.europa.eu/eli/, - неофіційні: вони побудовані за шаблоном ELI цим проєктом, бо офіційного ELI в Україні поки немає.", "@language": "uk"},
                         {"@value": "Identifiers that do not start with http://data.europa.eu/eli/ are unofficial: this project builds them on the ELI URI template because Ukraine has no official ELI yet.", "@language": "en"}],
    }]
    for t in sorted(types):
        graph.append({"@id": f"#type-{t}", "@type": "skos:Concept", "prefLabel": lang_values(types[t], "label")})
        if types[t].get("issuer_uk"):
            graph.append({"@id": f"#issuer-{t}", "@type": "dct:Agent", "label": lang_values(types[t], "issuer")})

    for s in sorted(sources, key=lambda x: x["eli"]):
        draft = s["status"] == "draft"
        node = {
            "@id": iri(s["eli"]),
            "@type": "eli:Work" if draft else "eli:LegalResource",
            "id_local": s["id"],
            "type_document": f"#type-{s['type']}",
        }
        if s["number"]:
            node["number"] = s["number"]
        if s["adopted"] and not (s["type"] in APPROX_DATE_TYPES and s["adopted"].endswith("-01-01")):
            node["date_document"] = s["adopted"]
        if s["status"] in IN_FORCE:
            node["in_force"] = IN_FORCE[s["status"]]
        if s["id"].startswith("ua-"):
            node["jurisdiction"] = UKR
        if types.get(s["type"], {}).get("issuer_uk"):
            node["passed_by"] = f"#issuer-{s['type']}"
        official = "en" if s["scope"] == "reference" or s["type"] == "nato_policy" else "uk"
        if not s["eli"].startswith("http"):  # EUR-Lex publishes the official expressions of EU acts itself
            title = s[f"title_{official}"] or s[f"short_ref_{official}"]
            expr = {"@id": f"{iri(s['eli'])}/{'ukr' if official == 'uk' else 'eng'}", "@type": "eli:LegalExpression",
                    "language": LANG[official], "title": {"@value": title, "@language": official}}
            if s[f"short_ref_{official}"] and s[f"short_ref_{official}"] != title:
                expr["title_short"] = {"@value": s[f"short_ref_{official}"], "@language": official}
            node["is_realized_by"] = [expr]
        node["label"] = lang_values(s, "title") or lang_values(s, "short_ref")
        if s["url"]:
            node["seeAlso"] = s["url"]
        for prop, targets in sorted(links.get(s["id"], {}).items()):
            node[prop] = sorted(targets)
        graph.append(node)
    return {"@context": CONTEXT, "@graph": graph}


def main():
    text = json.dumps(build(), ensure_ascii=False, indent=1) + "\n"
    if "--check" in sys.argv:
        current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if current != text:
            print("data/eli.jsonld is out of date: run python3 scripts/build_eli.py and commit the result")
            sys.exit(1)
        print("data/eli.jsonld is up to date")
        return
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
