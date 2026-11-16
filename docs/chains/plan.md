# Chain plan for the AI review / План ланцюгів для ШІ-рецензування

Generated 2026-11-16 from `docs/chains/triage.csv` (a triage of all 250 in-force acts in the register, from the register alone) and the links in `data/source_relations.csv`. Not reviewed by a person yet.

## How to use

- **One chat per chain**, in the order below. A chain runs from the law down to the most specific acts; the reviewer reads them together.
- **▶ map here**: the act is drafted and reviewed in this chain. **context (chain N)**: read here, mapped in chain N. **basis**: legal basis only, not mapped. **✔ mapped**: already in the workbooks; re-reviewed where it is mapped.
- **Texts**: `✓ library` is in `library/`. `fetch` links go to the zakon.rada.gov.ua print view (or the issuer's page): save it as `library/<type>/<id>/text.txt` with the URL and edition on the first line. `private` texts (НД ТЗІ, standards) go to the private library, not this repository.
- Acts with verdict `check`, and fixes to the register, are listed at the end. Dropped acts and the reasons are in `triage.csv`.

**Triage:** 89 acts to map, 18 legal basis only, 30 to check, 113 dropped. **Chains:** 42. **Texts:** 57 to fetch, 18 for the private library, the rest already in `library/`.

## Chains in priority order

| # | Priority | Topic | From | Acts to map here | Of them already mapped | Texts to fetch |
|---|---|---|---|---|---|---|
| 1 | 1 | system-protection | Закон України № 2163-VIII від 05.10.2017 | 8 | 0 | 8 |
| 2 | 1 | cyber-assessment-audit | Закон України № 2163-VIII від 05.10.2017 | 5 | 0 | 5 |
| 3 | 1 | incident-response | Закон України № 2163-VIII від 05.10.2017 | 5 | 0 | 7 |
| 4 | 1 | isms-baseline | Закон України № 2163-VIII від 05.10.2017 | 5 | 1 | 5 |
| 5 | 1 | cloud-datacentre | Закон України № 2075-IX від 17.02.2022 | 3 | 1 | 0 |
| 6 | 1 | system-protection | Закон України № 80/94-ВР від 05.07.1994 | 3 | 2 | 1 |
| 7 | 1 | bank-cyber | Закон України № 2163-VIII від 05.10.2017 | 2 | 2 | 2 |
| 8 | 1 | bank-cyber | Закон України № 679-XIV від 20.05.1999 | 2 | 2 | 2 |
| 9 | 1 | e-identification-trust | Закон України № 2155-VIII від 05.10.2017 | 2 | 0 | 2 |
| 10 | 1 | supplier-security | Закон України № 2163-VIII від 05.10.2017 | 2 | 0 | 3 |
| 11 | 1 | telecom | Закон України № 1089-IX від 16.12.2020 | 2 | 0 | 2 |
| 12 | 1 | training-awareness | Закон України № 2163-VIII від 05.10.2017 | 2 | 0 | 3 |
| 13 | 1 | backup-continuity | Закон України № 679-XIV від 20.05.1999 | 1 | 1 | 2 |
| 14 | 1 | ci-protection | Закон України № 2163-VIII від 05.10.2017 | 1 | 0 | 1 |
| 15 | 1 | ci-protection | Закон України № 1882-IX від 16.11.2021 | 1 | 0 | 1 |
| 16 | 1 | ci-protection | Закон України № 679-XIV від 20.05.1999 | 1 | 0 | 2 |
| 17 | 1 | nonbank-finance-cyber | Закон України № 679-XIV від 20.05.1999 | 1 | 0 | 2 |
| 18 | 1 | official-information | Постанова КМУ № 736 від 19.10.2016 | 1 | 1 | 0 |
| 19 | 1 | payment-market | Закон України № 2163-VIII від 05.10.2017 | 1 | 1 | 1 |
| 20 | 1 | personal-data | Закон України № 2297-VI від 01.06.2010 | 1 | 0 | 1 |
| 21 | 1 | system-protection | НД ТЗІ (technical documents) | 14 | 0 | 0 |
| 22 | 2 | incident-response | Постанова КМУ № 1295 від 23.12.2020 | 2 | 0 | 2 |
| 23 | 2 | vulnerability-management | Постанова КМУ № 497 від 16.05.2023 | 2 | 0 | 2 |
| 24 | 2 | backup-continuity | Постанова КМУ № 311 від 07.04.2023 | 1 | 0 | 0 |
| 25 | 2 | bank-cyber | Закон України № 2121-III від 07.12.2000 | 1 | 1 | 2 |
| 26 | 2 | ci-protection | Наказ Держспецзв’язку № 17 від 14.01.2025 | 1 | 0 | 1 |
| 27 | 2 | crypto-technical-protection | Указ Президента України № 505/1998 від 22.05.1998 | 1 | 0 | 1 |
| 28 | 2 | cyber-assessment-audit | Закон України № 2469-VIII від 21.06.2018 | 1 | 0 | 2 |
| 29 | 2 | cyber-assessment-audit | Закон України № 3475-IV від 23.02.2006 | 1 | 0 | 2 |
| 30 | 2 | incident-response | Постанова КМУ № 1772 від 16.11.2002 | 1 | 0 | 1 |
| 31 | 2 | nato-information | Закон України № 2163-VIII від 05.10.2017 | 1 | 0 | 3 |
| 32 | 2 | state-secrets | Постанова КМУ № 180 від 16.02.1998 | 1 | 0 | 1 |
| 33 | 2 | state-secrets | Закон України № 3855-XII від 21.01.1994 | 1 | 0 | 1 |
| 34 | 2 | supplier-security | Закон України № 74/98-ВР від 04.02.1998 | 1 | 0 | 1 |
| 35 | 2 | system-protection | Наказ Держспецзв’язку № 317 від 24.06.2024 | 1 | 0 | 1 |
| 36 | 2 | system-protection | НД ТЗІ 2.3-025-24 | 3 | 0 | 0 |
| 37 | 3 | system-protection | Постанова КМУ № 688 від 03.08.2005 | 2 | 0 | 2 |
| 38 | 3 | crypto-technical-protection | Постанова КМУ № 1772 від 16.11.2002 | 1 | 0 | 2 |
| 39 | 3 | state-secrets | Постанова КМУ № 939 від 18.12.2013 | 1 | 0 | 1 |
| 40 | 3 | system-protection | Закон України № 3475-IV від 23.02.2006 | 1 | 0 | 1 |
| 41 | 3 | vulnerability-management | Закон України № 3475-IV від 23.02.2006 | 1 | 0 | 2 |
| 42 | 3 | crypto-technical-protection | НД ТЗІ 1.6-005-2013 | 1 | 0 | 0 |

### 1. system-protection — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Постанова КМУ № 1426 від 29.12.2021 — Про затвердження Положення про організаційно-технічну модель кіберзахисту (`ua-cmu-1426-2021`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/1426-2021-%D0%BF/print) | Organisational-technical model of cyber protection; role split that the measures catalogue 75-2026 is based on. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 712 від 18.06.2025 — Деякі питання захисту інформаційних, електронних комунікаційних, інформаційно-комунікаційн (`ua-cmu-712-2025`) | ▶ map here | ✓ library | Security authorisation of systems and security profiles. |
| Наказ Держспецзв’язку № 771 від 30.08.2023 — Про затвердження Положення про систему захищеного доступу державних органів до мережі Інте (`ua-ssscip-771-2023`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-pro-zatverdzhennya-polozhennya-pro-sistemu-zakhishenogo-dostupu-derzhavnikh-organiv-do-merezhi-internet-vid-30-serpnya-2023-roku-771) | Secure internet access system and connection procedure for state bodies. |
| Наказ Держспецзв’язку № 409 від 30.06.2025 — Про затвердження базового профілю безпеки системи, де обробляється відкрита або конфіденці (`ua-ssscip-409-2025`) | ▶ map here | ✓ library | Baseline security profile for systems with open or confidential information. |
| Наказ Держспецзв’язку № 419 від 02.07.2025 — Про затвердження базового профілю безпеки системи, де обробляється службова інформація (`ua-ssscip-419-2025`) | ▶ map here | ✓ library | Baseline security profile for systems with official information. |
| Наказ Держспецзв’язку № 434 від 11.07.2025 — Про затвердження ведення переліку авторизованих систем з безпеки (`ua-ssscip-434-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/docs/nakaz-administraciyi-derzhspeczv-yazku-vid-11-07-2025-424-pro-zatverdzhennya-poryadku-vedennya-pereliku-avtorizovanikh-sistem-z-bezpeki) | List of security-authorised systems kept for owners. |
| Наказ Держспецзв’язку № 810 від 08.12.2025 — Про затвердження Рекомендацій з оцінювання дотримання вимог цільового профілю безпеки сист (`ua-ssscip-810-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-08-12-2025-810-pro-zatverdzhennya-rekomendacii-z-ocinyuvannya-dotrimannya-vimog-cilovogo-profilyu-bezpeki-sistemi) | Recommended guidance on assessing target security profile compliance under 712-2025. |
| Наказ Держспецзв’язку № 811 від 08.12.2025 — Про затвердження Рекомендацій з розроблення цільового профілю безпеки системи (`ua-ssscip-811-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-08-12-2025-811-pro-zatverdzhennya-rekomendacii-z-rozroblennya-cilovogo-profilyu-bezpeki-sistemi) | Recommended guidance on drafting a target security profile under 712-2025. |
| Наказ Держспецзв’язку № 847 від 19.12.2025 — Про затвердження Порядку здійснення моніторингу авторизації з безпеки інформаційних, елект (`ua-ssscip-847-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0008-26/print) | Monitoring of security-authorised systems. |

### 2. cyber-assessment-audit — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 1668 від 17.12.2025 — Про затвердження Порядку здійснення державного контролю за додержанням вимог законодавства (`ua-cmu-1668-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1668-2025-%D0%BF/print) | State supervision of cyber protection with rights and duties of inspected entities. |
| Постанова КМУ № 1799 від 31.12.2025 — Про затвердження Порядку оцінювання стану кіберзахисту інформаційних, електронних комуніка (`ua-cmu-1799-2025`) | ▶ map here | ✓ library | Cyber protection assessment procedure with self-assessment and external assessment. |
| Постанова КМУ № 712 від 18.06.2025 — Деякі питання захисту інформаційних, електронних комунікаційних, інформаційно-комунікаційн (`ua-cmu-712-2025`) | context (chain 1) | ✓ library | Security authorisation of systems and security profiles. |
| Наказ Держспецзв’язку № 285 від 16.04.2026 — Деякі питання проведення оцінювання стану кіберзахисту (`ua-ssscip-285-2026`) | ▶ map here | ✓ library | Self-assessment and external assessment guidance with mandatory report form. |
| Наказ Держспецзв’язку № 438 від 11.07.2025 — Про затвердження Вимог до юридичних осіб, фізичних осіб-підприємців, які здійснюють оцінюв (`ua-ssscip-438-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/administraciyeyu-derzhspeczv-yazku-priinyato-vimogi-do-yuridichnikh-osib-fizichnikh-osib-pidpriyemciv-yaki-zdiisnyuyut-ocinyuvannya-realizaciyi-cilovogo-profilyu-bezpeki-informaciinikh-elektronnikh-komunikaciinikh-informaciino-komunikaciinikh-tekhnologichnikh-sistem) | Requirements on entities assessing target security profiles. |
| Наказ Держспецзв’язку № 534 від 14.07.2026 — Про затвердження Вимог до суб'єктів оцінювання стану кіберзахисту (`ua-ssscip-534-2026`) | ▶ map here | [fetch](https://ips.ligazakon.net/document/re46528?an=10) | Requirements on cyber protection assessment providers. |

### 3. incident-response — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 1471 від 13.11.2025 — Про затвердження Порядку взаємодії суб’єктів національної системи реагування на кіберінцид (`ua-cmu-1471-2025`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/1471-2025-%D0%BF/print) | Interaction between CERT-UA and law enforcement; legal basis of the CSIRT interaction order 425-2026. |
| Постанова КМУ № 1533 від 26.11.2025 — Деякі питання реагування на кіберінциденти, кібератаки та кіберзагрози (`ua-cmu-1533-2025`) | ▶ map here | ✓ library | National cyber incident response plan with roles and procedures for state bodies and CI/CII. |
| Наказ Держспецзв’язку № 179 від 05.03.2026 — Про затвердження Порядку ведення репозитарію інформації про кіберінциденти (`ua-ssscip-179-2026`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0473-26/print) | Incident repository procedure for submitting incident information. |
| Наказ Держспецзв’язку № 143 від 18.02.2026 — Деякі питання реагування на кіберінциденти, кібератаки та кіберзагрози (`ua-ssscip-143-2026`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-18-02-2026-143-deyaki-pitannya-reaguvannya-na-kiberincidenti-kiberataki-ta-kiberzagrozi) | Risk-based cyber incident response procedure. |
| Наказ Держспецзв’язку № 410 від 04.06.2026 — Про затвердження Порядку приєднання суб’єктів забезпечення кібербезпеки до платформи обмін (`ua-ssscip-410-2026`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0898-26/print) | Joining the cyber threat information-sharing platform. |
| Наказ Держспецзв’язку № 425 від 08.06.2026 — Про затвердження Порядку взаємодії галузевих та регіональних команд реагування на кіберінц (`ua-ssscip-425-2026`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0954-26/print) | Interaction of sectoral / regional / private CSIRTs with CERT-UA. |

### 4. isms-baseline — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Постанова КМУ № 518 від 19.06.2019 — Про затвердження загальних вимог з кіберзахисту об’єктів критичної інфраструктури (`ua-cmu-518-2019`) | context (chain 14) | ✓ library | General cyber protection requirements for CI (consolidated with 1470-2025). |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 1516 від 26.11.2025 — Про затвердження Порядку призначення керівника з кіберзахисту на посаду в органі державної (`ua-cmu-1516-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1516-2025-%D0%BF/print) | Appointment of a head of cyber protection in state authorities (security role). |
| Наказ Держспецзв’язку № 402 від 02.06.2026 — Про затвердження Методики оцінювання ризиків кібербезпеки (`ua-ssscip-402-2026`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0880-26/print) | Cybersecurity risk assessment methodology. |
| Наказ Держспецзв’язку № 75 від 30.01.2026 — Про затвердження Каталогу заходів з кіберзахисту, базових заходів з кіберзахисту, форми пл (`ua-ssscip-75-2026`) | ✔ mapped, ▶ map here | ✓ library | Catalogue of cyber measures and baseline measures and cyber protection plan form (already mapped). |
| Наказ Держспецзв’язку № 798 від 03.12.2025 — Про затвердження Методичних рекомендацій щодо типових вимог до підрозділів з кіберзахисту, (`ua-ssscip-798-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/n-798-2025) | Recommended requirements for cyber units and cyber protection heads in state bodies and CII I-II. |

### 5. cloud-datacentre — Закон України № 2075-IX від 17.02.2022 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2075-IX від 17.02.2022 — Про хмарні послуги (`ua-law-2075-ix`) | ▶ map here | ✓ library | Cloud services law with requirements on providers and state users. |
| Постанова КМУ № 154 від 11.02.2025 — Деякі питання надання та використання хмарних послуг та/або послуг центру обробки даних (`ua-cmu-154-2025`) | ▶ map here | ✓ library | Rules for providing and using cloud and data-centre services for state bodies and CII. |
| Постанова Правління НБУ № 99 від 25.08.2025 — Постанова Правління Національного банку України від 25.08.2025 № 99 (`ua-nbu-99-2025`) | ✔ mapped, ▶ map here | ✓ library | Cloud computing use by NBU-supervised entities (already mapped). |

### 6. system-protection — Закон України № 80/94-ВР від 05.07.1994 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 80/94-ВР від 05.07.1994 — Про захист інформації в інформаційно-комунікаційних системах (`ua-law-80-94-vr`) | ✔ mapped, ▶ map here | ✓ library | Law on protection of information in ICS incl. security authorisation (already mapped). |
| Постанова КМУ № 373 від 29.03.2006 — Про затвердження Мінімальних вимог до захисту інформаційних, електронних комунікаційних, і (`ua-cmu-373-2006`) | ✔ mapped, ▶ map here | ✓ library | Minimum protection requirements for systems with state IR or restricted information (already mapped). |
| Наказ Держспецзв’язку № 45 від 26.03.2007 — Про затвердження Порядку оновлення антивірусних програмних засобів, які мають позитивний е (`ua-ssscip-45-2007`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0320-07/print) | Antivirus update procedure for certified anti-malware tools. |

### 7. bank-cyber — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Постанова Правління НБУ № 178 від 12.08.2022 — Постанова Правління Національного банку України від 12.08.2022 № 178 (`ua-nbu-178-2022`) | ✔ mapped, ▶ map here | ✓ library | Cyber protection regulation for banks (already mapped). |
| Постанова Правління НБУ № 4 від 16.01.2021 — Постанова Правління Національного банку України від 16.01.2021 № 4 (`ua-nbu-4-2021`) | ✔ mapped, ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/v0004500-21/print) | NBU supervision of bank compliance with IS / cyber / trust requirements (already mapped). |

### 8. bank-cyber — Закон України № 679-XIV від 20.05.1999 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 679-XIV від 20.05.1999 — Про Національний банк України (`ua-law-679-xiv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/679-14/print) | NBU law; legal basis of NBU security and cyber regulations. |
| Постанова Правління НБУ № 64 від 11.06.2018 — Постанова Правління Національного банку України від 11.06.2018 №64 (`ua-nbu-64-2018`) | ✔ mapped, ▶ map here | ✓ library | Bank risk management incl. operational and ICT risk (already mapped). |
| Постанова Правління НБУ № 95 від 28.09.2017 — Постанова Правління Національного банку України від 28.09.2017 № 95 (`ua-nbu-95-2017`) | ✔ mapped, ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/v0095500-17/print) | Information security in the banking system (already mapped). |

