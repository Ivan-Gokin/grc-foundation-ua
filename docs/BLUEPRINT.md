# Blueprint

[Українською](BLUEPRINT.uk.md)

This document describes what the project consists of, how the data is modelled, and how to maintain it. It is written for maintainers and contributors. Readers of the site do not need it.

## 1. What the project is

A foundation for GRC engineering in Ukraine. It answers two questions for an organisation that builds an information security management system (ISMS):

1. **Which legal and regulatory requirements apply to us?** A register of Ukrainian laws, regulations, regulator orders, standards and NATO policies, filtered by organisation type, with regulatory chains and a short description of each act.
2. **Which ISMS controls do those requirements touch?** A mapping from individual provisions (article, paragraph) to ISO/IEC 27001:2022 or NIST CSF 2.0, exported as a draft Statement of Applicability or a draft Target Profile with blank columns for organisation-defined values and policy references.

Scope decisions:

- **Ukraine-only operations.** EU acts and proposals are kept as a separate reference list (`scope=reference`): they show where Ukrainian law is heading, but never feed the controls table. International agreements Ukraine is party to (Association Agreement, Budapest Convention, Convention 108, the NATO security agreement) are part of the core register.
- **Two organisation-level frameworks:** ISO/IEC 27001:2022 (default) and NIST CSF 2.0.
- **ISMS only.** An integrated management system also covers quality (ISO 9001), continuity (ISO 22301) and others. They share the same harmonised structure, but this project covers the information security part.
- **System level (phase 2):** NIST SP 800-53 Rev. 5 with the Ukrainian baseline profiles, reached from the CSF 2.0 result through the official NIST mapping.

Every row carries its provenance and review status.

## 2. Repository layout

```
index.html, 404.html       the site (single page; 404.html resolves /eli/... addresses)
assets/                    styles, scripts, fonts and vendored libraries
assets/js/config.js        repository URL and other settings  <- edit before publishing
content/                   page texts in Markdown, uk and en: home, method, about, guide/ chapters, articles/
mappings/*.xlsx            provisions and their mappings to the frameworks: edited by hand
data/*.csv                 everything else: sources, chains, entity types, framework controls
data/sp800-53/             system-level data (phase 2)
data/datapackage.json      column descriptions of the published files (Frictionless Data Package)
data/meta.json             data version and date shown on the site
scripts/validate.py        data checks
scripts/build.py           builds the site into _site/ (adds the generated files, see below)
scripts/mapdata.py         reads and writes the mapping workbooks
docs/                      this blueprint
.github/                   the publish workflow, issue and pull request templates
```

Nothing generated is kept in git, so every fact lives in one place. On every push to `main`, GitHub Actions runs `validate.py` and `build.py` and publishes `_site/` to GitHub Pages. The build adds:

| Published file | Built from | For |
|---|---|---|
| `data/provisions.csv`, `data/mappings.csv` | `mappings/*.xlsx` | the site and software |
| `data/eli.jsonld` | `sources.csv`, `source_relations.csv` | ELI metadata (3.4) |
| `data/grc-foundation-ua.xlsx` | all of the above, joined | people: register, chains and mappings with names and texts |

