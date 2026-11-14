"""Append one stage's chair rulings to the decision ledger.
usage: ledger.py <workspace> <stage> <seg1,seg2,...>
Reads <workspace>/<stage>/ac_<seg>.jsonl; appends VALID, CLARIFY, SETTLED and AUTHOR items to <workspace>/decisions.md.
Chairs and later reviewers read the ledger, so a ruled question is not re-argued every round."""
import json, sys, collections
W, rnd, segs = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
out = open(f'{W}/decisions.md', 'a')
for seg in segs:
    out.write(f"\n## {rnd.upper()} segment {seg}\n\n")
    cnt = collections.Counter()
    for l in open(f'{W}/{rnd}/ac_{seg}.jsonl'):
        l = l.strip()
        if not l: continue
        r = json.loads(l); cnt[r.get('ruling')] += 1
        if r.get('ruling') in ('VALID', 'CLARIFY', 'SETTLED', 'AUTHOR'):
            out.write(f"- {r['rid']} | {r.get('crit','')} | {r.get('loc','')[:160]} | {r['ruling']} | {r.get('action','')[:300]} | {r.get('rationale','')[:300]}\n")
    print(seg, dict(cnt))
