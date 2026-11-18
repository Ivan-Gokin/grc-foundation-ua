# Review round r4: items that need the owner

These items come from the 12 chair reports (NA, NO2, NO1, PD, NB, IR, IS, CL, CI, AS, SP, ST). Where several chairs asked the same question, it appears once, with every segment that raised it.

The non-owner register changes were committed on branch `chains/2-5-10-12` as 985c338.

**How the ids work**
- **"added"**: the decision is in `data/decisions.csv` with status `proposed`, because a row we wrote cites it. Confirming it means setting status to `decided`. If you reject it, the rows listed with it have to be undone.
- **"not added"**: the decision is not in `decisions.csv`. The id shown is the one we suggest using if you accept it.
- Ids were renamed where chairs used generic ones:
  - NO1 PD-A…F became REV-NO1-PD-A…F.
  - PD segment PD-A…D became REV-PD-A…D.
  - NB items became REV-NB-PD-1…4 (NBU 143), REV-NB-PD1…3 (NBU 66), REV-NB-66-IV-V, REV-NB-143-P25-2 and REV-NB-143-P35.
  - CL PD-1…11 became REV-CL-PD-1…11.
  - NO2 decisions 1–5 became REV-NO2-PD1…5.
  - AS items became D1799-PD*, D285-PD*, D1668-PD* and REV-AS-SS.

---

## 1. Scope and applicability

**1.1 Order 843 (NATO profile): who it binds. PD-843-1 (added), PD-843-4 and PD-843-6 (not added). Raised by NA.**
- **Question:** Does the 843 baseline profile bind only owners of systems that have no network connections and process NATO RESTRICTED/ДСК information? Or does it bind every public-sector body and the Defence Forces?
- **Options:**
  - (a) Only those systems, tag nato-info. **Chair recommends (a).** The rows are already written this way: the defence and public-sector applicability rows are deleted, and nato-info cites PD-843-1. AUTH-41 does not extend to NATO information.
  - (b) Restore the defence and public-sector rows.
- **PD-843-4:** for such a system, profile 843 replaces profile 419 (ПКМУ 373 пп. 16–17). No value in 419 column 5 is stricter than 843 column 3. Chair: accept.
- **PD-843-6:** the profile's network measures (AC-17, AC-18, IA-3, MA-4, CA-3, SC-7, SC-8, SC-10, SC-23, SI-4) stay mandatory, but only for the interfaces the system actually has. Chair: accept.

- **REV-R5-NA-1 (added; from the confirmation round, a valid major).** Who owns the system: does 843 bind only public-sector owners (plus the Defence Forces), with private owners such as defence-industry enterprises getting it only as a processing condition set by the state owner of the information (ПКМУ 373 п. 20), as for 409/419 under REV-C1? **Rows written that way** (nato-info requires public-sector; a defence+nato-info row). Options: accept; or show it to every nato-info owner (if the NATO arrangements, Закон 2068-VIII, bind private owners directly — text not in the library).

**1.2 Order 45 (anti-virus updates): addressees. D45-PD2 (added). Raised by SP.**
- **Question:** Does Order 45 bind public authorities, local governments, military formations and state enterprises by their status, whether or not they hold state information resources or restricted information? Should state banks be excluded?
- **Rows written:** public-sector and defence, with no bank exception.
- **Options for the banks part:**
  - (a) Leave it as written, without `except=banks`. The text has no bank exception, and AUTH-30 is not carried over.
  - (b) Add `except=banks`.
- **Chair:** the banks part is the owner's call. See also 2.1.

**1.3 Order 836 (supplier security): suppliers and customers. Raised by ST.**
- **D-836-SUP (added).**
  - Question: are supplier duties held by any person who supplies goods, works or services for ICS with ДІР/СІ/ДТ or for ОКІІ?
  - Rows written: ict-suppliers is verified, and a new `vendors` row cites D-836-SUP.
  - Options: accept, or reject (then delete the vendors row). Chair: accept, noting that the tags are approximations.
- **D-836-OWN (added).**
  - Question: does 836 bind only owners of ICS with ДІР/СІ/ДТ and owners of ОКІІ, and not owners whose systems hold only other restricted information?
  - Cited on the state-ir row. Chair: accept.
