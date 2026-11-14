"""Fill the prompt templates for one review stage.

usage: mkprompts.py <workspace> <stage> <seg1,seg2,...> --kind review|chair|fill|sweep [--personas ciso,grc,reg] [--note FILE]

<workspace> holds project.json, contract.md, personas.json, decisions.md, author_decisions.md and texts/INDEX.md
(see README.md). <stage> is a folder name inside it (r1, r2, ..., sw, cc). The segment files
<stage>/seg_<seg>.txt and <stage>/controls.txt must exist (segments.py writes them).
--note appends the text of FILE to every prompt (round-specific instructions: what changed, what is settled).
Writes <stage>/prompt_<seg>_<persona>.md, chair_<seg>.md, fillprompt_<seg>.md or sweepprompt_<seg>.md.
"""
import argparse, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('ws'); ap.add_argument('stage'); ap.add_argument('segs')
ap.add_argument('--kind', required=True, choices=['review', 'chair', 'fill', 'sweep'])
ap.add_argument('--personas', default='')
ap.add_argument('--note', default='')
a = ap.parse_args()
W = os.path.abspath(a.ws); d = f'{W}/{a.stage}'
proj = json.load(open(f'{W}/project.json'))
def tpl(name):
    p = f'{W}/templates/{name}'
    return open(p if os.path.exists(p) else f'{HERE}/templates/{name}').read()
common = {'[LIBRARY]': f'{W}/texts/INDEX.md', '[CONTRACT]': f'{W}/contract.md', '[LEDGER]': f'{W}/decisions.md',
          '[DECISIONS]': f'{W}/author_decisions.md', '[OPSPEC]': f'{HERE}/apply_ops.py', '[WBIO]': f'{HERE}/wbio.py',
          '[CONTROLS]': f'{d}/controls.txt'}
common.update({f'[{k}]': v for k, v in proj.items()})
note = ('\n\n' + open(a.note).read()) if a.note else ''
def fill(t, extra):
    for k, v in {**common, **extra}.items():
        t = t.replace(k, v)
    return t + note
out = []
for seg in a.segs.split(','):
    seg_f = f'{d}/seg_{seg}.txt'
    if a.kind == 'review':
        P = json.load(open(f'{W}/personas.json'))
        keys = a.personas.split(',') if a.personas else [k for k in P if k != 'all']
        for k in keys:
            persona, lens = P[k]
            f = f'{d}/prompt_{seg}_{k}.md'
            open(f, 'w').write(fill(tpl('reviewer.md'), {'[PERSONA]': persona, '[LENS]': lens, '[SEGFILE]': seg_f,
                                                        '[OUTFILE]': f'{d}/rev_{seg}_{k}.jsonl'}))
            out.append(f)
    elif a.kind == 'chair':
        revs = sorted(x for x in os.listdir(d) if x.startswith(f'rev_{seg}_') and x.endswith('.jsonl'))
        f = f'{d}/chair_{seg}.md'
        open(f, 'w').write(fill(tpl('chair.md'), {'[SEGFILE]': seg_f, '[REVFILES]': ', '.join(f'{d}/{x}' for x in revs),
            '[RULINGS]': f'{d}/ac_{seg}.jsonl', '[OPS]': f'{d}/ops_{seg}.jsonl', '[RID_PREFIX]': f'{a.stage.upper()}-{seg}'}))
        out.append(f)
    elif a.kind == 'fill':
        f = f'{d}/fillprompt_{seg}.md'
        open(f, 'w').write(fill(tpl('fill.md'), {'[SEGFILE]': seg_f, '[OPS]': f'{d}/fill_{seg}.jsonl', '[IDPREFIX]': f'FILL-{seg}'}))
        out.append(f)
    else:
        f = f'{d}/sweepprompt_{seg}.md'
        open(f, 'w').write(fill(tpl('sweep.md'), {'[SEGFILE]': seg_f, '[EXTRA]': '', '[PREFIX]': f'SW-{seg}',
            '[FINDINGS]': f'{d}/find_{seg}.jsonl', '[OPS]': f'{d}/ops_{seg}.jsonl'}))
        out.append(f)
for f in out:
    t = open(f).read()
    missing = sorted(set(re.findall(r'\[[A-Z][A-Z_]+\]', t)))
    print(f, ('UNFILLED: ' + ' '.join(missing)) if missing else 'ok')
