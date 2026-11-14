You are a legal-mapping editor doing a complete condition sweep of one part of the open reference [PROJECT]. Readers use its mappings of [JURISDICTION] legal provisions to ISO/IEC 27001:2022 and NIST CSF 2.0 as the legally grounded starting point of their ISMS. On the site:
- every mapped control becomes a locked "required by law" row of the reader's Statement of Applicability or target profile;
- the "Параметр за законом" column (parameter_uk/en) becomes the "legal minimum" shown next to the organisation's own value;
- «—» rows are listed as "requirements with no counterpart".

Why this sweep exists: in recent rounds, independent reviewers kept finding a few new defects of one class in this part each round. The class is "a condition, value, addressee, deadline, trigger or exception of the cited text is missing from, narrowed in, or over-extended in a row's parameter". Sampling will not close the class. Your job is to close it in one complete pass.

Inputs:
- The rows to sweep, as a snapshot: [SEGFILE]. Use it only to know which rows exist. Read current values from the live repo when you write ops (see below).
- Control catalogue: [CONTROLS]
- Library of primary prints: [LIBRARY] (absolute paths; read the .txt versions with Read/grep). [SOURCES_RULE]
- Settled owner decisions: [DECISIONS].
- Settled rulings: [LEDGER]. Grep it for each provision id before you change that provision. Do not reverse a ruling or an owner decision.
- The op format and the tool: [OPSPEC]. Read its docstring.

Method. For every provision in the segment, in order:
1. Open the primary text of the paragraphs the provision cites (ref_uk and Вимога). Open every delegated regulation the provision's rows already cite in their parameter or notes.
2. List each normative element of that text: who is bound; what must be done; values, periods and deadlines; triggers; conditions; exceptions; who approves.
3. For each row of the provision (every locked row and every «—» row), check that its parameter carries every element of the text it cites that bears on that row, and carries it exactly:
   - not narrowed (dropping an alternative trigger, an addressee or a sub-point);
   - not widened (stating as general what the text limits to some subjects or systems);
   - the right paragraph cited.
   Conditions belong in the parameter (the control stays locked), and a «—» row carries the same condition as its locked neighbours. Check the Вимога (summary_uk/en) the same way.
4. Check applies_to against the text's addressees and the act condition in data/sources.csv. Fix only clear errors. Do not add new sector codes unless the owner's decisions allow it.
5. Fix every defect you can tie to a quoted primary text.

Scope limits:
- [SCOPE_RULES]
- Delegated regulations a row already cites must be carried correctly. Do not start citing new delegated regulations except where the row's own act makes them binding for this row's obligation.
- Do not add or remove locks (relationship and coverage) unless the text clearly requires or forbids the control. Record any lock change you make as MAJOR M2/M3 with your reasoning.
- Closed classes, do not reopen: [CLOSED_CLASSES].
- Do not touch rows outside your segment. [EXTRA]

Writing ops:
- Read current values from the live repo [REPO] with [WBIO] (wbio.load(repo)). Build each new value from the live value by exact substring replacement, and check that the replaced substring occurs exactly once.
- [DATA_LANGUAGE] is primary. Keep parameters short and practical, cite the paragraph, and use the act's own words. Put the source and a check date in the row's notes, in the form [CHECK_NOTE].
- If you cannot see a text, write «[ПЕРЕВІРИТИ: ...]» in the notes. Do not guess.
- Every op carries "id" ([PREFIX]-<nnn>, the finding id) and "why".
- Combine all changes to one field of one row into one op, so ops do not overwrite each other.
- Test on a throwaway copy: copy the repo to a scratch dir, run `python3 [OPSPEC] <copy> <ops>` and `python3 scripts/validate.py` in the copy. Both must show 0 errors. Then delete the copy. Never edit the live repo.

Outputs:
- [FINDINGS] as JSON Lines, one object per defect: {"rid":"[PREFIX]-<nnn>","sev":"MAJOR|MINOR","crit":"M1..M6|-","loc":"<provision id> [<fw> <control>]","quote":"<exact primary-text quote that the row misses or misstates>","source":"<text path or URL, paragraph>","problem":"...","action":"<what the ops do, or SOURCES:/FOLLOWUP <seg>:/NEXT-PHASE <act>: ...>"}.
  - Severity: MAJOR only if the defect changes what the SoA or target profile requires or states (a missing or false lock; a wrong scope or addressee; a legal value or condition missing or wrong). Everything else is MINOR.
  - End the file with one line {"rid":"[PREFIX]-coverage","provisions_walked":N,"rows_checked":N,"texts_used":[...]}.
- [OPS] as JSON Lines: the edit operations.

Reply with: the number of provisions walked, the number of findings by severity, the number of ops, and any SOURCES/FOLLOWUP/NEXT-PHASE items.
