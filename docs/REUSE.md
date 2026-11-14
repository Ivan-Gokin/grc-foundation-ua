# Reuse blueprint: building a legal GRC foundation for your country

This document is for anyone who wants to build the same thing for another jurisdiction. That means a register of the acts that bind organisations, a mapping of their provisions to ISO/IEC 27001:2022 and NIST CSF 2.0, and a site that turns a reader's profile into a draft Statement of Applicability (SoA) and target profile, with the legal minimum next to each control.

It covers:
- the technical solution and how to deploy it;
- the standards and notations it relies on;
- what to change for another country;
- how the data was built and reviewed with Claude (skills, agent calls, prompts, scripts);
- what is still to be done, including integration with GRC tools.

[`BLUEPRINT.md`](BLUEPRINT.md) is the companion. It has the field-level data model and the maintenance rules for this repository. This document links to it rather than repeating it.

## 1. What you get

| Output | Who uses it | Where it comes from |
|---|---|---|
| A register of legal and regulatory acts, with status, issuer, ELI identifier, who each act concerns, and the chains between acts (law → resolution → order) | compliance and legal teams | `data/sources.csv`, `applicability.csv`, `source_relations.csv` |
| Provisions (article and paragraph level) mapped to ISO 27001 controls and CSF 2.0 subcategories, with relationship, coverage, legal parameter and grounds | CISOs, GRC analysts, auditors | `mappings/*.xlsx`, published as `data/provisions.csv` and `data/mappings.csv` |
| A profile-driven draft SoA and draft CSF target profile, downloadable as Excel, with blank columns for the organisation's decisions | the organisation building an ISMS | the site (all in the browser) |
| A system level: the NIST SP 800-53 baselines and the controls the legislation drives | system owners and security architects | `data/sp800-53/` |
| Machine-readable data: CSV, a Frictionless data package, ELI JSON-LD and a joined Excel workbook | integrators, researchers, GRC tools | the build step |
| A review record: every ruling, the open issues, the owner's decisions and a lawyer sample | reviewers and auditors of the dataset | `docs/review-2026-11/` |

The core idea is simple. A legal provision becomes a **locked "required by law" row** of the reader's SoA, and the value the law sets (a deadline, a frequency, a condition) becomes the **legal minimum** next to the organisation's own value. A provision with no counterpart in the framework is still shown, as a **"requirement with no counterpart"**, so nothing silently drops out.

## 2. Technical solution

```
        official texts (PDF/HTML)                       you edit
                 │                                         │
                 ▼                                         ▼
   ┌───────────────────────┐     ┌────────────────────────────────────────────┐
   │  text library (local)  │────▶│  data/*.csv        register, sectors, chains │
   │  clean .txt prints      │     │  mappings/*.xlsx   provisions + mappings     │
   └───────────────────────┘     └───────────────┬────────────────────────────┘
                                                 │ git push / pull request
                                                 ▼
                         ┌──────────────────────────────────────────────┐
                         │ GitHub Actions                                 │
                         │  scripts/validate.py  → fail on any error      │
                         │  scripts/build.py     → _site/ + generated data │
                         └───────────────┬──────────────────────────────┘
                                         │ main only
                                         ▼
                         ┌──────────────────────────────────────────────┐
                         │ GitHub Pages: static site, no backend          │
                         │  index.html + assets/js/app.js reads data/*.csv │
                         │  filtering and Excel export in the browser      │
                         └──────────────────────────────────────────────┘
```

**Design choices worth keeping:**

- **No server, no database, no accounts.** The site is static HTML and JS. It fetches CSV, filters in the browser, and builds Excel with SheetJS client-side. Nothing the reader enters leaves the browser. Hosting costs nothing, and the whole site can be mirrored.
- **Two editing surfaces.** Lawyers and compliance staff edit provisions and mappings in **Excel workbooks**, with drop-downs and header notes. Everything else is **CSV**, which GitHub renders as a table. Generated files are never committed, so every fact lives in exactly one place.
- **Validation is the gate.** `scripts/validate.py` fails CI on unknown values, broken references, duplicate or reused IDs, malformed ELIs, a `reviewed` row without a reviewer, and non-text grounds without a dated note (BLUEPRINT §7). Nothing reaches the site without passing it.
- **Permanent identifiers.** Provision and act IDs are never renamed or reused. Deleted provision codes go to `data/retired_provisions.csv`, which validation enforces. People link to rows, and GRC tools will import them.

