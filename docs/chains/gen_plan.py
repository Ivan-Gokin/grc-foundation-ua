"""docs/chains/plan.md from chains.json, triage.csv, the register and library/. Run from the repo root: python3 gen_plan.py <dir>"""
import json, sys, csv, re, collections
from pathlib import Path
D = sys.argv[1]; C = json.load(open(D + '/chains.json'))
src = {r['id']: r for r in csv.DictReader(open('data/sources.csv', encoding='utf-8'))}
tri = {r['id']: r for r in csv.DictReader(open(D + '/triage.csv', encoding='utf-8'))}
lib = {p.name for p in Path('library').glob('*/*') if p.is_dir()}
sys.path.insert(0, 'scripts'); import mapdata
P, _, _ = mapdata.read_all([r['id'] for r in csv.DictReader(open('data/frameworks.csv'))]); mapped = {p['source_id'] for p in P}

# НД ТЗІ on system protection have no links in the register, so each came out as its own chain: one chain for them
nd = [c for c in C if src[c['root']]['type'] == 'nd_tzi' and len(c['acts']) == 1 and c['topic'] == 'system-protection']
rest = [c for c in C if c not in nd]
if nd:
    rest.append({'topic': 'system-protection', 'root': None, 'priority': min(c['priority'] for c in nd),
                 'leaves': sorted(l for c in nd for l in c['leaves']), 'acts': sorted(l for c in nd for l in c['leaves']), 'nd': True})
rest.sort(key=lambda c: (c['priority'], bool(c.get('nd')) or src[c['root']]['type'] == 'nd_tzi', -len(c['leaves']), c['topic']))
home = {}  # act -> the chain where it is mapped: the first (highest-priority, largest) chain of its own topic
for n, c in enumerate(rest, 1):
    for a in c['acts']:
        if tri.get(a, {}).get('verdict') == 'map' and tri[a]['topic'] == c['topic'] and a not in home:
            home[a] = n

def purl(r):
    u = (r.get('url') or '').split('#')[0]; m = re.search(r'zakon\.rada\.gov\.ua/laws/show/([^/?#]+)', u)
    return f"https://zakon.rada.gov.ua/laws/show/{m.group(1)}/print" if m else u
def name(a): return src[a]['short_ref_uk']
def text(a):
    r = src[a]
    if a in lib: return '✓ library'
    if r['type'] in ('nd_tzi', 'dstu', 'vst'): return 'private (publisher forbids reproduction)'
    if r['text_access'] != 'public': return 'restricted'
    u = purl(r); return f"[fetch]({u})" if u else 'fetch (no link in register)'
def fetch(a): return text(a).startswith('[fetch') or text(a).startswith('fetch')

L = ["# Chain plan for the AI review / План ланцюгів для ШІ-рецензування\n",
     "Generated 2026-11-16 from `docs/chains/triage.csv` (a triage of all 250 in-force acts in the register, from the register alone) and the links in `data/source_relations.csv`. Not reviewed by a person yet.\n",
     "## How to use\n\n- **One chat per chain**, in the order below. A chain runs from the law down to the most specific acts; the reviewer reads them together.\n"
     "- **▶ map here**: the act is drafted and reviewed in this chain. **context (chain N)**: read here, mapped in chain N. **basis**: legal basis only, not mapped. **✔ mapped**: already in the workbooks; re-reviewed where it is mapped.\n"
     "- **Texts**: `✓ library` is in `library/`. `fetch` links go to the zakon.rada.gov.ua print view (or the issuer's page): save it as `library/<type>/<id>/text.txt` with the URL and edition on the first line. `private` texts (НД ТЗІ, standards) go to the private library, not this repository.\n"
     "- Acts with verdict `check`, and fixes to the register, are listed at the end. Dropped acts and the reasons are in `triage.csv`.\n"]
cnt = collections.Counter(t['verdict'] for t in tri.values())
allfetch = {a for c in rest for a in c['acts'] if fetch(a)}; allpriv = {a for c in rest for a in c['acts'] if text(a).startswith('private')}
L.append(f"**Triage:** {cnt['map']} acts to map, {cnt['basis']} legal basis only, {cnt['check']} to check, {cnt['drop']} dropped. "
         f"**Chains:** {len(rest)}. **Texts:** {len(allfetch)} to fetch, {len(allpriv)} for the private library, the rest already in `library/`.\n")
L.append("## Chains in priority order\n\n| # | Priority | Topic | From | Acts to map here | Of them already mapped | Texts to fetch |\n|---|---|---|---|---|---|---|")
for n, c in enumerate(rest, 1):
    here = [a for a in c['acts'] if home.get(a) == n]
    L.append(f"| {n} | {c['priority']} | {c['topic']} | {'НД ТЗІ (technical documents)' if c.get('nd') else name(c['root'])} | {len(here)} | {sum(a in mapped for a in here)} | {sum(fetch(a) for a in c['acts'])} |")
L.append("")
for n, c in enumerate(rest, 1):
    L.append(f"### {n}. {c['topic']} — {'НД ТЗІ' if c.get('nd') else name(c['root'])} (priority {c['priority']})\n")
    L.append("| Act | Role | Text | Note |\n|---|---|---|---|")
    for a in c['acts']:
        t = tri.get(a, {}); v = t.get('verdict', '')
        role = ('✔ mapped, ' if a in mapped else '') + ('▶ map here' if home.get(a) == n else (f"context (chain {home[a]})" if a in home else ('basis' if v == 'basis' else (v or 'context'))))
        L.append(f"| {name(a)} — {src[a]['title_uk'][:90]} (`{a}`) | {role} | {text(a)} | {t.get('reason', '')} |")
    L.append("")
chk = [t for t in tri.values() if t['verdict'] == 'check']
L.append(f"## To check before the chains start ({len(chk)})\n\n| Act | What to check |\n|---|---|")
for t in sorted(chk, key=lambda t: t['id']): L.append(f"| {name(t['id'])} (`{t['id']}`) | {t['reason']} |")
L.append("\n## Register fixes and notes from the triage\n\n- ПКМУ № 1009/2026 and № 1500/2022 are missing from the register; their texts are in `library/cmu/`.\n")
L.append(open(D + '/triage_notes.md', encoding='utf-8').read())
open('docs/chains/plan.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print(len(rest), 'chains;', len(home), 'acts placed; without a home:', [a for a, t in tri.items() if t['verdict'] == 'map' and a not in home],
      '; fetch', len(allfetch), '; private', len(allpriv))
