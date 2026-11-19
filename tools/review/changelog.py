"""Diff v0 snapshot against the current repo.
usage: changelog.py <repo> <v0dir> <out.csv>  -> prints summary, writes per-row change CSV."""
import sys, os, csv, tempfile, shutil
sys.path.insert(0, os.path.dirname(__file__)); import wbio

repo, v0dir, outf = sys.argv[1:4]
tmp = tempfile.mkdtemp()
os.symlink(os.path.abspath(f"{repo}/scripts"), f"{tmp}/scripts")
os.symlink(os.path.abspath(f"{repo}/data"), f"{tmp}/data")
os.symlink(os.path.abspath(v0dir), f"{tmp}/mappings")
old, new = wbio.load(tmp), wbio.load(repo)

def flat(d):
    P, L = {}, {}
    for wb, w in d.items():
        for p in w['provisions']: P[p['id']] = (wb, p)
        for fw, rows in w['links'].items():
            for r in rows: L[(r['provision_id'], fw, r['control_id'] or '—')] = (wb, r)
    return P, L

P0, L0 = flat(old); P1, L1 = flat(new)
KEYF = ['relationship', 'coverage', 'parameter_uk', 'notes_uk', 'policies', 'rationale']
rows = []
stats = {}
def bump(wb, k): stats.setdefault(wb, {}).setdefault(k, 0); stats[wb][k] += 1
for pid in sorted(set(P0) | set(P1)):
    if pid not in P1: wb = P0[pid][0]; bump(wb, 'prov_deleted'); rows.append([wb, pid, '', 'provision deleted', '']); continue
    wb, p = P1[pid]
    if pid not in P0: bump(wb, 'prov_added'); rows.append([wb, pid, '', 'provision added', p.get('ref_uk', '')]); continue
    q = P0[pid][1]
    ch = [f for f in ('ref_uk', 'summary_uk', 'provision_type', 'applies_to') if (p.get(f) or '') != (q.get(f) or '')]
    if ch:
        bump(wb, 'prov_changed')
        if 'provision_type' in ch: bump(wb, 'type_changed')
        if 'applies_to' in ch: bump(wb, 'scope_changed')
        rows.append([wb, pid, '', 'provision changed: ' + ', '.join(ch),
                     '; '.join(f"{f}: {q.get(f) or '∅'} → {p.get(f) or '∅'}" for f in ch if f in ('ref_uk', 'provision_type', 'applies_to'))])
for k in sorted(set(L0) | set(L1)):
    pid, fw, c = k
    if k not in L1: wb = L0[k][0]; bump(wb, 'link_deleted'); rows.append([wb, pid, f"{fw} {c}", 'mapping deleted', L0[k][1].get('relationship', '')]); continue
    wb, r = L1[k]
    if k not in L0:
        bump(wb, 'link_added'); bump(wb, 'nocp_added' if c == '—' else 'ctl_added')
        if r.get('parameter_uk'): bump(wb, 'param_set')
        rows.append([wb, pid, f"{fw} {c}", 'mapping added', f"{r.get('relationship', '')}/{r.get('coverage', '')}"]); continue
    q = L0[k][1]
    ch = [f for f in KEYF if (r.get(f) or '') != (q.get(f) or '')]
    if ch:
        bump(wb, 'link_changed')
        if 'relationship' in ch or 'coverage' in ch: bump(wb, 'rel_changed')
        if 'parameter_uk' in ch and not q.get('parameter_uk'): bump(wb, 'param_set')
        rows.append([wb, pid, f"{fw} {c}", 'mapping changed: ' + ', '.join(ch),
                     f"{q.get('relationship', '')}/{q.get('coverage', '')} → {r.get('relationship', '')}/{r.get('coverage', '')}" if 'relationship' in ch or 'coverage' in ch else ''])
with open(outf, 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['workbook', 'provision', 'mapping', 'change', 'detail']); w.writerows(rows)
def count(d):
    np = sum(len(w['provisions']) for w in d.values()); ns = sum(1 for w in d.values() for p in w['provisions'] if p['provision_type'] in ('substantive', 'recommendation'))
    nl = sum(len(r) for w in d.values() for r in w['links'].values())
    npar = sum(1 for w in d.values() for rr in w['links'].values() for r in rr if r.get('parameter_uk'))
    nn = sum(1 for w in d.values() for rr in w['links'].values() for r in rr if not r.get('control_id'))
    return np, ns, nl, npar, nn
print('v0  provisions %d substantive %d mapping rows %d with parameter %d «—» rows %d' % count(old))
print('now provisions %d substantive %d mapping rows %d with parameter %d «—» rows %d' % count(new))
keys = ['prov_added', 'prov_deleted', 'prov_changed', 'type_changed', 'scope_changed', 'link_added', 'ctl_added', 'nocp_added', 'link_deleted', 'link_changed', 'rel_changed', 'param_set']
print('workbook,' + ','.join(keys))
for wb in sorted(stats): print(wb + ',' + ','.join(str(stats[wb].get(k, 0)) for k in keys))
shutil.rmtree(tmp)
