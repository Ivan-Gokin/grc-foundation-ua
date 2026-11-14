# Review contract: GRC-фундамент mappings (mappings/*.xlsx)

Object under review: the provisions («Вимоги») and provision-to-control mappings in `mappings/*.xlsx` of
https://github.com/ivan-gokin/grc-foundation-ua (data version at commit 5adf0ca, 2026-11-10).
Profile: REPORT, adapted to a mapping dataset. Personas (set by the author): CISO, GRC analyst, regulator.
Round cap: 15.

## Core claims ledger (spine) — EXTRACTED from the author's request, README, BLUEPRINT and Methodology

- **Thesis.** An organisation in Ukraine can build an integrated ISMS from scratch by taking the site's mappings
  as its legally grounded starting Statement of Applicability (ISO/IEC 27001:2022) or target profile
  (NIST CSF 2.0), with as little own analysis of the compliance requirements as possible.
- **C1 Legal accuracy.** Every provision row states a real obligation of the *current* text of an in-force act,
  with the correct article/paragraph, type (substantive / delegating / definitional) and addressee (applies_to).
- **C2 Correct drivers.** Every mapping names the control(s) that implement the provision, with a correct
  NIST IR 8477 relationship and coverage. On the site every mapped control becomes a locked "required by law"
  SoA row, so a spurious mapping is a false legal requirement and a missing one is a missed legal requirement.
- **C3 Legal specifics carried.** Where the act fixes something the framework leaves to the organisation
  (a value, deadline, frequency, mandatory content, condition or prohibition), the mapping carries it
  (`Параметр за законом` / notes), so the organisation does not have to re-read the act.
- **C4 Framework-independent.** The result works whichever organisation-level framework is chosen:
  each substantive provision is mapped to both ISO/IEC 27001:2022 and NIST CSF 2.0 directly (BLUEPRINT 3.5).
- **C5 Nothing falls through.** An obligation without a counterpart in a framework is recorded as «—»
  (no relationship), so it appears under "requirements with no counterpart"; provenance and review status
  are explicit on every row.
- **Audience and so-what.** CISOs / GRC practitioners of Ukrainian organisations (banks and NBU-supervised
  institutions, CI operators, public bodies, owners of systems with state information resources); their
  supervisors (SSSCIP, NBU) as the hostile check.
- **Out of scope.** The register itself (`data/sources.csv`, applicability, chains), the site code, the
  NIST SP 800-53 layer, and adding acts that have no workbook yet (listed as an open issue instead).

## Spine-vs-draft check (round 0)

| Claim | Finding in v0 | Action |
|---|---|---|
| C1 | CMU 373/2006 provisions use paragraph numbers of the edition before CMU 1531/2025 (own note says so); current text has 33 paragraphs with many new obligations | Fix: re-map to current text (in scope: act has a workbook) |
| C1 | Law 80/94 arts. 1-3 (definitions, objects, subjects) typed substantive and mapped (7 drivers) | Fix in round 1 if confirmed |
| C1 | NBU 95/2017 extracted from the original 2017 edition (own note); NBU 178/2022, 4/2021 amended by NBU 24/2025, 69/2025; NBU 64/2018 amended by NBU 70/2026 | Reviewers to verify; fix where text accessible |
| C2 | Some rows say "indirect link: no direct norm" yet still lock a control | Reviewers to rule |
| C3 | 0 of 495 mapping rows have `Параметр за законом`, though summaries contain values (e.g. "не рідше ніж один раз на рік") | Fix: fill parameters |
| C4 | NBU (315 provisions) mapped to ISO only; Law 80/94 and Order 75 (104 provisions) to CSF only. ISO is the site default, so a CI operator on ISO gets no drivers from Order 75 | Fix: add direct mappings to the missing framework (AI draft) |
| C5 | 54 «—» rows exist; adequacy to be reviewed | Reviewers |

## Major-comment rubric (everything else is MINOR)