### 9. e-identification-trust — Закон України № 2155-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2155-VIII від 05.10.2017 — Про електронні довірчі послуги (`ua-law-2155-viii`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/2155-19/print) | Trust services law with requirements on trust service and e-ID providers. |
| Постанова КМУ № 764 від 28.06.2024 — Деякі питання електронної ідентифікації та електронних довірчих послуг (`ua-cmu-764-2024`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/764-2024-%D0%BF/print) | Trust service and e-ID rules incl. ISO/IEC 27001 conformity for providers. |

### 10. supplier-security — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 1335 від 22.10.2025 — Про затвердження Порядку формування та ведення відкритого переліку забороненого до викорис (`ua-cmu-1335-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1335-2025-%D0%BF/print) | Open list of software and network equipment banned for state IR / CI / CII owners. |
| Постанова КМУ № 712 від 18.06.2025 — Деякі питання захисту інформаційних, електронних комунікаційних, інформаційно-комунікаційн (`ua-cmu-712-2025`) | context (chain 1) | ✓ library | Security authorisation of systems and security profiles. |
| Наказ Держспецзв’язку № 836 від 17.12.2025 — Порядок підтвердження постачальниками товарів, робіт, послуг відповідності впроваджених за (`ua-ssscip-836-2025`) | ▶ map here | ✓ library | Supplier confirmation of security measures by supply risk level. |

