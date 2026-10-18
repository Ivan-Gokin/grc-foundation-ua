# ISMS Policy Examples and Templates - Reference Guide

*Translated from the [Ukrainian original](#/articles?a=isms-policy-case-studies&lang=uk).*

> A selection of publicly available documents, templates and frameworks for information security management systems (ISMS). Useful as reference material when developing, auditing or improving your own set of policies.

---

## Contents

- [Why this matters](#why-this-matters)
- [Why policies?](#why-policies)
- [The ISMS documentation pyramid](#the-isms-documentation-pyramid)
- [Policy on policies](#policy-on-policies)
- [Desirable attributes of a good policy](#desirable-attributes-of-a-good-policy)
- [Policy-writing courses](#policy-writing-courses)
- [Policy examples](#policy-examples)
- [Template sources](#template-sources)

---

## Why this matters

Studying real and template policies gives you an understanding of **what they should look like** and **what you can include in them**: which structure to choose, which sections are typical, how requirements are worded, and what level of detail is sufficient.

**There is, however, an important caveat:**

> ⚠️ Policy templates, regardless of their source, **must not be taken as they are and used as your own documents**.

The reason is simple: a template is written for an abstract organisation. It does not know your structure, your business processes, your infrastructure, your regulatory obligations or your risk appetite. A document that does not reflect your reality does not protect you, whether technically, legally or during an audit.

**The same applies to AI-generated policies.** They can be useful as a starting point, but only if you generate them for a specific context and then edit them to fit your real needs. A generated document without critical review is an illusion of compliance, not compliance.

**The right approach looks like this:**
1. Study several examples and templates to understand the structure and logic of the document
2. Determine what is relevant to your organisation specifically
3. Adapt or write the document for your own context
4. Agree it with process owners and management: a policy must be enforceable
5. Implement it, train staff and review it regularly

---

## Why policies?

In most organisations, requirements for certain processes or behaviours exist, but they are scattered across dozens of orders, memos, letters and verbal agreements. It is hard to find the current requirement, harder still to tell whether it is still in force, and almost impossible to explain it to a new employee.

**A policy solves this problem.** It aggregates all of the organisation's requirements on a given topic in one document that:

- has a clear owner and a review date, so it is always clear who is responsible and whether the document is up to date
- is written for a specific audience, rather than being an extract from a law or an internal order
- does not duplicate the provisions of the law, but explains **how exactly your organisation** complies with them
- is updated as a whole, instead of accumulating amendments in separate orders

Compare the two approaches:

| Approach | Problem |
| --- | --- |
| Orders No. 12, 47, 103, 211... | It is unclear which is current. Documents contradict one another. Staff are hard to train. |
| Password Usage Policy v2.1 | One document, one owner, one review date. It is always clear what is in force. |

> This does not mean orders disappear: they can serve as the act that approves or amends a policy. But **the substantive requirement lives in the policy**, not in the order.

---

## The ISMS documentation pyramid

ISMS documentation is built on a hierarchical principle: the higher the level, the less detail and the wider the audience; the lower the level, the more specific the content and the narrower the audience.

```
        ┌─────────────────────────────┐
        │         POLICIES            │  Level 1
        │  What and why. The          │
        │  organisation's requirements│
        │  and principles.            │
        │  Audience: everyone.        │
        └────────────┬────────────────┘
                     │
        ┌────────────▼────────────────┐
        │        STANDARDS            │  Level 2
        │  How exactly. Specific      │
        │  technical or organisational│
        │  requirements to be met.    │
        │  Audience: those responsible│
        └────────────┬────────────────┘
                     │
        ┌────────────▼────────────────┐
        │        PROCEDURES           │  Level 3
        │  Step by step. Who does     │
        │  what and when in a         │
        │  specific situation.        │
        │  Audience: performers.      │
        └────────────┬────────────────┘
                     │
        ┌────────────▼────────────────┐
        │  INSTRUCTIONS / RECORDS     │  Level 4
        │  Evidence of performance:   │
        │  logs, reports, checklists, │
        │  minutes.                   │
        │  Audience: auditors.        │
        └─────────────────────────────┘
```

| Level | Document type | Example | Level of detail | Audience |
| --- | --- | --- | --- | --- |
| 1 | Policy | Information Security Policy | Low | All employees, management |
| 2 | Standard | Password Management Standard | Medium | IT, information security, process owners |
| 3 | Procedure | Incident Response Procedure | High | Response team |
| 4 | Instruction / Record | Incident investigation checklist | Very high | Auditors, performers |

> A typical mistake is to write all documents as "procedures", or, conversely, to leave everything at the level of general declarations. Each level has its own role and audience.

---

## Policy on policies

**A "policy on policies"** is a document that describes **how all other policies in the organisation are created, approved, maintained and withdrawn**.

### Why it is needed

Without it, every subsequent policy in the organisation may have a different structure, a different level of detail, an unclear status and unclear responsibility. Once an organisation has 10+ documents, managing them without a meta-policy becomes chaotic.

### What it usually includes

- **Definition of document types**: what counts as a policy, a standard, a procedure, an instruction (linked to the documentation pyramid above)
- **Template and structure**: mandatory sections for each document type (title, version, owner, scope, review date, etc.)
- **Approval process**: who has the right to approve documents at each level
- **Review cycle**: how often documents are reviewed (usually annually or after significant changes)
- **Version control**: how versions are numbered, where they are stored, how changes are communicated
- **Responsibility**: who owns each document and what that means in practice

> If your organisation does not yet have a meta-policy, write it first, before any topic-specific policies.

---

## Desirable attributes of a good policy

A good policy differs from a bad one not in length but in quality. Here are the key attributes:

**Unique**: contains requirements that are not found in the organisation's other policies. Each document covers its own topic without duplication.

**Concise**: contains only what is needed. A long policy that nobody reads does not work. If a document runs to more than a few pages, it may already be a procedure rather than a policy.

**Clear**: written in the language of the target audience. A policy for all employees should not contain technical jargon. A technical standard, by contrast, must be precise and unambiguous.

**Convenient for its target audience**: takes into account who will read and follow the document. A chief executive and a system administrator read completely different documents.

**Enforceable**: describes only what the organisation can and will actually do. A policy that stays on paper is worse than none at all: it creates a false sense of security and risks during an audit.

**Has an owner**: there is always a specific person or role responsible for keeping the document up to date.

**Has a review date**: a policy without a review date gradually and unnoticeably loses relevance.

---

## Policy-writing courses

### 🇺🇦 Cybersecurity Documentation School (Школа документації з кібербезпеки) - Legal IT Group

A Ukrainian-language course from Legal IT Group, focused on the practice of writing ISMS documents within the realities of Ukrainian legislation and regulation.

🔗 [legalitgroup.com - Cybersecurity Documentation School](https://legalitgroup.com/service/shkola-dokumentacziyi-z-kiberbezpeky/) (in Ukrainian)

- 6 theory-and-practice modules
- Capstone project
- Certificate on completion
- Covers DSTU ISO/IEC 27001, ND TZI (technical information security regulatory documents) and related Ukrainian requirements

---

### 🌐 PolicyWizard - Information Security Policy Writer

An English-language GRC course for GRC professionals.

🔗 [policywizard.io - Information Security Policy Writer](https://www.policywizard.io/information-security-policy-writer)

- Writing information security policies
- Risk assessment and quantification (ALE, Risk Register, Risk Scenarios)
- Document development methodology
- Templates and consulting support

---

## Policy examples

| Organisation | Document |
| --- | --- |
| 🇺🇦 JSC CB PrivatBank (АТ КБ ПРИВАТБАНК) | [**Information Security Policy**](https://static.privatbank.ua/files/0000003855727214.pdf) (in Ukrainian) |
| 🇺🇦 State Statistics Service of Ukraine (Держстат України) | [**Cybersecurity Incident Management Policy** in the information system of the state statistics authorities](https://www.ukrstat.gov.ua/norm_doc/2024/181/Polituka.pdf) (in Ukrainian) |
| 🇺🇦 State Statistics Service of Ukraine | [**Vulnerability Management Process** in the information system of the state statistics authorities](https://www.ukrstat.gov.ua/norm_doc/2024/195/prosec.pdf) (in Ukrainian) |
| 🇺🇦 State Statistics Service of Ukraine | [**Cybersecurity Risk Management Policy** in the information system of the state statistics authorities](https://www.ukrstat.gov.ua/norm_doc/2024/195/Polit.pdf) (in Ukrainian) |

---

## Template sources

| No. | Source | Description |
| --- | --- | --- |
| 1 | 🇺🇦 [Ministry of Health - Templates for healthcare facilities](https://moz.gov.ua/uk/shabloni-dlja-vprovadzhennja-kiberstandartiv-u-medichnih-zakladah) (in Ukrainian) | Ministry of Health of Ukraine (МОЗ). Based on NIST CSF. Adapted for healthcare institutions. |
| 2 | 🇺🇦 [Diia.Business - Cyber hygiene recommendations](https://business.diia.gov.ua/entrepreneur-handbook/item/praktichni-rekomendaciyi-dlya-privatnogo-sektoru-schodo-kibergigieni) (in Ukrainian) | Ministry of Digital Transformation of Ukraine (Мінцифри). Not tied to a specific standard. For small and medium-sized businesses. |
| 3 | [SANS Institute - Policy Template Library](https://www.sans.org/information-security-policy) | SANS and the Cybersecurity Risk Foundation (CRF). Not tied to a specific standard. General cybersecurity policy templates. |
| 4 | [Ministry of Security - GRC Resources](https://ministryofsecurity.co/resources/) | Ministry of Security (MoS). ISO 27001, SOC 2, CISM. Templates, checklists, playbooks. |
| 5 | [ISO 27k Toolkit](https://www.iso27001security.com/toolkit) | The ISO27001security.com community. ISO/IEC 27001 and ISO/IEC 27002. A complete set of ISMS documents. |
| 6 | [NIST CSF Policy Template Guide (PDF)](https://www.cisecurity.org/-/media/project/cisecurity/cisecurity/data/media/files/uploads/2024/08/cis-ms-isac-nist-cybersecurity-framework-policy-template-guide-2024.pdf) | CIS and MS-ISAC. NIST CSF 2.0. Policy templates mapped to the Govern, Identify, Protect, Detect, Respond and Recover functions. |
