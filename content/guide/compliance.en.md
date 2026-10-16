# Stage 2. Compliance

This stage is about moving requirements from documents onto systems: choosing controls for each information system, setting their parameters and checking them automatically. Outcome: secure configurations, automated checks and evidence collected without manual work.

## Information system level

The management system says what the organisation commits to. Each information system then needs specific technical and organisational controls with their parameters set. Ukrainian system-level requirements are built on NIST SP 800-53 (Security and Privacy Controls for Information Systems and Organizations).

Open [Controls → Information system](#/controls?fw=sp800-53r5) and pick the baseline profile for the kind of information in the system. Each control shows where the requirement comes from: the baseline profile, the cyber protection plan or legislation. Start with the controls that are not in the baseline profile: they are the ones most often missed.

## Tools and machine-readable data

The tables from this project are fine for getting started. It is time for a GRC system when:

- one requirement lives in several files;
- preparing for an audit takes weeks;
- you cannot tell which requirements are affected if a control stops working.

How to choose: [GRC systems overview](#/articles?a=grc-systems-overview).

Once the register and the mappings exist as data, legal changes become data changes, and each SoA row can be linked to an evidence source (logs, scanner reports, ticket records) and checked automatically. How to bring this project's data into a GRC system: [Methodology](#/method#import-into-grc-systems). Downloads: [About](#/about#data).
