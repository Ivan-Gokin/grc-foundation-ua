# Stage 2. Compliance

What is required regardless of our wishes is applied to systems and automated, so it takes less time. Outcome: requirements are applied to systems and assets as secure configurations and automated checks, and evidence is collected without manual work.

## Information system level

The management system says what the organisation commits to. Each information system then needs specific technical and organisational controls with their parameters set. Ukrainian system-level requirements are built on NIST SP 800-53 (Security and Privacy Controls for Information Systems and Organizations).

In the [Controls](#/controls?fw=sp800-53r5) view, pick "Information system → NIST SP 800-53". Each control shows where the requirement comes from:

| Source | What it is |
|---|---|
| **Baseline security profile** | The minimum set of controls for the kind of information in the system (open or confidential, official, NATO RESTRICTED), with parameter values |
| **Cyber protection plan** | The baseline cyber protection measures (SSSCIP Order No. 75/2026), mandatory depending on the object's category |
| **CSF and legislation** | The CSF 2.0 subcategories that other acts require |
| **Sector security profile** | Developed by sector regulators; none has been approved yet |

The interesting part is the controls outside the baseline profile, added by the plan or by legislation.

> This is a preview. The plan and legislation are expressed as CSF subcategories, and expanding them to SP 800-53 through the NIST mapping over-selects. Treat the result as candidates to tailor.

## Tools and machine-readable data

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
