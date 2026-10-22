# Methodology

<p class="chapter-lead">How the register and the mappings are built, how they are updated and checked, which tools the project uses and how to build a similar one. This is enough to trace where any conclusion on the site comes from, to check it, or to repeat the approach for another sector or country.</p>

<div id="method-version"></div>

## How the project is built

The project's logic can be traced from the primary source to every row on the site:

1. **Register of acts.** Every act has a description, legal status, the date it was last checked against the official text, a link to that text and "who it applies to" tags.
2. **Requirements.** Every act is broken down into provisions (article, paragraph) with a short summary.
3. **Mappings.** Every provision is linked to controls of a standard, with a relationship and a review status.
4. **Checks and publishing.** After every change the data is checked for errors automatically, and the site and the downloads are rebuilt.

The main value is the data; the site only presents it. The rules it is built by follow.

## Base standards

The basis is the standards Ukrainian regulators rely on: **ISO/IEC 27001:2022** and **NIST CSF 2.0** for the organisation's management system, and **NIST SP 800-53 Rev. 5** for information systems. How to choose between the first two: [Craft your baseline, step 4](#/craft?step=4).

NIST standards are not one document but a family of different types. The most common mistake is confusing a management framework with a control catalogue:

| NIST document | What it is | Ukrainian counterpart |
|---|---|---|
| **<span class="nw">NIST CSF 2.0</span>** | A framework: which processes the organisation must have. The language of the security lead and management | Baseline cyber protection measures (SSSCIP Order No. 75 of 30.01.2026) |
| **<span class="nw">NIST SP 800-53</span>** | A catalogue of 1,000+ controls for information systems. The language of architects and administrators | ND TZI 3.6-006-24 |
| **<span class="nw">NIST SP 800-53A</span>** | How to assess implemented controls | SSSCIP Order No. 354 of 10.07.2024 |
| **<span class="nw">NIST SP 800-53B</span>** | Control baselines | Baseline security profiles (SSSCIP Orders No. 409 of 30.06.2025, No. 419 of 02.07.2025, No. 843 of 17.12.2025) |
| **<span class="nw">NIST SP 800-61</span>** | Incident response methodology | First SSSCIP Order No. 570 of 03.07.2023 (an adaptation of NIST SP 800-61 Rev. 2), now a national approach: CMU Resolution No. 1533 of 26.11.2025 and SSSCIP Order No. 143 of 18.02.2026 |