- **D-836-CUST (not added).**
  - Question: must the customer check the supplier's level II–IV confirmation before signing the contract?
  - Chair: no. Show this as practice, not as a requirement of the act, because п. 5 sets no deadline and no recipient. The drafters' PROPOSED 1 is rejected.
- **D-836-KSZI (not added).**
  - Question: is Вимоги п. 6 a boundary rather than an exception? That is, does a КСЗІ attestat cover levels II–IV only within the КСЗІ functions, with full measures outside them?
  - Chair: accept, but note that the "outside them in full" part is an inference.

- **REV-R5-ST-1 (not added; from the confirmation round).**
  - Question: Order 836 — for a CII object with no ДІР, службова інформація or ДТ, the second criticality criterion (Критерії п. 4) is literally never met, yet п. 5 of the risk-level procedure puts CII objects at level II. Which level applies to their supplies?
  - Options: (a) level II for supplies where the supplier's system takes part in processing the object's information, level I for the rest, until SSSCIP clarifies — **chair recommends (a)** and asking SSSCIP; (b) literal reading: always level I (declaration only); (c) no decision, keep the [ПЕРЕВІРИТИ] marker (current state).

**1.4 ПКМУ 1335 / Закон 2163 ст. 4 ч. 4: the ban on listed software and equipment. Raised by ST and IS.**
- **D-1335-ADDR (added):** applicability follows the addressees of the ban. Chair: text-based; the owner only needs to set the status.
- **D-1335-USE (not added).**
  - Question: does the ban also cover continued use of software and equipment that were already installed, from the date they are listed, with no phase-out period?
  - The chairs disagree:
    - IS: supported by the text, so no decision is needed (D2163 PD1, marker closed).
    - ST: it is an interpretation of «використання», so the owner should decide.
  - Options: (a) accept as a recorded decision; (b) treat it as text and record no decision.

**1.5 Order 534: which assessments it covers. PD-534-1 (not added). Raised by AS.**
- **Question:** Does 534 apply to all kinds of assessment under ПКМУ 1799 п. 9?
- **Options:**
  - (a) Cumulative reading: 534 applies to all kinds, and for target-profile assessment Order 438 applies as well, while it is in force. **Chair recommends (a).**
  - (b) The drafters' reading: all kinds «крім» target-profile assessment.
- **Skipped until you decide:** the act_condition_uk/en of 534.

**1.6 ПКМУ 1799 п. 1 (and 1668 п. 6): "ДІР, службова інформація або державна таємниця" read as alternatives. REV-AS-SS (not added; related to REV-C11). Raised by AS.**
- **Question:** Should 1799 and 285 also apply to systems that hold only state secrets?
- **Skipped until you decide:** add rows `ua-cmu-1799-2025,state-secrets` and `ua-ssscip-285-2026,state-secrets` with `except=finance` and basis «п. 1 абз. перший» (AS register change 4).

**1.7 ПКМУ 1799 п. 6: does the owner have to give access? D1799-PD1 (not added). Raised by AS.**
- **Question:** Do the assessor's rights under п. 6 create a corresponding duty on the owner to give access to the object, documents, copies and explanations?
- **Options:**
  - (a) Accept, and keep A.8.34/PR.AA-05 on p6.
  - (b) Reject, delete both links and make p6 definitional.
- **Chair:** the duty is a sound inference but is not in the text, so it is your call.

**1.8 Order 410 (Platform) and REV-C10. PD-410-2 and PD-410-3 (added). Raised by IR.**
- **Question:** Should Order 410 be shown only to state bodies instead of the whole public sector (PD-410-2)? And should it be shown to owners of systems with ДІР/СІ/ДТ that report under the Plan, п. 17 (PD-410-3)?
- **Rows written:** state-bodies, state-ir and state-secrets, citing REV-C10.
- **Why it needs you:** PD-410-3 rests on REV-C10, which is still proposed.

**1.9 Order 771 (secure internet access). D771-PD1 (added). Raised by SP.**
- **Question:** Is state-bodies an acceptable approximation for the users of НТМ until ПКМУ 1358/2020 has been checked?
- **What is needed:** supply ПКМУ 1358/2020 (see section 6).

