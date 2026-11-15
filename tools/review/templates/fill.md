You complete mapping data of the open dataset [PROJECT] ([JURISDICTION] legal provisions mapped to ISO/IEC 27001:2022 and NIST CSF 2.0). Readers use it as the legally grounded starting point of their ISMS: every mapped control becomes a locked "required by law" row of their Statement of Applicability (ISO) or target profile (CSF), «Параметр за законом» becomes the legal minimum next to the organisation's own value, and «—» rows are listed as requirements with no counterpart. Do NOT edit repository files; write edit operations to a file.

Read completely:
- the current data of your segment: [SEGFILE]
- the contract (spine, rubric, venue standards, revision constraints): [CONTRACT]
- the decision ledger: [LEDGER] (do not contradict it)
- the edit-operation format: the docstring of [OPSPEC]
- the control catalogue: [CONTROLS] (map only to leaf items: ISO clause requirements such as 6.1.2 and Annex A controls such as A.8.15; CSF subcategories such as PR.PS-04)

Two tasks, both for every provision of type substantive in [SEGFILE]:

FILL-C4 (missing framework). Where a provision shows `-> <framework>: (немає жодного рядка)`, map it DIRECTLY to that framework from the provision's own text (`Вимога`, and the act text if needed): every control it actually requires, with the NIST IR 8477 relationship read as "provision is a <relationship> of control" (subset_of: the control fully covers it; intersects_with: each has something of its own; superset_of: the provision is broader; equal: same scope), coverage consistent with it (equal/subset_of full, else partial), rationale semantic/syntactic/functional, a short policy_uk (the internal document it belongs in, using the names already used in the segment where possible) and a one-sentence notes_uk. Do not derive the mapping mechanically from the other framework's rows; use them only as a cross-check. No indirect or "could support" links: map only what the provision requires. Usually 1-3 controls per provision. If the obligation has no counterpart in that framework (e.g. reporting to the NBU or SSSCIP, a state procedure), add one «—» row (control_id "—") with notes_uk saying what has no counterpart. For SSSCIP Order 75 baseline measures, which are CSF 2.0 subcategories, map the measure's outcome to ISO/IEC 27001:2022 directly.

FILL-C3 (legal parameters). For every mapping row (existing and new) whose provision sets a value, deadline, frequency, minimum, mandatory content, condition or prohibition that the control leaves to the organisation, set parameter_uk to that legal minimum in short practical [DATA_LANGUAGE] (e.g. «не рідше 1 разу на рік», «щонайменше 2 штатні працівники», «повідомити НБУ протягом 1 години», «зберігати журнали не менше 3 років»). Take it only from the provision's `Вимога`, its notes, or an act text you fetched (then add the source with append_notes_uk). Never invent or round values. Put the parameter on the row(s) of the control it parameterises, not on every row. If an existing row says subset_of/full but the provision demands a specific value or condition the control does not, setting the parameter is the fix; change the relationship only if, even with the parameter, the control does not fully cover the provision.

Rules: codes, not labels; every op has "id" "[IDPREFIX]-<nnn>" and a short "why"; [DATA_LANGUAGE] first; never quote ISO/IEC 27001 text; never change provision ids, codes or existing rows other than setting parameters (and the relationship case above).

Write the ops to [OPS]. Then run
python3 [OPSPEC] [REPO] [OPS] --dry
and fix every ERROR it prints (--dry writes nothing). Reply with: provisions given a missing framework, links added, «—» rows added, parameters set.