**Stack:**

| Part | Technology |
|---|---|
| Site | one `index.html`, vanilla JS (`assets/js/app.js`, about 2,200 lines; UI strings in `assets/js/i18n.js`), CSS; vendored PapaParse (CSV), marked (Markdown), SheetJS (Excel, loaded on demand) |
| Page texts | Markdown in `content/` (home, method, about, guide chapters, articles, the "Craft your baseline" steps), one file per language |
| Data tooling | Python 3.12, `openpyxl` 3.1.5 only (`scripts/mapdata.py`, `validate.py`, `build.py`) |
| CI/CD | GitHub Actions (`.github/workflows/site.yml`): validate and build on every pull request; publish to Pages on `main`; the built site is kept as a run artifact |
| Review tooling | `tools/review/` (Python, JSON Lines): segment views, prompt generation, edit operations, ledger, deliverables, lawyer sample. See §8 |

## 3. Deployment

1. **Fork or copy** the repository. Keep the history if you want to cite this project as the origin; that satisfies the CC BY 4.0 licence condition.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.** The workflow needs no secrets.
3. **Edit `assets/js/config.js`:**
   - `repoUrl` and `branch`;
   - `defaultLang`;
   - `heroExample`: the provision, framework and control shown on the home page;
   - `preview`.
4. **Keep preview mode on while the data is unreviewed.** The `<meta name="robots" content="noindex">` tag in `index.html` stays, and `preview: true` shows a banner on every page. Remove both only after human review.
5. **Run it locally:**
   ```bash
   pip install openpyxl==3.1.5
   python3 scripts/validate.py --stats
   python3 scripts/build.py && python3 -m http.server 8000 -d _site
   ```
6. **Release.** Bump `data/meta.json` (version, date), add a `CHANGELOG.md` entry, and tag the commit (`data-YYYY.MM`) so users can cite a version.

A private repository works as well: the built site is attached to every Actions run (Artifacts → `site`) and opens locally.

## 4. Standards and notations

