# Changelog

## data-2026.10.5 (2026-10-16)

- System level reworked: each SP 800-53 control shows where the requirement comes from: the baseline security profile (SSSCIP Orders No. 409/2025, 419/2025, 843/2025, with parameters), the cyber protection plan (baseline measures of Order No. 75/2026, by object category), or CSF and legislation (CSF subcategories required by other acts). Sector security profiles have a place in the view and the data model (`kind=sector`) but none is approved yet.
- New `data/sp800-53/profiles.csv` describing these sources; the validator checks it.
- Preview mode: `noindex` on the site, a "Preview, please do not share" banner (`preview: true` in `config.js`), and the built site kept as an artifact of every Actions run.

## data-2026.10.4 (2026-10-16)

- Provisions and mappings moved from `data/provisions.csv` and `data/mappings.csv` to Excel workbooks `mappings/*.xlsx` (`nbu`, `law-80-94-vr`, `cmu-373-736`, `ssscip-75-2026`): a «Вимоги» sheet per workbook and one sheet per framework, linked by act + paragraph, with header notes and drop-down lists. The conversion was lossless, except that the duplicate provision `ua-law-80-94-vr:a8-p4-gap` was merged into `a8-p4` as its "no counterpart" link.
- Nothing generated is kept in git any more. `scripts/build.py` builds the site into `_site/` and adds `provisions.csv`, `mappings.csv`, `eli.jsonld` and the new readable workbook `grc-foundation-ua.xlsx` (register, chains and mappings with names and texts joined in). GitHub Actions (`site.yml`) checks every pull request and publishes `main` to Pages; the Pages source is now "GitHub Actions".
- Removed for compactness: the one-off import and migration scripts (`import_legacy.py`, `merge_register_2026_10.py`, `import_strm_2026_10.py`, `migrate_to_eli_2026_10.py`, `legacy_translations_en.csv`), `build_eli.py` (now part of `build.py`), `.nojekyll` and `validate.yml`. What they did is recorded in the entries below.
- The Data page now offers the readable workbook first and links generated files to what they are built from.
- Removed the archived CSF 1.1 integration matrix (`data/archive/`). The repository and site addresses now point to github.com/Ivan-Gokin; the readable workbook gives full ELI addresses.

## data-2026.10.3 (2026-10-16)

- Regulatory chains rebuilt on the European Legislation Identifier (ELI). `source_relations.csv` now uses ELI ontology 1.5 properties: `issued_under` → `based_on` (103), `replaces` → `repeals` (16), `implements` → `transposes` (EU directives, 3), `applies` (EU regulations, 3) or `ensures_implementation_of` (treaties, 3); `amends` unchanged. Three links were reclassified: Law 4336-IX → Regulation 2024/792 (`related_to`), SSSCIP order 843/2025 → UA-NATO Security Agreement and Decree 37/2022 → Decree 447/2021 (`ensures_implementation_of`). New `adopts` (ELI-DL) for a law adopted from a bill.
- New `eli` column in `sources.csv`: the official ELI for the 28 EU acts, and an unofficial ELI-pattern path (`eli/ua/vru/law/2017/2163-viii`) for everything else, since Ukraine has no official ELI yet.
- New generated `data/eli.jsonld` (`scripts/build_eli.py`, checked in CI): the register and chains as ELI metadata; links from drafts as `eli-dl:foresees_change_of`.
- `404.html` resolves `/eli/...` addresses to the act in the register. The site shows the ELI of each act, labels links with ELI terms, and adds the ELI to the sources export.

## data-2026.10.2 (2026-10-16)

- **AI-generated, not yet proofread:** 315 provisions and 335 mappings for eight NBU resolutions (95/2017, 178/2022, 43/2021, 4/2021, 64/2018, 88/2019, 99/2025, 67/2024) to ISO/IEC 27001:2022, and 37 provisions and 70 mappings for Law No. 80/94-VR to NIST CSF 2.0, from two STRM workbooks (NIST IR 8477).
- New `review_status=ai_draft`, shown as "AI, not reviewed" with a warning above the controls table and in every export. The 22 earlier draft mappings written by Claude are now `ai_draft` too.
- New `policy_uk`/`policy_en` columns in `mappings.csv` (where the requirement belongs), shown on the site and added to the SoA export.
- Requirements with no counterpart in the framework (`no_relationship` with an empty `control_id`) are listed below the controls table.
- Provision caveats (edition used, numbering to verify) are shown with each driver.
- Law 80/94 is now tagged as applying to every organisation (universal norms) and to CII owners; its provisions carry `applies_to` for state information resources, CII and finance.

## data-2026.10.1 (2026-10-16)

- Merged the extended register: 288 sources (252 core, 36 EU reference), each with `register_no`, a description and "concerns" text in both languages, and `scope`/`domain` columns.
- New source types: international agreements, Ukrainian bills (watch list), Ministry of Justice and other orders, EU acts and proposals.
- Entity types rebuilt as 25 tags in four groups (`sector_groups.csv`), with multiple parents; 522 applicability rows (draft).
- 159 regulatory relations with legal basis, source URL and confidence; new "Chains" view.
- EU acts on a separate reference tab, never in the controls table. Bills, unratified treaties, repealed acts and records-management acts are hidden by default.
- New "Articles" section (ISMS policy case studies, GRC systems overview). Guide rewritten around the three GRC engineering stages.
- CSF 1.1 integration matrix moved to `data/archive/`.

## data-2026.10 (2026-10-16)

- Initial import from grc-one-stop-shop-ua: 211 Ukrainian and NATO sources (EU acts excluded), applicability by sector (draft), 10 regulatory relations (draft).
- CSF 2.0 controls with the SSSCIP 2026 Ukrainian text; 68 SSSCIP baseline measures as provisions mapped to CSF 2.0 (imported).
- ISO/IEC 27001:2022 clauses and Annex A controls with the project's own labels.
- 10 provisions of CMU Resolutions 373/2006 and 736/2016 with 22 draft mappings to both frameworks.
- SP 800-53 Rev. 5 with Ukrainian baselines (open, official, NATO) and the NIST CSF 2.0 to SP 800-53 mapping.
