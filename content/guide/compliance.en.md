# II.3. Information systems

The Statement of Applicability covers the organisation. Stage II continues at the level of each information system: choosing its controls, setting their parameters and, later, checking them automatically.

## Information system level

The management system says what the organisation commits to. Each information system then needs specific technical and organisational controls with their parameters set. Ukrainian system-level requirements are built on NIST SP 800-53 (Security and Privacy Controls for Information Systems and Organizations).

Open [Controls → Information system](#/controls?fw=sp800-53r5) and pick the baseline profile for the kind of information in the system. Each control shows where the requirement comes from: the baseline profile, the cyber protection plan or legislation. Start with the controls that are not in the baseline profile: they are the ones most often missed.

## A starting map for a public authority or a CI operator

If you are starting work in a public authority or at a critical infrastructure operator, a rough sequence is:

1. **Inventory the systems and kinds of information.** Decide what information each system processes: open, confidential, official. The kind of information determines the baseline profile.
2. **Choose a baseline profile for each system** and compare it with what is already in place. If there are certified KSZI, find out how to move them to authorisation.
3. **Run a gap analysis at organisation level** against the baseline cyber protection measures (NIST CSF 2.0): which processes exist and which are missing.
4. **Draw up the cyber protection plan** using the approved form. It is the main document recording the current state and the plan to close the gaps.
5. **Design incident response** with mandatory reporting to CERT-UA from the start: classification by severity and deadlines.
6. **Find the overlaps early.** If you are implementing an ISMS, decide which controls the systems inherit from the ISMS level, so you do not run two parallel projects or repeat the same thing system by system.

How the documents behind this map connect is shown by the [key chains](#/sources?scope=core&mode=chains#chain-system-baseline).

When the requirements for the organisation and for each system exist as data, they can be checked automatically: [GRC engineering](#/guide?c=grc).
