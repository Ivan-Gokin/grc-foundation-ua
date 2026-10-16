# About

<p class="chapter-lead">GRC foundation is an open reference of cybersecurity requirements for organisations operating in Ukraine. It answers three questions: which acts apply to me, what exactly they require, and which controls of a standard meet those requirements. It is a foundation for an integrated management system and for further GRC automation.</p>

<div id="about-version"></div>

## Open source and open data

The project is fully open:

- **code** is under the MIT licence;
- **data** is under CC BY 4.0: you may use, change and share it, including in commercial products, as long as you credit the source.

The texts of ISO standards are not reproduced: only identifiers and our own short names.

## How it is built

The project's logic can be traced from the primary source to every row on the site. Its main value is the data: the register of acts, requirements broken down by provision, and mappings to controls. Everything else just presents them.

| Part | Where | What it does |
|---|---|---|
| Register of acts, chains, kinds of entities, control catalogues | `data/*.csv` | The core data, edited as tables |
| Requirements of acts and mappings | `mappings/*.xlsx` | One Excel workbook per group of acts: a "Вимоги" (requirements) sheet and one sheet per standard |
| Validation | `scripts/validate.py` | Catches errors: unknown acts and controls, invalid values, duplicates |
| Build | `scripts/build.py` | Builds the site and generates the downloads: CSV, JSON-LD (ELI), a combined Excel workbook |
| Site | `index.html`, `assets/`, `content/` | A static page: all filters and exports run in the browser, nothing is sent anywhere |
| Publishing | `.github/workflows/site.yml` | After every change, GitHub Actions validates the data, builds the site and publishes it |

How the data itself is built is described in the [Methodology](#/method). The full data model and maintenance rules are in the project blueprint:

<div id="about-links"></div>

## Data

<div id="about-data"></div>

## Plans

<div id="about-plans"></div>

## Feedback and cooperation

This is a non-commercial open source project, and it relies on feedback. The most helpful things are:

- errors in mappings and in which acts apply to whom;
- new and amended acts that are not in the register yet;
- what is missing for your work.

Report them through [GitHub Issues](https://github.com/Ivan-Gokin/grc-foundation-ua/issues) or propose changes with a pull request.

For cooperation, use in your organisation or in training, contact the author: **Ivan Gokin** — [LinkedIn](https://www.linkedin.com/in/ivan-gokin-2ba0a4136/), [GitHub](https://github.com/Ivan-Gokin).

## Disclaimer

This is a reference tool, not legal advice. Applicability and mappings are the authors' opinion. Check conclusions against the official texts.
