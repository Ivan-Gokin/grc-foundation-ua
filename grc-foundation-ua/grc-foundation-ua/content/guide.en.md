## The path to GRC engineering

GRC engineering turns requirements, controls and evidence into data and code: secure configurations, automated checks on assets, continuous control monitoring. But you can only automate what has already been defined. Without an integrated management system and an exhaustive, consistent set of requirements, automation only speeds up the chaos: checks end up incomplete, duplicated or contradicting each other.

That is why the path has three stages, each built on the one before:

1. **Establish governance.** Understand the context, collect every applicable requirement, bring them under one ISMS framework and build them into a management system.
2. **Automate compliance.** Apply the integrated requirements to systems and assets: secure configurations, automated checks, evidence collection.
3. **Focus on risk.** Once routine compliance is handled automatically, spend the effort on what actually threatens the organisation.

The first stage is a prerequisite for the other two, so it is described in the most detail. Each step has a working tool on this site.

> An integrated management system combines several standards that share the same harmonised structure: ISO 9001 (quality), ISO/IEC 27001 (information security), ISO 22301 (continuity), ISO/IEC 27701 (privacy), ISO/IEC 42001 (AI) and others. This guide covers the information security management system (ISMS). The other systems can be built on the same foundation.

## Stage 1. Establish governance

Outcome: an integrated set of requirements (laws, orders, standards and contractual obligations brought under one framework) and a management system that maintains it.

### Step 1. Organisational context

*ISO/IEC 27001:2022, clauses 4.1-4.3; NIST CSF 2.0, category GV.OC*

Goal: understand what the organisation does, what it depends on and who it answers to, before choosing any controls. Without this the system is built "for the standard" rather than for the organisation, and soon turns into documents nobody follows.

**Mission and critical services.** Which services or functions matter most to customers, citizens or the state? What happens if they stop for an hour, a day, a week? The answers set the priorities for every later step (GV.OC-01, GV.OC-04).

**Legal status.** It decides which part of the legislation is core for you. Find your row: the links open the legal sources and the controls table with the right filter applied.

