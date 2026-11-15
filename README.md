# Кресленик відповідності СУІБ / Compliant ISMS Kreslenyk

«Кресленик» — українською «креслення, blueprint». До листопада 2026 року проєкт називався «GRC-фундамент для України». / *Kreslenyk* is Ukrainian for "blueprint". Until November 2026 the project was called "GRC foundation for Ukraine".

[Українською](#українською) | [English](#english)

## Українською

Відкритий довідник вимог кібербезпеки для організацій, що працюють в Україні: які акти до вас застосовні, що саме вони вимагають і якими заходами ISO/IEC 27001, NIST CSF 2.0 чи NIST SP 800-53 це виконати. Мета — основа для інтегрованої СУІБ, GRC у [розумінні OCEG](https://www.oceg.org/about/what-is-grc/): одна система заходів, у якій зведено й вимоги законодавства, замість окремого проєкту відповідності під кожен акт.

**Сайт:** https://ivan-gokin.github.io/grc-foundation-ua/. Що він дає і для кого — на головній сторінці; як побудовано дані — у розділі «Методика»; завантаження даних (Excel, CSV, JSON-LD) і плани — у розділі «Про проєкт».

Цей файл для тих, хто супроводжує репозиторій.

### Супровід

- **Що де лежить і як влаштовано дані:** [`docs/BLUEPRINT.uk.md`](docs/BLUEPRINT.uk.md).
- **Як відтворити проєкт для іншої країни** (технічне рішення, розгортання, стандарти й нотації, робота з Claude, рецензування, інтеграція з GRC-системами): [`docs/REUSE.md`](docs/REUSE.md), англійською; інструменти рецензування — [`tools/review/`](tools/review/README.md).
- **Як внести зміни** (зіставлення в Excel, решта даних у CSV, перевірка й локальне збирання): [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Публікація.** Кожна зміна в `main` перевіряється і публікується на GitHub Pages автоматично (`.github/workflows/site.yml`, джерело Pages: GitHub Actions); pull request лише перевіряється. Зібраний сайт зберігається з кожним запуском: Actions → запуск → Artifacts → `site`.
- **Попередній режим.** Поки дані вичитуються, сайт закрито від пошукових систем (`<meta name="robots" content="noindex">` в `index.html`) і на кожній сторінці є банер. Коли дані буде перевірено, видаліть цей рядок з `index.html` і поставте `preview: false` в `assets/js/config.js`.
- **Історія даних**, зокрема звідки вони походять і які зіставлення згенерував ШІ: [`CHANGELOG.md`](CHANGELOG.md).

### Ліцензія

Увесь проєкт — дані, тексти і код — під ліцензією [CC BY 4.0](LICENSE): його можна використовувати, змінювати і поширювати, зокрема комерційно, якщо вказати джерело: «Кресленик відповідності СУІБ, версія даних <версія>, https://ivan-gokin.github.io/grc-foundation-ua/».

Сторонні матеріали зберігають власний статус:

- тексти офіційних документів України не є об'єктами авторського права;
- тексти NIST CSF 2.0, SP 800-53 і відповідність CSF 2.0 до SP 800-53 — роботи уряду США;
- український текст CSF 2.0 взято з наказу Держспецзв'язку № 75 від 30.01.2026;
- ISO/IEC 27001 не відтворюється: лише ідентифікатори заходів і власні короткі назви;
- назви політик і стандартів у `data/policies.csv` і їх зіставлення з CSF 2.0 у `data/csf_policies.csv` взято з CIS/MS-ISAC NIST Cybersecurity Framework Policy Template Guide (2024); самі шаблони не відтворюються, і за умовами CIS їх не можна використовувати з метою отримання прибутку;
- бібліотеки в `assets/vendor/` і шрифти в `assets/fonts/` мають власні ліцензії (MIT, Apache 2.0, SIL OFL): див. заголовки файлів бібліотек і файли `OFL-*.txt`.

Це довідковий інструмент, а не юридична консультація.

### Контакти

Іван Гокін: [LinkedIn](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/), [GitHub](https://github.com/Ivan-Gokin). Помилки й нові акти: [Issues](https://github.com/Ivan-Gokin/grc-foundation-ua/issues).

## English

An open reference of cybersecurity requirements for organisations operating in Ukraine: which acts apply to you, what exactly they require, and which ISO/IEC 27001, NIST CSF 2.0 or NIST SP 800-53 controls meet them. The aim is a foundation for an integrated ISMS, GRC as [OCEG defines it](https://www.oceg.org/about/what-is-grc/): one set of controls that also carries the legal requirements, instead of a separate compliance project for each act.

**Site:** https://ivan-gokin.github.io/grc-foundation-ua/. What it offers and for whom is on the home page; how the data is built is in "Methodology"; data downloads (Excel, CSV, JSON-LD) and plans are in "About".

This file is for those who maintain the repository.

### Maintenance

- **What is where and how the data is modelled:** [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md).
- **How to build the same for another country** (technical solution, deployment, standards and notations, working with Claude, the review method, GRC integration): [`docs/REUSE.md`](docs/REUSE.md); review tooling in [`tools/review/`](tools/review/README.md).
- **How to make changes** (mappings in Excel, other data in CSV, checks and a local build): [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Publishing.** Every change to `main` is checked and published to GitHub Pages automatically (`.github/workflows/site.yml`, Pages source: GitHub Actions); pull requests are only checked. The built site is kept with every run: Actions → the run → Artifacts → `site`.
- **Preview mode.** While the data is being reviewed, the site is closed to search engines (`<meta name="robots" content="noindex">` in `index.html`) and every page shows a banner. When the data is reviewed, delete that line from `index.html` and set `preview: false` in `assets/js/config.js`.
- **Data history**, including where the data came from and which mappings were generated by AI: [`CHANGELOG.md`](CHANGELOG.md).

### Licence

The whole project — data, texts and code — is under [CC BY 4.0](LICENSE): you may use, change and share it, including commercially, as long as you credit the source: "Compliant ISMS Kreslenyk, data version <version>, https://ivan-gokin.github.io/grc-foundation-ua/".

Third-party material keeps its own status:

- texts of Ukrainian official documents are not subject to copyright;
- NIST CSF 2.0, SP 800-53 and the CSF 2.0 to SP 800-53 mapping are works of the US government;
- the Ukrainian CSF 2.0 text comes from SSSCIP Order No. 75 of 30.01.2026;
- ISO/IEC 27001 is not reproduced: only control identifiers and the project's own short labels;
- the policy and standard names in `data/policies.csv` and their correlation with CSF 2.0 in `data/csf_policies.csv` come from the CIS/MS-ISAC NIST Cybersecurity Framework Policy Template Guide (2024); the templates themselves are not reproduced, and CIS's terms say they are not to be used for profit;
- the libraries in `assets/vendor/` and the fonts in `assets/fonts/` have their own licences (MIT, Apache 2.0, SIL OFL): see the library file headers and the `OFL-*.txt` files.

This is a reference tool, not legal advice.

### Contact

Ivan Gokin: [LinkedIn](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/), [GitHub](https://github.com/Ivan-Gokin). Errors and new acts: [Issues](https://github.com/Ivan-Gokin/grc-foundation-ua/issues).
