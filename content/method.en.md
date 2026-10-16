# Methodology

<p class="chapter-lead">How the register and the mappings are built: which standards are the basis, how a requirement of an act is linked to a control, what kinds of requirements exist and how changes in legislation are tracked. This is enough to trace where any conclusion on the site comes from and to check it.</p>

## Base standards

The basis is the standards Ukrainian regulators rely on:

| Standard | Used for | Why this one |
|---|---|---|
| **ISO/IEC 27001:2022** (Information security management systems. Requirements) | The organisation's ISMS, certification | The international management system standard; the Ukrainian version is DSTU ISO/IEC 27001 |
| **NIST CSF 2.0** (NIST Cybersecurity Framework) | The organisation's cybersecurity profile | The SSSCIP baseline cyber protection measures (Order No. 75/2026) are an adapted translation of CSF 2.0 |
| **NIST SP 800-53 Rev. 5** (Security and Privacy Controls for Information Systems and Organizations) | Controls for a specific information system | The SSSCIP baseline security profiles (Orders No. 409/2025, 419/2025, 843/2025) are built on it |

These standards do not exclude others. Mappings are tied to specific provisions of acts, so they can be carried over to any other standard (ISO 22301, ISO/IEC 27701, CIS Controls) through published crosswalks between standards.

## GRC and the integrated management system

[OCEG](https://www.oceg.org/ideas/what-is-grc) is the international non-profit community that coined the term GRC. It defines GRC as *the integrated collection of capabilities that enable an organization to reliably achieve objectives, address uncertainty, and act with integrity*. Integration does not mean one big GRC department or one piece of software. It means governance, risk and compliance do not live in isolated silos. According to OCEG, organisations that integrate these processes duplicate less work and spend less.

ISO implements the idea through the **harmonised structure** of management system standards: ISO 9001 (quality), ISO/IEC 27001 (information security), ISO 22301 (continuity), ISO/IEC 27701 (privacy) and ISO/IEC 42001 (AI) share the same clauses 4-10. So one management system can meet several standards at once: one context, one risk method, one audit plan. This site covers the information security management system, but the other systems can be built on the same foundation.

**How ready-made mappings help:**

- **One control covers many requirements.** For example, ISO/IEC 27001 control A.5.24 (incident management planning) meets requirements of several NBU resolutions, SSSCIP orders and the personal data protection law at once. The organisation implements it once and has evidence for all of them.
- **You see where the standard is not enough.** Partial coverage and requirements with no counterpart show what to add on top of the standard. The organisation does not spend time on what is already covered and focuses on real gaps.
- **Legal changes stay local.** A new version of an act affects only the controls its provisions are linked to, not the whole system.

## How requirements are mapped to controls

The method is **Set Theory Relationship Mapping (STRM)** from [NIST IR 8477](https://csrc.nist.gov/pubs/ir/8477/final), "Mapping Relationships Between Documentary Standards, Regulations, Frameworks, and Guidelines" (2024). NIST uses the same approach in its OLIR programme.

**The unit of mapping** is a provision of an act (article, part, paragraph), not the whole act. A row reads: "provision [relationship] control".

| Relationship | Meaning | Coverage |
|---|---|---|
| **=** equal | The provision and the control are the same | full |
| **⊂** subset of | The provision is narrower: the control fully covers it | full |
| **⊃** superset of | The provision is broader than the control | partial |
| **∩** intersects with | They overlap, each has something of its own | partial |
| **∅** no relationship | Checked, no relationship | — |

Each mapping also carries:

- **rationale:** meaning (semantic), wording (syntactic) or outcome (functional);
- **legal parameter:** a value the act sets instead of the organisation;
- **where it belongs:** the internal document the requirement should live in;
- **status:** "AI, not reviewed" → "draft" → "reviewed" (by a second person, signed).

A provision that no control covers goes to the list of **requirements with no counterpart**.

## Kinds of requirements

| Kind | Examples | Binding force and nuances |
|---|---|---|
| **International treaties and EU law** | Convention on Cybercrime, Convention 108, EU-Ukraine Association Agreement, Security Agreement with NATO; EU acts: NIS2, DORA, GDPR | Ratified treaties are part of Ukrainian legislation (Art. 9 of the Constitution). EU law is not directly binding in Ukraine: it sits on a separate "Reference" tab and shows where legislation is heading through approximation |
| **Laws of Ukraine** | "On the Basic Principles of Ensuring Cybersecurity of Ukraine", "On Information Protection in Information and Communication Systems", "On Personal Data Protection" | Set the framework and delegate details to secondary legislation. Rarely contain specific controls themselves |
| **Sector requirements: finance** | NBU Board resolutions on information security, cyber protection, risk management, cloud services | The NBU adopts them under the Law "On the National Bank of Ukraine". They bind banks and other NBU-supervised institutions and often go down to deadlines and thresholds |
| **Sector requirements: public sector and CI** | Cabinet of Ministers resolutions (general cyber protection requirements for CI objects, minimum requirements for information protection in ICS), SSSCIP orders | See below on registration with the Ministry of Justice |
| **Baseline measures and profiles** | Baseline cyber protection measures based on CSF 2.0 (Order No. 75/2026); baseline security profiles based on SP 800-53 (Orders No. 409/2025, 419/2025, 843/2025) | The mandatory minimum. Depend on the object's category (baseline measures) or the kind of information in the system (profiles) |
| **Cyber protection plan** | The cyber protection plan form (Order No. 75/2026) | Mandatory measures that must go into the plan depending on the object's category |
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

## Data quality

- Every act has the date it was last checked against the official text.
- "Who it applies to" tags and mappings have a review status. Unreviewed items are marked on the site and in the files.
- Errors can be reported on [GitHub](https://github.com/Ivan-Gokin/grc-foundation-ua/issues). The rule: "reviewed" is set by a second person, not by the author of the mapping.
