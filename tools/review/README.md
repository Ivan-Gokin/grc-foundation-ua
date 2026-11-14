# Review tooling

These scripts and prompt templates ran the 2026-11 AI review of the mappings: 13 rounds, a condition sweep and two final checks. The method and the lessons learned are in [`docs/REUSE.md`](../../docs/REUSE.md), section 8. This file says what each piece does and how to run a round.

The scripts never edit the workbooks on their own initiative. Reviewers and chairs (AI agents) write **JSON Lines**. A person, or the coordinating agent, then applies the chair's **edit operations** with `apply_ops.py`, runs `scripts/validate.py`, and commits.

## Files

| File | What it does |
|---|---|
| `wbio.py` | Loads every `mappings/*.xlsx` into Python dicts, and saves them back, through the project's `scripts/mapdata.py`. The other scripts build on it. |
| `segments.py` | Writes one plain-text view per review segment (`seg_<seg>.txt`, with every provision and every mapping line) plus `controls.txt`. Reviewers read these files, not the workbooks. |
| `mkprompts.py` | Fills the templates in `templates/` for one stage: reviewer prompts (one per persona), chair, fill or sweep prompts. |
| `apply_ops.py` | Applies edit operations to the workbooks. It refuses an op whose old value no longer matches, and with `--dry` it writes nothing. Its docstring is the **op format** that chairs must follow. |
| `ledger.py` | Appends a stage's rulings to `decisions.md`. Later chairs read this ledger, so a settled question is not argued again. |
| `apply_stage.sh` | Runs apply → validate → ledger → build → commit → push for one segment, and stops on any error. |
| `set_act_cond.py` | Sets act-level fields in `data/sources.csv`, such as `act_condition_uk` and `checked_edition`, and refuses to write unless the csv round-trip is byte-identical. |
| `retired.py` | Rebuilds `data/retired_provisions.csv` from every applied `del_prov` op, so deleted codes are never reused. |
| `changelog.py` | Compares the current workbooks with a frozen snapshot (`v0/`) and writes a per-row change CSV and a summary. |
| `deliverables.py` | Builds the review record into `docs/<folder>`: responses, open issues, changes, ledger, owner decisions, log and contract. |
| `lawyer_sample.py` | Draws a reproducible, stratified random sample of mapping rows (default 50, seed 20261113) for a lawyer's spot check, as an Excel file with empty verdict columns. |
| `templates/reviewer.md` | Reviewer prompt. It returns comments with a verbatim quote, a severity, a rubric criterion and a concrete fix. |
| `templates/chair.md` | Chair prompt. It discards unquoted comments, merges duplicates, rules each item (VALID, DOWNGRADE, INVALID, CLARIFY, SETTLED or AUTHOR) and writes the ops. |
| `templates/fill.md` | Fill pass. It adds the missing framework for each provision and sets the legal parameters. |
| `templates/sweep.md` | Condition sweep. It walks every provision and row of an act against the primary text, then writes findings and ops. |
| `templates/personas.example.json` | The three reviewer personas: CISO, GRC analyst and regulator, plus a combined `all` reviewer for cheap confirmation rounds. |
| `templates/contract.example.md` | The review contract as used for Ukraine: the claim the data must support, the rubric M1–M6, the standards, and the constraints on revisions. |
| `templates/project.example.json` | The values that fill the `[PROJECT]`, `[JURISDICTION]`, `[DATA_LANGUAGE]`, `[SOURCES_RULE]` and similar placeholders. |

## Workspace

Keep the review **outside the repository**, in a workspace folder:

```
review-ws/
  project.json          from templates/project.example.json, filled in for your country
  personas.json         from templates/personas.example.json, with your regulators and audience
  contract.md           from templates/contract.example.md, rewritten for your scope
  author_decisions.md   the owner's decisions (AUTH-01, AUTH-02, ...): settled for every reviewer and chair
  decisions.md          the ledger (ledger.py appends to it)
  texts/INDEX.md        the library of primary legal texts: one row per act, path to a clean .txt print, edition, notes
  texts/...             the prints themselves (PDF → text, layout preserved)
  v0/                   a copy of mappings/*.xlsx before the review, for changelog.py
  r1/, r2/, ...         one folder per round: seg_*.txt, prompt_*.md, rev_*.jsonl, chair_*.md, ac_*.jsonl, ops_*.jsonl
  sw/, cc/              the sweep and the final checks, in the same layout
  templates/            optional: your own copies of the templates, which take precedence over tools/review/templates
```

## One round

```bash
T=tools/review; W=../review-ws; R=r5
SEGS='{"A":["ua-law-80-94-vr"],"B":["ua-ssscip-75-2026"]}' python3 $T/segments.py . $W/$R
python3 $T/mkprompts.py $W $R A,B --kind review --note $W/$R/note.md    # note: what changed, what is settled
# → run one AI agent per prompt_<seg>_<persona>.md (see docs/REUSE.md 8.3); each writes rev_<seg>_<persona>.jsonl
python3 $T/mkprompts.py $W $R A,B --kind chair --note $W/$R/note.md
# → run one AI agent per chair_<seg>.md; each writes ac_<seg>.jsonl and ops_<seg>.jsonl
$T/apply_stage.sh . $W $R A "Round 5, Закон 80/94: <summary>"
$T/apply_stage.sh . $W $R B "Round 5, Наказ 75: <summary>"
```

Count the round's valid majors with a one-liner over `ac_*.jsonl` (`sev == "MAJOR"` and `ruling` VALID or CLARIFY), then check them against your stopping criteria.

## Rules that made the difference

- **Quote or discard.** Every reviewer comment carries a verbatim quote from the segment file, and the chair checks it with grep. This removed hallucinated defects almost entirely.
- **Ops, not edits.** Chairs never touch the repo. Their ops are tested on a throwaway copy (apply_ops plus validate, both at 0 errors) before anyone applies them to the live repo.
- **Read live values.** Two chairs may run at once, and a segment snapshot can be stale. Every op is built from the live value by an exact single-occurrence substring replacement.
- **Owner decisions are settled.** `author_decisions.md` is the only way to stop a question from coming back every round.
- **Primary texts only.** The library is the basis of every legal claim. A mirror site is never enough. Where the text cannot be seen, the row gets `[ПЕРЕВІРИТИ: …]` rather than a guess.