### 11. telecom — Закон України № 1089-IX від 16.12.2020 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 1089-IX від 16.12.2020 — Про електронні комунікації (`ua-law-1089-ix`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1089-20/print) | E-communications law with network security and subscriber data protection duties. |
| Постанова КМУ № 75 від 24.01.2025 — Деякі питання оперативно-технічного управління електронними комунікаційними мережами в умо (`ua-cmu-75-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/75-2025-%D0%BF/print) | Operational management of e-communication networks in emergency and martial law. |

### 12. training-awareness — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 1281 від 08.10.2025 — Про затвердження Порядку проведення інструктажів та систематичних тренінгів щодо кібергігі (`ua-cmu-1281-2025`) | ▶ map here | ✓ library | Mandatory cyber-hygiene briefings and systematic training. |
| Наказ Держспецзв’язку № 661 від 21.10.2025 — Про затвердження Методичних рекомендацій щодо проведення інструктажів і тренінгів щодо кіб (`ua-ssscip-661-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-21-10-2025-661-pro-zatverdzhennya-metodichnikh-rekomendacii-shodo-provedennya-instruktazhiv-i-treningiv-shodo-kibergigiyeni-na-period-priznachennya-na-posadi-derzhavnikh-sluzhbovciv-pracivnikiv-organiv-derzhavnoyi-vladi-ta-inshikh-derzhavnikh-organiv-viiskovosluzhbovciv-kerivnikiv-ta-pracivnikiv-derzhavnikh-pidpriyemstv-ustanov-ta-organizacii) | Recommended training methodology issued under 1281-2025. |