**1.10 Закон 2075 (cloud) ст. 11 ч. 3: scope of the ban. REV-CL-PD-10 (not added). Raised by CL.**
- **Question:** Does the ban on processing службова інформація or ДТ in cloud or data-centre resources reach everyone who processes such information, including private holders, plus the providers who serve them? Or only public users and their providers?
- **Options:**
  - (a) Everyone. **Chair recommends (a).** Then add `ua-law-2075-ix,state-ir,cloud-users` and `…,state-secrets,cloud-users`, and widen «Стосується лише» of a11-p3-2 and a10-p3 in cloud.xlsx.
  - (b) Public users only. Set a11-p3-2 to `cloud;public-sector+cloud-users`.
- **Skipped:** CL register change 6.

**1.11 Закон 2075: the public-sector + cloud-users row. Raised by CL (R4-CL-019).**
- **Question:** The row `ua-law-2075-ix,public-sector,cloud-users` hides the new a11-p1 row (ст. 11 ч. 1) from public bodies that are not marked as cloud users. Is that acceptable, or should a11-p1 reach every public body?

**1.12 ПКМУ 154: legal hierarchy and the encryption reading. Raised by CL.**
- **REV-CL-PD-1 (not added).**
  - Question: can the CMU's temporary permission to buy from providers outside the list (until 31.12.2026) lower the list requirement of Закон 2075 ст. 8 ч. 2 and ст. 11 ч. 2?
  - Chair: no. Show the Law's requirement and keep the permission as a note only. Confirm.
- **REV-CL-PD-8 (not added).**
  - Question: should п. 7 абз. 2 be read strictly, so that службова інформація and ДТ may only be sent with ТЗІ/КЗІ that have a positive expert opinion, as in Закон 80/94 ст. 8 ч. 7?
  - Chair recommends the strict reading.
- **REV-CL-PD-6 (added), pn-9 part only.**
  - Question: is ensuring interoperability (п. 9) the provider's duty?
  - This holds only as an assumption. The rest of PD-6 is text-based.

**1.13 НБУ 67/2024: the finance tag. REV-NO1-PD-A (added). Raised by NO1.**
- **Question:** Is the finance tag acceptable as an approximation for financial-services market participants supervised by the NBU? Payment-market participants without the right to provide financial services are excluded through the act condition.
- **Chair:** accept.

