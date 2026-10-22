# III.2. GRC engineering

<p class="chapter-lead">What stages I and II produced is the foundation for automating controls: a minimal, integrated set of requirements for each asset.</p>

*Covers: ISO/IEC 27001:2022, clauses 5-10 · harmonised structure of ISO management system standards · NIST CSF 2.0, GOVERN function*

**Goal.** Build the requirements and controls into normal processes, so the system works every day and not only before an inspection, and so it can be checked automatically.

## The foundation for automation

GRC engineering turns requirements, controls and evidence into data and code: secure configurations, automated checks, continuous monitoring. But you can only automate what has already been defined. Stages I and II produce exactly that: a minimal, integrated set of requirements for each asset, every requirement with its legal basis, and one control meeting several acts at once. Automation cannot be built on top of contradictory requirements kept in different spreadsheets.

## What GRC is and why integrate

[OCEG](https://www.oceg.org/ideas/what-is-grc) is the international non-profit community that coined the term GRC. It defines GRC as *the integrated collection of capabilities that enable an organization to reliably achieve objectives, address uncertainty, and act with integrity*. Integration does not mean one big GRC department or one piece of software. It means governance, risk and compliance do not live in isolated silos. According to OCEG, organisations that integrate these processes duplicate less work and spend less.

ISO implements the idea through the harmonised structure of management system standards: quality, information security, continuity, privacy and AI can be run as one system. This site covers the information security management system, but the other systems can be built on the same foundation.

**How ready-made mappings help:**

- **One control covers many requirements.** For example, ISO/IEC 27001 control A.5.24 (incident management planning) meets requirements of several NBU resolutions, SSSCIP orders and the personal data protection law at once. The organisation implements it once and has evidence for all of them.
- **You see where the standard is not enough.** Partial coverage and requirements with no counterpart show what to add on top of the standard. The organisation does not spend time on what is already covered and focuses on real gaps.

## How to integrate

ISO management system standards share the same clauses 4-10, so they can be run as one system:

| Element | ISO clause | What to integrate |
|---|---|---|
| Context and scope | 4 | One context description for all systems (I.2) |
| Leadership and policy | 5 | One top-level policy, roles and authorities (I.1) |
| Risks and opportunities | 6 | One risk assessment method with different impact categories |
| Documented information | 7.5 | One set of rules for creating, approving and reviewing documents |
| Competence and awareness | 7.2-7.3 | One training programme |
| Internal audit | 9.2 | One audit plan covering all requirements |
| Management review | 9.3 | One meeting, one record |
| Nonconformity and improvement | 10 | One corrective action log |

**Where to start.** With the document pyramid: policies, standards, procedures, instructions and records. How to build it and write policies that are followed: [ISMS policy examples and templates](#/articles?a=isms-policy-case-studies). Every requirement in the register and every control needs an owner.

**Records management.** Ukrainian records management requirements (including DSTU 4163:2020) are in the [Acts](#/sources?scope=core&records=1) once you turn on "records management requirements". For public authorities and state-owned enterprises they are the basis of document control (clause 7.5).

## Tools and machine-readable data

The tables from this project are fine for getting started. It is time for a GRC system when:

- one requirement lives in several files;
- preparing for an audit takes weeks;
- you cannot tell which requirements are affected if a control stops working.

How to choose: [GRC systems overview](#/articles?a=grc-systems-overview).

Once the register and the mappings exist as data, legal changes become data changes, and each SoA row can be linked to an evidence source (logs, scanner reports, ticket records) and checked automatically. How to bring this project's data into a GRC system: [Methodology](#/method#import-into-grc-systems). Downloads: [Methodology, open data](#/method#open-data).

**Result.** Policies and procedures linked to the Statement of Applicability or target profile; a responsibility matrix; an internal audit plan and a management review schedule.

**Common mistakes**

- separate sets of documents for each standard and regulator that contradict each other;
- policies not communicated to staff and not audited;
- templates used without adaptation.