- **M1 Legal accuracy.** The provision row misstates the act: wrong or superseded article/paragraph or edition,
  an obligation the act does not impose or imposes on someone else, wrong `Тип`, wrong `Стосується лише`.
- **M2 False lock.** A mapping makes a control "required by law" although the provision does not require
  what the control is about (spurious or indirect link, definitional/delegating provision mapped).
- **M3 Missing lock.** The provision clearly requires a control that is not mapped, or the provision has no
  mapping at all to one of the two organisation-level frameworks.
- **M4 Misleading coverage.** Relationship or coverage would make the reader under- or over-implement: e.g.
  `subset of`/`full` where the act demands something the control does not ask for and no parameter carries it.
- **M5 Lost legal specifics.** The act sets a value, deadline, frequency, mandatory content, condition or
  prohibition, and the row carries it neither in `Параметр за законом` nor in an actionable note.
- **M6 Unflagged gap.** An obligation with no counterpart in the framework is not recorded as «—», so it would
  drop out of the SoA / target profile.

## Venue standards (what "good" means here)

- NIST IR 8477 STRM, provision = focal element: "provision X is a <relationship> of control Y".
  equal/subset_of -> coverage full; superset_of/intersects_with -> partial; «—» = checked, no counterpart.
- `Покриття` answers: does implementing the control (with the legal parameter) fully satisfy the provision?
- `Параметр за законом`: the legal minimum value the organisation must use; strictest wins.
- Only substantive provisions are mapped; definitional and delegating are not.
- Map each provision to both frameworks directly; never derive one from the other.
- ISO/IEC 27001 text is copyrighted: identifiers and own short wording only.
- AI rows stay `ШІ (не вичитано)`; only a second human sets `перевірено`.

- Sources (owner decision AUTH-25, 2026-11-14): cite only a primary source — the zakon.rada.gov.ua print or the issuing body's own site (bank.gov.ua, cip.gov.ua). Mirrors such as iplex or dtkt are never the basis of a check; replace such a citation only after checking the row against a primary text, otherwise leave a dated [ПЕРЕВІРИТИ] naming the act. Texts supplied by the author are listed in the workspace's texts/INDEX.md and take precedence.

## Revision constraints

- Smallest edit that resolves a VALID item. Keep `Код` (permanent IDs); renumbered paragraphs change `Пункт` only.
- Never fabricate legal content; parameters come from the provision summary or a fetched text, with the
  source noted. Otherwise leave `[ПЕРЕВІРИТИ: ...]` in the note.
- New or AI-edited rows: `Статус` = ШІ (не вичитано), `Хто зіставив` = «AI (Claude, hostile review 2026-11)»
  for new rows (existing rows keep their author and get a note), `Дата` = 2026-11-11.
- Imported (human) rows are not edited without a ledger entry; edits to them are flagged for the author.
- `python3 scripts/validate.py` must pass after every round.

## Data model and owner decisions (added 2026-11-13, binding from round 6)

- `grounds` («Підстава») on provisions and mappings: text (default) | assumption | regulator | practice. A row marked assumption/regulator/practice rests on that interpretation by the owner's decision; its dated sentence in the notes explains it. Do not raise such a row as M1/M2 merely because the act text alone does not say it; raise it only with a verified text or published regulator position that contradicts the assumption.
- `applies_to`: ';' = any of, '+' = all of, '!' = not (e.g. public-sector+!banks). New codes: banks, state-bodies.
- Act-level fields in data/sources.csv: checked_edition and act_condition_uk/en (shown in the segment header). Rows no longer repeat them; do not raise their absence on rows.
- Retired provision codes are listed in data/retired_provisions.csv and are never reused.
- The owner's decisions are in author_decisions.md (AUTH-*). They are SETTLED for reviewers and chairs: do not re-raise them without a new verified text.
- Incident reporting to regulators/CERT/ЦКЗ is mapped to incident-management controls (ISO A.5.24, A.5.26; CSF RS.CO-02, RS.MA-*) with recipient and deadline in the parameter (AUTH-06); other regulator reporting keeps «—»; never ISO 7.4 for regulator reporting.