**1.14 Sector codes (sectors.csv). The finance codes were added on 2026-11-18 (owner's decision); the others still need your decision.**
- **Done:** `nbu-is-participants` (parent finance, sort 50.9): non-bank participants of NBU information systems.
  - Raised by NO2.
  - НБУ 95 r3-p23 and r3-p24 are now tagged `banks;nbu-is-participants` and cite REV-NO2-PD1 (provision and links).
  - The 95 applicability row finance was replaced by `banks` (basis «п. 5 розділу I Положення») and `nbu-is-participants` (basis «п. 5 розділу I; розділ III», AUTH-POS-6;REV-NO2-PD1).
  - The interim note ("the site shows the row to the whole financial sector") was removed from both rows.
- **Done:** non-bank financial institutions `nonbank-fi` (50.6), important NBU oversight objects `nbu-oversight` (50.7) and the institution that maintains ЄЦБД ОСЦПВ `nbu-ecbd` (50.8), all children of finance.
  - Raised by NB.
  - `nbu-ecbd` was added because розд. V and пп. 8(3), 13 of НБУ 66 name that institution as a separate addressee.
  - НБУ 143 applicability is now `nonbank-fi` (no exception); НБУ 66 розд. IV–V rows were retagged (see 2.6 and 2.7).
  - REV-NB-PD-1 and REV-NB-66-IV-V now state the final tagging and are decided.
  - Note: a reader who ticks only «Фінансовий сектор» (as the questionnaire does) no longer sees НБУ 95 or 143. This is the same as for the bank-only acts (НБУ 4, 178): the narrower code has to be ticked.
- Sector code for response-team bodies: **not added** (owner, 2026-11-19: not the site's audience). Наказ 425 and ПКМУ 1471 keep their current tags.
- Residents of Дія Сіті and ФОП (Закон 2297 a10-p5, a24-p4). Raised by PD.

---

## 2. Banks and the NBU

**2.1 Should the ПКМУ 712 family be hidden from state banks, except for systems with state secrets? REV-C1 and REV-C2 (existing, proposed); D811-PD2, D847-PD2 and D45-PD2 (added). Raised by SP (434, 810, 811, 847, 45).**
- **Question:** ПКМУ 712 has no bank exception. Should the acts that follow it (712, Orders 434, 810, 811 and 847) carry `except=banks unless=state-secrets` by analogy with AUTH-14 and AUTH-37?
- **Options:**
  - (a) Yes, as written. The rows for 434, 810, 811 and 847 were written to mirror the 712 rows with this exception.
  - (b) No. Remove `except=banks` from the 712 rows and from all four mirror sets.
- **Chair:**
  - The public-sector scope is supported by the text.
  - The bank part rests only on REV-C1 and REV-C2, by analogy.
  - For Order 45 the bank exception is a separate choice (see 1.2).

**2.2 Is a state bank a "public user" of cloud services under Закон 2075 ст. 2? REV-CL-PD-11 (not added). Raised by CL; also in D2075 PROPOSED 3 and D154TD PROPOSED 3.**
- **Question:** Does Закон 2075 ст. 4 ч. 3 exempt state banks?
- **Chair:**
  - No, it exempts no one.
  - The real question is whether a state bank is a «публічний користувач» under ст. 2.
  - Until you decide, the user rows (a4-p3, a10-p3, a11-p2, td) are shown to state banks.
  - The banking law is not in the library.

**2.3 Methodology 402 for banks and finance. D402-PD3 (not added). Raised by IS.**
- **Question:** Does Методика 402 not apply to the NBU, banks, NBU-supervised persons and payment-market participants, because the acts it implements (ПКМУ 518 п. 6 and ПКМУ 373 п. 28) exclude them (AUTH-30, AUTH-38)? Systems with ДТ would still be covered under AUTH-37.
- **Chair:** not supported by the Methodology's own text; it is defensible only through the parent acts.
- **If you accept:**
  - the ki and kii rows get `except=finance` with `AUTH-38;D402-PD3`;
  - the public-sector and state-ir rows get `except=banks unless=state-secrets` with `AUTH-30;AUTH-37;D402-PD3`;
  - the 402 act condition gets a finance sentence.
- These changes were skipped.

**2.4 The finance exception in ПКМУ 1668, 1799 and Order 285. D1668-PD1 (added). Raised by AS.**
- **Question:** Is the exclusion of «операторів платіжних систем, їх учасників…» recorded as `except=finance`, which leaves out payment-system participants that are not financial institutions?
- **Rows written:** `except=finance` on all rows of 1799, 1668 and 285, citing D1668-PD1.
- **Chair:** this goes beyond the literal text, so it is your choice.

**2.5 NBU Regulation 95. REV-NO2-PD1…5 (PD1 added and decided 2026-11-18; PD2–PD5 not added). Raised by NO2. Chair: all need the owner.**
- **PD1 (done):** розд. III is shown to banks and to non-bank participants of the NBU information systems (code `nbu-is-participants`, 1.14).
- **PD2:** САБ in пп. 40 and 147 means every bank IS that directly automates banking activity (пп. 29, 38), until the NBU definition is checked.
- **PD3:** a registered ЦСК (пп. 110, 150) means a provider of electronic trust services that is not qualified. Needs Закон 2155-VIII.
- **PD4:** п. 54 sets the TLS version and implementation only for TCP connections that the bank protects with TLS. Otherwise п. 57 (IPsec ESP) applies.
- **PD5:** an ISMS under ДСТУ ISO/IEC 27001:2023 meets п. 8, which cites the 2015 edition, until the NBU amends it. Check the NBU's position.

**2.6 NBU Regulation 143/2025 (non-bank providers). Raised by NB.**
- **REV-NB-PD-1 (decided 2026-11-18).**
  - The applicability row is now `nonbank-fi` (insurers, credit unions, finance companies, pawnshops) with no exception; p1 and p4 cite REV-NB-PD-1.
  - Payment providers and postal operators no longer see the act.
- **REV-NB-PD-2 (not added).**
  - Question: did the resolution enter into force on 13.12.2025, the day after it was published on the NBU website, which would make the requirements mandatory from 13.12.2026?
  - The answer depends on ст. 56 of the Law on the NBU, which is not in the library.
  - The stricter date has already been written into act_condition and description (as the chair recommended).
- **REV-NB-143-P35 (not added).**
  - Question: does the two-year term of п. 35 run from 13.12.2026 for software whose support ended before that date, and from the end of support otherwise? Chair's wording.

**2.7 NBU Regulation 66/2026 (financial-sector CII), розд. IV–V. REV-NB-66-IV-V (added and decided 2026-11-18). Raised by NB.**
- **Done:** розд. IV: p25 → `nbu-oversight+ki+!banks`; p27-1…p27-7 and p28 → `nbu-oversight+kii+!banks`. Розд. V: p29 → `nbu-ecbd+ki`; p31 → `nbu-ecbd+kii`.
- Banks still do not see розд. IV rows, because НБУ 178 розд. II п. 18 sets the same measures for them.
- The addressee prefix («лише для …:») was removed from the 29 link parameters, and the "no separate code" sentence from the notes. Rows and links cite REV-NB-66-IV-V.
- The 66 act condition now says who sees розд. IV and V.

**2.8 Submissions to supervisors: how to map them, and REV-C13. REV-C13 (existing, proposed); REV-NB-PD-4 and REV-NO1-PD-B (not added). Raised by NB, NO1 and IS.**
- **Question:** When an act requires information to be given to the supervisor (НБУ 143 пп. 44–46; НБУ 4 submissions; SSSCIP under REV-C13), is the main record «—» (AUTH-06), with A.5.5 and RS.CO-03 only as auxiliary links where internal provision is required?
- **NB and NO1:** yes, for the NBU.
- **IS reviewers split on REV-C13.**
  - Options: keep it as it is (citing ст. 9 ч. 3 п. 4 абз. четвертий); or limit it to requests about incidents and add «—» rows for the threat-only report on a9-p3-4-5.
- **Decide all three together.**

**2.9 NBU Regulation 4: the deadline. REV-NO1-PD-F (not added). Raised by NO1.**
- **Question:** For п. 28-1 підп. 4–5 розд. III, does the five-working-day deadline run from the date of the decision (the stricter reading of «запровадження таких змін»)?

---

## 3. Personal data

**3.1 Закон 2297 ст. 7 ч. 2 пп. 6, 6². REV-PD-A (not added). Raised by PD.**
- **Question:** Is tagging these points `health;public-sector` acceptable? The tag is a superset of the persons the points name. In the public sector the row applies only to the named central executive bodies, funds, institutions and ТЦК, and only when health data are processed on these grounds; the condition is in the parameter.

**3.2 Ombudsman order 1/02-14 applies to every controller. REV-PD-D (added). Raised by PD.**
- **Question:** Should the Типовий порядок apply like the Law (personal-data and general)?
- **Rows written:** a new general row, citing REV-PD-D.
- **Chair:** accept. If you reject, delete the row.

**3.3 Sector codes for Дія Сіті residents and ФОП.** See 1.14.

---

## 4. Critical infrastructure

**4.1 Are CI operators part of the national response system? Re-check AUTH-POS-3 and AUTH-39 (both decided); D2163-PD7 (not added). Raised by IS. It affects rows written for IR.**
- **New textual reasons:**
  - Закон 2163 ст. 9 ч. 3 lists the members of the response system as a closed list, and CI operators are not on it.
  - ст. 9¹ ч. 5 separates operators' mandatory reports from reporting to the НКЦК by response teams.
- **Options:**
  - (a) Keep AUTH-POS-3. Then add D2163-PD7: AUTH-POS-3 extends to ст. 9 ч. 3 п. 4 абз. другий, so CI operators protect the ІзОД they receive in the system.
  - (b) Revise it. Then remove `ki` from 2163 a9-p3-4-2 and a9-p3-5-2, and review 1533 np-20 and 373 p29.
- **Rows that also rest on AUTH-POS-3:**
  - written in this commit: `ua-ssscip-179-2026,ki` and `ua-ssscip-425-2026,ki` (the latter also cites PD-425-2);
  - decisions added: D179-PD1 and D1471-PD2.

**4.2 Закон 2163 ст. 8 ч. 3 п. 26 (planning cyber-protection spending). D2163-PD4 (not added). Raised by IS.**
- **Question:** Should a point of ч. 3 be mapped as a duty only when it names who acts (п. 26), or should a8-p3-26 be definitional, with its 7.1 and GV.RR-03 links dropped and reliance placed on ПКМУ 518 p10?
- **Chair:** the drafters' duty reading is not supported, so it is your call.

**4.3 Security-passport data as restricted information. REV-CI3 (not added). Raised by CI.**
- **Question:** Is the information in the security passport (Закон 1882 ст. 12 ч. 7; ПКМУ 818) ІзОД protected by law?
  - If yes, a CI operator that processes it in an ICS is an addressee of Закон 80/94 ст. 8 ч. 1.
  - ст. 8 ч. 2–3 would apply only when the owner is in the public sector (AUTH-41).
  - Critical technological information would not count.
- **This replaces drafters' PD3 and changes the scope of the 80/94 rows.**

**4.4 When do a CI operator's duties start? REV-CI7 (added, cited in the 1882 act condition). Raised by CI.**
- **Question:** Do the passport and protection duties apply only to objects in the Register, after the sectoral body notifies the operator (ст. 11 ч. 4)?
- **Chair:** this is an operational reading, not a definition, because ст. 1 пп. 13–14 define ОКІ without reference to the Register.

**4.5 Order 17 indicators. REV-CI8 (not added). Raised by CI.**
- **Question:** Are the Order 17 criteria tools for the assessing bodies, binding on the operator only where they repeat a duty in a law or CMU resolution? This replaces PD-17-1 and follows AUTH-29.
- **It decides:** whether indicator-only rows (md3 GV.OV-03, 9.2, A.5.35, ID.RA-01, A.8.8; the physical-protection rows of kr-5-10) stay locked.
- **Afterwards:** the pentest «частково» band in md3 needs the same treatment as the 70%/30% bands.

**4.6 Закон 1882 ст. 8 ч. 4 (ownership ban; alienation within one year). Raised by CI (R4-CI-003).**
- **Question:** Should this be recorded?
- **Chair recommends:** one sentence in the 1882 act condition, and no row.

**4.7 CSIRT duties under Orders 425 and 1471. PD-425-1 (not added); D1471-PD1 (added); PD-425-3 (on hold). Raised by IR.**
- **PD-425-1:** CSIRT duties (розд. I пп. 5–6, III, V) apply only to CERT-UA, bodies that have set up a sectoral or regional CSIRT, and private teams. No state-bodies tag; the interim tag is `ncs-bodies;security-services` until the `csirt` code exists (1.14).
- **D1471-PD1:** the same for ПКМУ 1471. It is cited on the new security-services row.
- **PD-425-3:** waits until the SSSCIP CSIRT capability requirements are in the library.

---

## 5. Binding status of recommendations

**5.1 Order 143/2026 (incident response). Change binding from mandatory to recommended? D143-PD1 (replacement, not added). Raised by IR.**
- **Question:** The Methodological recommendations are voluntary (розд. I п. 3) and must only be taken into account (ПКМУ 1533 пп. 5, 9). Should the whole act be marked `binding=recommended`, so that the mr-* rows stop locking?
- **The mandatory parts keep their locks through the ПКМУ 1533 rows** (np-12, np-15, np-17-1, np-17-2, np-18). Only A.5.10 (tlp-5-2) would drop out.
- **Alternative:** add a provision-level `binding` column. This needs code in app.js (sourceVisible/provisionVisible, gapRows, craftRows).
- **Already done (non-owner):** the act condition now states that the mr-* values are recommended, and the parameters carry the prefix «Рекомендовано».
- **Chair's statement for D143-PD1:** «Методичні рекомендації Наказу № 143 не є НПА і добровільні…; обов'язковим є лише визначення рівня критичності за розд. III п. 5 (ПКМУ № 1533 п. 12).»

**5.2 Order 285 (assessment recommendations). Status and binding. D285-PD1 (P1/P2) and D285-PD5 (not added). Raised by AS.**
- **Question:** Should 285 be `binding=recommended` for the whole act, with only the report form mandatory (through ПКМУ 1799 п. 7, carried on `ua-cmu-1799-2025:p7`)?
- **Open conflict:** are the report-drafting recommendations binding? 1799 п. 7 says «відповідно до», while their own п. 3 says they are not binding.
- **Skipped until you decide:** AS register change 5 (binding, act_condition_uk/en). checked_edition stays empty (285 requisites are already in owner-todo).
- **D285-PD5:** a value between bands goes to the lower state; I and R ×100 give percent. This fills a gap in the text.

**5.3 Typical contract under ПКМУ 154: binding force. REV-CL-PD-9 (not added). Raised by CL (R4-CL-005).**
- **Question:** Do the 20 td-* rows (53 links) stay locked as "required by the act"? The library texts only approve a template.
- **Options:**
  - (a) Binding, as the drafters proposed.
  - (b) Show as recommended until a legal basis is recorded (ЦК ст. 630 / ГК ст. 179 ч. 4 [ПЕРЕВІРИТИ]). This is the chair's lean.
- **The 154 act condition now says** «обов'язковість умов — рішення власника».

**5.4 Order 843 profile measures. PD-843-2 (not added; together with REV-C3). Raised by NA.**
- **Question:** Is every ND TZI 3.6-006-24 measure named in column 2 mandatory in full, with column 3 as the minimum parameters, as REV-C3 does for Orders 409 and 419?

**5.5 Order of correction (припис) under ПКМУ 1668. D1668-PD4 (not added). Raised by AS.**
- **Question:** Are the requirements of a припис (п. 17 підп. 9) mandatory and mapped with p21?
- **Status:** deferred until Закон 877-V is in the library.

---

## 6. Missing texts for the library

- **ПКМУ 1358/2020**: Порядок функціонування НТМ. Needed for Order 771 and D771-PD1. Raised by SP.
- **Закон 2155-VIII**: electronic identification and trust services. Needed for NO2 PD3. **NBU definition of САБ** for NO2 PD2. Raised by NO2.
- **Закон «Про банки і банківську діяльність»**:
  - needed to check whether NBU 4 covers branches of foreign banks (NO1);
  - needed to decide whether a state bank is a public user (CL, 2.2).
- **Закон «Про Національний банк України» ст. 56**: official publication, for REV-NB-PD-2. Raised by NB.
- **Закон 877-V** on state supervision (control). Needed for ПКМУ 1668 припис, D1668-PD4. Raised by AS.
- **SSSCIP CSIRT capability requirements**, and **the SSSCIP procedure for delegating CERT-UA tasks** (425 r4-p1, r5-p1). Raised by IR.
- **SSSCIP criteria for a significant cyber incident** (1471 p6). Raised by IR.
- **NATO Directive AC/322-D/0048-REV3 (INV)**, named in column 4 of Order 843.
  - It is probably not publishable. Confirm that only the identifiers are kept (PD-843-5).
  - Raised by NA.
- **Civil Code ст. 630 / Commercial Code ст. 179 ч. 4** (or other basis), for the binding force of the Typical contract. Raised by CL.
- **The Мінцифри sectoral security profile, and the regulator's requirements for cloud providers.** Identify them, or confirm they do not exist yet. Raised by CL (R4-CL-023).
- **Тables of annexes 3 and 4 of Методика 402.** Annex 4 is filed but its table is still a «[TABLE]» placeholder, so the iv-3 and v-1 markers stay. Raised by IS.
- **Still missing, so the 1799 markers stay:** the target-profile recommendations (p12) and the SSSCIP state-IR assessment procedure (p20). Raised by AS.

---

## 7. Facts and requisites to confirm

- **Order 843:** the signed edition (date, number, registration) on cip.gov.ua. Raised by NA.
- **Order 143/2026:** the signed copy, and whether it was registered with the Мін'юст (date and number are blank in the library copy). Raised by IR.
- **Order 534 URL:** the chair proposes https://zakon.rada.gov.ua/laws/show/z1134-26 but could not fetch it. Not changed. Raised by AS.
- **Order 17/2025:**
  - the second registration number: 376/43782, while the scan reads «376/4МЩО»;
  - whether the order has been amended. Raised by CI.
- **ПКМУ 818:** the current edition. The library print is marked as not current. Raised by CI.
- **Signed editions on cip.gov.ua:** Orders 438, 810 and 811. Raised by SP.
- **Order 434:** the number. The register says 434, the cip.gov.ua address says 424. Raised by SP.
- **Order 771:** the date 30.08.2023 and the edition. Raised by SP.
- **Order 798:** the requisites (03.12.2025 № 798). Raised by IS.
- **Order 661:** the requisites (21.10.2025 № 661). The form carries the ДСК mark but the order directs publication. Raised by ST.
- **NBU 4:** does it apply to branches of foreign banks? The marker is in the applicability basis. Raised by NO1.
- **NBU 143/2025:** is the NBU-website publication on 12.12.2025 the official publication? See 2.6. Raised by NB.
- **ДСТУ ISO/IEC 27001:2015 vs 2023:** the NBU's position and the status of the 2015 edition. NO2 PD5.
- **Order 836, level IV (ДТ):** ask SSSCIP which profile a supplier at this level applies, since there is none in 409/419. Raised by ST (R4-ST-006 / D836 PROPOSED 5).
- **REV-C7 [ПЕРЕВІРИТИ]:** has SSSCIP set supplier measures under ПКМУ 373 п. 21 for systems that hold only other ІзОД? Raised by ST.
- **Library, ПКМУ 154 Typical contract:** the source URL. The first lines added to the four files record the edition and that you supplied the files on 2026-11-18, but not the URL. Raised by CL.

---

## 8. Other

**8.1 REV-C20 amendment (existing REV-C20, proposed). Raised by AS; related to D438-PD3 (added) in SP.**
- **Question:** Should REV-C20 be amended as follows?
  - The qualification requirements come from Order 438/2025 (534 п. 2).
  - The report is kept for at least three years, for at least the authorisation's validity, and for one year after it is cancelled (ПКМУ 712 п. 4 абз. п'ятий).
- **Note:** the second half of D438-PD3 (the list of assessors under 1799 п. 3) rests on REV-C20.

**8.2 Small items from NO1 (НБУ 4).**
- AUTHOR 010: should R4-F2-028 option (a) be taken, carrying the column-4 content in the notes of el-029 «—»?
- Text defect: П-4 п. 18 розд. II refers to п. 16; it should be п. 17. Should this be noted, or reported to the NBU?

---

## Register changes skipped (owner-dependent)

- **NO2:** sectors.csv row `nbu-is-participants`; the 95 applicability change (finance → banks, plus a new row); and the provision tags on r3-p23 and r3-p24. Applied 2026-11-18 (1.14, 2.5).
- **NB:** new finance child codes (change 5), applied 2026-11-18 with the 143 and 66 retags (1.14). The comment_uk fix on НБУ 43 п. 47 for НБУ 66 was not checked by the chair, so it was not applied.
- **IR:**
  - `ua-ssscip-143-2026` binding → recommended (5.1);
  - the `csirt` sector code and retags (1.14).
- **IS:** the conditional part of change 5 (402 except=finance / banks), which applies only if D402-PD3 is accepted (2.3).
- **CL:**
  - change 6 (2075 state-ir and state-secrets cloud-users rows, plus cloud.xlsx «Стосується лише»), which depends on 1.10;
  - change 7, which is a question (1.11).
- **AS:**
  - change 4 (state-secrets rows), see 1.6;
  - change 5 (285 binding and act condition), see 5.2;
  - change 8: the 534 URL is unconfirmed (section 7), and the act condition depends on PD-534-1 (1.5). The 534 checked_edition was applied.

## Decisions added in this commit that you may want to confirm first, because rows depend on them

PD-843-1, D45-PD2, D811-PD2, D847-PD2, D771-PD1, REV-NO1-PD-A, REV-PD-D, PD-410-2, PD-410-3, D1471-PD1, D1668-PD1, D-836-SUP, D-836-OWN and REV-CI7.

All other added decisions are text-based and proposed by the chairs.