### 13. backup-continuity — Закон України № 679-XIV від 20.05.1999 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 679-XIV від 20.05.1999 — Про Національний банк України (`ua-law-679-xiv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/679-14/print) | NBU law; legal basis of NBU security and cyber regulations. |
| Постанова Правління НБУ № 67 від 14.06.2024 — Про затвердження Положення про організацію забезпечення безперебійного функціонування в ум (`ua-nbu-67-2024`) | ✔ mapped, ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/v0067500-24/print) | Business continuity of banks and non-bank institutions in a special period (already mapped). |

### 14. ci-protection — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Постанова КМУ № 518 від 19.06.2019 — Про затвердження загальних вимог з кіберзахисту об’єктів критичної інфраструктури (`ua-cmu-518-2019`) | ▶ map here | ✓ library | General cyber protection requirements for CI (consolidated with 1470-2025). |

### 15. ci-protection — Закон України № 1882-IX від 16.11.2021 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 1882-IX від 16.11.2021 — Про критичну інфраструктуру (`ua-law-1882-ix`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1882-20/print) | CI law with sectors categorisation and duties of CI operators. |

### 16. ci-protection — Закон України № 679-XIV від 20.05.1999 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 679-XIV від 20.05.1999 — Про Національний банк України (`ua-law-679-xiv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/679-14/print) | NBU law; legal basis of NBU security and cyber regulations. |
| Постанова Правління НБУ № 66 від 12.06.2026 — Про затвердження Положення про критичну інформаційну інфраструктуру фінансового сектору та (`ua-nbu-66-2026`) | ▶ map here | [fetch](https://bank.gov.ua/ua/legislation/Resolution_12062026_66) | Financial-sector CII regulation with incident reporting to NBU. |

### 17. nonbank-finance-cyber — Закон України № 679-XIV від 20.05.1999 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 679-XIV від 20.05.1999 — Про Національний банк України (`ua-law-679-xiv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/679-14/print) | NBU law; legal basis of NBU security and cyber regulations. |
| Постанова Правління НБУ № 143 від 09.12.2025 — Про затвердження Положення про організацію заходів із забезпечення інформаційної безпеки т (`ua-nbu-143-2025`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/v0143500-25/print) | Information security and cyber requirements for non-bank financial service providers (from Dec 2026). |

### 18. official-information — Постанова КМУ № 736 від 19.10.2016 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 736 від 19.10.2016 — Про затвердження Типової інструкції про порядок ведення обліку, зберігання, використання і (`ua-cmu-736-2016`) | ✔ mapped, ▶ map here | ✓ library | Model instruction on recording, storing, using and destroying official-information media (already mapped). |

### 19. payment-market — Закон України № 2163-VIII від 05.10.2017 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Постанова Правління НБУ № 43 від 19.05.2021 — Постанова Правління Національного банку України від 19.05.2021 № 43 (`ua-nbu-43-2021`) | ✔ mapped, ▶ map here | ✓ library | Information protection and cyber protection for payment market participants (already mapped). |

### 20. personal-data — Закон України № 2297-VI від 01.06.2010 (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2297-VI від 01.06.2010 — Про захист персональних даних (`ua-law-2297-vi`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/2297-17/print) | Personal data law with security duties of controllers and processors. |

### 21. system-protection — НД ТЗІ (priority 1)

| Act | Role | Text | Note |
|---|---|---|---|
| НД ТЗІ 1.4-001-2000 — Типове положення про службу захисту інформації в автоматизованих системах, наказ ДСТСЗІ СБ (`ua-ndtzi-1.4-001-2000`) | ▶ map here | private (publisher forbids reproduction) | Model regulation for the information protection service (roles and duties). |
| НД ТЗІ 2.5-004-99 — Критерії оцінки захищеності інформації в комп’ютерних системах від несанкціонованого досту (`ua-ndtzi-2.5-004-99`) | ▶ map here | private (publisher forbids reproduction) | Evaluation criteria (functional security services and assurance levels) used for KSZI. |
| НД ТЗІ 2.5-005-99 — Класифікація автоматизованих систем і стандартні функціональні профілі захищеності оброблю (`ua-ndtzi-2.5-005-99`) | ▶ map here | private (publisher forbids reproduction) | Classification of automated systems and standard functional protection profiles. |
| НД ТЗІ 2.5-008-2002 — Вимоги із захисту конфіденційної інформації від несанкціонованого доступу під час обробки  (`ua-ndtzi-2.5-008-2002`) | ▶ map here | private (publisher forbids reproduction) | Protection requirements for confidential information in class 2 automated systems. |
| НД ТЗІ 2.5-010-2003 — Вимоги до захисту інформації WEB – сторінки від несанкціонованого доступу, наказ ДСТСЗІ СБ (`ua-ndtzi-2.5-010-2003`) | ▶ map here | private (publisher forbids reproduction) | Protection requirements for web pages with state IR. |
| НД ТЗІ 2.6-001-2011 — Порядок проведення робіт з державної експертизи засобів технічного захисту інформації від  (`ua-ndtzi-2.6-001-2011`) | ▶ map here | private (publisher forbids reproduction) | State expertise procedure for TZI tools and KSZI that system owners undergo. |
| НД ТЗІ 2.6-004-21 — Порядок авторизації безпеки інформаційних систем (`ua-ndtzi-2.6-004-21`) | ▶ map here | private (publisher forbids reproduction) | Security authorisation procedure for information systems; check alignment with 712-2025. |
| НД ТЗІ 3.6-001-2000 — Технічний захист інформації. Комп’ютерні системи. Порядок створення, впровадження, супрово (`ua-ndtzi-3.6-001-2000`) | ▶ map here | private (publisher forbids reproduction) | Lifecycle procedure for creating and maintaining TZI tools. |
| НД ТЗІ 3.6-004-21 — Порядок впровадження системи безпеки інформації в державних органах, на підприємствах, орг (`ua-ndtzi-3.6-004-21`) | ▶ map here | private (publisher forbids reproduction) | Implementing an information security system in bodies with legally protected information. |
| НД ТЗІ 3.6-005-21 — Порядок категоріювання безпеки інформаційної системи та інформації (`ua-ndtzi-3.6-005-21`) | ▶ map here | private (publisher forbids reproduction) | Security categorisation of information systems and information. |
| НД ТЗІ 3.6-006-24 — Порядок вибору захисту інформації, вимога щодо захисту якої встановлена законом та не стан (`ua-ndtzi-3.6-006-24`) | ▶ map here | private (publisher forbids reproduction) | Selection of protection measures for information systems. |
| НД ТЗІ 3.6-007-21 — Порядок впровадження заходів захисту інформації, вимога щодо захисту якої встановлена зако (`ua-ndtzi-3.6-007-21`) | ▶ map here | private (publisher forbids reproduction) | Implementation of protection measures for information systems. |
| НД ТЗІ 3.6-008-21 — Порядок моніторингу безпеки інформаційних систем (`ua-ndtzi-3.6-008-21`) | ▶ map here | private (publisher forbids reproduction) | Security monitoring of information systems. |
| НД ТЗІ 3.7-003-2023 — Порядок проведення робіт із створення комплексної системи захисту інформації в інформаційн (`ua-ndtzi-3.7-003-2023`) | ▶ map here | private (publisher forbids reproduction) | Procedure for creating a KSZI in an ICS. |

### 22. incident-response — Постанова КМУ № 1295 від 23.12.2020 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 1295 від 23.12.2020 — Деякі питання забезпечення функціонування системи виявлення вразливостей і реагування на к (`ua-cmu-1295-2020`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1295-2020-%D0%BF/print) | State vulnerability detection and incident response system (sensors) to which CII and state IR systems connect. |
| Наказ Держспецзв’язку № 284 від 24.06.2022 — Про затвердження Порядку передачі комплектів обладнання підсистеми збору телеметрії інформ (`ua-ssscip-284-2022`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0758-22/print) | Transfer and placement of state active sensors at CII and state IR systems. |

### 23. vulnerability-management — Постанова КМУ № 497 від 16.05.2023 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 497 від 16.05.2023 — Про затвердження Порядку пошуку та виявлення потенційної вразливості інформаційних (автома (`ua-cmu-497-2023`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/497-2023-%D0%BF/print) | Vulnerability search (bug bounty) procedure for state IR and CII owners. |
| Наказ Держспецзв’язку № 141 від 18.02.2026 — Про затвердження Примірної публічної пропозиції про здійснення пошуку та виявлення потенці (`ua-ssscip-141-2026`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-18-02-2026-141-pro-zatverdzhennya-primirnoyi-publichnoyi-propoziciyi-pro-zdiisnennya-poshuku-ta-viyavlennya-potenciinoyi-vrazlivosti) | Recommended model public offer for bug bounty issued under 497-2023. |

### 24. backup-continuity — Постанова КМУ № 311 від 07.04.2023 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 311 від 07.04.2023 — Деякі питання функціонування Національного центру резервування державних інформаційних рес (`ua-cmu-311-2023`) | ▶ map here | ✓ library | National backup centre for state information resources used by state bodies. |

### 25. bank-cyber — Закон України № 2121-III від 07.12.2000 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2121-III від 07.12.2000 — Про банки і банківську діяльність (`ua-law-2121-iii`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/2121-14/print) | Banking law; basis for NBU risk management and internal control regulations. |
| Постанова Правління НБУ № 88 від 02.07.2019 — Постанова Правління Національного банку України від 02.07.2019 № 88 (`ua-nbu-88-2019`) | ✔ mapped, ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/v0088500-19/print) | Bank internal control system (already mapped). |