The whole architecture resembles the US FISMA, which obliges federal agencies to build security on NIST standards. Security authorisation against profiles plays the role of the authority to operate (ATO), the procedure for assessing the state of cyber protection that of continuous monitoring, and the requirement to have a head of cyber protection in every public authority mirrors FISMA's CISO requirement. How these documents connect is shown by the [key chains](#/sources?scope=core&mode=chains#chain-isms-baseline); more on how NIST standards were adapted is in the author's article ["We have FISMA at home"](https://www.linkedin.com/pulse/%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%BD%D1%96%D0%B7%D0%B0%D1%86%D1%96%D1%8F-%D0%BA%D1%81%D0%B7%D1%96-%D1%87%D0%B8-%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%B8-nist-ivan-gokin-beh7f) (in Ukrainian).

These standards do not exclude others. Mappings are tied to specific provisions of acts, so they can be carried over to any other standard (ISO 22301, ISO/IEC 27701, CIS Controls) through published crosswalks between standards.

## How requirements are mapped to controls

The method is **Set Theory Relationship Mapping (STRM)** from [NIST IR 8477](https://csrc.nist.gov/pubs/ir/8477/final), "Mapping Relationships Between Documentary Standards, Regulations, Frameworks, and Guidelines" (2024). NIST uses the same approach in its OLIR programme.

**The unit of mapping** is a provision of an act (article, part, paragraph), not the whole act. A row reads: "provision [relationship] control".

This is what one such mapping looks like:

<div id="mapping-example"></div>

| Relationship | Meaning | Coverage |
|---|---|---|
| **=** equal | The provision and the control are the same | full |
| **⊂** subset of | The provision is narrower: the control fully covers it | full |
| **⊃** superset of | The provision is broader than the control | partial |
| **∩** intersects with | They overlap, each has something of its own | partial |
| **∅** no relationship | Checked, no relationship | — |

Each mapping also carries:

- **rationale:** what the conclusion about the relationship rests on: the meaning of the requirements (semantic), matching wording (syntactic) or the same outcome (functional);
- **legal parameter:** a value the act sets instead of the organisation;
- **where it belongs:** the internal document the requirement should live in;
- **review status** (see "Data quality" below).

## Kinds of requirements

| Kind | Examples | Binding force and nuances |
|---|---|---|
| **International treaties and EU law** | Convention on Cybercrime, Convention 108, EU-Ukraine Association Agreement, Security Agreement with NATO; EU acts: NIS2, DORA, GDPR | Ratified treaties are part of Ukrainian legislation (Art. 9 of the Constitution). EU law is for reference only, on a separate tab |
| **Laws of Ukraine** | "On the Basic Principles of Ensuring Cybersecurity of Ukraine", "On Information Protection in Information and Communication Systems", "On Personal Data Protection" | Set the framework and delegate details to secondary legislation. Rarely contain specific controls themselves |
| **Sector requirements: finance** | NBU Board resolutions on information security, cyber protection, risk management, cloud services | The NBU adopts them under the Law "On the National Bank of Ukraine". They bind banks and other NBU-supervised institutions and often go down to deadlines and thresholds |
| **Sector requirements: public sector and CI** | Cabinet of Ministers resolutions (general cyber protection requirements for CI objects, minimum requirements for information protection in ICS), SSSCIP orders | See below on registration with the Ministry of Justice |
| **Baseline measures and the cyber protection plan** (organisation level) | SSSCIP Order No. 75 of 30.01.2026: baseline cyber protection measures based on NIST CSF 2.0 and the cyber protection plan form | The mandatory minimum set of measures for the object's category; the organisation puts them into its cyber protection plan together with its other measures |
| **Baseline security profiles** (information system level) | SSSCIP Orders No. 409 of 30.06.2025, No. 419 of 02.07.2025, No. 843 of 17.12.2025 based on NIST SP 800-53 | The minimum set of controls with parameters for the kind of information in the system |
| **Military standards and NATO policies** | Ministry of Defence military standards (VST), AC/35 directives on protecting NATO information | Binding for the Defence Forces, the defence industry and anyone handling NATO information. Some documents are restricted: they are in the register for completeness, but without mappings |

### What "registered with the Ministry of Justice" means

Regulatory acts of ministries and other central executive bodies, including SSSCIP orders, go through state registration with the Ministry of Justice (Art. 117 of the Constitution) if they:

- affect the rights, freedoms and legitimate interests of citizens or legal entities;
- establish a mechanism for exercising them;
- or are inter-agency in nature.

The Ministry checks such an act for compliance with legislation. The act takes effect only after registration and official publication. An act that should have been registered but was not is deemed not to have taken effect and has no legal consequences.

For the reader this means:

- **a registered order** binds those it concerns; its text carries the note "Registered with the Ministry of Justice of Ukraine … under No. …";
- **recommendations, clarifications and methodological documents** are not registered because they contain no binding rules. The register marks them as recommended, and a filter can hide them;
- **technical regulatory documents** (ND TZI, DSTU) are not registered as regulatory acts either. They become binding through the act that refers to them, and this shows in the chains.

## Chains of acts and deduplication

Ukrainian requirements sit on several levels: a law instructs the Cabinet of Ministers, the Cabinet instructs the SSSCIP. Mapping each level separately would count one requirement three times. So:

- **Links between acts use the ELI vocabulary.** The [European Legislation Identifier](https://eur-lex.europa.eu/eli-register/about.html) is the EU standard for identifying legislation. These links are used:
  - **based on** (based_on): a Cabinet resolution based on a law, an order based on a resolution;
  - **amends** (amends);
  - **repeals** (repeals);
  - **transposes** (transposes) an EU directive;
  - **applies** (applies) an EU regulation;
  - **ensures implementation of** (ensures_implementation_of) a treaty or strategy.
- **The most specific document is mapped**, and the chain shows its legal basis. A provision that only instructs someone to develop a procedure is marked as "delegating" and is not mapped.
- **Changes show at once.** When an act is amended or repealed, the chain shows which acts and controls it affects. Repealed acts are hidden, not deleted, to keep the history.
- **Every act has a permanent identifier.** For EU acts it is the official ELI. For Ukrainian acts it is an identifier following the ELI pattern (for example, `eli/ua/vru/law/2017/2163-viii`), because Ukraine has no official ELI yet. The chains are available to software as JSON-LD.

The key chains in [Legal sources](#/sources?scope=core&mode=chains#chain-isms-baseline) show best how to read chains: how a law leads to the baseline ISMS measures, and how the requirements for information systems themselves are set. Each step there says what exactly it requires.

## How the data is updated and checked

- **Primary sources.** The texts of acts come from official sources: zakon.rada.gov.ua, cip.gov.ua (SSSCIP), bank.gov.ua (NBU), EUR-Lex. Every act has a link to its text and the date it was last checked against the official version.
- **One change, one pull request.** A new act, a status change, new provisions or mappings go in as separate changes to the repository, so the history of every row is visible on GitHub.
- **Automatic checks.** After every change a script checks the data: required fields, identifiers, links between acts, provisions and controls, allowed values. If there is an error, the site is not updated.
- **Review status.** "Who it applies to" tags and mappings go from "AI, not read" to "draft" to "reviewed". "Reviewed" is set by a second person, not by the author of the mapping. Anything not reviewed is marked on the site and in every file.
- **Versions.** Every data release has a version number and a date; what changed is in the [changelog](https://github.com/Ivan-Gokin/grc-foundation-ua/blob/main/CHANGELOG.md).
- **Changes in legislation.** Amended and repealed acts are not deleted: their status is updated and the chains show what it affects. How to report errors and new acts is in [About](#/about).

## Use of AI

The project uses artificial intelligence: to prepare data (including a first pass of the mappings), texts and the site's code. Mappings generated by AI are marked "AI, not read" until a person has checked them against the text of the act; the site warns about them above the table and in the files.

## Tools and how to build a similar project

The project is deliberately built with simple means, so that it is easy to check and to repeat:

| What | With what |
|---|---|
| Data | CSV files (UTF-8) in the repository; mappings are edited in Excel |
| Checks and builds | Python scripts: data checks, building the site, the Excel file and ELI metadata (JSON-LD) |
| Publishing | GitHub Actions builds the site after every change, GitHub Pages hosts it |
| Site | A static page without frameworks; the libraries PapaParse (CSV), marked (texts), SheetJS (Excel) |
| Data standards | NIST IR 8477 (relationships between requirements), the ELI vocabulary (links between acts), the official NIST mapping from NIST CSF 2.0 to NIST SP 800-53 |

To build the same kind of reference for another sector or country:

1. **Build a register of sources** with permanent identifiers, legal status and a check date.
2. **Break the acts down into provisions**: articles and paragraphs with a short summary.
3. **Choose a standard and map the provisions** to its controls following NIST IR 8477, with a review status on every row.
4. **Describe the links between acts** (based on, amends, repeals), so one requirement is not counted several times.
5. **Automate checks and builds**: the data should be checked on every change, and the site and files built from it rather than edited by hand.
6. **Agree on the process**: who makes changes, who reviews them, how errors are reported.

The technical description for maintainers:

<div id="method-links"></div>

## Open data and import into GRC systems

<div id="method-data"></div>

### Import into GRC systems

The project's data can be turned into formats that GRC systems load. There is no such export yet: we will build it if users need it, so let us know (contacts in [About](#/about)).

- **CISO Assistant (YAML libraries).** Each group of acts becomes a framework and each provision a requirement with a permanent identifier. Separate mapping sets link them to the ISO/IEC 27001:2022, NIST CSF 2.0 and NIST SP 800-53 frameworks built into CISO Assistant; NIST IR 8477 relationships carry over almost unchanged. An ISO/IEC 27001 assessment then pre-fills the assessment of the Ukrainian acts.
- **OSCAL.** NIST's open format for control catalogues, profiles with parameters and implementation state. Various GRC tools read it, so it is the option for other systems.

What cannot be carried over: the Statement of Applicability itself, that is your decisions (applicable or not, justification, status, evidence). They are the result of your assessment, which is created in the GRC system; the imported libraries supply its requirements and legal basis.
