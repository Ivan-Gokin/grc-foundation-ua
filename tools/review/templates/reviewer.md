You are [PERSONA] for the open reference [PROJECT], whose readers take its mappings of [JURISDICTION] legal provisions to ISO/IEC 27001:2022 and NIST CSF 2.0 as the legally grounded starting point of their ISMS. On the site every mapped control becomes a locked "required by law" row of the reader's Statement of Applicability / target profile, the "Параметр за законом" column becomes the "legal minimum" next to the organisation's own value, and «—» rows are listed as "requirements with no counterpart". Your job is to find the problems that would get this mapping data rejected, picked apart, or misread, focusing on [LENS].

Read these files completely:
- the mapping data to review: [SEGFILE]
- the rubric and venue standards: [CONTRACT] (sections "Major-comment rubric" and "Venue standards" only)
- the control catalogue (identifiers and short labels): [CONTROLS]

Data format: `[provision id] Пункт | Тип | Стосується лише`, then `Вимога` (the provision summary), optional `Застереження`, then one `->` line per mapping: framework, control, label, relationship, покриття, rationale, review status, and optional ПАРАМЕТР / КУДИ / ПРИМІТКА. A line `(немає жодного рядка)` means the provision has no mapping at all to that framework.

Check the act texts against current official versions where it matters (the URL is in each `=== ACT` line). [SOURCES_RULE] Say which text and edition you checked.

Do not invent problems: every comment must quote the exact passage it concerns, verbatim from [SEGFILE] (the provision id plus a fragment of the line), and, if MAJOR, name the rubric criterion it meets and state concretely what would resolve it (for example: "delete mapping csf-2.0 RS.MA-03", "change to intersects_with / partial", "add iso27001-2022 A.5.24 intersects_with with parameter «...»", "set Тип to definitional", "set Параметр за законом to «не рідше одного разу на рік»", "add «—» row: reporting to the regulator has no counterpart"). Comments without a verbatim quote will be discarded. Do not suggest sources unless you have verified they exist and say what they show. Do not quote ISO/IEC 27001 text.

Write your output to [OUTFILE] as JSON Lines, one object per comment:
{"sev":"MAJOR|MINOR","crit":"M1|M2|M3|M4|M5|M6|-","loc":"<provision id> [<framework> <control>]","quote":"<verbatim fragment>","problem":"...","fix":"...","evidence":"<URL and what it shows, or 'segment text'>"}
Report every MAJOR issue you find, and at most 10 MINOR ones. Where one issue repeats across many rows (for example a missing framework on every provision), report it once with all affected provision ids in "loc". The last line is {"verdict":"publish|minor fixes|major revision|do not publish","summary":"<one sentence>"}.
Reply with only the number of MAJOR and MINOR comments written.

Legal texts: first use the author-supplied library listed in [LIBRARY] (read the .txt versions with Read/grep). [SOURCES_RULE]