| Standard or notation | Used for | Where |
|---|---|---|
| **ISO/IEC 27001:2022** | organisation-level framework; draft SoA. Clauses 4–10 shown as their own block, Annex A controls as SoA rows | `data/controls_iso27001-2022.csv` (IDs and the project's own short labels only, never ISO text) |
| **NIST CSF 2.0** | organisation-level framework; draft target profile; mapped at subcategory level only | `data/controls_csf-2.0.csv` (an official national translation is used where one exists) |
| **NIST SP 800-53 Rev. 5** + the official CSF 2.0 → SP 800-53 mapping | system level; national baseline profiles | `data/sp800-53/` |
| **NIST IR 8477** (set-theory relationship mapping, the OLIR method) | every mapping row: `equal`, `subset_of`, `superset_of`, `intersects_with`, `no_relationship`; rationale `semantic`, `syntactic`, `functional`; strength 1–10. The provision is the focal element: "provision X is a *relationship* of control Y" | `mappings/*.xlsx`, BLUEPRINT §3.5 |
| **Coverage** (project extension) | does implementing the control satisfy the provision: `full`, `partial` or `none`. Defaults follow the relationship | same |
| **ELI** (European Legislation Identifier), pillars I and II; ELI ontology 1.5, ELI-DL for bills | an identifier for every act; chains as ELI properties (`based_on`, `amends`, `repeals`, `transposes`, `applies`...) | `sources.csv` (`eli`), `source_relations.csv`, published as `data/eli.jsonld` |
| **JSON-LD** | machine-readable register and chains | `data/eli.jsonld` (built) |
| **Frictionless Data Package** | column descriptions of every published file | `data/datapackage.json` |
| **CSV** (RFC 4180, UTF-8, no BOM in git; a BOM added on download for Excel) | all non-mapping data | `data/` |
| **`applies_to` expressions** (project notation) | narrowing a provision to entity types. `;` = OR, `+` = AND, `!` = NOT. Example: `public-sector;public-sector+state-secrets` = public sector, or public sector with state secrets. An exception for the whole act (Order 75 is not for banks unless they hold state secrets) goes once in `applicability.csv` (`except`, `unless`), not as `!banks` on every provision | provisions; evaluated in `app.js`; checked in `validate.py` |
| **`grounds`** (project notation) | what a row rests on: `text` (default), `assumption`, `regulator` or `practice`. Anything but `text` needs a dated sentence in the notes that starts with its label | provisions and mappings; checked in `validate.py` |
| **`review_status`** | `ai_draft`, `draft`, `imported` or `reviewed` (reviewed requires `reviewed_by`). The site badges AI rows and every export marks them | mappings |
| **Edit operations** (project notation, JSON Lines) | machine-applicable changes to the workbooks, each with a ruling id and a reason | `tools/review/apply_ops.py` docstring |
| **OSCAL 1.2** (catalog, profile, Control Mapping model) | planned export; §9 | — |

## 5. Data conventions that make it work

Each of these rules came from a review defect that kept recurring. Keep them.

1. **Map each provision to both frameworks directly.** Never derive the ISO mapping from the CSF mapping or the other way round, because the error compounds.
2. **A conditional duty keeps its lock, and the condition goes into the parameter.** Example: «лише для систем з державною таємницею» (state-secret systems only). If you unlock a conditional row, readers who meet the condition lose a legal requirement.
3. **A `—` row ("no counterpart") carries the same condition as its locked neighbours.** Otherwise it reads as a general rule.
4. **The parameter is the legal minimum, in the act's own words, with the paragraph cited.** Watch for three errors: dropping an alternative trigger or an addressee (narrowing), stating as general what the text limits (widening), and citing the wrong paragraph.
5. **Delegating and definitional provisions are not mapped.** The child act carries the requirement, and the chain records the legal basis (BLUEPRINT §3.4).
6. **Scope lives at two levels.** The act condition (`act_condition_uk` in `sources.csv`) states who the act binds and who it excludes. `applies_to` narrows individual provisions. The site shows both.
7. **Interpretations are labelled and dated.** «Припущення автора (2026-11-14): …» ("author's assumption"), «Позиція регулятора (…)» ("regulator's position"). A reader can tell what the act says from what someone concluded.
8. **Owner decisions are numbered** (AUTH-01, AUTH-02, …) and listed in one file. Rows cite them. Reviewers treat them as settled unless they bring a new primary text.
9. **Primary sources only.** Use the official legal portal or the issuing body's own site. Mirror sites are never the basis of a check. If the text cannot be seen, write `[ПЕРЕВІРИТИ: …]` ("to check"), not a guess.
10. **Copyright.** National official texts are usually free to quote. NIST works are public domain. ISO text is copyrighted, so publish identifiers and your own labels only. Check each source's notice; national standards often forbid reproduction.

## 6. Adapting it to your country

**What is generic (keep as is):** the site code, build, validation, the NIST IR 8477 mapping model, the ISO and CSF control lists, SP 800-53 and its official CSF mapping, the export logic, the review tooling and the templates.

**What is national (replace):**

| Item | File(s) | What to do |
|---|---|---|
| Acts register | `data/sources.csv`, `source_types.csv`, `source_relations.csv`, `chains.csv`, `chain_steps.csv` | Empty them and fill them for your jurisdiction. Keep the column set. |
| ID prefixes and ELI paths | the same files | Change the `ua-` prefix to your ISO 3166 code (`pl-law-…`) and use the ELI jurisdiction segment (`eli/pl/sejm/law/…`). If your country publishes **official ELI**, use it; EU member states usually do. |
| Who an act concerns | `sectors.csv`, `sector_groups.csv`, `applicability.csv` | Build your own entity taxonomy: critical-infrastructure categories, public sector, regulated sectors, kinds of protected information. Keep `general` and multi-parent types. Expect it to change during review, but add codes sparingly: each new code multiplies the `applies_to` combinations. |
| Mapping workbooks | `mappings/*.xlsx` | Start one workbook per group of acts. Copy an existing workbook, clear its rows, and keep the sheets and headers. |
| Workbook headers and labels | `scripts/mapdata.py` (`PROV_SHEET`, `PROV_COLS`, `LINK_COLS`, value labels) | They are in Ukrainian. Translate the header texts and help notes; keep the field names. |
| Languages | `*_uk` / `*_en` columns; `assets/js/i18n.js` (`uk`, `en` blocks); `content/*.uk.md`, `*.en.md`; `config.js` `defaultLang` | The code assumes two languages: a primary one in the `_uk` columns and English in the `_en` columns. **Easiest path:** keep the column names and treat `_uk` as "primary language". **Clean path:** rename the suffix in `mapdata.py`, `build.py`, `validate.py`, `app.js` and `datapackage.json` (about 60 places) and rename the i18n block and content files. |
| National framework translation | `controls_csf-2.0.csv` (`text_uk`), `frameworks.csv` notes | Use an official translation if your regulator published one, and credit it. |
| System-level baselines | `data/sp800-53/profiles.csv`, `baselines_ua.csv` | Add your national baseline profiles if any exist. Otherwise keep only the CSF expansion. |
| Page texts | `content/` | Rewrite the home, method, about and guide pages for your audience. The methodology chapter is mostly reusable. |
| Review contract and personas | `tools/review/templates/contract.example.md`, `personas.example.json`, `project.example.json` | Name your regulators, your audience and your primary-source rule (§8). |

**A sensible order of work:**

1. Register the acts and their chains. Leave out mappings for now; the register alone is useful.
2. Tag who each act concerns, and record the act condition (addressees and exclusions) from each act's own scope article.
3. Build the **text library**: a clean `.txt` of the current edition of every act you will map, with an index (§8.2). Every later step depends on it.
4. Extract provisions, typing each one as substantive, delegating or definitional.
5. Map, with AI as a first pass (`ai_draft`), to both frameworks, with parameters.
6. Review (§8), then human review and a lawyer's sample (§8.6).
7. Leave preview mode and release.

## 7. Building the data with Claude: what was used

The Ukrainian dataset was built and reviewed in Claude, with the person acting as **owner** (the only one who takes legal-interpretation decisions) and Claude acting as **coordinator** of many sub-agents.

| Capability | How it was used |
|---|---|
| **`hostile-review-loop` skill** | The backbone of the review. It sets up a contract (the claim the data must support, a major-comment rubric, venue standards and revision constraints), runs independent reviews with an identical prompt each round, has an area chair rule every comment, keeps a ledger, and stops on agreed criteria. Invoked as `/hostile-review-loop` on the mappings. |
| **Sub-agents** (the Agent tool, run in the background) | One agent per reviewer prompt and one per chair, sweep or fill prompt. Up to about 20 run at once. Each writes JSON Lines to a file and replies with counts only, which keeps the coordinator's context small. |
| **Resuming agents** (SendMessage) | Agents stopped by usage limits were resumed with "continue from where you stopped; re-read live values before writing ops". |
| **Owner questions** (AskUserQuestion) | Legal-interpretation forks were put to the owner as 2–3 options with a recommendation; answers became numbered owner decisions (AUTH-xx). |
| **File reading and PDF skills** (`file-reading`, `pdf-reading`) | Turned the owner's PDF prints of the acts into the plain-text library. |
| **`xlsx` skill / openpyxl** | Workbook reading and writing, through `scripts/mapdata.py` only, so formats stay valid. |
| **Domain skills** (`iso27001`, `nist-csf`) | Useful for drafting mappings and checking control semantics. |
| **Web search and fetch** | Finding editions and checking the regulators' own sites. The official Ukrainian legal portal blocks automated fetching, so the owner supplied prints; plan for that. |
| **Language skill** (`ukrainize-text` or your language's equivalent) | Recommended for primary-language wording hygiene in parameters and notes. |

**Practical limits we hit:**
- **Cost.** Each sub-agent used roughly 150–450k tokens. A full round on 11 segments (33 reviewers and 11 chairs) is therefore around 10M tokens.
- **Usage caps.** Plan for 5-hour and weekly usage caps (resume agents instead of restarting them), a concurrency cap on sub-agents (queue the rest), and stale snapshots (chairs read live values).

## 8. The review method

### 8.1 Roles and flow

```
 segment view (seg_X.txt) ──▶ 3 reviewers (CISO · GRC analyst · regulator), independent, same prompt
                                 │  JSON Lines: severity, rubric criterion, verbatim quote, concrete fix
                                 ▼
                          area chair: discard unquoted · merge · rule · write edit ops
                                 │  ac_X.jsonl (rulings)  ops_X.jsonl (edits, tested on a throwaway copy)
                                 ▼
             coordinator: apply_ops → validate (0 errors) → ledger → build → commit → push
                                 │
                 owner decides AUTHOR items ──▶ author_decisions.md (settled for everyone)
```

**Personas** (`templates/personas.example.json`):
- **CISO** checks actionability: false or missing locks, and legal values that are not carried.
- **GRC analyst** checks method: relationship direction, coverage, the most specific control, and consistency.
- **Regulator** checks the letter of the current text: addressees, editions, values and missed obligations.
- **All** combines the three in one reviewer, for cheap confirmation passes.

**Rubric** (`templates/contract.example.md`):
- **M1 Legal accuracy:** the row misstates the act. Wrong or superseded paragraph or edition, an obligation the act does not impose or imposes on someone else, wrong type, or wrong `applies_to` scope.
- **M2 False lock:** a control is marked "required by law" though the provision does not require it.
- **M3 Missing lock:** a control the provision clearly requires is not mapped, or one of the two frameworks has no row at all.
- **M4 Misleading coverage:** the relationship or coverage would make the reader under- or over-implement.
- **M5 Lost legal specifics:** a value, deadline, frequency, mandatory content, condition or prohibition is carried neither in the parameter nor in an actionable note.
- **M6 Unflagged gap:** an obligation with no counterpart is not recorded as a `—` row, so it would drop out of the SoA.

From round 10 on, a comment counts as MAJOR **only if it changes what the SoA or target profile requires or states**. Without this rule the count does not converge.

**Chair rulings:**
- **VALID:** the defect is real; the chair writes ops.
- **DOWNGRADE:** real, but minor.
- **INVALID:** a misreading.
- **CLARIFY:** reword the row so it cannot be misread.
- **SETTLED:** already decided in the ledger.
- **AUTHOR:** needs the owner or an unavailable text.

### 8.2 The text library comes first

Most real defects were found by reading the **current edition** of the act, and the delegated acts it makes binding, paragraph by paragraph. Build `texts/INDEX.md`: one row per act with the edition date, the path to a clean `.txt`, and notes such as "original 2021 text only, do not use for amended points". Every prompt points to it. A legal claim is ruled VALID only if someone checked it against that library or the issuer's own site.

### 8.3 Running it

See [`tools/review/README.md`](../tools/review/README.md) for the commands. Per round:
1. `segments.py` writes one view per segment (an act, or half of a long act).
2. `mkprompts.py --kind review` writes the reviewer prompts; run them as sub-agents.
3. `mkprompts.py --kind chair` writes the chair prompts; run one chair per segment.
4. `apply_stage.sh` applies, validates, logs, builds, commits and pushes each segment.
5. Count the valid majors per segment and compare them with the stopping criteria.

Each round gets a short **note** appended to every prompt, saying what changed, which classes are closed, and which owner decisions are new. Without it, reviewers re-raise settled points.

### 8.4 Stopping criteria (agree them before you start)

1. Every segment's latest review has 0–1 valid majors, and none rose against the previous review.
2. The final stage has ≤5 valid majors in total, and none is a legal-accuracy or scope major (M1) or a false lock (M2).
3. Coverage is complete: every act walked in full, and every row changed after its last review re-checked.
4. Open items are listed, not hidden.

**Cost rule:** segments at 0–1 majors get one combined (`all`) reviewer instead of three. A cap on the number of rounds stops the review even if the criteria are not met; Ukraine used 15.

### 8.5 When sampling stops converging: the sweep

In Ukraine, three dense public-sector acts kept producing 2–4 new "missing or narrowed condition" majors every round. They were real, but each round sampled only a few. A **condition sweep** fixed this. One editor per half-act walks **every provision and every row** against the primary text and the delegated acts the rows cite. For each row it checks addressees, values, deadlines, triggers, conditions, exceptions and approvers, then writes verified ops (`templates/sweep.md`). The sweep found 33 majors at once, against 2–4 per round from sampling. After it, the confirmation round found 2.

Then run a **final change check**: one combined reviewer per group, reading only the provisions changed since their act's last review. Follow it with a **re-check** of whatever that check changed. Stop when a pass finds no scope or lock majors.

**Propagate owner decisions systematically.** A decision such as "state-owned banks with state-secret systems see the state-secret rows" had to be applied across two acts. Applied row by row, it leaked for three rounds. A mechanical search (every row tagged `!banks` that mentions state secrets but lacks the branch), followed by one ruling per candidate, closed it.

### 8.6 Human review and handover

AI review is a filter, not a sign-off. Every AI-touched row stays `ai_draft` until a person checks it against the act. The handover package (`docs/review-2026-11/`) is a model:
- `decision-list.md`: the decisions left for the owner, assumptions to confirm, sources to supply, and resolved and next-phase items;
- `responses.md`: every ruling;
- `open-issues.md`;
- `changes.csv`: the row-level diff from the pre-review snapshot;
- `lawyer-sample.xlsx`: a reproducible stratified sample with empty verdict columns, where a pattern of errors matters more than any single row;
- the ledger, log and contract.

### 8.7 Lessons

- **Quote or discard.** Requiring a verbatim quote that the chair can grep removed almost all hallucinated defects.
- **The chair protects the data from wrong comments as much as from wrong rows.** In Ukraine, roughly 10–30% of merged items per round were ruled INVALID, SETTLED or DOWNGRADE.
- **Read the delegated acts.** Many conditions live in the resolution or order an act delegates to, not in the act itself.
- **Don't reverse a ruling without new text.** One chair tried to reverse the previous round's ruling. The coordinator dropped the op and kept the earlier ruling.
- **Count majors by effect on the SoA**, not by wording.
- **Keep the whole review outside the repository** (a workspace) and commit only data changes and the final record. Cite commit hashes in the log for traceability, and merge with a merge commit so those hashes survive.

## 9. Work to be done

### 9.1 Data (Ukraine)

- Human review of every `ai_draft` row, the owner's decision list, and the lawyer sample.
- Next-phase workbooks for the acts that were only referenced: ПКМУ 1533 (national incident response plan), 1799 (assessment of the state of cyber protection), 1281 (cyber hygiene), 518 (general cyber-protection requirements for critical infrastructure), and 205 (backups).
  - The most important gap: critical-infrastructure operators outside the public sector do not yet get the ПКМУ 518/1799 assessment duty and its deadlines.
- Sector security profiles, as soon as the regulators approve them.
- A mapping from SP 800-53 to ISO 27001, and a reverse mapping from the national baseline profiles to ISMS controls.
- A review of the English translations, then leaving preview mode.
- Monitoring of official publications for new and amended acts (scheduled GitHub Actions that open an issue per change), plus a change feed (RSS/Atom and GitHub releases per data version).

### 9.2 Integration with GRC tools

The data is already structured so that each integration is an **export script in `scripts/`**, run by `build.py`, with the output published next to the CSV. The SoA *decisions* (applicable or not, justification, status, evidence) belong to each organisation. Exports therefore carry the **requirements, their legal basis and the mappings**, which the GRC tool then uses to pre-fill an assessment.

| Target | What to export | Mapping of our fields | Status |
|---|---|---|---|
| **OSCAL catalog** (one per act or per workbook) | provisions as controls or parts with stable IDs; act metadata in `metadata`; ELI as a link | `id` → control `id`; `ref_uk` → label prop; `summary_*` → part `statement` | to build |
| **OSCAL Control Mapping model** (OSCAL 1.2) | one `mapping-collection` per framework: source = the national catalog, target = the ISO 27001 or CSF 2.0 catalog | `relationship`: `equal` → `equal-to`, `subset_of` → `subset-of`, `superset_of` → `superset-of`, `intersects_with` → `intersects-with`, `no_relationship` → `no-relationship`; `rationale` → `matching-rationale` (`semantic`, `syntactic`, `functional`); `coverage` and `strength` → map coverage and confidence props; `review_status` and `grounds` → props | to build; the value sets line up almost one-to-one |
| **OSCAL profile** ("legal baseline" for a chosen entity profile) | the controls with legal drivers for a profile, with `set-parameter` values from the legal parameters | `parameter_*` → `set-parameters`; `applies_to` evaluated at export | to build; the bridge to SSP tooling such as Compliance Trestle |
| **CISO Assistant** (intuitem, open source) | a framework library per group of acts (YAML, built from its Excel template with `convert_library_v2.py`), and mapping libraries to the ISO 27001:2022, CSF 2.0 and SP 800-53 frameworks that CISO Assistant already ships | node URN = permanent provision ID; `applies_to` → implementation groups (OR only; the exact condition in the annotation); mappings follow the NIST OLIR convention (`equal`, `subset`, `superset`, `intersect`), both directions; a row with a legal value is at most `intersect` into the act; AI-draft mark in annotations | **done**: `scripts/export_ciso_assistant.py`, run by `build.py`; published as `data/ciso-assistant-libraries.zip`. Loaded into a CISO Assistant backend in testing: 12 frameworks, 476 requirements |
| **NIST OLIR** | an Informative Reference submission (the national acts as reference documents against CSF 2.0) | the same IR 8477 relationships | optional; gives international visibility |
| **Commercial GRC platforms** (ServiceNow IRM, Archer, OneTrust, Drata or Vanta custom frameworks, Eramba) | a flat "authority document → citation → control" CSV, plus a mapping CSV | provision → citation; act → authority document; mapping rows as-is | confirm each vendor's current import template before building; most accept CSV |
| **Static API** | per-provision and per-act JSON under `/api/` (generated), keyed by the permanent IDs, plus a release feed so tools can poll for changes | — | to build; costs nothing on Pages |
| **MCP server** | read-only tools for AI agents: find the acts for a profile, get a provision and its mappings, diff two data versions | — | idea; several GRC tools already expose MCP |

Recommended order: CISO Assistant libraries (done) and the OSCAL Control Mapping export first (both reuse the NIST IR 8477 values directly), then the OSCAL profile with parameters, then the static API and release feed. Vendor CSVs can follow on request.

### 9.3 For a new country

- Ship a `template` branch: empty data files, the workbook skeleton, the review workspace templates, and this guide.
- Make the language suffixes configurable (`primary` and `secondary` instead of `uk` and `en`).
- A deck that explains the approach to regulators and practitioners is planned.

## 10. Sources

- NIST IR 8477, *Mapping Relationships Between Documentary Standards, Regulations, Frameworks, and Guidelines*, and the OLIR programme: https://csrc.nist.gov/projects/olir
- OSCAL Control Mapping model (v1.2.x reference): https://pages.nist.gov/OSCAL-Reference/models/v1.2.1/mapping/ and the concept page https://pages.nist.gov/OSCAL/learn/concepts/layer/control/mapping
- ELI, European Legislation Identifier: https://eur-lex.europa.eu/eli-register/about.html
- Frictionless Data Package: https://specs.frictionlessdata.io/data-package/
- CISO Assistant, framework and mapping libraries (contributing guide): https://intuitem.gitbook.io/ciso-assistant/contributing/framework
