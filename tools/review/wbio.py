"""Lossless-enough load/save of mappings/*.xlsx via the project's mapdata module.
load(repo) -> {workbook_name: {"provisions":[prov dicts (PROV_COLS fields, codes, derived grounds)], "links":{fw:[link dicts (LINK_COLS fields, codes, derived grounds)]}}}
save(repo, data) rewrites every workbook with mapdata.write_workbook."""
import sys, csv
from pathlib import Path

def _md(repo):
    sys.path.insert(0, str(Path(repo) / 'scripts'))
    import mapdata
    return mapdata

def frameworks(repo):
    return [r['id'] for r in csv.DictReader(open(Path(repo) / 'data/frameworks.csv'))]

def load(repo):
    md = _md(repo)
    prov, maps, errs = md.read_all(frameworks(repo), Path(repo) / 'mappings')
    if errs: raise SystemExit(errs)
    out, pid2 = {}, {}
    for p in prov:
        wb = p['_where'].split(' / ')[0]
        d = out.setdefault(wb, {'provisions': [], 'links': {}})
        row = {f: p.get(f, '') for f, *_ in md.PROV_COLS}
        row['code'] = p['id'].split(':', 1)[1]
        row['id'] = p['id']
        d['provisions'].append(row)
        pid2[p['id']] = (wb, p)
    for m in maps:
        wb, p = pid2[m['provision_id']]
        fw = m['framework_id']
        row = {f: m.get(f, '') for f, *_ in md.LINK_COLS}
        row['source_id'], row['ref_uk'] = p['source_id'], p['ref_uk']
        row['provision_id'] = p['id']
        out[wb]['links'].setdefault(fw, []).append(row)
    # what each row rests on, derived from the decisions it cites (data/decisions.csv), as read_all does
    kinds = md.decision_kinds(Path(repo) / 'data' / 'decisions.csv')
    for d in out.values():
        for r in d['provisions'] + [x for rs in d['links'].values() for x in rs]:
            r['grounds'] = md.grounds_of(r.get('decisions', ''), kinds)
    # keep framework sheet order as in file
    import openpyxl
    for wb in out:
        names = openpyxl.load_workbook(Path(repo) / 'mappings' / wb, read_only=True).sheetnames
        out[wb]['sheets'] = [n for n in names if n != md.PROV_SHEET]
    return out

def save(repo, data):
    md = _md(repo)
    for wb, d in data.items():
        links = {}
        for fw in d.get('sheets') or list(d['links']):
            rows = []
            for r in d['links'].get(fw, []):
                r = dict(r)
                if not r.get('control_id'): r['control_id'] = '—'
                if r.get('relationship') == 'no_relationship' and r['control_id'] == '—': r['relationship'] = ''
                rows.append(r)
            links[fw] = rows
        for fw in d['links']:
            if fw not in links: links[fw] = d['links'][fw]
        md.write_workbook(Path(repo) / 'mappings' / wb, d['provisions'], links)
