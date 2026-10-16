# GRC systems overview: why you need one, what is inside and where to start

*Translated from the [Ukrainian original](#/articles?a=grc-systems-overview&lang=uk).*

> A practical overview of the governance, risk & compliance (GRC) tool market: where the value lies, which functionality is critical, what the analysts say and which systems you can try on your own. Status as of July 2026.

---

## Contents

1. [Why a GRC system](#1-why-a-grc-system)
2. [Cloud platforms vs configurable and on-prem systems](#2-cloud-platforms-vs-configurable-and-on-prem-systems)
3. [Key functionality](#3-key-functionality)
4. [Integrations](#4-integrations)
5. [Machine-readable compliance and GRC automation](#5-machine-readable-compliance-and-grc-automation)
6. [What the analysts say](#6-what-the-analysts-say)
7. [Systems with Ukrainian localisation](#7-systems-with-ukrainian-localisation)
8. [Sources](#8-sources)

---

## 1. Why a GRC system

Many organisations in Ukraine are simultaneously implementing an ISMS based on **ISO/IEC 27001** or **NIST CSF**, building a **KSZI** (comprehensive information security system) based on **NIST SP 800-53**, and having to meet the requirements of legislation, critical infrastructure regulators and sector regulators (for example the **NBU**), on top of their own internal requirements. Bringing all this into one consistent picture without a tool is almost impossible: different standards and legal acts overlap, duplicate each other and sometimes conflict. That is why you need **integration of requirements and quality control**, so that the management system stays effective rather than shrinking to box-ticking "acknowledgement" of a pile of paper sent to all users.

A GRC platform is not there to store documents. It is there to make **the links between the elements of the management system machine-readable** and the state of the programme visible without manual collection.

**Dependency tracking.** Risk → asset → business process → control → standard requirement → task → evidence → owner. Once this graph exists, you can answer questions that Excel cannot: which assets remain unprotected if a control is not performed; which ISO 27001 requirements will slip if this owner leaves; which next action will give the biggest gain in coverage.

**Documenting the facts behind decisions.** An audit, a certification, a customer review, an incident investigation: these are all requests for evidence over time: who did what, when, and on what basis it was approved. The system makes the decision log a by-product of daily work, not a separate "collect a folder for the auditor" project.

**Understanding the level of assurance.** The difference between "we have a policy" and "we know the control works". The system shows not a binary status but when the control was last tested, by whom, on what sample and with what deviations.

**Managing the GRC programme as a programme.** Roadmap, workload of owners, recurring tasks, deadlines, metrics: requirements coverage, overdue tasks, age of risks, time to close nonconformities.

**Less duplication.** One control covers the requirements of several standards at once (ISO 27001 + SOC 2 + NIS2 + internal policies). This is called *framework crosswalking* and it saves the most time of everything on this list.

**A foundation for automation.** This is the newest and most underrated value. Once requirements, controls, assets and evidence become **structured data rather than text in documents**, the platform stops being an archive and starts working as an orchestrator: it launches checks itself, collects evidence on a schedule, opens a task when there is a deviation and updates the compliance status. Some controls in cloud environments are already verified automatically (MFA configuration, disk encryption, access policies, logging settings), and the platform simply receives the result instead of asking a person to take a screenshot. More on this in [section 5](#5-machine-readable-compliance-and-grc-automation).

### What a system does not give you by itself

Worth bearing in mind before you choose. Points from [Ayoub Fandi](https://grc.engineering/), co-author of the GRC Engineering manifesto:

- **Most platforms are chronically under-used**: often the value comes not from buying a new tool but from integrations and reworking processes in the one you already have.
- **Controls designed "for the auditor" rather than "for the threat" produce security theatre**: clean evidence with the risk still open. Configure the system to measure effectiveness, not the presence of an artefact.
- **Data fragmentation is the main reason GRC looks like bureaucracy.** The goal is a single data layer that tools plug into.
- **GRC often owns activity instead of outcomes.** Not "we carried out 12 assessments" but "we changed N decisions based on data".

Hence the main check before buying: **formulate 3 specific decisions that you want to make better thanks to the system.** If you cannot, the tool will not help.

---

## 2. Cloud platforms vs configurable and on-prem systems

This is not "expensive versus cheap"; these are two different classes of task.

|  | SaaS compliance automation (Drata, Vanta, Sprinto, Secureframe, Comp AI) | Configurable GRC/ERM platforms (Archer, IBM OpenPages, LogicGate, CISO Assistant, Eramba) |
| --- | --- | --- |
| **Task** | Quickly demonstrate compliance with popular standards (SOC 2, ISO 27001, HIPAA, GDPR) | Build a management system around your own risk model, regulation and structure |
| **How it works** | Ready-made controls + connectors that collect evidence from the cloud automatically | Own data model, hierarchies, assessment methodologies, custom frameworks |
| **Implementation** | Days to weeks | Weeks to months |
| **Strength** | Automatic evidence collection, easy start, clear pricing | Depth: risk aggregation across levels, multiple lines of defence, sector specifics |
| **Weakness** | Stretch poorly to non-standard requirements (laws, sector norms, OT/ICS) | Expensive, slow, needs an administrator; excessive customisation creates lock-in |
| **Data** | In the vendor's cloud | On-prem or private cloud: critical where data sovereignty is required |

Cloud platforms are good at implementing **simple** management systems: the standard is known, the infrastructure is in the cloud, the goal is a certificate. Configurable and on-prem systems are needed when you have to **bring different standards, legal requirements and sector norms into one model**: for example ISO 27001 + NIS2 + DORA + regulator requirements + ISO 9001 + customer requirements in tenders.

A separate reason to choose on-prem in the Ukrainian context is **data sovereignty and operating with limited connectivity**: the asset register and the recovery plan must be available when external services are not.

A realistic scenario for most mid-sized organisations is a **hybrid**: SaaS for automatically collecting technical evidence + a separate system as the source of truth for risks, policies and audits. According to Gartner, 85% of its clients who use GRC tools have more than one solution.

---

## 3. Key functionality

**1. A policy repository accessible to everyone.** Versioning, statuses (draft → approval → in force → archive), a separate space for discussing new editions, the next review date, an owner. An employee should find the answer without contacting security, and you should be able to prove who approved a change and when.

**2. Asset inventory.** Servers, services, applications, equipment, premises. Each asset has an owner, classification, criticality and dependencies. An inventory without owners is a dead inventory.

**3. Data inventory.** Which categories of data exist, where they are stored, how they move, who has access, how long they live.

**4. Personal data inventory (RoPA).** Separate from the general one, because it has its own structure: processing purposes, legal bases, categories of data subjects, recipients, cross-border transfers, retention periods, link to the DPIA.

**5. Risk inventory.** Owner, assessment (qualitative, semi-quantitative or quantitative), treatment plan, history of reassessments and, critically, a link to assets and controls. A register that lives apart from the controls quickly turns into fiction.

**6. Policy training.** Acknowledgement, comprehension check, confirmation, reminders, coverage report. Often this is an integration with an existing LMS, and that is fine, as long as the statuses flow back into the GRC system.

**7. Compliance matrix.** Requirement → the control that covers it → evidence that it works → the responsible person. Plus automatic mapping between standards, so that one control counts towards several frameworks at once.

**8. Audits.** A risk-based annual plan, working papers, classified findings, corrective actions with deadlines and owners, re-verification. Separately, read-only access for the external auditor, so you do not exchange archives by email.

**9. Third-party management.** A supplier register by criticality, due diligence questionnaires, their certificates with expiry dates, contractual security obligations, periodic reassessments, a link between the supplier and the assets and processes that depend on it.

**Highly desirable:** a library of ready-made policies and controls; assigning tasks to performers with reminders and recurring tasks; incident and nonconformity management; dashboards for three audiences (the board, process owners, specialists); a change log within the system itself; AI as a drafter for policies and for analysing supplier documents; quantitative risk assessment (FAIR, Monte Carlo) for those who justify budgets in money.

---

## 4. Integrations

**The main implementation risk is creating yet another closed island of infrastructure.** Without integrations you get manual re-creation of the same tasks in Jira and in the GRC system, manual ETL (export CSV → clean → upload → repeat a month later), a mismatch between the CMDB and the asset register, and evidence that has gone stale by the time the auditor opens it.

The minimum worth demanding:

| Area | What to integrate |
| --- | --- |
| Identity | SSO (SAML/OIDC), SCIM for provisioning users and roles |
| Tasks | Two-way synchronisation with a tracker (Jira, ServiceNow, GitLab) |
| Assets | CMDB, MDM, cloud providers, inventory tools |
| Technical evidence | CSPM, vulnerability scanners, EDR, CI/CD, logging |
| HR | Onboarding/offboarding, policy acknowledgement, access reviews |
| General | REST API, webhooks, automation tools (n8n, Make), full data export |

**Two questions that save the most nerves.** Ask the vendor to show not a list of logos but: (1) how exactly the two-way task synchronisation works, which determines whether people will use the system; (2) what a full export of your data looks like, which determines whether you will be able to leave it.

In its Q2 2026 Wave, Forrester names this the main vector of the market: GRC platforms must turn **from a system of record into a system of action**, orchestrating an ecosystem of tools rather than replacing them all.

---

## 5. Machine-readable compliance and GRC automation

First, which pains this approach is trying to treat at all. The classic, "paper" model of compliance runs into three things: **high audit costs on both sides** (the organisation spends months collecting evidence by hand, and the auditor reviews it by hand in the same way); **unreliable evidence** (a screenshot or extract shows the state at one moment in the past, goes stale easily and is easy to forge); and **weak control over whether the controls work at all** between audits: a "done" status in a spreadsheet says nothing about today. GRC Engineering targets exactly this: making evidence continuous, verifiable and cheap to collect.

**GRC Engineering** is an approach in which compliance is built with engineering methods: controls are described as code, evidence is collected from systems automatically, changes go through review and versioning, and the result is measured not by the number of documents but by how many decisions have become better. This needs not "yet another register" but an **orchestrator platform**: a single data model plus an API through which scanners, pipelines and task trackers connect to it.

### Prerequisite: an integrated management system

Automation cannot be built on top of contradictory requirements. If for the same asset one standard requires one thing, the regulator another and the customer contract a third, and all this lives in different spreadsheets, no orchestrator will know what exactly to check and when to consider a control satisfied.

So the prerequisite of the approach is an **integrated management system** in which the requirements of legislation, regulators (for example the NBU), contracts and your own internal requirements are consolidated into **a single, exhaustive and consistent set of requirements for each object**. In practice this means:

- one requirements catalogue into which all sources are consolidated, with duplicates and conflicts eliminated (the same *framework crosswalking* as in [section 1](#1-why-a-grc-system), but as a foundation rather than a convenience);
- reusable controls: one control covers the requirements of several sources at once;
- an unambiguous "requirement → control → evidence → owner" link, so that automation has something to check.

Without this layer, automation only produces inconsistent artefacts faster. With it, automation becomes a superstructure on top of an already ordered model.

### What it looks like technically: the OSCAL example

Historically, security automation began with **SCAP** (NIST, mid-2000s), which described configuration checks in a machine-readable way but knew nothing about the requirements, controls and documents of a management system. That part remained in Word and Excel.

In 2019 NIST released **OSCAL** (Open Security Controls Assessment Language), a set of models in JSON/XML/YAML for what used to be text: a catalogue of a standard's requirements, a selection of requirements for a specific level, a description of how a component satisfies requirements, a system security plan, an assessment plan and results, and a plan of action and milestones. The idea is simple: if these are data rather than documents, they can be validated automatically, reused across standards and generated from the real state of the system.

**Reality is slower than the idea.** OSCAL is complex, writing it by hand does not scale, and adoption remained niche for a long time, mostly in the US public sector. OSCAL here is just **one possible format**; what matters is the principle itself, "requirements and evidence as structured data", not a specific standard. For a Ukrainian organisation OSCAL is almost certainly excessive, but the principle behind it is universal.

### What works in practice today

Around the same principle, and in parallel with OSCAL, a more pragmatic layer has grown up:

- **Continuous controls monitoring (CCM)** in commercial GRC platforms: connectors to clouds, EDR and CI/CD that continuously confirm that a control works, instead of an annual screenshot. According to Forrester, this is so far the weakest spot of the market (see [section 6](#6-what-the-analysts-say)), so test it in a demo rather than relying on the brochure.
- **Compliance-as-code + policy-as-code.** The [OSCAL Compass](https://oscal-compass.dev/) ecosystem (Trestle, Compliance-to-Policy) turns requirements into policies for engines such as Kyverno or OPA and returns their results back into the assessment format; all of this lives in Git and CI/CD.
- **Standardised mapping libraries**: NIST OLIR (used by CISO Assistant), Secure Controls Framework (used by SimpleRisk), the de facto "interchange format" for cross-crediting controls.
- **MCP (Model Context Protocol)** is a new interface through which AI agents get access to GRC data. It is already supported in CISO Assistant, among others.

**Practical conclusion.** It is worth (1) putting the requirements in order through an integrated management system and (2) choosing a tool that keeps your data **structured and serves it through an API**, otherwise in two years you will have to do this work a second time, when machine-readable evidence becomes a routine demand from customers and auditors. At the same time this is **not a silver bullet**: the potential of the approach is high, but its ceiling is set not by technology but by internal policy and business priorities. If management is not ready to act on the results of automated checks and to allocate resources to remediate findings, the best automation will only show problems faster that nobody will solve.

**Further reading on GRC Engineering:** [grc.engineering manifesto](https://grc.engineering/) · [GRC Engineering 101](https://grcengclub.com/learn/grc-engineering-101). For those who want to go deeper and more systematically, there is a dedicated [certification at the GRC Engineering Club Academy](https://grcengclub.com/academy).

---

## 6. What the analysts say

The four main sources define "GRC" **differently**; this is the most important thing to know before reading any quadrant.

And an even more important caveat for all of them at once: **analyst firms are not impartial.** Their business model is closely interwoven with the vendors they assess: vendors pay for consulting, for the right to reprint reports in marketing, for participation in events. This does not mean the rankings are bought, but it does mean that a position in a quadrant is not an objective physical quantity but a weighted opinion with a known conflict of interest. So do not trust them blindly. At the same time the benefit is real: they are the best available **snapshot of the industry**, showing who is on the market at all, how players position themselves and where trends are heading. Use quadrants to outline the field of candidates, not to pick the winner for you.

**Gartner, Magic Quadrant for GRC Tools, Assurance Leaders (October 2025).** The first edition; it looks narrowly, at tools for holistic enterprise risk management. Leaders: **Archer, AuditBoard, Diligent, IBM (OpenPages), LogicGate**. Challengers: MetricStream, Resolver, Riskonnect, SAI360, ServiceNow, Workiva. Niche Players: Ideagen, LogicManager, Mitratech, Onspring, Origami Risk. There are no Visionaries in this edition; honourable mentions: Corporater and Protecht. Useful details beyond the picture: there are over a hundred vendors selling "GRC"; promises of implementation in "under 12 weeks" usually do not hold in practice; vendors' definitions of "low-code" mean very different things; customer complaints repeat from product to product and almost always concern price, configuration complexity and an interface that is unclear to non-technical users.

**Forrester Wave, Q2 2026.** 12 vendors, a noticeably more critical tone. Many platforms still require too much manual input and remain expensive relative to what they actually do. **AI so far delivers minimal value**: current functionality strengthens existing capabilities rather than changing them qualitatively, and customers complain about its limitations and cost. **Continuous controls monitoring is the weakest criterion of the whole study**: where it exists, it is usually built as an evidence-collection mechanism for auditors rather than as continuous monitoring of control effectiveness. There is no consensus on AI pricing, ranging from "included" to payment per number of scenarios.

**IDC MarketScape 2025.** Looks at GRC through a cybersecurity lens: continuous monitoring of risk posture across the whole IT landscape, quantification of cyber risk, third-party risks. ⚠️ Mostly vendor excerpts are publicly available, showing the position only of whoever paid for the reprint.

**G2, Best GRC Products 2026.** A review-based ranking; top 5: Vanta, Workiva, Sprinto, Secureframe, Optro. The category is very broad: the same list includes LMSs, AML tools and even an operating system, and the ranking correlates with the volume of reviews and is skewed towards SaaS for start-ups. But it is the best source of colour on UX, implementation and support.

**Practical conclusions for the buyer:**

- [ ] Quadrants are good for a short-list of 3-5 candidates; after that, only a pilot on your own data
- [ ] Demand a written price breakdown: what is included, what costs extra, how much AI costs, what happens if you grow to 2× users
- [ ] Check two-way task synchronisation and completeness of data export
- [ ] Ask who leads the implementation, the vendor or a partner, and how much it costs
- [ ] Look at who owns the company: the market is consolidating heavily through M\&A

---

## 7. Systems with Ukrainian localisation

The GRC tool market is huge, with over a hundred products. The most convenient up-to-date **catalogue with classifications from all analyst reports** is maintained by Arun Sivadasan at [**allaboutgrc.com/grc-tools**](https://allaboutgrc.com/grc-tools/): 80+ tools in an Airtable table with filters and CSV export, with marks from Gartner MQ 2025, Forrester Wave, Chartis RiskTech and IDC MarketScape. It is the best starting point, so that we do not rewrite the whole market here.

Below, separately, are four solutions that have **at least partly localised their products for Ukraine and have no ties to Russia** (checked: intuitem is a French company hosting in the EU; Kordon is Estonian, hosting in the EU; UnderDefense is of Ukrainian origin; CSET comes from CISA, the US government). These are the ones to start with for organisations for which the language of the interface, support or documentation matters. Details and differences are in the list below.

- [**CISO Assistant**](https://intuitem.com/) (intuitem, France): the best free start for multi-standard programmes on your own server.
- [**EY Virtual Internal Auditor (EY VIA)**](https://www.ey.com/en_ua/services/consulting/virtual-internal-auditor) (USA): an EY solution that helps track compliance using AI
- [**UnderDefense MAXI**](https://underdefense.com/) (USA / Ukrainian roots): compliance automation on top of MDR/SOC, with adaptation of some NBU requirements.
- [**ITS Compliance**](https://my-itspecialist.com/in-house-developed-software/its-compliance) (Ukraine): automation on top of an asset management system.
- [**Kordon**](https://kordon.app/uk/) (Estonia): the easiest entry for SMBs; fully Ukrainian website and documentation, with [free policy templates](https://kordon.app/uk/shablony-dokumentiv/).
- [**CISODIUM**](https://cisodium.com/uk/) (Estonia): automation on top of an asset management system.
- [**CSET**](https://www.cisa.gov/downloading-and-installing-cset) (CISA): a free offline tool for one-off self-assessment for small organisations and OT environments.
- [**SecBoard**](https://secboard.online/) (Ukraine)

> **The rest of the market.** SimpleRisk, Comp AI, Eramba, Prowler and 80+ more tools, with their positions in analyst reports, are conveniently compared in the catalogue at [allaboutgrc.com/grc-tools](https://allaboutgrc.com/grc-tools/). It also lists "GRC-adjacent" tools (Databee, Tanium) that appear in analyst reports but are not GRC platforms in the pure sense.

## 8. Sources

**Market analysis**

- Gartner. *Magic Quadrant for Governance, Risk and Compliance Tools, Assurance Leaders*, 27.10.2025, ID G00801545: [reprint](https://www.gartner.com/doc/reprints?id=1-2M6L6HIT&ct=251028&st=sb)
- Forrester. *The Forrester Wave™: Governance, Risk, And Compliance Platforms, Q2 2026*: [announcement and key findings](https://www.forrester.com/blogs/announcing-the-forrester-wave-governance-risk-and-compliance-platforms-q2-2026/)
- IDC. *IDC MarketScape: Worldwide GRC Software Vendor Assessment, 2025* (#US53615325): [public excerpt](https://digitalxforce.com/wp-content/uploads/2025/07/IDC-MarketScape-Worldwide-Governance-Risk-and-Compliance-Software-Vendor-Assessment-2025_.pdf)
- G2. *Best Governance, Risk & Compliance (GRC) Products 2026*: [list](https://www.g2.com/best-software-companies/top-governance-risk-and-compliance)
- Arun Sivadasan. [GRC tools: all about GRC](https://allaboutgrc.com/grc-tools/): 80+ tools with classifications from analyst reports

**Machine-readable compliance**

- NIST. [Open Security Controls Assessment Language (OSCAL)](https://csrc.nist.gov/projects/open-security-controls-assessment-language)
- [OSCAL Compass](https://oscal-compass.dev/): Trestle, Agile Authoring, Compliance-to-Policy

**GRC Engineering**

- [grc.engineering manifesto](https://grc.engineering/)
- [GRC Engineering 101](https://grcengclub.com/learn/grc-engineering-101) · [certification at the GRC Engineering Club Academy](https://grcengclub.com/academy)
- Ayoub Fandi: [grcengineer.com](https://grcengineer.com/), [LinkedIn](https://www.linkedin.com/in/ayoubfandi/?locale=en)
- [awesome-security-GRC](https://github.com/Arudjreis/awesome-security-GRC)

---

> **Disclaimer.** This material is an overview and is not a recommendation of any specific product. Vendors' positions in analyst reports are the opinion of the respective research organisations at the time of publication, not a statement of fact; the reports are protected by copyright and are paraphrased here briefly, in our own words. Prices and functionality change, so check current data with the vendors.