| If you are... | Legislation | Controls |
|---|---|---|
| A critical infrastructure operator | [legal sources](#/sources?scope=core&s=ki) | [controls](#/controls?s=ki) |
| An owner or manager of a CII facility | [legal sources](#/sources?scope=core&s=kii) | [controls](#/controls?s=kii) |
| A public authority or state-owned enterprise | [legal sources](#/sources?scope=core&s=public-sector) | [controls](#/controls?s=public-sector) |
| An owner of a system with state information resources or "for official use" information | [legal sources](#/sources?scope=core&s=state-ir) | [controls](#/controls?s=state-ir) |
| A bank or another institution supervised by the NBU | [legal sources](#/sources?scope=core&s=finance) | [controls](#/controls?s=finance) |
| Defence Forces, defence industry, or you handle NATO information | [legal sources](#/sources?scope=core&s=defence,defence-industry,nato-info) | [controls](#/controls?s=defence,defence-industry,nato-info) |
| A telecom operator | [legal sources](#/sources?scope=core&s=telecom) | [controls](#/controls?s=telecom) |
| A trust service or electronic identification provider | [legal sources](#/sources?scope=core&s=trust) | [controls](#/controls?s=trust) |
| An ICT or cybersecurity service supplier to such organisations | [legal sources](#/sources?scope=core&s=ict-suppliers,security-services) | [controls](#/controls?s=ict-suppliers,security-services) |
| Any other organisation | [legal sources](#/sources?scope=core&s=personal-data) | [controls](#/controls?s=personal-data) |

**Interested parties and their requirements.** Who has the right or a reason to require something from you in information security: regulators, owners, customers, partners, suppliers, employees, insurers? For each, record what they expect and where the requirement comes from (GV.OC-02, GV.OC-03).

| Interested party | What they expect | Source of the requirement | How we address it |
|---|---|---|---|
| Regulator (e.g. SSSCIP) | Compliance with cyber protection requirements | Law, order | Through the requirements register, step 2 |
| Key customer | Protection of their data, incident notification | Contract, security annex | Contract requirements added to the register |
| Employees | Protection of personal data | Law "On Personal Data Protection" | Personal data processing policy |

**Dependencies.** What does the organisation depend on: IT outsourcing, cloud providers, software, telecom and energy suppliers? Which of these are critical for the services above (GV.OC-05)?

**Internal factors.** Structure, culture, resources, existing management systems (quality, continuity, privacy). In step 5 the ISMS is integrated with them rather than built separately. Amendment 1:2024 to ISO/IEC 27001:2022 also requires you to decide whether climate change is a relevant issue; a reasoned "yes" or "no" is enough.

**Scope of the management system** (clause 4.3): which units, processes, systems and locations are in or out, and why. The scope must cover the critical services and everything they depend on.

Output: a context description (1-3 pages), a list of interested parties and their requirements, an ISMS scope with rationale.

Common mistakes: the context is copied from a template; only laws are considered and contractual requirements are missed; the context is described once and never reviewed.

### Step 2. Applicable requirements

*ISO/IEC 27001:2022, clause 4.2 and control A.5.31; NIST CSF 2.0, GV.OC-03*

Goal: build your own list of requirements the organisation must meet or has chosen to meet, and give each an owner.

In Ukraine, cybersecurity requirements are spread across documents at different levels: international agreements, laws and decrees, Cabinet of Ministers resolutions, orders of the SSSCIP (the State Service of Special Communications and Information Protection) and NBU resolutions, technical information protection documents (ND TZI), national (DSTU) and military (VST) standards, NATO policies.

1. Open the [legal sources](#/sources), choose who the requirements should concern and download the filtered list as CSV or Excel. It is the basis of your requirements register.
2. Mark each act's applicability: yes, no or unknown; for "unknown", note who should clarify it.
3. For acts marked "yes", look at the **chains** (the "Chains" tab): resolutions and orders issued under a law usually contain more specific requirements than the law itself. Map the most specific document and use the chain as the legal basis, so one requirement is not counted several times.
4. Add what a public register cannot contain: customer contracts, parent company requirements, internal decisions, voluntarily adopted standards.

How to decide whether a document applies to you:

- **binding directly:** it names your category (CI operators, banks, public authorities);
- **binding through a contract:** for example, your customer is a bank and the NBU's requirements for suppliers are passed on to you by contract;
- **not in force yet:** draft laws and unratified treaties are hidden by default; watch them, but do not build the system on them;
- **in force in the EU:** EU law has its own "Reference" tab. It does not apply directly to organisations operating only in Ukraine, but it shows where Ukrainian law is heading;
- **repealed:** such acts are hidden; check that your documents no longer refer to them.

Output: a register of applicable requirements with owners and sources. It is evidence for ISO/IEC 27001 control A.5.31 and NIST CSF outcome GV.OC-03.

Common mistakes: a register without owners; missed contractual requirements; no review after legislative changes.

### Step 3. ISMS framework

The ISMS framework is the standard whose terms you use to describe your controls. The site supports two.

**ISO/IEC 27001:2022.** A certifiable management system standard. Clauses 4-10 describe the system itself; Annex A lists 93 controls. The key document is the Statement of Applicability (SoA): every control with a decision on whether it applies and why. Choose it if you need certification or partners ask for it.

**NIST CSF 2.0.** A set of outcomes in six functions: Govern, Identify, Protect, Detect, Respond, Recover. Work is organised through current and target profiles. The SSSCIP baseline cybersecurity measures (Order No. 75 of 30.01.2026) are an adapted translation of CSF 2.0, so for CI operators and the public sector CSF matches the regulator's language.

The frameworks are not exclusive: you can certify against ISO/IEC 27001 and report a CSF profile to the regulator. Pick one as the main structure and connect the other through mappings.

### Step 4. Mapping and the Statement of Applicability

*ISO/IEC 27001:2022, clause 6.1.3; NIST CSF 2.0, organisational profiles*

In the [Controls](#/controls) view, each provision of an act (article, paragraph) is mapped to controls of the chosen framework. Mappings use the set-theory relationship model from NIST IR 8477: the symbol shows how the provision relates to the control.

<div id="legend"></div>

Each mapping carries a coverage mark:

- **full:** implementing the control satisfies the provision;
- **partial:** the control helps, but the law asks for more. These are the gaps most often missed when relying on a standard alone.

Some acts set values that a standard leaves to the organisation: log retention, training frequency, incident reporting deadlines. They appear in the "Legal parameter" column. Your organisation's value can be stricter, but not weaker; if acts set different values, the strictest applies.

The result downloads as a draft Statement of Applicability (ISO/IEC 27001) or Target Profile (CSF 2.0), with blank columns for your work:

| Column | What to fill in |
|---|---|
| Applicable | yes or no; for "no", the justification |
| Organisation-defined value | your period, frequency, threshold (not weaker than the legal parameter) |
| Policy / procedure reference | the document and section where the control is described |
| Owner | a role or a unit |
| Implementation status | implemented, partial, planned |
| Evidence | what shows an auditor the control works |

Most mappings were generated by AI and have not yet been read by a person: the table and the file mark them "AI, not reviewed". The other drafts are waiting for a second person's review. Check every mapping against the text of the act before you put it into your SoA.

Below the table is a list of **requirements with no counterpart** in the framework: provisions that no control covers (reporting to the regulator, corporate governance, contract terms and so on). They need their own clauses in your documents; each comes with a suggestion of where it belongs.

Common mistakes: "yes" everywhere without evidence; the regulator's minimum treated as the maximum, ignoring the organisation's own risks; the gap list never turned into a plan with deadlines and budget.

### Step 5. Integrated management system

*ISO/IEC 27001:2022, clauses 5-10; harmonised structure of ISO management system standards; NIST CSF 2.0, GOVERN function*

Goal: build the requirements and controls into normal processes, so the system works every day and not only before an inspection. ISO management system standards share the same clauses 4-10, so they can be run as one system.

| Element | ISO clause | What to integrate |
|---|---|---|
| Context and scope | 4 | One context description for all systems (step 1) |
| Leadership and policy | 5 | One top-level policy, roles and authorities |
| Risks and opportunities | 6 | One risk assessment method with different impact categories |
| Documented information | 7.5 | One set of rules for creating, approving and reviewing documents |
| Competence and awareness | 7.2-7.3 | One training programme |
| Internal audit | 9.2 | One audit plan covering all requirements |
| Management review | 9.3 | One meeting, one record |
| Nonconformity and improvement | 10 | One corrective action log |

Ukrainian records management requirements (including DSTU 4163:2020) are in the [legal sources](#/sources?scope=core&records=1): turn on "records management requirements". For public authorities and state-owned enterprises they are the basis of document control (clause 7.5).

Start with the document pyramid: top-level policy, topic-specific policies, procedures, instructions, records. How to write policies that are followed: [ISMS policy examples and templates](#/articles?a=isms-policy-case-studies). Every requirement in the register and every control needs an owner.

Output: policies and procedures linked to the Statement of Applicability or target profile; a responsibility matrix; an internal audit plan and a management review schedule.

Common mistakes: separate sets of documents for each standard and regulator that contradict each other; policies not communicated to staff and not audited; templates used without adaptation.

## Stage 2. Automate compliance

Outcome: requirements are applied to systems and assets as secure configurations and automated checks, and evidence is collected without manual work.

### System level

The management system says what the organisation commits to. Each information system then needs specific technical and organisational controls with their parameters set. Ukrainian system-level requirements, including the SSSCIP baseline security profiles for open, official and NATO information, are built on NIST SP 800-53.

The [System level](#/system) view shows this step: from CSF 2.0 subcategories with legal drivers, through the official NIST mapping, to the SP 800-53 controls in the baseline for your type of information, with parameter values. It is a preview: expanding through the mapping over-selects, so treat the result as candidates to tailor.

### Tools and machine-readable data

The tables from this project are fine for getting started. It is time for a GRC system when one requirement lives in several files, preparing for an audit takes weeks, and you cannot tell which requirements are affected if a control stops working. How to choose: [GRC systems overview](#/articles?a=grc-systems-overview).

Once the register and the mappings exist as data:

- **legal changes** become data changes, showing which controls and policies a new version of an act affects;
- **controls connect to evidence:** each SoA row can be linked to an evidence source (logs, scanner reports, ticket records) and checked automatically;
- **system profiles become machine-readable:** OSCAL describes a control catalogue, a profile with parameters and the implementation state in a form tools can read.

All project data is open: the [Data](#/data) view offers one Excel workbook for reading, and CSV and JSON-LD files for software.

## Stage 3. Focus on risk

Outcome: routine compliance is maintained automatically, and decisions are driven by risk. Cybersecurity legislation in Ukraine changes several times a year, and so does the organisation, so the system needs regular review.

| Event | What to review |
|---|---|
| A new or changed act | Applicability (step 2), Statement of Applicability or profile (step 4), affected policies |
| Organisational changes: new services, restructuring, a new supplier | Context and scope (step 1) |
| A serious incident | Risks, profile, response procedures |
| Audit or regulator inspection results | Corrective actions |
| At least once a year | Everything, during management review (clause 9.3) |

To catch changes, watch the project repository on GitHub (Watch, then Custom, then Releases) and check the primary sources: zakon.rada.gov.ua and cip.gov.ua.

> Stages 2 and 3 are being expanded: material on secure configurations, automated checks and risk management is in preparation.

## Glossary

| Ukrainian | English | Meaning |
|---|---|---|
| СУІБ | ISMS | information security management system |
| Положення про застосовність | Statement of Applicability (SoA) | ISO/IEC 27001 controls with a decision and justification |
| цільовий профіль | Target Profile | the desired state of CSF 2.0 outcomes |
| ОКІ / ОКІІ | critical (information) infrastructure object | an object of critical (information) infrastructure |
| КСЗІ | KSZI | comprehensive information protection system with state expertise |
| ТЗІ | TZI | technical information protection |
| параметр, визначений організацією | organisation-defined parameter (ODP) | a value the standard leaves to the organisation |

## Disclaimer

This is a reference tool, not legal advice. Applicability and mappings are the authors' opinion. Check conclusions against the official texts linked in the legal sources.
