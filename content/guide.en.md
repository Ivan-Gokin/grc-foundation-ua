## The path to GRC engineering

GRC engineering turns requirements, controls and evidence into data and code: secure configurations, automated checks, continuous control monitoring.

But you can only automate what has already been defined. Without an integrated management system and a complete, consistent set of requirements, automation only speeds up the chaos: checks end up incomplete, duplicated or contradicting each other.

That is why the path has three stages, each built on the one before:

| Stage | What we do | What we get |
|---|---|---|
| **1. Establish governance** | Understand the context, collect every applicable requirement, bring them under one framework and build them into a management system | A requirements register, a Statement of Applicability, a working ISMS |
| **2. Automate compliance** | Apply the requirements to systems and assets | Secure configurations, automated checks, evidence without manual work |
| **3. Focus on risk** | Routine is handled automatically; effort goes to real threats | Risk-based decisions, regular review |

The first stage is a prerequisite for the other two, so it is described in the most detail. Each step has a working tool on this site.

> An **integrated management system** combines several standards that share the same structure: ISO 9001 (quality), ISO/IEC 27001 (information security), ISO 22301 (continuity), ISO/IEC 27701 (privacy), ISO/IEC 42001 (AI) and others. This guide covers the information security management system (ISMS); the other systems can be built on the same foundation.

## Stage 1. Establish governance

Five steps, from understanding the organisation to a system that works every day. The outcome is an integrated set of requirements (laws, orders, standards and contracts brought under one framework) and a management system that maintains it.

### Step 1. Organisational context

*Covers: ISO/IEC 27001:2022, clauses 4.1-4.3 · NIST CSF 2.0, GV.OC*

**Goal.** Understand what the organisation does, what it depends on and who it answers to, before choosing any controls. Without this the system is built "for the standard" rather than for the organisation, and soon turns into documents nobody follows.

Answer six questions.

**1. Mission and critical services.** Which services or functions matter most to customers, citizens or the state? What happens if they stop for an hour, a day, a week? The answers set the priorities for every later step (GV.OC-01, GV.OC-04).

**2. Legal status.** It decides which part of the legislation is core for you. Find your row: the links open the legal sources and the controls table with the right filter applied.

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

**3. Interested parties and their requirements.** Who has the right or a reason to require something from you in information security: regulators, owners, customers, partners, suppliers, employees, insurers? For each, record what they expect and where the requirement comes from (GV.OC-02, GV.OC-03). For example:

| Interested party | What they expect | Source of the requirement | How we address it |
|---|---|---|---|
| Regulator (e.g. SSSCIP) | Compliance with cyber protection requirements | Law, order | Through the requirements register, step 2 |
| Key customer | Protection of their data, incident notification | Contract, security annex | Contract requirements added to the register |
| Employees | Protection of personal data | Law "On Personal Data Protection" | Personal data processing policy |

**4. Dependencies.** What does the organisation depend on: IT outsourcing, cloud providers, software, telecom and energy suppliers? Which of these are critical for the services in question 1 (GV.OC-05)?

**5. Internal factors.** Structure, culture, resources, existing management systems (quality, continuity, privacy). In step 5 the ISMS is integrated with them rather than built separately.

Amendment 1:2024 to ISO/IEC 27001:2022 also requires you to decide whether climate change is a relevant issue. A reasoned "yes" or "no" is enough.

**6. Scope of the management system** (clause 4.3). Which units, processes, systems and locations are in or out, and why. The scope must cover the critical services and everything they depend on.

**Result.** A context description of 1-3 pages, a list of interested parties and their requirements, an ISMS scope with rationale.

**Common mistakes**

- the context is copied from a template;
- only laws are considered and contractual requirements are missed;
- the context is described once and never reviewed.

### Step 2. Applicable requirements

*Covers: ISO/IEC 27001:2022, clause 4.2 and control A.5.31 · NIST CSF 2.0, GV.OC-03*

**Goal.** Build your own list of requirements the organisation must meet or has chosen to meet, and give each an owner.

