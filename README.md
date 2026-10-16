# GRC-фундамент для України / GRC foundation for Ukraine

[Українською](#українською) | [English](#english)

> [!WARNING]
> Це довідковий інструмент, а не юридична консультація. Застосовність актів і зіставлення з заходами - думка авторів, частина даних ще не перевірена (див. статуси в таблицях).
> This is a reference tool, not legal advice. Applicability and mappings are the authors' opinion, and part of the data is not yet reviewed (see the status columns).

## Українською

### Про проєкт

Автоматизація GRC починається не з інструмента, а з системи управління: треба знати, які вимоги до організації застосовні, і якими заходами вона їх виконує. Цей проєкт дає фундамент для такої роботи в Україні:

1. **Реєстр нормативних джерел** (252 позиції): закони, укази, постанови КМУ, накази Держспецзв'язку та НБУ, НД ТЗІ, ДСТУ, ВСТ, міжнародні договори і політики НАТО, а також законопроєкти для спостереження. Перелік фільтрується за типом суб'єкта (25 типів у чотирьох групах), показує опис і "кого стосується" для кожного акта, нормативні ланцюги з правовою підставою кожної ланки, і його можна завантажити. Кожен акт має ідентифікатор ELI (European Legislation Identifier), а ланцюги описано властивостями онтології ELI і доступні як JSON-LD.
2. **Зіставлення з СУІБ**: окремі положення (стаття, пункт) зіставлені із заходами ISO/IEC 27001:2022 або NIST CSF 2.0 за методикою NIST IR 8477. Результат вивантажується як проєкт Положення про застосовність або цільового профілю зі стовпцями для параметрів, які визначає організація, і посилань на політики.
3. **Рівень систем (попередня версія)**: перехід від CSF 2.0 до NIST SP 800-53 з українськими базовими профілями безпеки.

Окремо ведеться **довідковий перелік актів і проєктів ЄС** (36 позицій): він показує, куди рухається українське законодавство, але не потрапляє до таблиці заходів. Розділ **Статті** містить довідкові матеріали (кейси політик СУІБ, огляд GRC-систем).

Проєкт розрахований на організації, що працюють в Україні.

### Як користуватися

- **Сайт:** `https://<owner>.github.io/grc-foundation-ua/` (після публікації). Оберіть тип організації та стандарт, перегляньте заходи з правовими підставами й завантажте результат у CSV чи Excel.
- **Дані:** таблиці в теці [`data/`](data/). GitHub показує їх як таблиці з пошуком, їх можна завантажити напряму.

### Склад репозиторію

| Що | Де |
|---|---|
| Сайт | `index.html`, `assets/`, `content/` |
| Дані | `data/*.csv`, опис стовпців у `data/datapackage.json` |
| Концепція, модель даних і порядок супроводу | [`docs/BLUEPRINT.uk.md`](docs/BLUEPRINT.uk.md) |
| Довідкові статті | `content/articles/*.md` |
| Метадані ELI (JSON-LD) | `data/eli.jsonld`, генерує `scripts/build_eli.py` |
| Перевірка даних | `scripts/validate.py` (запускається в CI) |

### Встановлення

1. Створіть на GitHub порожній публічний репозиторій `grc-foundation-ua` і завантажте до нього вміст архіву (`git push` або "Add file → Upload files").
2. У `assets/js/config.js` замініть `OWNER` у `repoUrl` на свій обліковий запис.
3. **Settings → Pages → Build and deployment:** Source "Deploy from a branch", гілка `main`, тека `/ (root)`. Збирати нічого не треба (файл `.nojekyll` вимикає Jekyll).
4. За хвилину-дві сайт з'явиться за адресою `https://<owner>.github.io/grc-foundation-ua/`.
5. Перевірка даних запускається автоматично для кожного pull request (`.github/workflows/validate.yml`). Локально: `python3 scripts/validate.py --stats`; після зміни актів чи зв'язків також `python3 scripts/build_eli.py`.
6. Для локального перегляду: `python3 -m http.server 8000` у корені репозиторію і відкрийте `http://localhost:8000` (сайт читає CSV через `fetch`, тому відкриття `index.html` як файлу не спрацює).

### Як долучитися

Повідомте про новий чи змінений акт або помилку в зіставленні через issue, або запропонуйте зміни через pull request. Порядок супроводу описано в [`docs/BLUEPRINT.uk.md`](docs/BLUEPRINT.uk.md), коротко - у [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Походження

Перелік джерел, українські базові профілі SP 800-53 і зіставлення базових заходів з CSF 2.0 імпортовано з проєкту [grc-one-stop-shop-ua](https://github.com/Ivan-Gokin/grc-one-stop-shop-ua) (`scripts/import_legacy.py`). Розширений реєстр (описи, теги типів суб'єктів, ланцюги з правовими підставами, акти ЄС) додано у жовтні 2026 р. (`scripts/merge_register_2026_10.py`). Зіставлення для восьми постанов НБУ (з ISO/IEC 27001) і Закону № 80/94-ВР (з NIST CSF 2.0) згенеровано ШІ і ще не вичитано; їх імпортовано скриптом `scripts/import_strm_2026_10.py`, а на сайті вони мають позначку "ШІ, не вичитано". Ідентифікатори і зв'язки переведено на ELI скриптом `scripts/migrate_to_eli_2026_10.py`. Усі чотири скрипти одноразові й зберігаються лише для простежуваності.

### Ліцензії

Код: MIT ([`LICENSE`](LICENSE)). Дані: CC BY 4.0 ([`LICENSE-DATA.md`](LICENSE-DATA.md)). Тексти заходів ISO/IEC 27001 не відтворюються: наведено лише ідентифікатори та власні короткі формулювання.

### Контакти

[Ivan Gokin](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/)

## English

### About

GRC automation starts with a management system, not a tool: you need to know which requirements apply to the organisation and which controls satisfy them. This project provides that foundation for Ukraine:

1. **A register of legal and normative sources** (252 entries): laws, decrees, Cabinet of Ministers resolutions, SSSCIP and NBU orders, TZI normative documents, national and military standards, international agreements and NATO policies, plus bills on a watch list. It is filtered by entity type (25 types in four groups), shows what each act is about and whom it concerns, and regulatory chains with the legal basis of every link, and it can be downloaded. Every act has a European Legislation Identifier (ELI), and the chains use the ELI ontology properties and are published as JSON-LD.
2. **ISMS mappings**: individual provisions (article, paragraph) are mapped to ISO/IEC 27001:2022 or NIST CSF 2.0 controls using the NIST IR 8477 relationship model. The result is exported as a draft Statement of Applicability or Target Profile, with columns for organisation-defined values and policy references.
3. **System level (preview)**: from CSF 2.0 to NIST SP 800-53 with the Ukrainian baseline security profiles.

A separate **EU reference list** (36 acts and proposals) shows where Ukrainian law is heading but never enters the controls table. The **Articles** section holds background reading (ISMS policy case studies, an overview of GRC systems).

The project assumes operations in Ukraine.

### How to use it

- **Site:** `https://<owner>.github.io/grc-foundation-ua/` (once published). Pick your organisation type and framework, review controls with their legal drivers, and download the result as CSV or Excel.
- **Data:** the tables in [`data/`](data/). GitHub renders them as searchable tables, and they can be downloaded directly.

### What is in the repository

| What | Where |
|---|---|
| Site | `index.html`, `assets/`, `content/` |
| Data | `data/*.csv`, column descriptions in `data/datapackage.json` |
| Concept, data model and maintenance procedure | [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) |
| Articles | `content/articles/*.md` |
| ELI metadata (JSON-LD) | `data/eli.jsonld`, built by `scripts/build_eli.py` |
| Data checks | `scripts/validate.py` (runs in CI) |

### Installation

1. Create an empty public repository `grc-foundation-ua` on GitHub and add the contents of the archive (`git push`, or "Add file → Upload files").
2. In `assets/js/config.js`, replace `OWNER` in `repoUrl` with your account.
3. **Settings → Pages → Build and deployment:** Source "Deploy from a branch", branch `main`, folder `/ (root)`. There is no build step (`.nojekyll` turns Jekyll off).
4. After a minute or two the site is live at `https://<owner>.github.io/grc-foundation-ua/`.
5. Data checks run automatically on every pull request (`.github/workflows/validate.yml`). Locally: `python3 scripts/validate.py --stats`; after changing acts or links, also `python3 scripts/build_eli.py`.
6. To preview locally: run `python3 -m http.server 8000` in the repository root and open `http://localhost:8000` (the site loads the CSVs with `fetch`, so opening `index.html` as a file will not work).

### Contributing

Report a new or changed act, or a wrong mapping, through an issue, or propose a change through a pull request. The maintenance procedure is in [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md), with a short version in [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Provenance

The source list, the Ukrainian SP 800-53 baseline profiles and the baseline-measure mapping to CSF 2.0 were imported from [grc-one-stop-shop-ua](https://github.com/Ivan-Gokin/grc-one-stop-shop-ua) (`scripts/import_legacy.py`). The extended register (descriptions, entity-type tags, chains with legal bases, EU acts) was merged in October 2026 (`scripts/merge_register_2026_10.py`). The mappings for eight NBU resolutions (to ISO/IEC 27001) and Law No. 80/94-VR (to NIST CSF 2.0) were generated by AI and have not yet been proofread; they were imported with `scripts/import_strm_2026_10.py` and are marked "AI, not reviewed" on the site. Identifiers and links were moved to ELI with `scripts/migrate_to_eli_2026_10.py`. All four scripts are one-off and kept for provenance only.

### Licences

Code: MIT ([`LICENSE`](LICENSE)). Data: CC BY 4.0 ([`LICENSE-DATA.md`](LICENSE-DATA.md)). ISO/IEC 27001 control texts are not reproduced; only identifiers and the project's own short labels are used.

### Contact

[Ivan Gokin](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/)