### 26. ci-protection — Наказ Держспецзв’язку № 17 від 14.01.2025 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Наказ Держспецзв’язку № 17 від 14.01.2025 — Про затвердження Методики та Критеріїв і показників оцінки стану захищеності об’єктів крит (`ua-ssscip-17-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-administraciyi-derzhspeczv-yazku-vid-14-sichnya-2025-roku-17-pro-zatverdzhennya-metodiki-ta-kriteriyiv-i-pokaznikiv-ocinki-stanu-zakhishenosti-ob-yektiv-kritichnoyi-infrastrukturi) | Methodology and criteria for assessing CI protection state. |

### 27. crypto-technical-protection — Указ Президента України № 505/1998 від 22.05.1998 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Указ Президента України № 505/1998 від 22.05.1998 — Про Положення про порядок здійснення криптографічного захисту інформації в Україні (`ua-pres-505-1998`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/505/print) | Procedure for cryptographic protection of information. |

### 28. cyber-assessment-audit — Закон України № 2469-VIII від 21.06.2018 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2469-VIII від 21.06.2018 — Про національну безпеку України (`ua-law-2469-viii`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/2469-19/print) | National security law; legal basis of the cyber protection review 1176-2020. |
| Постанова КМУ № 1176 від 11.11.2020 — Про затвердження Порядку проведення огляду стану кіберзахисту критичної інформаційної інфр (`ua-cmu-1176-2020`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1176-2020-%D0%BF/print) | Review procedure for the cyber protection state of CII and state information resources that owners undergo. |

