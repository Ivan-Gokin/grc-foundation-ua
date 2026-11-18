# Open points from the AI drafts of chains 2, 5, 10, 12 (2026-11-18)

For the review round: proposed decisions, register fixes and rows to check. Delete this file once the review has ruled on them.

## D1281 (ПКМУ 1281): 9 prov, 10 links
- PROPOSED: «ПКМУ № 1281 зобов'язує лише суб'єктів державного управління (п. 1), тому рядки ki і kii в data/applicability.csv для ua-cmu-1281-2025 не мають підстави в тексті і мають бути вилучені; оператори КІ державного сектору охоплені рядком public-sector.»
- [ПЕРЕВІРИТИ] p4: Наказ 661 not in library.
- Follow-up: notes on ua-ssscip-75-2026:base:PR.AT-01 (A.6.3, PR.AT-01) and ua-cmu-373-2006:p32 say «перенесе окрема робоча книга ПКМУ 1281» → point to ua-cmu-1281-2025:p3, p5, p9, p10.
## D836 (Наказ 836): 20 prov (13 subst), 40 links, 2 «—»; four documents (vm Вимоги z1975-25, kc Критерії, rr Порядок рівня ризику, pd Порядок підтвердження)
- PROPOSED 1 (pd-2-4-5): customer must obtain and check supplier confirmation before contract; with 373 п. 21 (REV-C7) customer duty for public sector.
- PROPOSED 2 (vm-6): supplier ІКС with КСЗІ meets пп. 4–5 only within КСЗІ functions; outside them in full.
- PROPOSED 3 (vm-1-2): suppliers tagged ict-suppliers (tag may be narrower than «будь-яка особа»).
- PROPOSED 4 (rr-1-3): customers tagged state-ir;state-secrets;kii; owners with only other ІзОД are not addressees.
- PROPOSED 5 (vm-5): no base profile for level IV (ДТ) supplier ІКС in 409/419 — open question to SSSCIP.
- REVIEW: п. 4 абз. 15 «збої та помилки» mapped as flaw remediation (A.8.8, ID.RA-01, PR.PS-02) — confirm.
- REGISTER: sources.csv ua-ssscip-836-2025 title/url cover only z1978-25; act approves four documents (z1975…z1978-25).
## D1799 (ПКМУ 1799): 24 prov (15 subst), 32 links, 5 «—»
- PROPOSED 1 (p6): assessor rights = owner duty to give access to object, documents, information (ІзОД by rules), explanations.
- PROPOSED 2 (p7-3): п. 7 абз. 3 does not name who sends report copy; row shown to owners and assessors; owner ensures within 30 days (e.g. contract clause). Keeps [ПЕРЕВІРИТИ] on 712 pa-4-5.
- PROPOSED 3 (p4): «same assessor no more than three years in a row» applies to any kind incl. self-assessment by listed officials (strictest).
- REGISTER: applicability ua-cmu-1799-2025 all four rows except=finance (п. 1 абз. 3). checked_edition: zakon.rada print «чинний станом на 14.11.2026», no amendments → «ред. 31.12.2025 (первинна; змін станом на 14.11.2026 немає)».
- [ПЕРЕВІРИТИ]: 438, 534, target-profile recommendations, SSSCIP state-IR procedure (p3, p12, p15, p18, p20, p22).
## D2075 (Закон 2075-IX): 21 prov (12 subst), 39 links, 8 «—»; new workbook cloud.xlsx
- PROPOSED 1 (register): kii owners using cloud are addressees of ст. 10 ч. 3 → applicability ua-law-2075-ix add kii requires=cloud-users.
- PROPOSED 2: ст. 11 ч. 3 абз. 3 ban (ДСК/ДТ in cloud abroad etc.) only for public users and providers serving them.
- PROPOSED 3: state banks as cloud users follow NBU (ст. 4 ч. 3; НБУ 99) → user rows a10-p3, a11-p2 public-sector+!banks (analogy AUTH-14/REV-C18).
- REVIEW: ст. 8 ч. 1 абз. 2–8 elements carried in parameters of 6.1.3 and ID.RA-06, not separate locks — confirm.
- [ПЕРЕВІРИТИ]: regulator incident procedure, regulator requirements (абз. 12), CMU act on trust services in cloud, MoD acts.
## D285 (Наказ 285): 25 prov (19 subst), 41 links, 2 «—»
- PROPOSED 1: self-assessment and report recommendations, though declared non-binding, are the method «з урахуванням» of which assessment and report are made (1799 пп. 7–8) → intersects_with; weights/scales in parameters as recommended, not legal minimum.
- PROPOSED 2: report form mandatory for all assessors (1799 п. 7 «за формою … Адміністрації»).
- PROPOSED 3: external-assessment recommendations (п. 2 розд. I — KI operators) also apply to ОКІІ owners that are not KI operators (1799 п. 16) → applies_to ki;kii.
- PROPOSED 4 (register): 285 inherits 1799 scope: except=finance; III–IV only voluntary or пп. 11, 17 → act_condition + except.
- PROPOSED 5: indicator between ranges → lower state; external indicator I ×100 to percent.
- [ПЕРЕВІРИТИ]: requisites blank (order, recommendations, report form «у редакції наказу … від ___ 2026»); «менше 20 %» vs 0–20 % critical band; scale mismatch.
- OWNER: Наказ 285 date/number/edition (add to owner-todo).
## D154 (ПКМУ 154): 29 prov (20 subst), 47 links, 12 «—»
- PROPOSED 1 (register): private owners of ДІР/ІзОД using cloud are addressees of Порядок надання п. 3 and Порядок каталогів п. 6 → applicability 154 add state-ir requires=cloud-users.
- PROPOSED 2: п. 1 абз. 2 exception (ст. 4 ч. 4, defence) not tagged !defence; condition in pn-1-2.
- PROPOSED 3: passive duties п. 8 абз. 2, 7, п. 9 on the provider (pn-8-2, pn-8-5, pn-9).
- PROPOSED 4: DC-only provider: ISO/IEC 27001 certificate suffices (п. 7 Вимог) though п. 2 names 27001, 27017, 27018 (vn-8-9).
- PROPOSED 5: п. 2 абз. 2 temporary exception to provider list until 31.12.2026 (p2-2).
- PROPOSED 6: public users and KI operators (ОКІІ) contract per Типовий договір (Закон 2075 ст. 10 ч. 2); resolution itself sets no obligation (td).
- [ПЕРЕВІРИТИ]: Типовий договір body + annexes 1–3 (published separately; not in library) — OWNER TEXT; Мінцифри sectoral security profile (vn-5); SSSCIP data deletion recommendations (pn-11); 2163 ст. 8 ч. 6.
- REGISTER checked_edition 154: «ред. 13.08.2026 (зміни № 1691/2025 і № 1009/2026)».
