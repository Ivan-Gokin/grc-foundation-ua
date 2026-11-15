"""Write per-segment review views of the current workbooks, plus controls.txt.
usage: SEGS='{"A":["ua-law-80-94-vr"],"B":["ua-nbu-64-2018#1"]}' segments.py <repo> <outdir>
Without SEGS, every act with provisions becomes its own segment (named by its source id).
"<id>#1" / "<id>#2" splits a long act into halves."""
import sys, csv, os
sys.path.insert(0, os.path.dirname(__file__))
import wbio
repo, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
import json as _j
SEG = _j.loads(os.environ['SEGS']) if os.environ.get('SEGS') else None  # {seg: [source_id, 'source_id#1' (first half), ...]}
data = wbio.load(repo)
if SEG is None:
    SEG = {}
    for _wb, _d in data.items():
        for _p in _d['provisions']: SEG.setdefault(_p['source_id'], [_p['source_id']])
ctl = {}
for f in ['iso27001-2022', 'csf-2.0']:
    for r in csv.DictReader(open(f'{repo}/data/controls_{f}.csv')):
        ctl[(f, r['id'])] = r['name_en'] or r.get('text_en', '')
src = {r['id']: r for r in csv.DictReader(open(f'{repo}/data/sources.csv'))}
dec = {r['id']: r for r in csv.DictReader(open(f'{repo}/data/decisions.csv'))}
appl = {}
for r in csv.DictReader(open(f'{repo}/data/applicability.csv')): appl.setdefault(r['source_id'], []).append(r)
ids = lambda s: [x for x in (s or '').split(';') if x]
provs, links = [], {}
for wb, d in data.items():
    for p in d['provisions']: p['_wb'] = wb; provs.append(p)
    for fw, rows in d['links'].items():
        for r in rows: links.setdefault(r['provision_id'], []).append((fw, r))
KEYS = [('parameter_uk', 'ПАРАМЕТР'), ('policies', 'КУДИ'), ('notes_uk', 'ПРИМІТКА')]
for seg, acts in SEG.items():
    out = open(f'{outdir}/seg_{seg}.txt', 'w')
    cited = []
    for a in acts:
        half = None
        if '#' in a: a, half = a.split('#')
        s = src[a]
        out.write(f"\n=== ACT {a} | {s['short_ref_uk']} | {s['title_uk']} | {s['title_en']} | url: {s['url']} | workbook mappings/{next((p['_wb'] for p in provs if p['source_id']==a), '?')}\n")
        if s.get('checked_edition'): out.write(f"  Звірена редакція (для всього акта): {s['checked_edition']}\n")
        if s.get('act_condition_uk'): out.write(f"  Умова для всього акта: {s['act_condition_uk']}\n")
        for r in appl.get(a, []):
            if r.get('except') or r.get('decisions'):
                out.write(f"  Застосовність: {r['sector_id']}" + (f" | крім: {r['except']}" if r.get('except') else '') + (f" | але так, якщо є: {r['unless']}" if r.get('unless') else '') + (f" | РІШЕННЯ: {r['decisions']}" if r.get('decisions') else '') + "\n")
                cited += ids(r.get('decisions'))
        plist =[p for p in provs if p['source_id'] == a]
        if half: n = (len(plist) + 1) // 2; plist = plist[:n] if half == '1' else plist[n:]
        for p in plist:
            out.write(f"\n[{p['id']}] Пункт: {p['ref_uk']} | Тип: {p['provision_type']} | Стосується лише: {p['applies_to'] or '-'}" + (f" | Підстава: {p['grounds']} ({p['decisions']})" if p.get('decisions') else '') + "\n")
            cited += ids(p.get('decisions'))
            out.write(f"  Вимога: {p['summary_uk']}\n")
            if p.get('notes'): out.write(f"  Застереження: {p['notes']}\n")
            for fw, r in links.get(p['id'], []):
                c = r['control_id'] or '—'
                out.write(f"  -> {fw} {c} «{ctl.get((fw, r['control_id']), '')}» | {r['relationship'] or 'no_relationship'} | покриття={r['coverage'] or '-'} | {r['rationale']} | {r['review_status']}" + (f" | ПІДСТАВА: {r['grounds']} ({r['decisions']})" if r.get('decisions') else ''))
                cited += ids(r.get('decisions'))
                for k, lab in KEYS:
                    if r.get(k): out.write(f" | {lab}: {r[k]}")
                out.write('\n')
            fws = {fw for fw, _ in links.get(p['id'], [])}
            if p['provision_type'] == 'substantive':
                for fw in ['iso27001-2022', 'csf-2.0']:
                    if fw not in fws: out.write(f"  -> {fw}: (немає жодного рядка)\n")
    if cited:
        out.write("\n=== РІШЕННЯ (data/decisions.csv), на які посилаються рядки цього сегмента\n")
        for i in dict.fromkeys(cited):
            d = dec.get(i, {})
            out.write(f"[{i}] {d.get('kind', '?')}, {d.get('status') or '-'}, {d.get('date', '')}: {d.get('statement_uk', '(немає в реєстрі)')}\n")
    out.close()
with open(f'{outdir}/controls.txt', 'w') as out:
    for f in ['iso27001-2022', 'csf-2.0']:
        out.write(f"\n## {f}\n")
        for r in csv.DictReader(open(f'{repo}/data/controls_{f}.csv')):
            out.write(f"{r['id']} [{r['level']}] {r['name_en'] or r.get('text_en','')}\n")
for f in sorted(os.listdir(outdir)): print(f, os.path.getsize(f'{outdir}/{f}'))
