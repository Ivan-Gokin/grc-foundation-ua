# Owner decision list: legal mappings review, 2026-11

This is the starting point for the human review. The AI review stopped on 2026-11-14 because the agreed criteria were met (see `log.md`, and PR #8). Every row the AI changed or added is still marked «ШІ (не вичитано)» (`ai_draft`).

## What to do, in order

1. **Decide A1–A3 below.** Three questions remain. Each lists options and a recommendation.
2. **Confirm or reject the assumption groups B1–B3.** These are interpretations the reviewers made without a direct instruction from you. B4 lists the ones already covered by your decisions.
3. **Supply the sources in C**, where you have them. Each one closes a [ПЕРЕВІРИТИ] marker.
4. **Give `lawyer-sample.xlsx` to the lawyer.** It holds 50 rows from 12 acts, stratified and reproducible (seed 20261113), with empty verdict columns. If the lawyer finds a pattern, that pattern is worth more than the single row.
5. **Mark reviewed rows as you go.** When you have checked a row, set its status in the workbook from «ШІ (не вичитано)» to reviewed.

## Two known limits (no decision needed now)

- **ПКМУ 736 for ОМС:** the act only recommends its instruction to local self-government bodies. Following your "no new codes" line (AUTH-34, AUTH-38), there is no separate ОМС code. So an ОМС that picks "state bodies" sees the ПКМУ 736 rows as locks, and the act condition explains that they are recommendations.
- **Assessment for CI operators outside the public sector:** these operators do not yet see the ПКМУ 518 / 1799 assessment duty or its deadlines (annual self-assessment, external assessment at least every two years). It belongs in the next-phase ПКМУ 1799 workbook (E, SW-Ba-009).


Prepared 2026-11-14 from: `docs/review-2026-11/open-issues.md` (section 1, 38 AUTHOR items; section 4, 19 markers), `review/r7/followups.md`, `review/r8/followups.md`, `review/dp/author_decisions.md` (AUTH-01 … AUTH-39), `review/decisions.md` (rounds R1–R13, SW, CC) and the live workbooks read with `tools/wbio.py` (2,064 rows).

Result for the 38 section-1 items: 36 resolved, 1 open (R9-A2-007), 1 next phase (R5-A2-013). From the follow-up files, R6-A1-011 and R7-A2-009 are still open, and R9-A2-007 appears there too.

---

## A. Decisions needed (most impactful first)

### A1. R6-A1-011: backup copies abroad after martial law (ПКМУ 205 п. 26-5 vs ПКМУ 1500 п. 21)

**Rows:** `ua-law-80-94-vr:a8-p11` [csf PR.DS-11; iso A.8.13] and `ua-law-80-94-vr:a8-p12` [csf PR.DS-11; iso A.8.13]. All four carry `[ПЕРЕВІРИТИ (2026-11-14): питання власнику R6-A1-011]`. Who sees them: `state-ir+!banks;public-sector+!banks` (a8-p12 also `kii+!banks`). Your earlier answer covered banks, but banks are already excluded, so the question was asked again (author_decisions.md, "Pending").

**Facts, checked against the supplied prints:**
- ПКМУ 205 п. 26-5 (as amended by № 1009/2026, in force since 13.08.2026, with no end date) applies to category I–II informatization tools. If the primary environment is in Ukraine, at least one recovery-reserve instance must sit in a protected environment outside Ukraine. If the primary environment is abroad, at least one instance must stay within Ukrainian jurisdiction.
- ПКМУ 1500, Порядок п. 21: within six months after martial law ends, customers **that signed a contract under п. 3 of the same Порядок** must stop using foreign cloud and data-centre resources and keep state information resources and their backups in Ukraine. By its text, п. 21 binds only those п. 3 contract holders (texts/r3/cmu1500.clean.txt, line 203).
- Закон 80/94 ст. 8 ч. 11 пп. 2–3 (row a8-p12) sets duties only for martial law plus six months. The ч. 12 ban (row a8-p12-2025) covers only temporarily occupied territories and aggressor or allied states.

**Question:** After martial law plus six months, must a public-sector owner of a category I–II tool whose primary environment is in Ukraine keep one reserve instance abroad?

**Options:**
- **(a) Both rules stand, with narrow scopes (recommended).** п. 21 only winds down the п. 3 foreign cloud/ЦОД arrangements. п. 26-5 is the later, specific and open-ended rule for the recovery reserve, and it keeps applying.
  - SoA/profile change: the a8-p11 PR.DS-11 and A.8.13 parameter keeps п. 26-5 with no end date.
  - The a8-p12 notes say that п. 21 binds only п. 3 contract holders and does not cancel the п. 26-5 reserve instance.
  - The marker becomes a dated `Припущення автора` sentence with grounds=assumption on the 4 links.
  - The SoA keeps a legal minimum of "one reserve instance abroad" after the war.
- **(b) п. 21 wins after martial law.** All state information resources and their copies return to Ukraine. The "abroad" branch of п. 26-5 is read as limited to martial law plus six months, in line with the ч. 11 п. 2 time limit.
  - SoA/profile change: the a8-p11 PR.DS-11 and A.8.13 parameter gets "until martial law + 6 months" on the abroad branch.
  - a8-p12 gets a matching note, and the same 4 links get an assumption sentence.
  - After the war, the SoA shows no legal duty to hold a reserve abroad.
- **(c) Leave it undecided.** Both parameters show the two rules side by side as conflicting after martial law, and the question goes to the lawyer sample (AUTH-21). The marker is replaced by a dated note naming the conflict. Relationships and coverage do not change.

**Reviewer recommendation:** (a). The text of п. 21 limits its addressees, and the 2026 amendment to ПКМУ 205 was made with ПКМУ 1500 already in force. Martial law continues, so nothing changes in practice today.

### A2. R9-A2-007: ПКМУ 736 records-keeping rules, plus methodology rules you ordered that are still unwritten

**Rows:** `ua-cmu-736-2016:p63-73` [Застереження] (пп. 64, 68–70), the same category on `p93-94`, and п. 92 (value appraisal of documents). The comparison is with `p108-109` [A.5.9; ID.AM-07]. Tag: `state-bodies`.

**Question:** Should records-keeping and archive rules (filing, registration logs, retention periods, value appraisal) be excluded from mapping by a written methodology rule, or recorded as "no counterpart" rows?

**Options:**
- **(a) A methodology rule (recommended).** Add a criterion to `content/method.*.md` and `docs/BLUEPRINT*.md` §3.5: «діловодні та архівні правила окремо не зіставляються». The data does not change, and neither does the SoA or profile. The notes on p63-73 and p93-94 already use this wording, and R7-A2-005 accepted it.
- **(b) "No counterpart" rows.** Add ISO «—» and CSF «—» (no_relationship) rows for пп. 64, 68–70 and 92. The SoA and profile locks do not change. These paragraphs then appear under "requirements with no counterpart" in the state-bodies export.

**Reviewer recommendation:** (a). Use the same edit to write the rules you already decided, which are not in `content/method.uk.md`, `content/method.en.md` or `docs/BLUEPRINT.md` yet:
- **AUTH-06:** incident reporting maps to A.5.24, A.5.26 and RS.CO-02. Other reporting to regulators gets «—» as the main record, with A.5.5 as a supporting link, and never ISO 7.4.
- **AUTH-07:** for conditional duties, the control stays locked and the condition goes into «Параметр за законом».

### A3. R7-A2-009 (optional): the addressees of ПКМУ 1533 п. 12 on ПКМУ 373 p29

**Rows:** `ua-cmu-373-2006:p29` [iso A.5.25; csf RS.MA-03]. Both currently have grounds empty (text). The parameter quotes п. 12 word for word: "суб'єкт забезпечення кібербезпеки самостійно або у взаємодії з CERT-UA / CSIRT …". Scope of p29: `public-sector+!banks;public-sector+state-secrets`.

**Question:** Should the reading that every p29 addressee is a "суб'єкт забезпечення кібербезпеки" under п. 12 be marked as an assumption? ПКМУ 1533 п. 3 names state bodies, local governments (ОМС), critical infrastructure (КІ) operators and owners of critical information infrastructure objects (ОКІІ). It does not name state enterprises directly.

**Options:**
- **(a) Leave as text and close (recommended).** p29 itself requires owners to respond "з урахуванням національного плану", so the plan's п. 12 reaches all p29 addressees through ПКМУ 373. Nothing changes.
- **(b) Mark it as an assumption.** Set grounds=assumption on the 2 links with a dated sentence. The assumption badge then appears on those 2 locked rows of the public-sector SoA and profile.

---

## B. Assumptions to confirm (dated «Припущення автора (2026-11-14)», not yet confirmed by you)

The live data has 86 such sentences in 77 rows. 51 of them restate decisions you already made (table B4). The three groups below are unconfirmed.

| # | Statement | Rows | Example ids | Added by | If you reject it |
|---|---|---|---|---|---|
| B1 | Наказ 75 base measures: banks do not see a measure through its public-sector branches (`public-sir+!banks`; `public-restricted+!banks`; `public-restricted+state-secrets` kept). This extends AUTH-30 from ПКМУ 373 п. 2 to Наказ 75. For КІ/ОКІІ branches the exclusion is textual (ПКМУ 518 п. 1 абз. 2, AUTH-38). | 24 provisions | `ua-ssscip-75-2026:base:RS.CO-02`, `base:PR.DS-11`, `base:GV.RM-03`, `base:RS.MA-01` | R10-B-001 (also stated in the act condition, which AUTH-38 reviewed for the КІ/НБУ part only) | State banks with public-sir or public-restricted systems see 24 more locked measures in their SoA and profile. |
| B2 | ПКМУ 373 p21, level IV (state secrets): the supplier's system takes part in processing state secrets, so Закон 80/94 ст. 8 ч. 6 applies and the "certificate" route of Порядок підтвердження п. 5 is closed. Only security authorisation (with listing) or a valid КСЗІ attestat counts. | 5 links on 1 provision | `ua-cmu-373-2006:p21` [A.5.20], [A.5.21], [GV.SC-05], [iso —], [csf —] | CC-001 | The level-IV parameter lists all three routes, as for levels II–III, so an accredited ISO/IEC 27001 certificate (AUTH-POS-1) would also suffice. |
| B3 | The AUTH-37 state-secrets branch (`;public-sector+state-secrets`, with the AUTH-37 sentence) was added to rows your decision did not list. AUTH-37 named a8-p2, a8-p3, a8-p7, a13-i1-1, p11, p14, p16 and p23; the reviewers applied its criterion to 6 more. | 6 provisions | `ua-cmu-373-2006:p5`, `p10` (R13-A2-001); `p21` (CC-001); `p29` (CC-002); `ua-law-80-94-vr:a10-p4` (R13-A1-001); `a10-p3.a1` (R13-A1-002) | R13, CC | State banks with state-secret systems stop seeing these 6 rows. |

### B4. Already confirmed (no action; listed so the 86 sentences add up)

| Statement | Sentences | Confirmed by |
|---|---|---|
| ПКМУ 373 п. 2: rows hidden for banks except state-secret systems | 27 | AUTH-30 |
| State-secret branch on the rows AUTH-37 lists (Закон 80/94 a8-p2, a8-p3, a8-p7, a13-i1-1; ПКМУ 373 p11, p14, p16, p23) | 8 (of the 14 AUTH-37 sentences; the other 6 are B3) | AUTH-37 |
| A Наказ 285 criterion alone does not justify a lock (e.g. `base:ID.RA-01` [A.8.8], `base:PR.DS-01` [A.8.3]) | 7 | AUTH-29 |
| НБУ 43 el-006: non-payment-service providers classify criticality by Положення № 123 by analogy | 4 | AUTH-32 |
| НБУ 178 el-017: both п. 44 areas, in one audit or two | 2 | AUTH-23 |
| Закон 80/94 a8-p11: no ч. 11 п. 1 duty for КІІ owners without state information resources | 1 | AUTH-27 |
| Закон 80/94 a10-p4 covers state enterprises | 1 | AUTH-33 |
| НБУ 43 el-063: п. 5 excludes only activity as a participant | 1 | AUTH-31 |

Check: 24 + 5 + 6 + 27 + 8 + 7 + 4 + 2 + 1 + 1 + 1 = 86.

---

## C. Sources you should supply (the 19 [ПЕРЕВІРИТИ] markers in section 4, grouped)

Open-issues lists 19 distinct markers. The live data repeats them on sibling links, so there are 44 occurrences.

| # | Missing source | Markers (rows) | Note |
|---|---|---|---|
| C1 | Наказ Адміністрації Держспецзв'язку № 402 від 02.06.2026 (z0880-26, Методика оцінювання ризиків кібербезпеки): zakon.rada print or the SSSCIP site | 3: `ua-cmu-373-2006:p28` (provision; iso 6.1.2; iso 8.2; also on csf GV.RM-06, ID.RA-05) | It was read only on the docs.dtkt.ua mirror. These are also the last 5 dtkt citations in the data (AUTH-25). |
| C2 | Details of the order amending наказ № 285 | 1: `ua-cmu-373-2006:p27` (A.5.35, A.5.36, GV.OV-03) | |
| C3 | Legal basis of наказ 285 criteria 1.1–1.3 (cyber unit or head) and 6.2 (own-domain e-mail with an OpenPGP key) | 2: `ua-cmu-373-2006:p30` (5.3, A.5.2, GV.RR-02; A.5.5, RS.CO-03) | Under AUTH-29 these criteria cannot create locks anyway. You can also just drop the markers. |
| C4 | Закон 2163-VIII, current edition (zakon.rada print) | 1: `ua-cmu-373-2006:p30` (5.3, A.5.2, GV.RR-02) | Is a cyber-protection unit or head mandatory? This is also next-phase item R5-A2-013. |
| C5 | An SSSCIP order approving a base security profile for state-secret systems, or confirmation that none exists | 1: `ua-cmu-373-2006:p16` (A.5.31, 6.1.3, GV.OC-03, ID.RA-06) | Orders 409/419 cover only open and confidential information. |
| C6 | An official SSSCIP or Cabinet (КМУ) clarification of the ПКМУ 712 transition: status of earlier КСЗІ attestats, and what happens to work not finished within абз. 3 п. 2 | 3: `ua-cmu-373-2006:p16` (provision); `ua-law-80-94-vr:a8-p3`; `a13-i1-1` | AUTH-POS-2 already gives the practice note. The print does not settle the legal point. |
| C7 | The Cabinet procedure for state expertise of software for state-secret systems (Закон 80/94 ст. 8 ч. 9) | 1: `ua-law-80-94-vr:a8-p9` (ID.RA-09, PR.PS-05, A.8.19, A.5.21) | |
| C8 | Source of the rule "spot-check restores at least once every two months", possibly ПКМУ № 522/2022 (НЦР services) | 1: `ua-law-80-94-vr:a8-p11` (PR.DS-11, A.8.13) | The ПКМУ 311/2023 print does not contain it. It is not a legal minimum until checked. |
| C9 | The act setting the procedure for moving backups and state information resources abroad under martial law (ст. 8 ч. 11 пп. 2–3) | 1: `ua-law-80-94-vr:a8-p12` (PR.DS-11, A.8.13, A.5.23, A.7.10, iso «—», csf «—») | ПКМУ 1500 covers only cloud/ЦОД placement by customers who opt in. |
| C10 | НБУ 88 current edition (п. 5 розд. II, ред. 26.06.2026): zakon.rada print v0088500-19 or the PDF of постанова НБУ № 64/2026 on bank.gov.ua | 1: `ua-nbu-88-2019:el-036` | sources.csv checked_edition still says "за первинним текстом не звірено". |
| C11 | Text and status of законопроєкт № 15344 of 22.06.2026 (essential terms of cloud contracts) | 1: `ua-nbu-99-2025:el-014` (A.5.20, GV.SC-05) | The 17 terms of Закон 2075-IX ч. 3 ст. 10 are already checked against the print. |
| C12 | НБУ 64 amendment history (2018–2026 resolutions): which one added the breakdown by components in п. 277 | 1: `ua-nbu-64-2018:el-027` (6.1.2, GV.RM-02) | The binding date itself is settled (R11-E2a-001). Only the attribution is open. |
| (A1) | Not a source: your decision on R6-A1-011 | 2: `ua-law-80-94-vr:a8-p11`, `a8-p12` (PR.DS-11, A.8.13) | See A1. |

Check: 3 + 1 + 2 + 1 + 1 + 3 + 1 + 1 + 1 + 1 + 1 + 1 + 2 = 19.

---

## D. Resolved items (rid → resolved by)

### From open-issues section 1 (36 of 38)

- R1-B-016 → R10-B-002 (RS.CO-02, A.5.26, A.5.24 parameters from ПКМУ 1533 пп. 13, 14, 17, 18, 20, checked against the print supplied under AUTH-28) and R10-B-007, R10-B-008, R11-B-005 (ID.IM-04). The rest of 1533 is next phase.
- R1-B-020 → AUTH-09 (checked_edition field per act) and AUTH-TAG-DONE (grounds column). Cleanup still possible: the label «legacy-import-2026-10» still opens the notes of all 68 Наказ 75 provisions (R13-B-008 only normalised it). Drop it if you don't want it.
- R1-B-023 → R6-B-001 and R6-B-006 (all 68 codes scripted against the signed text, 68/68), plus the R9-B-001 sweep.
- R1-B-024 → R6-B-004 (the ID.IM-04 parameter carries the Наказ 75 plan form and the annual review) and R13-B-005.
- R1-E-018 → live data: НБУ 64 гл. 45-2–45-8 are mapped from the zakon.rada print ред. 20.08.2026 (el-009; el-010 contract content пп. 290-47–290-50; el-012 exit plans гл. 45-8; el-037 contract register, додаток 7; el-038). Постанова № 70 print supplied (AUTH-28).
- R1-E-037 → R3-E1-001 (caveat replaced) and AUTH-09. The leftover el-036 marker is C10.
- R2-A1-015 → ПКМУ 1009 text supplied. ПКМУ 205 (ред. 1009/2026) values are now in the a8-p11 PR.DS-11 and A.8.13 parameters. The separate workbook is next phase (AUTH-19).
- R2-A1-032 → AUTH-02.
- R2-A2-004 → AUTH-01a. Live: `state-bodies` code; all 736 rows tagged.
- R2-A2-005 → R4-A2-001 (supersedes R1-A-033) and AUTH-30.
- R2-B-002 → R10-B-003 and SW-Bb-004 (RS.MA-03 and A.5.25 parameter from Нацплан п. 12; A.5.25 stays subset_of/full with the parameter).
- R2-B-014 → live site: ISO clauses 4–10 get their own block and export sheet, not SoA rows (`assets/js/app.js`); AUTH-05.
- R2-D1-004 → AUTH-10 (act condition with п. 4 shown on every row) and AUTH-POS-8 (el-029 marker closed).
- R2-D2-007 → AUTH-07 and AUTH-01a (no new НБУ 43 codes). The п. 36–37 addressees are in the el-065 parameters (R6-D2-005, R6-D2-006, R7-D2-011); no split needed.
- R2-D2-021 → AUTH-TXT-43.
- R2-E2-023 → AUTH-12 (el-011 retyped as delegating, locks removed). The `trust` code exists (AUTH-01a).
- R2-E2-034 → the supplied НБУ 64 print (texts/r2/nbu64.clean.txt), додаток row 51: banking groups "до 31 серпня 2020 року". The schedule was amended by №№ 126/2018, 74/2019, 46/2020 and 172/2020. The row is correct; a dated "звірено" note is optional.
- R2-F2-009 → R3-F2-007 (17 terms in A.5.20 and GV.SC-05), checked against the Закон 2075-IX print (AUTH-28). The bill marker is C11.
- R3-A1-007 → AUTH-02.
- R3-A1-020 → AUTH-03. Live: the personal-data example is gone from a4-p2; dated assumption added.
- R3-A2-001 → AUTH-01a.
- R3-A2-002 → R4-A2-001 and AUTH-30.
- R3-A2-016 → R4-A2-016 and the ПКМУ 1799 print (AUTH-28). The deadlines are in A.5.35, A.5.36 and GV.OV-03. The наказ 285 amendment marker is C2.
- R3-A2-018 → R4-A2-007 (p118-131 added), R5-A2-024 and R6-A2-012.
- R3-A2-024 → R4-A2-006 (p7 and p12 added).
- R3-B-018 → R6-B-015 (the Наказ 75 act condition is now in sources.csv) and R6-B-001.
- R3-B-019 → R10-B-009, R11-B-001 and R12-B-001 (ПКМУ 1281 п. 7 deadlines in the PR.AT-01 and A.6.3 parameters). The rest is next phase (R12-B-008).
- R3-C1-005 → AUTH-POS-5 and AUTH-07 (condition in the parameter); `banks` code (AUTH-01a).
- R4-A1-001 → AUTH-02.
- R4-A1-004 → AUTH-03 (with AUTH-14 for banks).
- R4-A1-011 → AUTH-POS-1.
- R4-B-010 → R10-B-004 (RC.CO-04 conditions of Порядок п. 4 from the 1533 print).
- R4-F2-027 → AUTH-06 (regulator reporting: «—» main record, A.5.5 supporting; GV.OC-03 stays only for duties to comply with law, e.g. НБУ 99 el-017), applied in R6-F2-016. The methodology text is still missing; see A2.
- R5-C2-001 → AUTH-01a and AUTH-POS-6 (`banks` on НБУ 95; r3-p23 and r3-p24 split out for non-bank participants).
- R5-F2-016 → AUTH-06 ("never ISO 7.4").
- R10-E2a-020 → R11-E2a-001 (the maximum-loss indicator is binding with no transitional period, from the original 2018 text) and CC-032.

### From r7/followups.md (7 of 8)

- НБУ 64 act condition → live sources.csv act_condition (banks and banking groups).
- R7-A1-009 → AUTH-27 (answered: no; `kii` removed from a8-p11).
- R7-E1-001 → AUTH-22.
- R7-F1-001 and R7-F1-002 → AUTH-22 (branches) and AUTH-26 (НБУ 178 zakon.rada print).
- R7-F1-003 → AUTH-23.
- R7-E2-001 → AUTH-24.
- R7-E2-009 → AUTH-25. Live: no НБУ 64 row cites docs.dtkt.ua any more; the only dtkt citations left are on ПКМУ 373 p28 (C1).

### From r8/followups.md (7 of 9; R9-A2-007 is open, R10-E2a-020 is listed above)

- R8-D1-005 → AUTH-32.
- R8-D1-010 → AUTH-31.
- R8-F1-010 → AUTH-36.
- R8-B-015 → AUTH-29.
- R8-A2-002 → AUTH-30 (option a).
- R8-E2-006 → AUTH-35.
- ПКМУ 712 fix (final round, A1) → live a8-p3 and a13-i1-1: for state-secret systems the 12 months run from registration of the attestat; ПКМУ 627 is marked as having lost force on 01.01.2026. The leftover marker on unfinished work is C6.

---

## E. Next-phase items (one line each)

- R5-A2-013: Закон 2163-VIII (AUTH-19 scope) decides whether ПКМУ 373 p30 [5.3, A.5.2, GV.RR-02] gets a parameter or loses its marker (C4). It is not yet in next_phase.md; add it.
- R10-B-002: ПКМУ 1533 exchange channel and rules (exchange platform, «єдине вікно», TLP; Нацплан п. 15). A pointer is already in the notes.
- R10-B-004: ПКМУ 1533 exchange platform, «єдине вікно» and TLP (Нацплан п. 15), as above, for RC.CO-04.
- R10-B-005: ПКМУ 1533 Нацплан п. 21 (containment and recovery), п. 23 абз. 3 (direct CSIRT access) and п. 24 абз. 1–2 (mandatory response requirements of SSSCIP and СБУ; possibly A.5.5 or A.5.26).
- R10-B-006: ПКМУ 1533 Нацплан п. 9 абз. 2–6 (response planning, SOPs, response training, connection to ДЦКЗ), for ID.IM-04.
- R10-B-010: ПКМУ 1533 Нацплан п. 26 абз. 1 (inform CERT-UA, СЦ СБУ or CSIRT after the response) and Порядок п. 4 for cii-3-4.
- R12-B-007: ПКМУ 1533 Нацплан п. 26 абз. 2 (training and exercises; candidates PR.AT-02, A.6.3, A.5.24).
- R12-B-008: ПКМУ 1281 separate workbook: content (пп. 3–4), who conducts (п. 5), head's oversight (п. 9), retention and SSSCIP check (п. 10).
- R12-A1: ПКМУ 205 / 311: НЦР contract terms (ПКМУ 311 пп. 5, 23) against A.5.20 and GV.SC-05, together with handing copies to НЦР.
- SW-373b: ПКМУ 1533 Нацплан п. 13 (joint measures after a cyber attack) and п. 14 (preventive measures after a cyber threat).
- SW-Ba-009: ПКМУ 518 / 1799: assessment duty and Порядок deadlines (пп. 7, 14, 16, 17(1)) for КІ operators outside the public sector.
- SW-Bb: ПКМУ 1533 Нацплан п. 26 абз. 1 as a candidate for the RS.CO-02, A.5.26 and A.5.24 parameters, besides RC.CO-03.
- SW-Bb: ПКМУ 518 п. 9 against the PR.AT-01 and PR.AT-02 parameters when the 518 workbook is built.
- CC: ПКМУ 518 п. 10 (planning and funding cyber-protection from risk results) with locks on 7.1 and GV.RR-03 for КІ operators and ОКІІ owners (НБУ and banks excluded, п. 1 абз. 2).
