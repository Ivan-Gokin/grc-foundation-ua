#!/bin/bash
# Apply one segment's chair (or sweep) output to the repo, check it, log it, build, commit and push.
# usage: apply_stage.sh <repo> <workspace> <stage> <seg> "<commit subject>"
# Expects <workspace>/<stage>/ops_<seg>.jsonl and ac_<seg>.jsonl (a sweep's find_<seg>.jsonl is converted to ac_ first).
# Stops before committing if apply_ops or validate reports an error.
set -euo pipefail
REPO=$1; W=$2; STAGE=$3; SEG=$4; MSG=$5
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -f "$W/$STAGE/find_$SEG.jsonl" ] && [ ! -f "$W/$STAGE/ac_$SEG.jsonl" ]; then
  python3 - "$W/$STAGE" "$SEG" <<'P'
import json, sys
d, seg = sys.argv[1], sys.argv[2]
with open(f'{d}/ac_{seg}.jsonl', 'w') as out:
    for l in open(f'{d}/find_{seg}.jsonl'):
        r = json.loads(l)
        if r['rid'].endswith('-coverage'): continue
        r.setdefault('ruling', 'VALID'); r.setdefault('rationale', r.get('problem', ''))
        out.write(json.dumps(r, ensure_ascii=False) + '\n')
P
fi
cd "$REPO"
python3 "$HERE/apply_ops.py" . "$W/$STAGE/ops_$SEG.jsonl" | tail -1 | tee /dev/stderr | grep -q "errors 0"
python3 scripts/validate.py | tail -1 | tee /dev/stderr | grep -q "^0 errors"
python3 "$HERE/ledger.py" "$W" "$STAGE" "$SEG"
python3 scripts/build.py > /dev/null
git add -A
git commit -q -m "$MSG"
git push -q
git log --oneline -1