In Ukraine, cybersecurity requirements are spread across documents at different levels: international agreements, laws and decrees, Cabinet of Ministers resolutions, orders of the SSSCIP (the State Service of Special Communications and Information Protection) and NBU resolutions, technical information protection documents (ND TZI), national (DSTU) and military (VST) standards, NATO policies. The [Legal sources](#/sources) view helps collect them.

1. **Download the list.** Choose who the requirements should concern and download the filtered list as CSV or Excel. It is the basis of your requirements register.
2. **Mark applicability.** For each act: yes, no or unknown. For "unknown", note who should clarify it.
3. **Follow the chains.** For acts marked "yes", open the "Chains" tab: resolutions and orders adopted under a law usually contain more specific requirements than the law itself. Map the most specific document and use the chain as the legal basis, so one requirement is not counted several times.
4. **Add your own.** What a public register cannot contain: customer contracts, parent company requirements, internal decisions, voluntarily adopted standards.

How to decide whether a document applies to you:

| Situation | What to do |
|---|---|
| It names your category (CI operators, banks, public authorities) | Applicable |
| Requirements reach you through a contract (e.g. your customer is a bank and the NBU's supplier requirements go into the contract) | Applicable through the contract |
| A draft law or an unratified treaty | Watch it, but do not build the system on it (hidden by default) |
| EU law (the "Reference" tab) | Not directly binding for organisations operating only in Ukraine, but shows where the law is heading |
| A repealed act (hidden by default) | Check that your documents no longer refer to it |

**Result.** A register of applicable requirements with owners and sources. It is evidence for ISO/IEC 27001 control A.5.31 and NIST CSF outcome GV.OC-03.

**Common mistakes**

- a register without owners;
- missed contractual requirements;
- no review after legislative changes.

### Step 3. Choosing the framework

**Goal.** Choose the standard whose terms you will use to describe your controls. The site supports two.

| | ISO/IEC 27001:2022 | NIST CSF 2.0 |
|---|---|---|
| What it is | A certifiable management system standard | A set of outcomes in six functions: Govern, Identify, Protect, Detect, Respond, Recover |
| Structure | Clauses 4-10 describe the system; Annex A lists 93 controls | Current and target profiles |
| Key document | Statement of Applicability (SoA) | Target profile |
| When to choose it | You need certification or partners ask for it | You are a CI operator or in the public sector: the SSSCIP baseline cyber protection measures (Order No. 75 of 30.01.2026) are an adapted translation of CSF 2.0, so CSF matches the regulator's language |

The frameworks are not exclusive: you can certify against ISO/IEC 27001 and report a CSF profile to the regulator. Pick one as the main structure and connect the other through mappings.

### Step 4. Mapping and the Statement of Applicability

*Covers: ISO/IEC 27001:2022, clause 6.1.3 · NIST CSF 2.0, organisational profiles*

**Goal.** See which controls of the chosen framework the law requires, and turn that into a draft SoA or target profile.

In the [Controls](#/controls) view, each provision of an act (article, paragraph) is mapped to controls of the framework. Mappings use the set-theory relationship model from NIST IR 8477: the symbol shows how the provision relates to the control.

<div id="legend"></div>

Each mapping carries a coverage mark:

- **full** - implementing the control satisfies the provision;
- **partial** - the control helps, but the law asks for more. These are the gaps most often missed when relying on a standard alone.

**Legal parameters.** Some acts set values that a standard leaves to the organisation: log retention, training frequency, incident reporting deadlines. Your value can be stricter, but not weaker. If acts set different values, the strictest applies.

**Requirements with no counterpart.** Below the table is a list of provisions that no control covers: reporting to the regulator, corporate governance, contract terms. They need their own clauses in your documents; each comes with a suggestion of where it belongs.

**What you download.** A draft Statement of Applicability (ISO/IEC 27001) or Target Profile (CSF 2.0), with blank columns for your work:

| Column | What to fill in |
|---|---|
| Applicable | yes or no; for "no", the justification |
| Organisation-defined value | your period, frequency, threshold (not weaker than the legal parameter) |
| Policy / procedure reference | the document and section where the control is described |
| Owner | a role or a unit |
| Implementation status | implemented, partial, planned |
| Evidence | what shows an auditor the control works |

> **Note.** Most mappings were generated by AI and have not yet been read by a person: the table and the file mark them "AI, not reviewed". Check every mapping against the text of the act before you put it into your SoA.

**Result.** A draft SoA or target profile with the legal drivers of each control, and a list of requirements the framework does not cover.

**Common mistakes**

- "yes" everywhere without evidence;
- the regulator's minimum treated as the maximum, ignoring the organisation's own risks;
- the gap list never turned into a plan with deadlines and budget.

### Step 5. Integrated management system

*Covers: ISO/IEC 27001:2022, clauses 5-10 · harmonised structure of ISO management system standards · NIST CSF 2.0, GOVERN function*

**Goal.** Build the requirements and controls into normal processes, so the system works every day and not only before an inspection.

ISO management system standards share the same clauses 4-10, so they can be run as one system:

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

**Where to start.** With the document pyramid: top-level policy, topic-specific policies, procedures, instructions, records. How to write policies that are followed: [ISMS policy examples and templates](#/articles?a=isms-policy-case-studies). Every requirement in the register and every control needs an owner.

**Records management.** Ukrainian records management requirements (including DSTU 4163:2020) are in the [legal sources](#/sources?scope=core&records=1) once you turn on "records management requirements". For public authorities and state-owned enterprises they are the basis of document control (clause 7.5).

**Result.** Policies and procedures linked to the Statement of Applicability or target profile; a responsibility matrix; an internal audit plan and a management review schedule.

**Common mistakes**

- separate sets of documents for each standard and regulator that contradict each other;
- policies not communicated to staff and not audited;
- templates used without adaptation.

## Stage 2. Automate compliance

Outcome: requirements are applied to systems and assets as secure configurations and automated checks, and evidence is collected without manual work.

### System level

The management system says what the organisation commits to. Each information system then needs specific technical and organisational controls with their parameters set. Ukrainian system-level requirements are built on NIST SP 800-53.

In the [Controls](#/controls?fw=sp800-53r5) view, pick "Information system → NIST SP 800-53". Each control shows where the requirement comes from:

| Source | What it is |
|---|---|
| **Baseline security profile** | The minimum set of controls for the kind of information in the system (open or confidential, official, NATO RESTRICTED), with parameter values |
| **Cyber protection plan** | The baseline cyber protection measures (SSSCIP Order No. 75/2026), mandatory depending on the object's category |
| **CSF and legislation** | The CSF 2.0 subcategories that other acts require |
| **Sector security profile** | Developed by sector regulators; none has been approved yet |

The interesting part is the controls outside the baseline profile, added by the plan or by legislation.

> This is a preview. The plan and legislation are expressed as CSF subcategories, and expanding them to SP 800-53 through the NIST mapping over-selects. Treat the result as candidates to tailor.

### Tools and machine-readable data

The tables from this project are fine for getting started. It is time for a GRC system when:

- one requirement lives in several files;
- preparing for an audit takes weeks;
- you cannot tell which requirements are affected if a control stops working.

How to choose: [GRC systems overview](#/articles?a=grc-systems-overview).

Once the register and the mappings exist as data:

- **legal changes** become data changes, showing which controls and policies a new version of an act affects;
- **controls connect to evidence:** each SoA row can be linked to an evidence source (logs, scanner reports, ticket records) and checked automatically;
- **system profiles become machine-readable:** OSCAL describes a control catalogue, a profile with parameters and the implementation state in a form tools can read.

All project data is open: the [About](#/about) view offers one Excel workbook for reading, and CSV and JSON-LD files for software.

## Stage 3. Focus on risk

Outcome: routine compliance is maintained automatically, and decisions are driven by risk.

Cybersecurity legislation in Ukraine changes several times a year, and so does the organisation, so the system needs regular review:

| Event | What to review |
|---|---|
| A new or changed act | Applicability (step 2), SoA or profile (step 4), affected policies |
| New services, restructuring, a new supplier | Context and scope (step 1) |
| A serious incident | Risks, profile, response procedures |
| Audit or regulator inspection results | Corrective actions |
| At least once a year | Everything, during management review (clause 9.3) |

**How not to miss changes.** Watch the project repository on GitHub (Watch → Custom → Releases) and check the primary sources: zakon.rada.gov.ua and cip.gov.ua.

> Stages 2 and 3 are being expanded: material on secure configurations, automated checks and risk management is in preparation.

## Glossary

| Ukrainian | English | Meaning |
|---|---|---|
| СУІБ | ISMS | information security management system |
| Положення про застосовність | Statement of Applicability (SoA) | ISO/IEC 27001 controls with a decision and justification |
| цільовий профіль | Target Profile | the desired state of CSF 2.0 outcomes |
| зацікавлена сторона | interested party | a person or organisation that can affect decisions or is affected by them |
| ОКІ / ОКІІ | critical (information) infrastructure object | an object of critical (information) infrastructure |
| КСЗІ | KSZI | comprehensive information protection system with state expertise |
| ТЗІ | TZI | technical information protection |
| параметр, визначений організацією | organisation-defined parameter (ODP) | a value the standard leaves to the organisation |

## Disclaimer

This is a reference tool, not legal advice. Applicability and mappings are the authors' opinion. Check conclusions against the official texts linked in the legal sources.
