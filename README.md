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
3. **Рівень систем (попередня версія)**: заходи NIST SP 800-53 для конкретної системи з позначкою, звідки походить кожна вимога: базовий профіль безпеки, план кіберзахисту, CSF і законодавство (галузеві профілі додадуться, коли їх затвердять).

Окремо ведеться **довідковий перелік актів і проєктів ЄС** (36 позицій): він показує, куди рухається українське законодавство, але не потрапляє до таблиці заходів. Розділ **Статті** містить довідкові матеріали (кейси політик СУІБ, огляд GRC-систем).

Проєкт розрахований на організації, що працюють в Україні.

### Як користуватися

- **Сайт:** [https://ivan-gokin.github.io/grc-foundation-ua/](https://ivan-gokin.github.io/grc-foundation-ua/). Оберіть тип організації та стандарт, перегляньте заходи з правовими підставами й завантажте результат у CSV чи Excel.
- **Дані для людей:** на сайті в розділі **Дані** є `grc-foundation-ua.xlsx` - реєстр, ланцюги і зіставлення з назвами актів, текстами вимог і назвами заходів в одній книзі.
- **Дані для програм:** там само - CSV (UTF-8) з описом стовпців у `datapackage.json` і метадані ELI (`eli.jsonld`), за постійними адресами `https://ivan-gokin.github.io/grc-foundation-ua/data/<файл>`.

### Склад репозиторію

| Що | Де |
|---|---|
| Сайт | `index.html`, `404.html`, `assets/`, `content/` |
| Зіставлення (редагуються в Excel) | `mappings/*.xlsx` |
| Решта даних | `data/*.csv`, опис стовпців у `data/datapackage.json` |
| Перевірка і збирання | `scripts/validate.py`, `scripts/build.py`; публікація - `.github/workflows/site.yml` |
| Концепція, модель даних і порядок супроводу | [`docs/BLUEPRINT.uk.md`](docs/BLUEPRINT.uk.md) |

Згенеровані файли (`provisions.csv`, `mappings.csv`, `eli.jsonld`, `grc-foundation-ua.xlsx`) у репозиторії не зберігаються: їх збирають під час публікації.

### Встановлення

1. Створіть на GitHub порожній публічний репозиторій `grc-foundation-ua` в обліковому записі [Ivan-Gokin](https://github.com/Ivan-Gokin) (адреси в `assets/js/config.js` і `data/meta.json` уже налаштовано на нього).
2. Завантажте вміст архіву: "Add file → Upload files" (разом із прихованою текою `.github`) або з терміналу в теці проєкту: `git init -b main`, `git add -A`, `git commit -m "Перша публікація"`, `git remote add origin https://github.com/Ivan-Gokin/grc-foundation-ua.git`, `git push -u origin main`.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. Відкрийте вкладку **Actions** і, якщо перший запуск ще не відбувся або впав до вмикання Pages, запустіть **Check and publish** вручну (Run workflow). За кілька хвилин сайт з'явиться за адресою https://ivan-gokin.github.io/grc-foundation-ua/.
5. Далі кожна зміна в `main` перевіряється й публікується автоматично; pull request лише перевіряється.

**Попередній режим.** Поки дані вичитуються, сайт закрито від пошукових систем (`<meta name="robots" content="noindex">` в `index.html`), а вгорі кожної сторінки є смуга «Попередня версія». Коли дані буде перевірено, видаліть цей рядок з `index.html` і поставте `preview: false` в `assets/js/config.js`. Зібраний сайт зберігається з кожним запуском (Actions → запуск → Artifacts → `site`), тож його можна завантажити й переглянути локально, навіть коли репозиторій приватний.

Локально: `pip install openpyxl`, потім `python3 scripts/validate.py --stats`, `python3 scripts/build.py` і `python3 -m http.server 8000 -d _site` (відкрийте `http://localhost:8000`).

### Як оновити зіставлення

1. Відкрийте потрібну книгу в `mappings/` (на GitHub: файл → "Download raw file").
2. Змініть рядки в аркуші «Вимоги» чи в аркуші стандарту (`iso27001-2022`, `csf-2.0`). Підказки є в примітках до заголовків, значення - у випадних списках.
3. Завантажте файл назад з тією самою назвою ("Add file → Upload files") і зробіть commit.
4. Перевірка покаже помилки, якщо вони є (вкладка Actions); інакше сайт оновиться сам.

### Як долучитися

Повідомте про новий чи змінений акт або помилку в зіставленні через issue, або запропонуйте зміни через pull request. Порядок супроводу описано в [`docs/BLUEPRINT.uk.md`](docs/BLUEPRINT.uk.md), коротко - у [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Походження

Перелік джерел, українські базові профілі SP 800-53 і зіставлення базових заходів з CSF 2.0 походять із проєкту [grc-one-stop-shop-ua](https://github.com/Ivan-Gokin/grc-one-stop-shop-ua); розширений реєстр (описи, теги, ланцюги, акти ЄС) додано у жовтні 2026 р. Зіставлення для восьми постанов НБУ (з ISO/IEC 27001) і Закону № 80/94-ВР (з NIST CSF 2.0) згенеровано ШІ і ще не вичитано: на сайті й у таблицях вони мають позначку "ШІ, не вичитано". Як дані потрапили до проєкту, описано в [`CHANGELOG.md`](CHANGELOG.md).

### Ліцензії

Код: MIT ([`LICENSE`](LICENSE)). Дані: CC BY 4.0 ([`LICENSE-DATA.md`](LICENSE-DATA.md)). Тексти заходів ISO/IEC 27001 не відтворюються: наведено лише ідентифікатори та власні короткі формулювання.

### Контакти

[Ivan Gokin](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/)

## English

### About

GRC automation starts with a management system, not a tool: you need to know which requirements apply to the organisation and which controls satisfy them. This project provides that foundation for Ukraine:

1. **A register of legal and normative sources** (252 entries): laws, decrees, Cabinet of Ministers resolutions, SSSCIP and NBU orders, TZI normative documents, national and military standards, international agreements and NATO policies, plus bills on a watch list. It is filtered by entity type (25 types in four groups), shows what each act is about and whom it concerns, and regulatory chains with the legal basis of every link, and it can be downloaded. Every act has a European Legislation Identifier (ELI), and the chains use the ELI ontology properties and are published as JSON-LD.
2. **ISMS mappings**: individual provisions (article, paragraph) are mapped to ISO/IEC 27001:2022 or NIST CSF 2.0 controls using the NIST IR 8477 relationship model. The result is exported as a draft Statement of Applicability or Target Profile, with columns for organisation-defined values and policy references.
3. **System level (preview)**: NIST SP 800-53 controls for a given system, each marked with where the requirement comes from: a baseline security profile, the cyber protection plan, or CSF and legislation (sector profiles will be added once approved).

A separate **EU reference list** (36 acts and proposals) shows where Ukrainian law is heading but never enters the controls table. The **Articles** section holds background reading (ISMS policy case studies, an overview of GRC systems).

The project assumes operations in Ukraine.

### How to use it

- **Site:** [https://ivan-gokin.github.io/grc-foundation-ua/](https://ivan-gokin.github.io/grc-foundation-ua/). Pick your organisation type and framework, review controls with their legal drivers, and download the result as CSV or Excel.
- **Data for people:** the **Data** section of the site offers `grc-foundation-ua.xlsx`: the register, the chains and the mappings with act names, requirement texts and control names in one workbook.
- **Data for software:** in the same place, UTF-8 CSV files described in `datapackage.json` and ELI metadata (`eli.jsonld`), at stable addresses `https://ivan-gokin.github.io/grc-foundation-ua/data/<file>`.

### What is in the repository

| What | Where |
|---|---|
| Site | `index.html`, `404.html`, `assets/`, `content/` |
| Mappings (edited in Excel) | `mappings/*.xlsx` |
| Other data | `data/*.csv`, column descriptions in `data/datapackage.json` |
| Checks and build | `scripts/validate.py`, `scripts/build.py`; publishing: `.github/workflows/site.yml` |
| Concept, data model and maintenance procedure | [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) |

Generated files (`provisions.csv`, `mappings.csv`, `eli.jsonld`, `grc-foundation-ua.xlsx`) are not kept in the repository; they are built on publication.

### Installation

1. Create an empty public repository `grc-foundation-ua` under the [Ivan-Gokin](https://github.com/Ivan-Gokin) account (the addresses in `assets/js/config.js` and `data/meta.json` already point there).
2. Add the contents of the archive: "Add file → Upload files" (including the hidden `.github` folder), or from a terminal in the project folder: `git init -b main`, `git add -A`, `git commit -m "First publication"`, `git remote add origin https://github.com/Ivan-Gokin/grc-foundation-ua.git`, `git push -u origin main`.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. Open the **Actions** tab and, if the first run has not happened yet or failed before Pages was switched on, run **Check and publish** by hand (Run workflow). In a few minutes the site is live at https://ivan-gokin.github.io/grc-foundation-ua/.
5. From then on every change to `main` is checked and published automatically; pull requests are only checked.

**Preview mode.** While the data is being reviewed, the site is closed to search engines (`<meta name="robots" content="noindex">` in `index.html`) and every page shows a "Preview" banner. When the data is reviewed, delete that line from `index.html` and set `preview: false` in `assets/js/config.js`. The built site is kept with every run (Actions → the run → Artifacts → `site`), so it can be downloaded and viewed locally even while the repository is private.

Locally: `pip install openpyxl`, then `python3 scripts/validate.py --stats`, `python3 scripts/build.py` and `python3 -m http.server 8000 -d _site` (open `http://localhost:8000`).

### Updating the mappings

1. Open the workbook in `mappings/` (on GitHub: the file → "Download raw file").
2. Edit the rows in the «Вимоги» sheet or in a framework sheet (`iso27001-2022`, `csf-2.0`). The header notes explain each column; fixed values come from drop-down lists.
3. Upload the file back under the same name ("Add file → Upload files") and commit.
4. The check reports any errors (Actions tab); otherwise the site updates itself.

### Contributing

Report a new or changed act, or a wrong mapping, through an issue, or propose a change through a pull request. The maintenance procedure is in [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md), with a short version in [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Provenance

The source list, the Ukrainian SP 800-53 baseline profiles and the baseline-measure mapping to CSF 2.0 come from [grc-one-stop-shop-ua](https://github.com/Ivan-Gokin/grc-one-stop-shop-ua); the extended register (descriptions, tags, chains, EU acts) was added in October 2026. The mappings for eight NBU resolutions (to ISO/IEC 27001) and Law No. 80/94-VR (to NIST CSF 2.0) were generated by AI and have not yet been proofread: the site and the workbooks mark them "AI, not reviewed". [`CHANGELOG.md`](CHANGELOG.md) records how the data came in.

### Licences

Code: MIT ([`LICENSE`](LICENSE)). Data: CC BY 4.0 ([`LICENSE-DATA.md`](LICENSE-DATA.md)). ISO/IEC 27001 control texts are not reproduced; only identifiers and the project's own short labels are used.

### Contact

[Ivan Gokin](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/)