How to check and build the site locally: [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## 3. Data model

All data lives in UTF-8 CSV files without BOM. GitHub renders each one as a searchable table. Downloads from the site add a BOM so Excel opens Cyrillic correctly.

```
sectors ──< applicability >── sources ──< provisions ──< mappings >── controls (per framework)
                                 │
                                 └──< source_relations (chains as ELI properties: based_on, amends, repeals...)
```

| File | One row is | Key columns |
|---|---|---|
| `sources.csv` | a legal act or normative document | `id`, `register_no`, `eli`, `scope`, `domain`, `type`, `status`, `binding`, `role`, `description_*`, `concerns_*`, `url`, `last_verified` |
| `source_types.csv` | a type of source (law, CMU resolution, ND TZI, EU act...) | `id`, labels, issuer |
| `sectors.csv` | an entity type the reader can pick ("who it concerns") | `id`, `parent`, `group`, `selectable` |
| `sector_groups.csv` | a group of entity types in the filter | `id`, labels |
| `applicability.csv` | "source X concerns entity type Y" | `source_id`, `sector_id`, `basis`, `verified` |
| `source_relations.csv` | a link in a regulatory chain | `source_id`, `relation`, `related_id`, `basis_uk`, `source_url`, `confidence` |
| `provisions.csv` (from «Вимоги» in `mappings/*.xlsx`) | one requirement inside a source (article, paragraph) | `id`, `source_id`, `ref_uk`, `provision_type`, `applies_to` |
| `mappings.csv` (from the framework sheets in `mappings/*.xlsx`) | provision-to-control relationship | `provision_id`, `framework_id`, `control_id`, `relationship`, `coverage`, `parameter_uk` |
| `controls_*.csv` | a control or requirement of a framework | `id`, `level`, `parent` |
| `frameworks.csv` | a supported framework | `id`, `tier`, `controls_file` |

Column-level descriptions are in `data/datapackage.json`. `provisions.csv` and `mappings.csv` are not kept in the repository: the build makes them from the workbooks (4.4).

### 3.1 Identifiers

IDs are permanent. Once published, an ID is never renamed or reused, because people link to it and other rows reference it. If an ID was wrong, keep it and fix the other columns.

| Source type | Pattern | Example |
|---|---|---|
| Law | `ua-law-<number>-<convocation>` | `ua-law-2163-viii` |
| Presidential decree | `ua-pres-<number>-<year>` | `ua-pres-447-2021` |
| CMU resolution | `ua-cmu-<number>-<year>` | `ua-cmu-518-2019` |
| SSSCIP order | `ua-ssscip-<number>-<year>` | `ua-ssscip-75-2026` |
| NBU resolution | `ua-nbu-<number>-<year>` | `ua-nbu-95-2017` |
| ND TZI / DSTU / VST | `ua-ndtzi-<code>`, `ua-dstu-<code>`, `ua-vst-<code>` | `ua-ndtzi-3.7-003-05` |
| NATO document | `nato-<code, lowercase, dashes>` | `nato-ac-35-d-2002-rev5` |
| Draft law | `ua-bill-<number>` | `ua-bill-8153` |
| International agreement | `intl-<organisation>-<treaty code>` | `intl-coe-ets-185` |
| EU act | `eu-<reg\|dir\|reg-del\|reg-impl>-<year>-<number>` | `eu-reg-2022-2554` |
| EU proposal | `eu-com-<year>-<number>` | `eu-com-2025-837` |

Besides the `id`, every source has a `register_no`: the number readers see on the site ("No. 181"). It continues the numbering of the original register, is unique, and is never reused, even if the act is deleted. A new act gets the next free number.

**ELI.** Every source also has an `eli`: its European Legislation Identifier, the URI scheme the EU and most member states use for legislation (ELI pillar I).

- **EU acts** carry their official ELI from the Publications Office, e.g. `http://data.europa.eu/eli/reg/2022/2554/oj`. It resolves to EUR-Lex.
- **Everything else** gets an ELI-pattern path built by this project, relative to the site root: `eli/<jurisdiction>/<agent>/<type>/<year>/<number>`, e.g. `eli/ua/vru/law/2017/2163-viii`, `eli/ua/cmu/resolution/2019/518`, `eli/ua/ssscip/order/2026/75`. Ukraine has no official ELI yet, so these are **unofficial** and are marked with an asterisk on the site. When an official Ukrainian ELI appears, replace the column values and keep the `id`.
- The full IRI is the site address plus the path (`https://ivan-gokin.github.io/grc-foundation-ua/eli/ua/vru/law/2017/2163-viii`). `404.html` resolves such addresses to the act in the register, and `/ukr` or `/eng` at the end (the language expression) goes to the same place.

| Jurisdiction / agent / type | Used for |
|---|---|
| `ua/vru/law`, `ua/vru/bill` | laws, bills |
| `ua/president/decree` | presidential decrees (number without `/year`) |
| `ua/cmu/resolution`, `ua/nbu/resolution` | Cabinet and NBU resolutions |
| `ua/ssscip/order`, `ua/sbu/order`, `ua/moj/order`, `ua/<agency>/order` | orders |
| `ua/nccc/decision`, `ua/ssscip/guidance` | NCCC decisions, SSSCIP guidance |
| `ua/ssscip/nd-tzi`, `ua/dstu/standard`, `ua/mod/vst` | ND TZI, national and military standards |
| `int/<parties or organisation>/...` | international agreements, e.g. `int/coe/ets/185` |
| `nato/doc/<code>` | NATO documents |
| `eu/com/proposal/<year>/<number>` | EU proposals (they have no official ELI) |

The number is lowercased, `/` becomes `-`, Cyrillic is transliterated (`80/94-ВР` → `80-94-vr`). Parts of one document get a subdivision (`.../2.3-025-24/t1`). The `eli` is unique and as permanent as the `id`.

Provision IDs are `<source_id>:<local reference>`, for example `ua-cmu-373-2006:p7` (paragraph 7) or `ua-law-2163-viii:a5-2` (article 5, part 2). Use `p` for paragraphs (пункт), `a` for articles (стаття), `s` for sections (розділ), dashes for ranges and parts.

### 3.2 Source attributes that drive the site

- **`status`**: `in_force`, `repealed`, `not_yet_in_force` (e.g. a treaty signed but not ratified), `draft` (a bill or an EU proposal), `unknown`. Repealed, draft and not-yet-in-force sources are hidden by default but never deleted. Only `in_force` sources feed the controls table.
- **`scope`**: `core` (Ukrainian law, international agreements, NATO) or `reference` (EU acts and proposals, shown on their own tab).
- **`domain`**: `cybersecurity` or `records` (records management requirements, useful for an integrated management system; hidden by default).
- **`description_*`, `concerns_*`**: one or two sentences on what the act is about, and who it concerns in words. `comment_uk` holds the author's working notes (status, changes, dates).
- **`binding`**: `mandatory` or `recommended` (methodical recommendations, national standards). The reader can hide recommendations.
- **`role`**: what kind of document it is for compliance purposes:
  - `requirements`: contains obligations. Its provisions get mapped.
  - `context`: defines the national system, regulators, strategy. Shown for understanding, not mapped.
  - `procedural`: rules for the regulator's own procedures.
  - `amending`: only amends other acts. Map the amended act's consolidated text, not this one.
- **`text_access`**: `public` or `restricted` (marked "ДСК" or NATO INV). Restricted documents are listed so readers know they exist, but they cannot be mapped publicly.

### 3.3 Entity types and applicability

Each act is tagged with the entity types it concerns (`applicability.csv`). The types in `sectors.csv` are grouped for the filter (`sector_groups.csv`):

- **legal status:** critical infrastructure operators, CII owners, public sector, national cybersecurity system bodies, Defence Forces;
- **information processed:** state information resources and restricted information, state secrets, NATO information, personal data;
- **sector or service:** finance, electronic communications, trust services, cloud and data centres, digital platforms, healthcare, industrial control systems, AI, defence industry;
- **suppliers:** software and hardware manufacturers, ICT suppliers, cybersecurity service providers.

`general` ("all organisations") is not selectable: it is always included. Acts that only set state policy or a regulator's own procedures carry no entity tag and have `role=context`.

A type can have several parents (`parent` separated by `;`). The criticality categories `cii-1-2` and `cii-3-4` sit under both `ki` and `kii`, and `public-sir` / `public-restricted` under both `state-ir` and `public-sector`. They exist because the SSSCIP baseline measures apply per category.

Selection logic: choosing a type includes its parents and `general` when matching acts (choosing `cii-3-4` shows acts tagged `ki`, `kii`, `cii-3-4` or `general`). For provisions with `applies_to`, choosing a broad type also includes the narrower ones (choosing `ki` shows the baseline measures for both criticality groups).

### 3.4 Regulatory chains: decoupling requirements

For readers this is explained in the Methodology (`content/method.*.md`, with an example); here are the recording rules.

Requirements often sit several levels deep: a law delegates to the Cabinet of Ministers, which delegates to SSSCIP. Chains are recorded in the vocabulary of the ELI ontology, so they can be exchanged with EUR-Lex and national gazettes that publish ELI metadata. To avoid counting the same requirement twice:

1. Record the chain in `source_relations.csv` (`ua-cmu-518-2019 based_on ua-law-2163-viii`), with the legal basis in `basis_uk` (usually the preamble: "Відповідно до ч. 3 ст. 5 Закону..."), where you found it in `source_url`, and `confidence`: `high` if taken from the act itself, `medium` if from secondary sources. The row always reads "source_id *relation* related_id", in the direction of the ELI ontology: the newer or lower act is the `source_id`. The `relation` is a property of the ELI ontology 1.5:

   | `relation` | Use it when the `source_id`... | On the Chains tab |
   |---|---|---|
   | `based_on` | is adopted under an enabling act (a CMU resolution under a law, an order under a resolution, a delegated EU act under its basic act) | nested |
   | `transposes` | approximates or transposes an EU directive | nested, badge |
   | `applies` | conforms with an act that is not transposed, typically an EU regulation | nested, badge |
   | `ensures_implementation_of` | implements a treaty, a strategy or a plan without being empowered by it | nested, badge |
   | `amends` | changes the text of another act (including a new edition of it) | alongside |
   | `repeals` | cancels or replaces another act completely | alongside |
   | `commences` | sets another act into force | alongside |
   | `cites`, `related_to` | only refers to it, or is related in another way | alongside |
   | `adopts` (ELI-DL) | is the law adopted from a bill (`related_id` is the bill) | alongside |

   A bill or an EU proposal (`status=draft`) uses the same properties for the changes it proposes (`ua-bill-8153 repeals ua-law-2297-vi`); the site marks them "proposed", and the JSON-LD writes them as `eli-dl:foresees_change_of`.
2. Classify each provision:
   - `substantive`: an actual obligation. Map it.
   - `delegating`: "the procedure is established by the Cabinet of Ministers". Do not map it. The child act's provisions carry the requirement, and the chain shows the legal basis.
   - `definitional`: scope, terms. Do not map it, but it can go into the description.
3. When an act is replaced, add a `repeals` relation from the new act, set the old one to `repealed`, and map the new act.

**Machine-readable chains.** On publication, `scripts/build.py` turns `sources.csv` and `source_relations.csv` into `data/eli.jsonld`: every act as an `eli:LegalResource` (bills and proposals as `eli:Work`) with its ELI, type, date, force, issuer, official-language title and the chain links as ELI properties (pillar II). The file is not kept in the repository.

**Key chains.** `chains.csv` (a chain's title and short description) and `chain_steps.csv` (the steps in order: act, provision, what it does in the chain) narrate a path through the register; the site shows them above the tree on the "Chains" tab. The links between the acts are still recorded in `source_relations.csv`: a key chain explains them, it does not replace them.

### 3.5 Mapping methodology

For readers, the meaning of the relationships and coverage is explained in the Methodology; here are the field values.

Mappings follow the set-theory relationship model from NIST IR 8477 (the method behind NIST's OLIR programme). The **provision is the focal element** and the control is the reference element, so each row reads "provision X is a `<relationship>` of control Y".

| `relationship` | Meaning | Typical `coverage` |
|---|---|---|
| `equal` | Same scope and intent | `full` |
| `subset_of` | The provision is narrower than the control | `full`: implementing the control satisfies it |
| `superset_of` | The provision is broader than the control | `partial`: more is needed |
| `intersects_with` | They overlap, each has parts the other lacks | `partial` |
| `no_relationship` | Checked and found unrelated (record it to show the gap was examined). With an empty `control_id` it means the provision was checked against the whole framework and no control covers it: the site lists it under "requirements with no counterpart" | `none` |

Other columns:

- **`rationale`**: `semantic` (meaning), `syntactic` (wording), `functional` (outcome).
- **`strength`**: optional 1-10.
- **`coverage`**: does implementing the control fully satisfy the provision? This is what the reader acts on: `partial` means the ISMS alone is not enough.
- **`parameter_uk` / `parameter_en`**: a value the law sets for something the organisation would otherwise define, such as a retention period, a review frequency or a reporting deadline. On export these become the "legal minimum" next to the blank "organisation value" column. When several provisions set different values for one control, the site lists all of them, and the strictest one wins.
- **`policy_uk` / `policy_en`**: the internal document (policy, procedure) where the requirement belongs. It is a suggestion; the organisation's own reference goes in the export's blank column.
- **`review_status`**: `ai_draft` (generated by AI, not yet read by a person), `draft` (proposed by a person, not reviewed), `imported` (from an earlier dataset), `reviewed` (checked by a second person, `reviewed_by` filled). AI-generated rows also start `mapped_by` with "AI".

**AI-generated mappings.** They are welcome as a first pass, but they never go straight to `reviewed`. A person reads each row against the text of the act (paragraph number, edition, relationship, coverage), corrects it, fills in `reviewed_by` and only then sets `reviewed`. The site shows `ai_draft` rows with an "AI, not reviewed" badge and a warning above the table, and marks them in every export.

Map each provision to both frameworks directly. Do not derive ISO mappings from CSF ones or the other way round: the imprecision compounds.

### 3.6 Export columns

The site exports what the reader sees and adds blank columns for the organisation's work. What to fill in is explained to readers in the guide (step 5, `content/guide/soa.*.md`); the columns are set by `exportSoa` in `assets/js/app.js`. For ISO 27001 it is a draft Statement of Applicability, for CSF 2.0 a draft target profile.

## 4. Maintaining the list of laws

### 4.1 Adding a new source

1. Find the official text, preferably on zakon.rada.gov.ua. For SSSCIP documents not on Rada, use cip.gov.ua.
2. Add a row to `sources.csv`:
   - `id` per the pattern in 3.1; check it is not taken. `register_no`: the next free number. `eli`: the official ELI for an EU act, otherwise the project path from 3.1.
   - `scope` (`core`, or `reference` for EU acts) and `domain` (`cybersecurity` or `records`).
   - `type`, `number`, `adopted`, `registered` (Ministry of Justice registration, if any).
   - `short_ref_uk`, `short_ref_en`, `title_uk`, `title_en`.
   - `description_uk`, `description_en`: one or two sentences on what the act is about.
   - `concerns_uk`, `concerns_en`: who it concerns, in words.
   - `status`, `binding`, `role`, `text_access`, `url`.
   - `last_verified`: today's date.
3. Add one row per entity type to `applicability.csv`, with `basis` (why it applies) and `verified=yes` if you checked the scope article. Acts with no direct duties get no rows and `role=context`.
4. Add its links to `source_relations.csv` with the ELI property that fits (3.4): at least `based_on` for the act it was adopted under. If it repeals an act, set the old act's `status` to `repealed`.
5. If it contains requirements (`role=requirements`), add its provisions (4.4).
6. Run `python3 scripts/validate.py` and open a pull request. CI runs the same check, and publishes the site once the change is merged.

### 4.2 Bills and EU acts

- **Bills** (`type=ua_bill`, `status=draft`) are a watch list. Include a bill only if it would create obligations for organisations and is a government bill, has passed first reading, or is tied to an EU commitment. Keep "станом на <дата>" in `comment_uk`. When it is adopted, add the law as a new row with an `adopts` relation from the law to the bill and set the bill to `repealed`; if it is withdrawn, set it to `repealed` with a comment.
- **EU acts** (`scope=reference`) follow the same rules as Ukrainian acts. When Ukraine adopts a law that approximates one, link the Ukrainian law to the EU act: `transposes` for a directive, `applies` for a regulation.

### 4.3 When an act changes

| Event | What to do |
|---|---|
| Amended | Check whether mapped provisions changed. In the workbook, update `Вимога` and `Параметр за законом`, set `Статус` of the affected links to `чернетка`; update `last_verified` in `sources.csv`. |
| Repealed | `status=repealed`. Keep the row, provisions and mappings for history. |
| Replaced by a new act | Add the new act, a `repeals` relation, set the old one `repealed`, map the new act's provisions. |
| Renumbered paragraphs | Keep `Код` (it is permanent); update `Пункт` in «Вимоги» and in the links that point to it (Find and Replace). |

### 4.4 Adding provisions and mappings

Provisions and mappings live in `mappings/*.xlsx`, one workbook per group of acts (`nbu.xlsx`, `law-80-94-vr.xlsx`...). Each workbook has:

- **«Вимоги»**: one row per requirement of an act: `Акт` (source id), `Код` (short permanent code, e.g. `p40`; leave empty and it is made from the paragraph), `Пункт`, `Вимога`, `Тип`, `Стосується лише`, `Застереження`, and optional English columns.
- **one sheet per framework**, named by its id (`iso27001-2022`, `csf-2.0`): one row per link: `Акт` + `Пункт` exactly as in «Вимоги» (copy them), `Захід`, `Відношення`, `Обґрунтування`, and optionally `Сила`, `Покриття`, `Параметр за законом`, `Куди внести`, `Примітка`, `Статус`, `Хто зіставив`, `Хто перевірив`, `Дата`. `Захід` «—» means the requirement has no counterpart in the framework.

Column headers have notes, and the columns with fixed values have drop-down lists. An empty `Покриття` follows from the relationship (subset of / equal = full, otherwise partial); an empty `Статус` means draft.

- One row per requirement. Group consecutive paragraphs only if they form one requirement.
- The requirement is a short paraphrase, not a quote. Quote the act only where the exact wording matters.
- Only `обов'язок` (substantive) provisions get mapped.
- Use `Стосується лише` only if the provision is narrower than the act.
- To start a new group of acts, copy an existing workbook and clear its rows. An act's provisions belong in one workbook only.
- Do not rename `Код` once published: it is the provision's id (`ua-nbu-95-2017:el-017`).

### 4.5 Periodic review

- **Monthly:** check the SSSCIP news feed and zakon.rada.gov.ua for new or changed cybersecurity acts. A GitHub issue template "New or changed act" exists for this.
- **Quarterly:** sort `sources.csv` by `last_verified` and recheck the oldest in-force rows. `validate.py --stats` prints counts of unverified rows.
- **Release:** update `data/meta.json` (version, date), add a `CHANGELOG.md` entry, and tag the commit (`data-2026.11`). People can cite a specific version.

### 4.6 Translations

Ukrainian is the primary language of the data. English titles, descriptions and concerns follow; they are informal translations that still need review. Keep terminology consistent with the glossary in the guide (СУІБ = ISMS, КСЗІ = KSZI, ОКІ = critical infrastructure object). In Ukrainian, write «зацікавлені сторони» (interested parties), not «заінтересовані»; keep the original wording in official texts quoted verbatim (the CSF 2.0 translation and the baseline measures of Order No. 75/2026).

### 4.7 Copyright rules

- Ukrainian official documents (laws, resolutions, orders) are not subject to copyright and can be quoted.
- NIST publications are US government works in the public domain.
- **ISO text is copyrighted.** Only control identifiers and the project's own short labels are published. Never paste ISO wording into the data.
- NATO documents: list only what is publicly available. Restricted documents are listed by reference only.

## 5. How the site works

- `index.html` loads `config.js`, `i18n.js` and `app.js`, plus two libraries kept in `assets/vendor/`: PapaParse (CSV) and marked (Markdown). SheetJS (also vendored) loads only when someone exports to Excel.
- `404.html` resolves the project's ELI addresses (`/eli/...`) to the act in the register.
- `app.js` fetches the CSV files from `data/` (two of them built from the workbooks), builds the indexes and renders the views: **Home** (`content/home.*.md`), **Questionnaire** (`#/start`: four questions that set the sector filters and the framework; answers are not stored), **Guide** (chapters from `content/guide/`, listed in the `CHAPTERS` constant of `app.js`, with a header menu and a side panel), **Controls** (one view for both levels: the ISMS frameworks ISO/IEC 27001 and NIST CSF 2.0, and NIST SP 800-53 for an information system), **Legal sources** (tabs for Ukrainian law and the EU reference list, each as a list or as chains), **Methodology** (`content/method.*.md`), **Articles** (Markdown from `content/articles/`, shown in the guide's menu) and **About** (`content/about.*.md`; data downloads and plans are filled in by `app.js`). Old `#/system`, `#/data` and `#/guide` links still work. A link like `#/method#heading-id` scrolls to that heading.
- Markdown conventions in `content/`: a paragraph that starts with **Мета.** / **Goal.**, **Результат.** / **Result.** or **Типові помилки** / **Common mistakes** (with the list after it) is shown as a callout; an italic-only line right under a heading is the "Covers:" line.
- The state (language, view, sectors, framework, toggles) is kept in the URL hash, so a filtered view can be shared as a link.
- Nothing is sent anywhere. All filtering and export happen in the browser.

Selection logic for the controls table:

1. Selected sectors are expanded with their parents and `general`.
2. Sources are kept if they are in the `core` scope, `in_force`, have an applicability row for any expanded type, and (if "recommendations" is off) `binding=mandatory`.
3. Provisions of those sources are kept if `applies_to` is empty or intersects the selected types and their narrower sub-types.
4. Mappings of those provisions to the chosen framework give the "legal drivers" of each control.
5. By default only controls with at least one driver are shown. The toggle shows the full control set, for a complete SoA.

## 6. Phase 2: system level

The organisation level (ISO 27001 or CSF 2.0) says what the organisation commits to. The system level (NIST SP 800-53) is where controls are selected and parameterised for each information system. In Controls, "Information system → NIST SP 800-53" shows, for each control, where the requirement comes from. The sources are described in `data/sp800-53/profiles.csv`:

| `kind` | Source | How the SP 800-53 controls are obtained |
|---|---|---|
| `baseline` | SSSCIP baseline security profiles (Orders No. 409/2025, 419/2025, 843/2025) | directly: column `<id>` and parameters `<id>_params_uk` in `baselines_ua.csv` |
| `plan` | baseline cyber protection measures, the mandatory part of the cyber protection plan (Order No. 75/2026) | the CSF subcategories of that act's provisions, filtered by the object's category (`applies_to`), expanded through the NIST CSF 2.0 to SP 800-53 mapping (`map_csf-2.0_sp800-53r5.csv`) |
| - | CSF and legislation | the CSF subcategories that all other acts require (mappings in `mappings/*.xlsx`), expanded through the same mapping |
| `sector` | sector security profiles (Art. 10 of Law No. 80/94-VR) | like `baseline`; none approved yet |

To add a sector profile once approved: add the act to `sources.csv`, a `kind=sector` row to `profiles.csv`, and two columns to `baselines_ua.csv` (`<id>` with `yes` for the profile's controls and `<id>_params_uk` with the parameters). The site picks it up without code changes.

The mapping over-selects, so treat the expansion as candidates to tailor, not a final set. Mappings to ISO 27001 are not included. Not yet done: the NIST SP 800-53 to ISO 27001 mapping, and OSCAL output (machine-readable profiles with parameter values set), which is the bridge to automation.

## 7. Quality gates

`scripts/validate.py` fails CI on: unknown columns or values in the workbooks, a link whose `Акт` + `Пункт` is not in «Вимоги», a paragraph or code used twice, duplicate or malformed IDs, references to unknown sources/sectors/provisions/controls, invalid enumerations, bad dates or URLs, a BOM in a CSV, a mapping to a function or category instead of a subcategory/control, and a `reviewed` mapping without a reviewer. It also fails on a malformed or duplicate `eli` and on an unknown ELI property in `relation`. It warns about unverified rows and draft mappings.
