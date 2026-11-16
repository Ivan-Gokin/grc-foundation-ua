# Chains for the AI review

- `plan.md` — the chains in priority order, the acts in each (which to map, which are context or legal basis), and which texts are still needed, with links. Start here.
- `triage.csv` — one row per in-force act in the register: verdict (`map`, `basis`, `check`, `drop`), addressees, topic, parent act, priority and the reason. Made from the register alone by AI on 2026-11-16; not reviewed by a person.
- `build_chains.py`, `gen_plan.py` — regenerate the plan after the triage or the register changes: `python3 docs/chains/build_chains.py . <dir with triage.csv>` then `python3 docs/chains/gen_plan.py <dir>` from the repository root.
