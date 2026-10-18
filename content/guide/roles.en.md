# Step 1. Roles and authorities

<p class="chapter-lead">Stage 1, "Governance", has six steps. If you have taken the <a href="#/start">questionnaire</a> and have an ISMS skeleton, these steps explain how to turn it into a system that works every day. Start with people: who decides, who does the work, who checks.</p>

## Three stages

GRC engineering turns requirements, controls and evidence into data and code: secure configurations, automated checks, continuous monitoring. But you can only automate what has already been defined. The path has three stages:

<ol class="stages">
<li><b>Governance</b><span>We decide who is responsible for security, what is required of us and how we manage it. The result is an integrated management system with a complete set of requirements. It is the prerequisite for everything else, and this is where this site helps.</span></li>
<li><b>Compliance</b><span>What is required regardless of our wishes is applied to systems and automated: configurations, checks, evidence collection. Less time on routine.</span><a href="#/guide?c=compliance">Guide: stage 2 →</a></li>
<li><b>Risk management</b><span>The freed-up resources go into resilience to a changing environment: new threats, new suppliers, new requirements.</span><a href="#/guide?c=risk">Guide: stage 3 →</a></li>
</ol>

## About this step

*Covers: ISO/IEC 27001:2022, clauses 5.1, 5.3 and controls A.5.2-A.5.4 · NIST CSF 2.0, GV.RR*

**Goal.** Decide who makes information security decisions, who is responsible for carrying them out and who checks independently. Without this the remaining steps have no owners: nobody updates the requirements register, nobody accepts risks, and policies are signed by people without the authority to enforce them.

## Who is responsible for what

| Role | Responsibility |
|---|---|
| **Head of the organisation** | Approves the policy and objectives, allocates resources, accepts residual risks, reviews the system at least once a year (clauses 5.1, 9.3; GV.RR-01) |
| **Collective body** (information security or risk committee) | Aligns decisions between business, IT, security, legal and HR; considers risks that affect several units |
| **Chief information security officer (CISO)** | Builds and maintains the system, reports to management, coordinates incident response |
| **Process and asset owners** | Responsible for controls in their area: information classification, access rights, supplier requirements (A.5.9, A.5.12) |
| **IT and operations** | Implement and run the technical controls |
| **Internal audit** | Checks independently that the system works (clause 9.2) |
| **Employees** | Follow the policies, report events and incidents (A.6.3, A.6.8) |

In a small organisation one person may hold several roles. What matters is that every role is named and someone is accountable for it.

## Three lines

A convenient model for allocating roles:

- **first line:** units that deal with risk every day (process owners, IT);
- **second line:** functions that set the rules and monitor them (security, risk, compliance);
- **third line:** internal audit, independent of the first two.

Security cannot be built, operated and independently checked by the same people. If the CISO reports to the IT director, a conflict of interest is built into the structure.

## Segregation of duties

Conflicting duties are split between different people (A.5.3). For example:

- whoever grants access does not approve it themselves;
- an administrator does not review their own actions in the logs;
- a developer does not deploy changes to production without approval.

## What regulators require

Some regulators prescribe the structure directly. For example, [NBU Board Resolution No. 95 of 28.09.2017](#/sources?act=ua-nbu-95-2017) requires a bank to appoint a CISO with authority no lower than a deputy chair of the management board, and forbids the information security unit from administering the bank's information systems. To see which acts require this of you, open Controls: [GV.RR for NIST CSF 2.0](#/controls?fw=csf-2.0&q=GV.RR) or [A.5.2 for ISO/IEC 27001](#/controls?fw=iso27001-2022&q=A.5.2).

**Result.** A section of the policy or a separate regulation on roles; a responsibility (RACI) matrix for key processes; orders appointing the CISO and setting up the collective body; security duties in job descriptions.

**Common mistakes**

- the CISO reports to IT and audits themselves;
- responsibility without authority or budget;
- management does not take part: it does not review the system or accept risks, everything is "delegated to security";
- a single "person responsible for everything" with no deputy.