### 29. cyber-assessment-audit — Закон України № 3475-IV від 23.02.2006 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 3475-IV від 23.02.2006 — Про Державну службу спеціального зв’язку та захисту інформації України (`ua-law-3475-iv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/3475-15/print) | SSSCIP law; basis of SSSCIP orders on scanning assessment and state expertise. |
| Наказ Держспецзв’язку № 660 від 02.12.2014 — Про затвердження Порядку оцінки стану захищеності державних інформаційних ресурсів в інфор (`ua-ssscip-660-2014`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0090-15/print) | SSSCIP assessment of protection of state IR in systems. |

### 30. incident-response — Постанова КМУ № 1772 від 16.11.2002 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 1772 від 16.11.2002 — Про затвердження Порядку взаємодії органів виконавчої влади з питань захисту державних інф (`ua-cmu-1772-2002`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/1772-2002-%D0%BF/print) | Interaction of executive bodies on protecting state IR including incident notification. |

### 31. nato-information — Закон України № 2163-VIII від 05.10.2017 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 2163-VIII від 05.10.2017 — Про основні засади забезпечення кібербезпеки України (`ua-law-2163-viii`) | context (chain 4) | [fetch](https://zakon.rada.gov.ua/laws/show/2163-19/print) | Framework cybersecurity law with duties of CI / CII / state IR owners; basis of most cyber acts. |
| Закон України № 4336-IX від 27.03.2025 — Про внесення змін до деяких законів України щодо захисту інформації та кіберзахисту держав (`ua-law-4336-ix`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/4336-20/print) | Amending law; its changes live in 2163-VIII / 80/94-ВР / 3475-IV but it is the stated basis of many implementing acts. |
| Постанова КМУ № 712 від 18.06.2025 — Деякі питання захисту інформаційних, електронних комунікаційних, інформаційно-комунікаційн (`ua-cmu-712-2025`) | context (chain 1) | ✓ library | Security authorisation of systems and security profiles. |
| Наказ Держспецзв’язку № 843 від 17.12.2025 — Про затвердження базового профілю безпеки системи, де обробляється інформація НАТО з грифо (`ua-ssscip-843-2025`) | ▶ map here | [fetch](https://cip.gov.ua/ua/news/nakaz-843-2025) | Baseline security profile for standalone NATO RESTRICTED systems. |

### 32. state-secrets — Постанова КМУ № 180 від 16.02.1998 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 180 від 16.02.1998 — Про затвердження Положення про забезпечення режиму секретності під час обробки інформації, (`ua-cmu-180-1998`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/180-98-%D0%BF/print) | Secrecy regime for processing state secrets in information systems. |

### 33. state-secrets — Закон України № 3855-XII від 21.01.1994 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 3855-XII від 21.01.1994 — Про державну таємницю (`ua-law-3855-xii`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/3855-12/print) | State secrets law with access and clearance regime duties. |

### 34. supplier-security — Закон України № 74/98-ВР від 04.02.1998 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 74/98-ВР від 04.02.1998 — Про Національну програму інформатизації (`ua-law-74-98-vr`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/74/print) | Informatisation programme law; basis of 205-2025. |
| Постанова КМУ № 205 від 21.02.2025 — Деякі питання створення, адміністрування та забезпечення функціонування засобу інформатиза (`ua-cmu-205-2025`) | ▶ map here | ✓ library | Creation and administration of state informatisation tools incl. requirements for software developed on state order. |

### 35. system-protection — Наказ Держспецзв’язку № 317 від 24.06.2024 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| Наказ Держспецзв’язку № 317 від 24.06.2024 — Про визначення Базового профілю безпеки інформації (`ua-ssscip-317-2024`) | ▶ map here | [fetch](https://cip.gov.ua/services/cm/api/attachment/download?id=65232) | 2024 baseline information security profile; check relation to 409-2025 / 419-2025. |

### 36. system-protection — НД ТЗІ 2.3-025-24 (priority 2)

| Act | Role | Text | Note |
|---|---|---|---|
| НД ТЗІ 2.3-025-24 — Т1 Методика оцінювання заходів захисту інформації, вимога щодо захисту якої встановлена за (`ua-ndtzi-2.3-025-24`) | ▶ map here | private (publisher forbids reproduction) | Assessment methodology for protection measures in information systems (vol. 1). |
| НД ТЗІ 2.3-025-24 — Т2 Методика оцінювання заходів захисту інформації, вимога щодо захисту якої встановлена за (`ua-ndtzi-2.3-025-24-2`) | ▶ map here | private (publisher forbids reproduction) | Assessment methodology for protection measures (vol. 2). |
| НД ТЗІ 2.3-025-24 — Т3 Методика оцінювання заходів захисту інформації, вимога щодо захисту якої встановлена за (`ua-ndtzi-2.3-025-24-3`) | ▶ map here | private (publisher forbids reproduction) | Assessment methodology for protection measures (vol. 3). |

### 37. system-protection — Постанова КМУ № 688 від 03.08.2005 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 688 від 03.08.2005 — Про затвердження Положення про Реєстр інформаційних, електронних комунікаційних та інформа (`ua-cmu-688-2005`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/688-2005-%D0%BF/print) | Register of executive bodies' ICS; reporting of systems akin to asset inventory. |
| Наказ Держспецзв’язку № 72 від 24.04.2007 — Про затвердження Порядку формування й користування інформаційним фондом Реєстру інформацій (`ua-ssscip-72-2007`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0500-07/print) | Information fund of the ICS register to which executive bodies submit data. |

### 38. crypto-technical-protection — Постанова КМУ № 1772 від 16.11.2002 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 1772 від 16.11.2002 — Про затвердження Порядку взаємодії органів виконавчої влади з питань захисту державних інф (`ua-cmu-1772-2002`) | context (chain 30) | [fetch](https://zakon.rada.gov.ua/laws/show/1772-2002-%D0%BF/print) | Interaction of executive bodies on protecting state IR including incident notification. |
| Наказ Держспецзв’язку № 94 від 10.06.2008 — Про затвердження Порядку координації діяльності органів державної влади, органів місцевого (`ua-ssscip-94-2008`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0603-08/print) | Coordination on preventing leakage via technical channels for holders of restricted information. |

### 39. state-secrets — Постанова КМУ № 939 від 18.12.2013 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| Постанова КМУ № 939 від 18.12.2013 — Постанова Кабінету Міністрів України від 18 грудня 2013 року № 939 (`ua-cmu-939-2013`) | check | restricted | Restricted (DSK) secrecy-regime procedure; sets regime duties but text is not public; decide if restricted acts can be mapped or keep as basis of sbu-383-2020. |
| Наказ СБУ № 383 від 23.12.2020 — Про затвердження Зводу відомостей, що становлять державну таємницю (`ua-sbu-383-2020`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0052-21/print) | Catalogue of state-secret information that holders apply when classifying. |

### 40. system-protection — Закон України № 3475-IV від 23.02.2006 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 3475-IV від 23.02.2006 — Про Державну службу спеціального зв’язку та захисту інформації України (`ua-law-3475-iv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/3475-15/print) | SSSCIP law; basis of SSSCIP orders on scanning assessment and state expertise. |
| Наказ Держспецзв’язку № 93 від 16.05.2007 — Про затвердження Положення про державну експертизу в сфері технічного захисту інформації (`ua-ssscip-93-2007`) | ▶ map here | ✓ library | State expertise in TZI for KSZI and tools. |

### 41. vulnerability-management — Закон України № 3475-IV від 23.02.2006 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| Закон України № 3475-IV від 23.02.2006 — Про Державну службу спеціального зв’язку та захисту інформації України (`ua-law-3475-iv`) | basis | [fetch](https://zakon.rada.gov.ua/laws/show/3475-15/print) | SSSCIP law; basis of SSSCIP orders on scanning assessment and state expertise. |
| Наказ Держспецзв’язку № 20 від 15.01.2016 — Про затвердження Порядку сканування на предмет вразливості державних інформаційних ресурсі (`ua-ssscip-20-2016`) | ▶ map here | [fetch](https://zakon.rada.gov.ua/laws/show/z0196-16/print) | SSSCIP vulnerability scanning of state IR online that owners are subject to. |

### 42. crypto-technical-protection — НД ТЗІ 1.6-005-2013 (priority 3)

| Act | Role | Text | Note |
|---|---|---|---|
| НД ТЗІ 1.6-005-2013 — Захист інформації на об’єктах інформаційної діяльності. Положення про категоріювання об’єк (`ua-ndtzi-1.6-005-2013`) | ▶ map here | private (publisher forbids reproduction) | Categorisation of premises where restricted (non-secret) information circulates. |

## To check before the chains start (30)

| Act | What to check |
|---|---|
| AC/322-D(2015)0031 (`nato-ac-322-d-2015-0031`) | Crypto directive for NATO information in non-NATO nations' CIS (restricted); check whether it binds Ukrainian systems directly. |
| Постанова КМУ № 1082 від 17.07.2003 (`ua-cmu-1082-2003`) | Restricted (DSK) resolution with no published content; check title and scope before deciding. |
| Постанова КМУ № 1363 від 23.12.2020 (`ua-cmu-1363-2020`) | 2020 experimental vulnerability-detection project; check whether it still runs or was superseded by 497-2023 / 1580-2025. |
| Постанова КМУ № 1580 від 03.12.2025 (`ua-cmu-1580-2025`) | LINKS show it amends 497-2023 but DESC describes its own procedure; check whether it approves a standalone procedure (map) or only amends (drop). |
| Постанова КМУ № 939 від 18.12.2013 (`ua-cmu-939-2013`) | Restricted (DSK) secrecy-regime procedure; sets regime duties but text is not public; decide if restricted acts can be mapped or keep as basis of sbu-383-2020. |
| Постанови Правління НБУ № 70, 72, 73 від 30.06.2026 (`ua-nbu-70-2026`) | Entry bundles NBU 70/72/73 and LINKS only show amendment of 64-2018; check whether 72/73 approve standalone third-party risk rules. |
| НД ТЗІ 1.6-003-2004 (`ua-ndtzi-1.6-003-2004`) | Restricted; threat-model rules for TZI complexes at premises; check whether text can be mapped. |
| НД ТЗІ 1.6-006-2015 (`ua-ndtzi-1.6-006-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.2-008-2015 (`ua-ndtzi-2.2-008-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.2-009-2015 (`ua-ndtzi-2.2-009-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.2-011-2015 (`ua-ndtzi-2.2-011-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.3-019-2015 (`ua-ndtzi-2.3-019-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.3-020-2015 (`ua-ndtzi-2.3-020-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.3-023-2015 (`ua-ndtzi-2.3-023-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.3-024-2015 (`ua-ndtzi-2.3-024-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.4-010-2015 (`ua-ndtzi-2.4-010-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.4-011-2015 (`ua-ndtzi-2.4-011-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.4-014-2015 (`ua-ndtzi-2.4-014-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.5-012-2015 (`ua-ndtzi-2.5-012-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 2.7-012-2015 (`ua-ndtzi-2.7-012-2015`) | Restricted and untitled in the register; obtain title and scope. |
| НД ТЗІ 3.6-003-2016 (`ua-ndtzi-3.6-003-2016`) | Restricted; creation and attestation of TZI complexes; check whether text can be mapped. |
| Наказ Держспецзв’язку № 354 від 10.07.2024 (`ua-ssscip-354-2024`) | Title and content not given in the register yet it sits in the system-baseline chain; identify the act. |
| Наказ Держспецзв’язку № 604 від 07.08.2026 (`ua-ssscip-604-2026`) | Inspection methodology and act form; check whether it lists requirements inspected entities must evidence (map) or only inspector steps (drop). |
| Наказ Держспецзв’язку № 627/772 від 19.12.2024 (`ua-ssscip-627-2024`) | Joint SBU/SSSCIP order with no title; identify it and check the id against ua-cmu-627-2024 repealed by 712-2025. |
| Наказ Держспецзв’язку № 67/ДСК від 28.01.2026 (`ua-ssscip-67-2026`) | Restricted (DSK) order on e-ID and trust services in systems with official and secret information; check if mappable. |
| ВСТ 01.008.001-2021 (`ua-vst-01.008.001-2021`) | Restricted mandatory military standard on security procedures for NATO-information CIS; check if mappable. |
| ВСТ 01.008.002-2021 (`ua-vst-01.008.002-2021`) | Restricted mandatory military standard on risk management for NATO-information CIS; check if mappable. |
| ВСТ 01.008.003-2021 (`ua-vst-01.008.003-2021`) | Restricted mandatory military standard on security evaluation and certification; check if mappable. |
| ВСТ 01.008.004-2021 (`ua-vst-01.008.004-2021`) | Restricted mandatory military standard on security accreditation; check if mappable. |
| ВСТ 01.008.005-2021 (`ua-vst-01.008.005-2021`) | Restricted mandatory military standard on NATO information exchange for non-NATO nations; check if mappable. |

## Register fixes and notes from the triage

- ПКМУ № 1009/2026 and № 1500/2022 are missing from the register; their texts are in `library/cmu/`.

# Triage notes

Totals: 250 acts. Verdicts: map 89, drop 113, check 30, basis 18. Of the map acts, 36 are priority 1, 36 priority 2 and 17 priority 3.

## Acts referenced in LINKS but missing from the register

Repealed predecessors. These are expected to be absent, because the extract lists only in-force acts:
- ua-cmu-257-2023, repealed by 1799-2025.
- ua-cmu-299-2023, repealed by 1533-2025. ua-pres-37-2022 still shows `based_on←ua-cmu-299-2023`, which is a stale incoming link.
- ua-cmu-869-2009 and ua-cmu-121-1998, both repealed by 205-2025.
- ua-ssscip-570-2023 and ua-nccc-21-2023, both repealed by ssscip-143-2026.
- ua-ssscip-599-2023, repealed by ssscip-141-2026. ua-cmu-497-2023 still shows `based_on←ua-ssscip-599-2023`, which is stale.
- ua-ssscip-601-2021 and ua-ssscip-54-2025, both repealed by ssscip-75-2026.
- NATO AC/35-D/2000-REV8, 2001-REV2, 2002-REV4 and 2003-REV4, each superseded by its next revision.

Possibly in force but missing:
- **ua-ssscip-228-2024**. It appears only as `based_on→ua-law-3475-iv`. The register shows no repeal, so check whether it is an in-force SSSCIP order that was left out.
- **ua-cmu-627-2024**. ua-cmu-712-2025 repeals it. The register does contain **ua-ssscip-627-2024**, a joint SBU/SSSCIP order no. 627/772 of 19.12.2024 with no title. Check whether 712-2025 really repeals a CMU resolution no. 627 of 2024 or whether one of the two ids is wrong.

Foreign sources and drafts. These are correctly absent from a register of Ukrainian acts:
- EU acts: eu-dir-2022-2555 (NIS2), eu-reg-2024-792, eu-dir-2018-1972 and eu-reg-2014-910.
- Bills: ua-bill-8153, which would repeal 2297-VI, and ua-bill-8238, 16123, 15344-1 and 12174.

Gaps in the register's own links:
- ua-cmu-337-2026 is an amending act, but it has no `amends` links, so the CI resolutions it changes are not identified.
- ua-nbu-66-2026 amends other NBU acts according to its title, but it has no `amends` links.
- ua-nbu-70-2026 is a single entry for three resolutions (70, 72 and 73).

## Topics added

The suggested slug set was extended with these slugs:
- `vulnerability-management`: bug bounty and vulnerability scanning (497-2023, 1580-2025, 1363-2020, ssscip-141-2026, ssscip-20-2016).
- `nato-information`: ssscip-843-2025, the VST military standards, the UA-NATO security agreement and all NATO policies.
- `nonbank-finance-cyber`: NBU 143-2025, for non-bank financial service providers. The alternative was to merge it into `bank-cyber`.
- `ai-security`: ssscip-154-2026 and CETS 225. Both are dropped.
- `institutional`: grouping slug for dropped acts that only set up state bodies, strategies or programmes.
- `records-management`: grouping slug for dropped records-management acts (CMU 55-2018, MoJ 1000/5, DSTU 4163, egov-60).

I used `system-protection` where the register's hand-built chain is called `system-baseline` (373-2006, 712-2025, 80/94-ВР, 3.6-004-21, 3.6-006-24, 409-2025, 419-2025 and 354-2024). The chain and the slug need to be reconciled.

## Things I was unsure about

- **Restricted texts (17 checks).** These are CMU 1082-2003 and 939-2013, the 13 untitled 2015 ND TZI, ND TZI 1.6-003-2004 and 3.6-003-2016, SSSCIP 67-2026, the five VST 01.008.00x-2021 standards and AC/322-D(2015)0031. Their subject would justify `map`, but an open reference may not be able to map them provision by provision. A policy decision is needed on whether to include them.
- **Recommended guidance.** I applied your rule that recommended documents with no binding reference are dropped. On that basis I dropped ssscip-463-2023 (ICS), 505-2024 (cloud), 702-2024 (CI audit), 154-2026 (AI), ER 09-2025 (target profile), and the DSTU 3396 and TEMPEST recommendations. Several of these would be high-value if a binding act turns out to reference them.
  - Recommended guidance issued under a map act (`based_on`) was treated as map at priority 3: ssscip-661, 810, 811 and 141. ssscip-798 is priority 2.
- **ua-law-4336-ix** is an amending law. I gave it `basis` instead of `drop` because the register names it as the basis of about a dozen implementing acts. Its substantive changes are mapped through the consolidated 2163-VIII and 80/94-ВР.
- **Amending acts dropped.** CMU 1470-2025 and 1531-2025 are new wordings of 518 and 373; map those consolidated texts. CMU 1740-2025, CMU 447-2025, CMU 337-2026 and NBU 24-2025 are dropped on the same basis.
- **Unresolved checks:**
  - ua-nbu-70-2026: the third-party risk rules. Check whether 72 and 73 are standalone regulations.
  - ua-cmu-1580-2025: own procedure or only an amendment of 497?
  - ua-ssscip-604-2026: does the inspection act form list the requirements that inspected entities must evidence?
  - ua-ssscip-354-2024: no title, but it sits in a chain.
  - ua-ssscip-627-2024: no title.
  - ua-cmu-1363-2020: an experimental project that may be obsolete.
- **NATO policies.** All NATO directives were dropped as binding NATO bodies and member nations, including the core AC/35-D/2000–2005 and C-M(2002)49 ones. Ukrainian duties come through the security agreement, ssscip-843-2025 and the VST standards. The register does not say whether Ukraine applies these directives directly. AC/35-D/1038-REV3 is `basis` because VST-005 applies it.
- **Possible overlaps to verify:**
  - ssscip-317-2024 (baseline profile 2024) against 409-2025 and 419-2025, the profiles under 712-2025.
  - ND TZI 2.6-004-21 (authorisation) against CMU 712-2025.
  - CMU 1176-2020 (review) against 1799-2025 (assessment).
- **Marginal priority-3 maps.** These are register and reporting duties (CMU 688-2005 and ssscip-72-2007), the sensor equipment transfer (ssscip-284-2022), the incident repository (ssscip-179-2026), state expertise (ND TZI 2.6-001 and ssscip-93-2007) and sbu-383-2020 as a classification catalogue. They could be downgraded to drop.
- **Law 2939-VI** (access to public information) was dropped because the register gives it no security content. If it is linked as the basis of the official-information handling act CMU 736-2016, change it to `basis`.

