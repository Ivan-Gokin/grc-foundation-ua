/* GRC foundation for Ukraine: static site logic. No build step, no tracking.
 * Loads CSV files from data/, filters them in the browser, and exports results. */
(function () {
  "use strict";

  const CFG = window.GRC_CONFIG;
  const I18N = window.GRC_I18N;
  const GLYPH = { equal: "=", subset_of: "⊂", superset_of: "⊃", intersects_with: "∩", no_relationship: "∅" };
  const FILES = [
    "sources.csv", "source_types.csv", "sectors.csv", "sector_groups.csv", "applicability.csv", "source_relations.csv",
    "provisions.csv", "mappings.csv", "frameworks.csv", "controls_iso27001-2022.csv", "controls_csf-2.0.csv",
    "sp800-53/baselines_ua.csv", "sp800-53/map_csf-2.0_sp800-53r5.csv",
  ];
  const VIEWS = ["guide", "controls", "sources", "system", "articles", "data"];
  const ARTICLES = ["isms-policy-case-studies", "grc-systems-overview"];
  const IN_EFFECT = (st) => st === "in_force";

  const D = {}; // indexes
  const S = {   // state (mirrored in the URL hash)
    lang: null, view: "guide", sectors: [], fw: "iso27001-2022", only: true, rec: true, drafts: true,
    repealed: false, context: false, q: "", type: "", baseline: "open", linked: true,
    scope: "core", mode: "list", pending: false, records: false, article: "",
  };
  const guideCache = {};
  const slugify = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
  const app = document.getElementById("app");

  // ------------------------------------------------------------------ helpers
  const t = (k) => (I18N[S.lang] && I18N[S.lang][k] !== undefined ? I18N[S.lang][k] : I18N.uk[k] !== undefined ? I18N.uk[k] : k);
  const fmt = (s, ...a) => String(s).replace(/\{(\d)\}/g, (_, i) => a[+i]);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L = (row, base) => (row ? row[`${base}_${S.lang}`] || row[`${base}_uk`] || row[`${base}_en`] || "" : "");
  const isFallback = (row, base) => S.lang === "en" && row && !row[`${base}_en`] && row[`${base}_uk`];
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  async function loadCsv(name) {
    const res = await fetch(`data/${name}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const text = await res.text();
    return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
  }

  // ------------------------------------------------------------------ data
  async function loadAll() {
    const tables = await Promise.all(FILES.map(loadCsv));
    const by = (rows, key = "id") => Object.fromEntries(rows.map((r) => [r[key], r]));
    const [sources, types, sectors, groups, appl, rels, provs, maps, fws, iso, csf, b53, m53] = tables;
    D.sources = sources;
    D.sourceById = by(sources);
    D.sourceByEli = by(sources, "eli");
    D.types = by(types);
    D.typeOrder = types.map((r) => r.id);
    D.sectors = sectors.sort((a, b) => +a.sort - +b.sort);
    D.sectorById = by(sectors);
    D.groups = groups.sort((a, b) => +a.sort - +b.sort);
    D.parents = {}; D.children = {};
    sectors.forEach((x) => {
      D.parents[x.id] = (x.parent || "").split(";").filter(Boolean);
      D.parents[x.id].forEach((pid) => (D.children[pid] = D.children[pid] || []).push(x.id));
    });
    D.applBySource = {};
    D.unverifiedAppl = 0;
    appl.forEach((r) => {
      (D.applBySource[r.source_id] = D.applBySource[r.source_id] || []).push(r);
      if (r.verified !== "yes") D.unverifiedAppl++;
    });
    D.relsOut = {}; D.relsIn = {};
    rels.forEach((r) => {
      (D.relsOut[r.source_id] = D.relsOut[r.source_id] || []).push(r);
      (D.relsIn[r.related_id] = D.relsIn[r.related_id] || []).push(r);
    });
    D.provById = by(provs);
    D.provsBySource = {};
    provs.forEach((p) => (D.provsBySource[p.source_id] = D.provsBySource[p.source_id] || []).push(p));
    D.mappings = maps;
    D.frameworks = fws.filter((f) => f.tier === "organisation").sort((a, b) => +a.sort - +b.sort);
    D.controls = { "iso27001-2022": iso.sort((a, b) => +a.sort - +b.sort), "csf-2.0": csf.sort((a, b) => +a.sort - +b.sort) };
    D.controlById = { "iso27001-2022": by(iso), "csf-2.0": by(csf) };
    D.b53 = b53;
    D.csfTo53 = {};
    m53.forEach((r) => (D.csfTo53[r.csf_id] = D.csfTo53[r.csf_id] || []).push(r.sp800_53_id));
    try {
      const [meta, pkg] = await Promise.all([
        fetch("data/meta.json").then((r) => r.json()),
        fetch("data/datapackage.json").then((r) => r.json()),
      ]);
      D.meta = meta; D.pkg = pkg;
    } catch (e) { D.meta = null; D.pkg = null; }
    D.rowCounts = Object.fromEntries(FILES.map((f, i) => [f, tables[i].length]));
  }

  // ------------------------------------------------------------------ state <-> URL
  function readHash() {
    if (location.hash && !location.hash.startsWith("#/")) return false; // in-page anchor
    const h = location.hash.replace(/^#\/?/, "");
    const [view, query] = h.split("?");
    if (VIEWS.includes(view)) S.view = view;
    const p = new URLSearchParams(query || "");
    if (p.has("lang") && I18N[p.get("lang")]) S.lang = p.get("lang");
    if (p.has("s")) S.sectors = p.get("s").split(",").filter(Boolean);
    if (p.has("fw")) S.fw = p.get("fw");
    ["only", "rec", "drafts", "repealed", "context", "linked", "pending", "records"].forEach((k) => { if (p.has(k)) S[k] = p.get(k) === "1"; });
    S.q = p.get("q") || "";
    S.type = p.get("type") || "";
    if (p.has("b")) S.baseline = p.get("b");
    if (p.has("scope")) S.scope = p.get("scope") === "reference" ? "reference" : "core";
    if (p.has("mode")) S.mode = p.get("mode") === "chains" ? "chains" : "list";
    S.article = ARTICLES.includes(p.get("a")) ? p.get("a") : "";
    S.act = p.get("act") || ""; // an ELI or id, e.g. from an /eli/... link resolved by 404.html
    return true;
  }
  function writeHash() {
    const p = new URLSearchParams();
    p.set("lang", S.lang);
    if (S.sectors.length) p.set("s", S.sectors.join(","));
    if (S.view === "controls") { p.set("fw", S.fw); p.set("only", S.only ? "1" : "0"); }
    if (S.view === "controls" || S.view === "sources") { p.set("rec", S.rec ? "1" : "0"); }
    if (S.view === "controls") p.set("drafts", S.drafts ? "1" : "0");
    if (S.view === "sources") {
      p.set("scope", S.scope); p.set("mode", S.mode);
      ["repealed", "context", "pending", "records"].forEach((k) => p.set(k, S[k] ? "1" : "0"));
      if (S.type) p.set("type", S.type);
    }
    if (S.view === "articles" && S.article) p.set("a", S.article);
    if (S.view === "system") { p.set("b", S.baseline); p.set("linked", S.linked ? "1" : "0"); }
    if (S.q && (S.view === "controls" || S.view === "sources" || S.view === "system")) p.set("q", S.q);
    const next = `#/${S.view}?${p.toString()}`;
    if (location.hash !== next) history.replaceState(null, "", next);
  }

  // ------------------------------------------------------------------ selection logic
  function expandedSectors() {
    if (!S.sectors.length) return null; // null = everything
    const out = new Set(["general"]);
    const up = (id) => { if (out.has(id) || !D.sectorById[id]) return; out.add(id); D.parents[id].forEach(up); };
    S.sectors.forEach(up);
    return out;
  }
  // selected sectors plus everything narrower (for provisions that apply to a sub-group only)
  function selectedDown() {
    const out = new Set(["general"]);
    const down = (id) => { if (out.has(id)) return; out.add(id); (D.children[id] || []).forEach(down); };
    S.sectors.forEach(down);
    expandedSectors().forEach((id) => out.add(id));
    return out;
  }
  function sourceApplies(src, exp) {
    if (!exp) return true;
    return (D.applBySource[src.id] || []).some((a) => exp.has(a.sector_id));
  }
  // forSources=false: the controls table (only Ukrainian acts in force drive controls)
  function sourceVisible(src, exp, forSources) {
    if (!src) return false;
    if (!forSources) {
      if (src.scope !== "core" || !IN_EFFECT(src.status)) return false;
    } else {
      if (src.scope !== S.scope) return false;
      if (src.status === "repealed" && !S.repealed) return false;
      if ((src.status === "draft" || src.status === "not_yet_in_force") && !S.pending) return false;
      if (!S.context && src.role !== "requirements") return false;
      if (src.domain === "records" && !S.records) return false;
    }
    if (!S.rec && src.binding !== "mandatory") return false;
    return sourceApplies(src, exp);
  }
  function provisionVisible(p, exp) {
    if (!p || !sourceVisible(D.sourceById[p.source_id], exp, false)) return false;
    if (!exp || !p.applies_to) return true;
    const down = selectedDown();
    return p.applies_to.split(";").some((s) => down.has(s));
  }
  function driversFor(fw, exp, includeDrafts) {
    const out = {};
    D.mappings.forEach((m) => {
      if (m.framework_id !== fw || m.relationship === "no_relationship") return;
      if (!m.control_id || (!includeDrafts && isDraft(m))) return;
      const p = D.provById[m.provision_id];
      if (!provisionVisible(p, exp)) return;
      (out[m.control_id] = out[m.control_id] || []).push(m);
    });
    return out;
  }

  // ------------------------------------------------------------------ labels
  const typeLabel = (id) => L(D.types[id], "label") || id;
  const sourceRef = (src) => (src ? L(src, "short_ref") || src.number || src.id : "");
  const sourceTitle = (src) => L(src, "title") || sourceRef(src);
  const controlName = (fw, c) => (fw === "csf-2.0" && c.level === "subcategory" ? L(c, "text") : L(c, "name"));
  const statusLabel = (st) => ({ in_force: t("stInForce"), repealed: t("stRepealed"), not_yet_in_force: t("stNotYet"), draft: t("stDraft") }[st] || t("stUnknown"));
  const roleLabel = (r) => ({ context: t("roleContext"), procedural: t("roleProcedural"), amending: t("roleAmending") }[r] || "");
  const reviewLabel = (r) => ({ ai_draft: t("aiDraft"), draft: t("draft"), imported: t("imported"), reviewed: t("reviewed") }[r] || r);
  const isDraft = (m) => m.review_status === "draft" || m.review_status === "ai_draft";
  const reviewMark = (m) => (isDraft(m) ? ", " + reviewLabel(m.review_status) : "");
  const covLabel = (c) => (c === "full" ? t("fullNote") : c === "partial" ? t("partialNote") : c);
  const relWords = (r) => (t("rel") || {})[r] || r;
  const fwRow = (id) => D.frameworks.find((f) => f.id === id);
  const fwLabel = (f) => (f ? (f.name.startsWith("ISO") ? `${f.name}:${f.version}` : `${f.name} ${f.version}`) : "");

  function glyph(rel, big) {
    return `<span class="glyph${big ? " glyph-big" : ""}" title="${esc(relWords(rel))}" aria-label="${esc(relWords(rel))}">${GLYPH[rel] || "?"}</span>`;
  }

  // ------------------------------------------------------------------ shell
  function renderShell() {
    document.documentElement.lang = S.lang === "uk" ? "uk" : "en";
    document.title = `${t("siteName")}: ${t("siteSub")}`;
    const nav = [["guide", "navGuide"], ["controls", "navControls"], ["sources", "navSources"], ["system", "navSystem"], ["articles", "navArticles"], ["data", "navData"]]
      .map(([v, k]) => `<a href="#/${v}" data-view="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${esc(t(k))}</a>`).join("");
    document.getElementById("header").innerHTML = `
      <div class="brand"><a href="#/guide" class="brand-name">${esc(t("siteName"))}</a><span class="brand-sub">${esc(t("siteSub"))}</span></div>
      <nav class="nav" aria-label="${esc(t("siteName"))}">${nav}</nav>
      <button class="lang" type="button" id="lang" aria-label="${esc(t("langSwitchLabel"))}">${esc(t("langSwitch"))}</button>`;
    document.getElementById("lang").onclick = () => { S.lang = S.lang === "uk" ? "en" : "uk"; store.set("grc-lang", S.lang); render(); };
    const meta = D.meta ? fmt(t("dataVersion"), D.meta.version, D.meta.date) : "";
    document.getElementById("footer").innerHTML = `<p>${esc(t("footer"))} ${esc(meta)}</p>`;
  }

  function render() {
    renderShell();
    writeHash();
    ({ guide: renderGuide, controls: renderControls, sources: renderSources, system: renderSystem, articles: renderArticles, data: renderData })[S.view]();
  }

  // ------------------------------------------------------------------ filter panel (shared)
  function sectorChips() {
    const chip = (s) => `<label class="chip${D.parents[s.id].length ? " chip-sub" : ""}" title="${esc(L(s, "description"))}"><input type="checkbox" name="sector" value="${esc(s.id)}" ${S.sectors.includes(s.id) ? "checked" : ""}><span>${esc(L(s, "label"))}</span></label>`;
    const groups = D.groups.map((g) => {
      const items = D.sectors.filter((s) => s.selectable === "yes" && s.group === g.id);
      const open = g.sort === "0" || items.some((s) => S.sectors.includes(s.id));
      return `<details class="chip-group"${open ? " open" : ""}><summary>${esc(L(g, "label"))}</summary>${items.map(chip).join("")}</details>`;
    }).join("");
    return `<fieldset class="chips"><legend>${esc(t("orgType"))}</legend>
      <p class="hint">${esc(t("orgTypeHint"))}</p>${groups}
    </fieldset>`;
  }
  function toggle(key, label) {
    return `<label class="toggle"><input type="checkbox" data-toggle="${key}" ${S[key] ? "checked" : ""}><span>${esc(label)}</span></label>`;
  }
  function bindPanel(root, rerender) {
    root.querySelectorAll('input[name="sector"]').forEach((el) => el.addEventListener("change", () => {
      S.sectors = [...root.querySelectorAll('input[name="sector"]:checked')].map((x) => x.value);
      rerender();
    }));
    root.querySelectorAll("input[data-toggle]").forEach((el) => el.addEventListener("change", () => { S[el.dataset.toggle] = el.checked; rerender(); }));
    root.querySelectorAll('input[name="fw"]').forEach((el) => el.addEventListener("change", () => { S.fw = el.value; rerender(); }));
    root.querySelectorAll('input[name="baseline"]').forEach((el) => el.addEventListener("change", () => { S.baseline = el.value; rerender(); }));
    const typeSel = root.querySelector("#type");
    if (typeSel) typeSel.addEventListener("change", () => { S.type = typeSel.value; rerender(); });
    const q = root.querySelector("#q");
    if (q) {
      let timer;
      q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { S.q = q.value; rerender(true); }, 200); });
    }
    const reset = root.querySelector("#reset");
    if (reset) reset.addEventListener("click", () => {
      Object.assign(S, { sectors: [], only: true, rec: true, drafts: true, repealed: false, context: false, q: "", type: "", linked: true, pending: false, records: false });
      render();
    });
  }
  function workspace(panel, mainId) {
    app.innerHTML = `<div class="workspace">
      <details class="panel" open><summary>${esc(t("filters"))}</summary><div class="panel-body">${panel}</div></details>
      <section class="results" id="${mainId}" aria-live="polite"></section></div>`;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    if (narrow) app.querySelector(".panel").removeAttribute("open");
    return app.querySelector(`#${mainId}`);
  }
  const searchBox = () => `<label class="field"><span>${esc(t("search"))}</span><input id="q" type="search" value="${esc(S.q)}" placeholder="${esc(t("searchPh"))}" autocomplete="off"></label>`;

  // ------------------------------------------------------------------ guide
  async function renderGuide() {
    app.innerHTML = `<article class="guide"><div id="hero"></div><div class="prose" id="guide-text"><p class="hint">${esc(t("loading"))}</p></div></article>`;
    renderHero(document.getElementById("hero"));
    const key = S.lang;
    if (!guideCache[key]) {
      try {
        const res = await fetch(`content/guide.${key}.md`, { cache: "no-cache" });
        guideCache[key] = res.ok ? await res.text() : "";
      } catch (e) { guideCache[key] = ""; }
    }
    if (S.view !== "guide" || S.lang !== key) return;
    const el = document.getElementById("guide-text");
    renderMarkdown(el, guideCache[key]);
    const legend = el.querySelector("#legend");
    if (legend) legend.outerHTML = relLegend();
  }
  function renderHero(el) {
    const ex = CFG.heroExample || {};
    const m = D.mappings.find((x) => x.provision_id === ex.provision && x.framework_id === ex.framework && x.control_id === ex.control);
    const p = m && D.provById[m.provision_id];
    const src = p && D.sourceById[p.source_id];
    const c = m && D.controlById[m.framework_id] && D.controlById[m.framework_id][m.control_id];
    let example = "";
    if (m && p && src && c) {
      const capT = (t("heroCaption") || {})[m.relationship] || "";
      const provRef = `${L(p, "ref")}`;
      example = `<figure class="hero-example">
        <div class="hero-pair">
          <div class="hero-card"><span class="hero-kicker">${esc(sourceRef(src))}, ${esc(provRef)}${isDraft(m) ? ` <span class="badge rv-${esc(m.review_status)}">${esc(reviewLabel(m.review_status))}</span>` : ""}</span><span class="hero-text">${esc(L(p, "summary"))}</span></div>
          ${glyph(m.relationship, true)}
          <div class="hero-card"><span class="hero-kicker">${esc(fwLabel(fwRow(m.framework_id)))}, ${esc(c.id)}</span><span class="hero-text">${esc(controlName(m.framework_id, c))}</span></div>
        </div>
        <figcaption>${esc(fmt(capT, provRef, c.id))}</figcaption></figure>`;
    }
    el.innerHTML = `<header class="hero"><h1>${esc(t("heroTitle"))}</h1><p class="lead">${esc(t("heroLead"))}</p>
      ${example}
      <p class="hero-actions"><a class="btn btn-primary" href="#/controls">${esc(t("heroOpenControls"))}</a><a class="btn" href="#/sources">${esc(t("heroOpenSources"))}</a></p></header>`;
  }
  function relLegend() {
    return `<dl class="legend" aria-label="${esc(t("dataLegend"))}">${Object.keys(GLYPH).map((r) => `<div>${glyph(r)}<dt>${esc(r)}</dt><dd>${esc(relWords(r))}</dd></div>`).join("")}</dl>`;
  }

  // ------------------------------------------------------------------ controls
  function renderControls() {
    if (!D.controls[S.fw]) S.fw = "iso27001-2022";
    const fwRadios = D.frameworks.map((f) => `<label class="radio"><input type="radio" name="fw" value="${esc(f.id)}" ${S.fw === f.id ? "checked" : ""}><span>${esc(fwLabel(f))}</span></label>`).join("");
    const panel = `<fieldset><legend>${esc(t("framework"))}</legend>${fwRadios}</fieldset>
      ${sectorChips()}
      <fieldset><legend>${esc(t("options"))}</legend>${toggle("only", t("optOnlyMapped"))}${toggle("rec", t("optRecommended"))}${toggle("drafts", t("optDrafts"))}</fieldset>
      ${searchBox()}
      <button type="button" class="btn btn-quiet" id="reset">${esc(t("reset"))}</button>`;
    const main = workspace(panel, "controls-main");
    bindPanel(app, (soft) => (soft ? (writeHash(), drawControls(main)) : render()));
    drawControls(main);
  }

  function controlRows() {
    const exp = expandedSectors();
    const drivers = driversFor(S.fw, exp, S.drafts);
    const all = D.controls[S.fw];
    const leaf = all.filter((c) => ["subcategory", "requirement", "control"].includes(c.level));
    const q = S.q.trim().toLowerCase();
    const rows = [];
    leaf.forEach((c) => {
      const ds = (drivers[c.id] || []).slice().sort((a, b) => a.provision_id.localeCompare(b.provision_id));
      if (S.only && !ds.length) return;
      if (q) {
        const hay = [c.id, controlName(S.fw, c), L(c, "name"), ...ds.map((m) => { const p = D.provById[m.provision_id]; const s = D.sourceById[p.source_id]; return `${sourceRef(s)} ${L(p, "ref")} ${L(p, "summary")} ${sourceTitle(s)}`; })].join(" ").toLowerCase();
        if (!hay.includes(q)) return;
      }
      rows.push({ c, ds });
    });
    return { rows, leafCount: leaf.length, drivers, exp };
  }

  function drawControls(main) {
    const { rows, leafCount, drivers } = controlRows();
    const fw = fwRow(S.fw);
    const withDrivers = Object.keys(drivers).length;
    const provSet = new Set(), srcSet = new Set();
    Object.values(drivers).flat().forEach((m) => { provSet.add(m.provision_id); srcSet.add(D.provById[m.provision_id].source_id); });
    const partial = rows.filter((r) => r.ds.length && !r.ds.some((m) => m.coverage === "full")).length;
    const gaps = gapRows();
    const shown = rows.flatMap((r) => r.ds).concat(gaps);
    const ai = shown.filter((m) => m.review_status === "ai_draft").length;
    const groups = {};
    D.controls[S.fw].forEach((c) => { groups[c.id] = c; });

    let body = "";
    let lastGroup = null;
    rows.forEach(({ c, ds }) => {
      const g = topGroup(c);
      if (g && g !== lastGroup) {
        lastGroup = g;
        body += `<tr class="group"><th colspan="3" scope="colgroup">${esc(g.id)} ${esc(L(g, "name"))}</th></tr>`;
      }
      body += controlRow(c, ds);
    });

    const outName = L(fw, "output");
    main.innerHTML = `
      <div class="results-head">
        <h1>${esc(fwLabel(fw))}</h1>
        <p class="summary">${esc(fmt(t("summaryControls"), withDrivers, leafCount, provSet.size, srcSet.size))}${partial ? ` ${esc(fmt(t("summaryPartial"), partial))}` : ""}</p>
        ${ai ? `<p class="ai-warning" role="note">${esc(fmt(t("aiWarning"), ai, shown.length))}</p>` : ""}
        ${S.sectors.length ? "" : `<p class="hint">${esc(t("orgTypeNone"))}</p>`}
        <p class="hint">${esc(L(fw, "text_note"))}</p>
        <div class="exports">
          <button type="button" class="btn btn-primary" id="x-csv">${esc(fmt(t("exportSoaCsv"), outName))}</button>
          <button type="button" class="btn" id="x-xlsx">${esc(fmt(t("exportSoaXlsx"), outName))}</button>
          <button type="button" class="btn btn-quiet" id="x-long">${esc(t("exportLong"))}</button>
          <p class="hint">${esc(t("exportNote"))} ${S.only ? esc(t("exportScope")) : ""}</p>
        </div>
      </div>
      ${rows.length ? `<div class="table-wrap"><table class="controls">
        <thead><tr><th scope="col">${esc(t("colControl"))}</th><th scope="col">${esc(t("colDrivers"))}</th><th scope="col">${esc(t("colParam"))}</th></tr></thead>
        <tbody>${body}</tbody></table></div>` : `<p class="empty">${esc(t("noControls"))}</p>${otherFwHint()}`}
      ${gapsHtml(gaps, fw)}`;
    const sw = main.querySelector("#switch-fw");
    if (sw) sw.onclick = () => { S.fw = sw.dataset.fw; render(); };
    main.querySelector("#x-csv").onclick = () => exportSoa(rows, "csv");
    main.querySelector("#x-xlsx").onclick = () => exportSoa(rows, "xlsx");
    main.querySelector("#x-long").onclick = () => exportLong(rows, gaps);
  }

  // provisions checked against the whole framework with no counterpart (empty control_id)
  function gapRows() {
    const exp = expandedSectors();
    const q = S.q.trim().toLowerCase();
    return D.mappings.filter((m) => {
      if (m.framework_id !== S.fw || m.control_id || m.relationship !== "no_relationship") return false;
      if (!S.drafts && isDraft(m)) return false;
      const p = D.provById[m.provision_id];
      if (!p || p.provision_type === "definitional" || !provisionVisible(p, exp)) return false;
      if (!S.rec && D.sourceById[p.source_id].binding !== "mandatory") return false;
      if (q && ![sourceRef(D.sourceById[p.source_id]), L(p, "ref"), L(p, "summary"), L(m, "policy")].join(" ").toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.provision_id.localeCompare(b.provision_id, undefined, { numeric: true }));
  }
  function gapsHtml(gaps, fw) {
    if (!gaps.length) return "";
    const items = gaps.map((m) => {
      const p = D.provById[m.provision_id]; const src = D.sourceById[p.source_id];
      const badge = m.review_status !== "reviewed" ? `<span class="badge rv-${esc(m.review_status)}">${esc(reviewLabel(m.review_status))}</span>` : "";
      return `<li><span class="driver-ref">${esc(sourceRef(src))}, ${esc(L(p, "ref"))}</span> ${badge}
        <p>${esc(L(p, "summary"))}</p>${L(m, "policy") ? `<p class="muted"><b>${esc(t("driverPolicy"))}:</b> ${esc(L(m, "policy"))}</p>` : ""}</li>`;
    }).join("");
    return `<details class="gaps"><summary><h2>${esc(fmt(t("gapsTitle"), fwLabel(fw), gaps.length))}</h2></summary>
      <p class="hint">${esc(t("gapsIntro"))}</p><ul class="gap-list">${items}</ul></details>`;
  }

  function otherFwHint() {
    const other = D.frameworks.find((f) => f.id !== S.fw);
    if (!other) return "";
    const n = Object.keys(driversFor(other.id, expandedSectors(), S.drafts)).length;
    return n ? `<p><button type="button" class="btn" id="switch-fw" data-fw="${esc(other.id)}">${esc(fmt(t("switchFw"), fwLabel(other), n))}</button></p>` : "";
  }

  function topGroup(c) {
    const ctrls = D.controlById[S.fw];
    let cur = ctrls[c.parent];
    while (cur && cur.parent && ctrls[cur.parent] && S.fw === "iso27001-2022") cur = ctrls[cur.parent];
    return cur || null;
  }

  function controlRow(c, ds) {
    const name = controlName(S.fw, c);
    const drivers = ds.length ? `<ul class="drivers">${ds.map(driverItem).join("")}</ul>` : `<span class="muted">${esc(t("noDrivers"))}</span>`;
    const params = ds.filter((m) => L(m, "parameter"));
    const paramHtml = params.length
      ? `<ul class="params">${params.map((m) => `<li>${esc(L(m, "parameter"))} <span class="muted">(${esc(sourceRef(D.sourceById[D.provById[m.provision_id].source_id]))}, ${esc(L(D.provById[m.provision_id], "ref"))})</span></li>`).join("")}</ul>${params.length > 1 ? `<p class="hint">${esc(t("strictest"))}</p>` : ""}`
      : "";
    return `<tr><th scope="row" class="ctl"><span class="ctl-id">${esc(c.id)}</span><span class="ctl-name">${esc(name)}</span></th>
      <td data-label="${esc(t("colDrivers"))}">${drivers}</td><td data-label="${esc(t("colParam"))}">${paramHtml}</td></tr>`;
  }

  function driverItem(m) {
    const p = D.provById[m.provision_id];
    const src = D.sourceById[p.source_id];
    const badges = [
      `<span class="badge cov-${esc(m.coverage)}">${esc(covLabel(m.coverage))}</span>`,
      m.review_status !== "reviewed" ? `<span class="badge rv-${esc(m.review_status)}">${esc(reviewLabel(m.review_status))}</span>` : "",
    ].join("");
    const applies = p.applies_to ? `<p><b>${esc(t("appliesOnly"))}:</b> ${p.applies_to.split(";").map((s) => esc(L(D.sectorById[s], "label") || s)).join("; ")}</p>` : "";
    const note = L(m, "notes") ? `<p><b>${esc(t("driverNote"))}:</b> ${esc(L(m, "notes"))}</p>` : "";
    const policy = L(m, "policy") ? `<p><b>${esc(t("driverPolicy"))}:</b> ${esc(L(m, "policy"))}</p>` : "";
    const caveat = p.notes ? `<p class="muted"><b>${esc(t("driverCaveat"))}:</b> ${esc(p.notes)}</p>` : "";
    const link = src.url ? ` <a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(t("openText"))}</a>` : "";
    return `<li><details class="driver">
      <summary>${glyph(m.relationship)}<span class="driver-main"><span class="driver-ref">${esc(sourceRef(src))}, ${esc(L(p, "ref"))}</span> ${badges}</span></summary>
      <div class="driver-body">
        <p><b>${esc(t("driverSummary"))}:</b> ${esc(L(p, "summary"))}</p>
        <p><b>${esc(t("driverSource"))}:</b> ${esc(sourceTitle(src))}.${link}</p>
        ${applies}${note}${policy}${caveat}
        <p class="muted">${esc(t("driverMeta"))}: ${esc(relWords(m.relationship))}, ${esc(m.rationale)}${m.strength ? `, ${esc(m.strength)}/10` : ""}; ${esc(m.mapped_by)}${m.reviewed_by ? `, ${esc(m.reviewed_by)}` : ""}; ${esc(m.date)}</p>
      </div></details></li>`;
  }

  // ------------------------------------------------------------------ exports
  function csvCell(v) {
    const s = String(v == null ? "" : v);
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }
  function download(name, content, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function downloadCsv(name, header, rows) {
    const text = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    download(name, "﻿" + text, "text/csv;charset=utf-8"); // BOM so Excel reads Cyrillic
  }
  let xlsxLoading = null;
  function loadXlsx() {
    if (window.XLSX) return Promise.resolve();
    if (!xlsxLoading) xlsxLoading = new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = "assets/vendor/xlsx.mini.min.js";
      s.onload = ok; s.onerror = () => fail(new Error("xlsx"));
      document.head.appendChild(s);
    });
    return xlsxLoading;
  }
  async function downloadXlsx(name, sheet, header, rows, widths) {
    await loadXlsx();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    ws["!cols"] = (widths || header.map(() => 24)).map((w) => ({ wch: w }));
    ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }) };
    ws["!freeze"] = { xSplit: 1, ySplit: 1 };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet.slice(0, 31));
    const ai = D.mappings.filter((m) => m.framework_id === S.fw && m.review_status === "ai_draft").length;
    const meta = [["note", ai ? t("aiFileNote") : ""], ["version", D.meta ? D.meta.version : ""], ["date", new Date().toISOString().slice(0, 10)], ["framework", S.fw], ["sectors", S.sectors.join(", ") || "all"], ["url", location.href]];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(meta), "about");
    XLSX.writeFile(wb, name);
  }
  const stamp = () => `${S.fw}${S.sectors.length ? "_" + S.sectors.join("-") : ""}_${new Date().toISOString().slice(0, 10)}`;

  function exportSoa(rows, kind) {
    const header = [t("xControlId"), t("xControl"), t("xDrivers"), t("xCoverage"), t("xParam"),
      t("xApplicable"), t("xJustification"), t("xOrgValue"), t("xPolicy"), t("xPolicySuggested"), t("xOwner"), t("xStatus"), t("xEvidence")];
    const data = rows.map(({ c, ds }) => {
      const drv = ds.map((m) => { const p = D.provById[m.provision_id]; return `${sourceRef(D.sourceById[p.source_id])}, ${L(p, "ref")} [${GLYPH[m.relationship]} ${covLabel(m.coverage)}${reviewMark(m)}]`; }).join("\n");
      const pol = [...new Set(ds.map((m) => L(m, "policy")).filter(Boolean))].join("\n");
      const cov = ds.length ? (ds.some((m) => m.coverage === "full") ? t("fullNote") : t("partialNote")) : "";
      const par = ds.filter((m) => L(m, "parameter")).map((m) => `${L(m, "parameter")} (${sourceRef(D.sourceById[D.provById[m.provision_id].source_id])}, ${L(D.provById[m.provision_id], "ref")})`).join("\n");
      return [c.id, controlName(S.fw, c), drv, cov, par, ds.length ? (S.lang === "uk" ? "так" : "Y") : "", "", "", "", pol, "", "", ""];
    });
    const base = `${S.fw === "csf-2.0" ? "target-profile" : "soa"}_${stamp()}`;
    if (kind === "xlsx") downloadXlsx(`${base}.xlsx`, S.fw === "csf-2.0" ? "Profile" : "SoA", header, data, [10, 50, 55, 12, 35, 14, 30, 30, 30, 40, 20, 20, 30]);
    else downloadCsv(`${base}.csv`, header, data);
  }
  function exportLong(rows, gaps) {
    const header = [t("xControlId"), t("xControl"), t("xProvision"), t("xSource"), "ref", t("driverSummary"), t("xRelationship"), t("xCoverage"), t("xParam"), t("driverPolicy"), t("xReview"), t("xMappedBy"), "url"];
    const out = [];
    const line = (cid, cname, m) => {
      const p = D.provById[m.provision_id]; const s = D.sourceById[p.source_id];
      out.push([cid, cname, p.id, sourceRef(s), L(p, "ref"), L(p, "summary"), m.relationship, m.coverage, L(m, "parameter"), L(m, "policy"), reviewLabel(m.review_status), m.mapped_by, s.url]);
    };
    rows.forEach(({ c, ds }) => ds.forEach((m) => line(c.id, controlName(S.fw, c), m)));
    (gaps || []).forEach((m) => line("", t("gapsNone"), m));
    downloadCsv(`mappings_${stamp()}.csv`, header, out);
  }

  // ------------------------------------------------------------------ sources
  function renderSources() {
    const act = S.act && (D.sourceByEli[S.act] || D.sourceById[S.act]);
    S.act = "";
    if (act) Object.assign(S, { scope: act.scope, mode: "list", repealed: true, context: true, pending: true, records: true, rec: true, type: "", sectors: [], q: act.eli });
    const typeOpts = D.typeOrder.filter((id) => D.sources.some((s) => s.type === id && s.scope === S.scope))
      .map((id) => `<option value="${esc(id)}" ${S.type === id ? "selected" : ""}>${esc(typeLabel(id))}</option>`).join("");
    const opts = [toggle("pending", t(S.scope === "core" ? "optPending" : "optProposals")), toggle("context", t("optContext")),
      toggle("rec", t("optRecommended")), toggle("repealed", t("optRepealed"))];
    if (S.scope === "core") opts.push(toggle("records", t("optRecords")));
    const panel = `${sectorChips()}
      <label class="field"><span>${esc(t("srcType"))}</span><select id="type"><option value="">${esc(t("srcAllTypes"))}</option>${typeOpts}</select></label>
      <fieldset><legend>${esc(t("options"))}</legend>${opts.join("")}</fieldset>
      ${searchBox()}
      <button type="button" class="btn btn-quiet" id="reset">${esc(t("reset"))}</button>`;
    const main = workspace(panel, "sources-main");
    bindPanel(app, (soft) => (soft ? (writeHash(), drawSources(main)) : render()));
    drawSources(main);
    if (act) { writeHash(); const row = document.getElementById(`src-${act.id}`); if (row) { row.scrollIntoView({ block: "center" }); row.classList.add("flash"); setTimeout(() => row.classList.remove("flash"), 1600); } }
  }

  function sourceRows() {
    const exp = expandedSectors();
    const q = S.q.trim().toLowerCase();
    const order = (s) => D.typeOrder.indexOf(s.type);
    return D.sources.filter((s) => {
      if (!sourceVisible(s, exp, true)) return false;
      if (S.type && s.type !== S.type) return false;
      if (q && D.sourceByEli[S.q.trim()]) return s.eli === S.q.trim();
      if (q && ![s.id, s.eli, s.register_no, s.short_ref_uk, s.short_ref_en, s.title_uk, s.title_en, s.description_uk, s.description_en,
        s.concerns_uk, s.concerns_en, s.comment_uk, s.number].join(" ").toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => order(a) - order(b) || (b.adopted || "").localeCompare(a.adopted || ""));
  }

  // ELI ontology 1.5 properties (eli:...) and ELI-DL (eli-dl:adopts); see docs/BLUEPRINT.md, 4.1
  const relOut = (r) => { const l = t("rel_" + r.relation) || r.relation; return D.sourceById[r.source_id].status === "draft" && r.relation !== "adopts" ? fmt(t("relProposed"), l) : l; };
  const relIn = (r) => { const l = t("relIn_" + r.relation) || r.relation; return D.sourceById[r.source_id].status === "draft" && r.relation !== "adopts" ? fmt(t("relProposed"), l) : l; };
  const eliAbs = (eli) => (eli ? new URL(eli, location.href.split("#")[0]).href : "");
  const eliOfficial = (eli) => /^https?:\/\/data\.europa\.eu\/eli\//.test(eli || "");
  function eliLine(s) {
    if (!s.eli) return "";
    const abs = eliAbs(s.eli);
    return eliOfficial(s.eli)
      ? `<span class="src-eli"><abbr title="European Legislation Identifier">ELI</abbr> <a href="${esc(abs)}" target="_blank" rel="noopener">${esc(abs.replace(/^https?:\/\//, ""))}</a></span>`
      : `<span class="src-eli" title="${esc(t("eliUnofficial"))}"><abbr title="European Legislation Identifier">ELI</abbr>* <code>${esc(s.eli)}</code></span>`;
  }
  const pendingMark = (id) => { const x = D.sourceById[id]; return x && !IN_EFFECT(x.status) ? ` (${statusLabel(x.status)})` : ""; };

  function relLinks(src) {
    const out = (D.relsOut[src.id] || []).map((r) => ({ label: relOut(r), id: r.related_id, rel: r }));
    const inn = (D.relsIn[src.id] || []).map((r) => ({ label: relIn(r), id: r.source_id, rel: r }));
    const groups = new Map();
    [...out, ...inn].forEach((r) => { if (!groups.has(r.label)) groups.set(r.label, []); groups.get(r.label).push(r); });
    if (!groups.size) return "";
    const link = (r) => {
      const tip = [r.rel.basis_uk, r.rel.confidence === "medium" ? t("confMedium") : ""].filter(Boolean).join(". ");
      return `<a href="#src-${esc(r.id)}" data-jump="${esc(r.id)}"${tip ? ` title="${esc(tip)}"` : ""}>${esc(sourceRef(D.sourceById[r.id]) || r.id)}</a>${esc(pendingMark(r.id))}${r.rel.confidence === "medium" ? `<sup class="conf" title="${esc(t("confMedium"))}">?</sup>` : ""}`;
    };
    return `<ul class="chain">${[...groups].map(([label, rs]) => `<li><span class="muted" title="${esc(rs[0].rel.relation === "adopts" ? "eli-dl:adopts" : "eli:" + rs[0].rel.relation)}">${esc(label)}:</span> ${rs.map(link).join("; ")}</li>`).join("")}</ul>`;
  }

  function sourceBadges(s) {
    return [
      `<span class="badge st-${esc(s.status)}">${esc(statusLabel(s.status))}</span>`,
      s.binding === "recommended" ? `<span class="badge">${esc(t("bRecommended"))}</span>` : "",
      s.role !== "requirements" ? `<span class="badge">${esc(roleLabel(s.role))}</span>` : "",
      s.text_access === "restricted" ? `<span class="badge">${esc(t("restricted"))}</span>` : "",
      s.domain === "records" ? `<span class="badge">${esc(t("domainRecords"))}</span>` : "",
    ].join("");
  }

  function sourceTabs() {
    const tab = (k, label, n) => `<a href="#" data-scope="${k}" class="tab"${S.scope === k ? ' aria-current="page"' : ""}>${esc(label)} <span class="muted">${n}</span></a>`;
    const mode = (k, label) => `<a href="#" data-mode="${k}" class="tab"${S.mode === k ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
    const count = (sc) => D.sources.filter((x) => x.scope === sc).length;
    return `<div class="tabs"><nav class="tabset" aria-label="${esc(t("navSources"))}">${tab("core", t("tabCore"), count("core"))}${tab("reference", t("tabReference"), count("reference"))}</nav>
      <nav class="tabset" aria-label="${esc(t("modeLabel"))}">${mode("list", t("modeList"))}${mode("chains", t("modeChains"))}</nav></div>`;
  }

  function drawSources(main) {
    const rows = sourceRows();
    const total = D.sources.filter((x) => x.scope === S.scope).length;
    const head = `
      <div class="results-head">
        <h1>${esc(t(S.scope === "core" ? "navSources" : "tabReference"))}</h1>
        ${sourceTabs()}
        ${S.scope === "reference" ? `<p class="notice">${esc(t("refNote"))}</p>` : ""}
        <p class="summary">${esc(fmt(t("srcSummary"), rows.length, total))}</p>
        ${S.sectors.length ? "" : `<p class="hint">${esc(t("orgTypeNone"))}</p>`}
        ${D.unverifiedAppl && S.mode === "list" ? `<p class="hint">${esc(t("srcUnverified"))}</p>` : ""}
        ${S.mode === "list" ? `<div class="exports"><button type="button" class="btn btn-primary" id="s-csv">${esc(t("srcDownload"))}</button><button type="button" class="btn" id="s-xlsx">${esc(t("srcDownloadX"))}</button></div>` : `<p class="lead-sm">${esc(t("chainsIntro"))}</p>`}
      </div>`;
    main.innerHTML = head + (S.mode === "chains" ? chainsHtml(rows) : sourcesTable(rows));
    main.querySelectorAll("a[data-scope]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); S.scope = a.dataset.scope; S.type = ""; render(); }));
    main.querySelectorAll("a[data-mode]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); S.mode = a.dataset.mode; writeHash(); drawSources(main); }));
    const csvBtn = main.querySelector("#s-csv");
    if (csvBtn) {
      csvBtn.onclick = () => exportSources(rows, "csv");
      main.querySelector("#s-xlsx").onclick = () => exportSources(rows, "xlsx");
    }
    main.querySelectorAll("a[data-jump]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.dataset.jump;
      const target = document.getElementById(`src-${id}`);
      if (target && S.mode === "list") { target.scrollIntoView({ behavior: "smooth", block: "center" }); target.classList.add("flash"); setTimeout(() => target.classList.remove("flash"), 1600); }
      else {
        const x = D.sourceById[id];
        Object.assign(S, { mode: "list", scope: x ? x.scope : S.scope, repealed: true, context: true, pending: true, records: true, type: "", q: x ? x.eli : id });
        render();
      }
    }));
  }

  function sourcesTable(rows) {
    if (!rows.length) return `<p class="empty">${esc(t("srcNone"))}</p>`;
    const body = rows.map((s) => {
      const n = (D.provsBySource[s.id] || []).length;
      const sectors = (D.applBySource[s.id] || []).map((a) => `<span class="tag">${esc(L(D.sectorById[a.sector_id], "label"))}</span>`).join("");
      const title = sourceTitle(s);
      const concerns = L(s, "concerns");
      const comment = s.comment_uk && s.comment_uk !== L(s, "description")
        ? `<details class="more"><summary>${esc(t("comment"))}</summary><p lang="uk">${esc(s.comment_uk)}</p></details>` : "";
      return `<tr id="src-${esc(s.id)}">
        <th scope="row" class="src"><span class="src-type">${esc(typeLabel(s.type))}<span class="src-no">${esc(t("regNo"))} ${esc(s.register_no)}</span></span>
          <span class="src-ref">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(sourceRef(s))}</a>` : esc(sourceRef(s))}</span>
          ${title !== sourceRef(s) ? `<span class="src-title"${isFallback(s, "title") ? ' lang="uk"' : ""}>${esc(title)}</span>` : ""}${eliLine(s)}</th>
        <td data-label="${esc(t("srcColStatus"))}">${sourceBadges(s)}${n ? `<p class="muted small">${esc(fmt(t("provisionsCount"), n))}</p>` : ""}</td>
        <td data-label="${esc(t("srcColDesc"))}"><p${isFallback(s, "description") ? ' lang="uk"' : ""}>${esc(L(s, "description"))}</p>
          ${concerns ? `<p class="concerns"><b>${esc(t("concerns"))}</b> ${esc(concerns)}</p>` : ""}
          ${sectors ? `<p class="tags">${sectors}</p>` : ""}${comment}</td>
        <td data-label="${esc(t("srcColChain"))}">${relLinks(s)}</td></tr>`;
    }).join("");
    return `<div class="table-wrap"><table class="sources">
        <thead><tr><th scope="col">${esc(t("srcColRef"))}</th><th scope="col">${esc(t("srcColStatus"))}</th><th scope="col">${esc(t("srcColDesc"))}</th><th scope="col">${esc(t("srcColChain"))}</th></tr></thead>
        <tbody>${body}</tbody></table></div>`;
  }

  // Chains: hierarchy from eli:based_on and the implementation properties; amendments, repeals and the rest shown alongside.
  function chainsHtml(rows) {
    const HIER = new Set(["based_on", "transposes", "applies", "ensures_implementation_of"]);
    const kids = {}, parents = {};
    Object.values(D.relsOut).flat().forEach((r) => {
      if (!HIER.has(r.relation)) return;
      (kids[r.related_id] = kids[r.related_id] || []).push(r);
      (parents[r.source_id] = parents[r.source_id] || []).push(r.related_id);
    });
    const show = new Set();
    const addUp = (id) => { if (show.has(id)) return; show.add(id); (parents[id] || []).forEach(addUp); };
    rows.forEach((x) => { if (kids[x.id] || parents[x.id]) addUp(x.id); });
    if (!show.size) return `<p class="empty">${esc(t("chainsNone"))}</p>`;
    const rank = (id) => { const x = D.sourceById[id]; return [D.typeOrder.indexOf(x.type), x.adopted || "9999"]; };
    const cmp = (a, b) => { const ra = rank(a), rb = rank(b); return ra[0] - rb[0] || ra[1].localeCompare(rb[1]); };
    const roots = [...show].filter((id) => !(parents[id] || []).some((p) => show.has(p)) && kids[id]).sort(cmp);
    const seen = new Set();
    const label = (id, rel) => {
      const x = D.sourceById[id];
      const side = (D.relsIn[id] || []).filter((r) => !HIER.has(r.relation))
        .map((r) => `${esc(relIn(r))} <a href="#src-${esc(r.source_id)}" data-jump="${esc(r.source_id)}">${esc(sourceRef(D.sourceById[r.source_id]))}</a>${esc(pendingMark(r.source_id))}`);
      const cls = x.status === "repealed" ? " repealed" : "";
      return `${rel && rel !== "based_on" ? `<span class="badge" title="eli:${esc(rel)}">${esc(t("rel_" + rel))}</span> ` : ""}<a class="chain-node${cls}" href="#src-${esc(id)}" data-jump="${esc(id)}">${esc(sourceRef(x))}</a>`
        + `${!IN_EFFECT(x.status) ? ` <span class="badge st-${esc(x.status)}">${esc(statusLabel(x.status))}</span>` : ""}${x.scope === "reference" ? ` <span class="badge">${esc(t("badgeEu"))}</span>` : ""}`
        + ` <span class="muted small">${esc(sourceTitle(x).slice(0, 110))}</span>`
        + (side.length ? ` <span class="chain-side">(${side.join("; ")})</span>` : "");
    };
    const walk = (id, rel, depth) => {
      const ch = (kids[id] || []).filter((r) => show.has(r.source_id)).sort((a, b) => cmp(a.source_id, b.source_id));
      if (seen.has(id) && ch.length) return `<li>${label(id, rel)} <span class="muted small">${esc(t("seeAbove"))}</span></li>`;
      seen.add(id);
      if (!ch.length || depth > 8) return `<li>${label(id, rel)}</li>`;
      return `<li>${label(id, rel)}<ul>${ch.map((r) => walk(r.source_id, r.relation, depth + 1)).join("")}</ul></li>`;
    };
    return `<div class="chains">${roots.map((id) => `<ul class="tree">${walk(id, null, 0)}</ul>`).join("")}</div>`;
  }

  function exportSources(rows, kind) {
    const header = ["id", "ELI", "No.", t("xType"), t("xNumber"), t("xAdopted"), t("srcColRef"), t("xTitle"), t("xDescription"), t("concerns"), t("xStatusSrc"),
      t("xBinding"), t("xRole"), t("xSectors"), t("xVerified"), t("xUrl")];
    const data = rows.map((s) => [s.id, eliAbs(s.eli), s.register_no, typeLabel(s.type), s.number, s.adopted, sourceRef(s), sourceTitle(s), L(s, "description"), L(s, "concerns"), statusLabel(s.status),
      s.binding === "mandatory" ? t("bMandatory") : t("bRecommended"), roleLabel(s.role) || "", (D.applBySource[s.id] || []).map((a) => L(D.sectorById[a.sector_id], "label")).join("; "),
      s.last_verified, s.url]);
    const name = `${S.scope === "core" ? "legal-sources" : "eu-reference"}${S.sectors.length ? "_" + S.sectors.join("-") : ""}_${new Date().toISOString().slice(0, 10)}`;
    if (kind === "xlsx") downloadXlsx(`${name}.xlsx`, "Sources", header, data, [22, 40, 6, 18, 12, 12, 34, 60, 60, 50, 14, 14, 14, 40, 12, 40]);
    else downloadCsv(`${name}.csv`, header, data);
  }

  // ------------------------------------------------------------------ articles
  const articleCache = {};
  async function renderArticles() {
    if (!S.article) {
      app.innerHTML = `<article class="page"><h1>${esc(t("navArticles"))}</h1><p class="lead-sm">${esc(t("articlesIntro"))}</p>
        <ul class="files">${ARTICLES.map((a) => `<li class="file"><a class="file-name" href="#/articles?a=${a}">${esc(t("art_" + a))}</a><p>${esc(t("artd_" + a))}</p></li>`).join("")}</ul></article>`;
      return;
    }
    const key = `${S.article}.${S.lang}`;
    app.innerHTML = `<article class="guide"><p><a href="#/articles">${esc(t("articlesBack"))}</a></p><div class="prose" id="article-text"><p class="hint">${esc(t("loading"))}</p></div></article>`;
    if (articleCache[key] === undefined) {
      try {
        const res = await fetch(`content/articles/${key}.md`, { cache: "no-cache" });
        articleCache[key] = res.ok ? await res.text() : "";
      } catch (e) { articleCache[key] = ""; }
    }
    if (S.view !== "articles" || `${S.article}.${S.lang}` !== key) return;
    renderMarkdown(document.getElementById("article-text"), articleCache[key]);
  }

  // Markdown with heading ids (GitHub style) and in-page links that scroll instead of routing
  function renderMarkdown(el, md) {
    el.innerHTML = marked.parse(md);
    el.querySelectorAll("h1, h2, h3, h4").forEach((h) => { if (!h.id) h.id = slugify(h.textContent); });
    el.querySelectorAll("table").forEach((tb) => { const w = document.createElement("div"); w.className = "table-wrap"; tb.replaceWith(w); w.appendChild(tb); });
    el.querySelectorAll('a[href^="#"]:not([href^="#/"])').forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    el.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });
  }

  // ------------------------------------------------------------------ system level (preview)
  function renderSystem() {
    const bl = [["open", "sysOpen"], ["dsk", "sysDsk"], ["nato", "sysNato"]].map(([v, k]) => `<label class="radio"><input type="radio" name="baseline" value="${v}" ${S.baseline === v ? "checked" : ""}><span>${esc(t(k))}</span></label>`).join("");
    const panel = `<fieldset><legend>${esc(t("sysBaseline"))}</legend>${bl}</fieldset>
      ${sectorChips()}
      <fieldset><legend>${esc(t("options"))}</legend>${toggle("linked", t("sysLinked"))}${toggle("drafts", t("optDrafts"))}</fieldset>
      ${searchBox()}`;
    const main = workspace(panel, "system-main");
    bindPanel(app, (soft) => (soft ? (writeHash(), drawSystem(main)) : render()));
    drawSystem(main);
  }
  function systemRows() {
    const exp = expandedSectors();
    const csfDrivers = driversFor("csf-2.0", exp, S.drafts);
    const linked = {};
    Object.keys(csfDrivers).forEach((csf) => (D.csfTo53[csf] || []).forEach((id) => (linked[id] = linked[id] || []).push(csf)));
    const fam = {}; // family-level links (e.g. "PT") apply to every control of that family
    Object.keys(linked).filter((k) => /^[A-Z]{2}$/.test(k)).forEach((k) => (fam[k] = linked[k]));
    const q = S.q.trim().toLowerCase();
    return D.b53.filter((c) => {
      if (c[S.baseline] !== "yes") return false;
      c._csf = [...new Set([...(linked[c.id] || []), ...(fam[c.family] || [])])];
      if (S.linked && !c._csf.length) return false;
      if (q && ![c.id, c.name_en, c.name_uk_machine, c[`${S.baseline}_params_uk`]].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }
  function drawSystem(main) {
    const rows = systemRows();
    const pcol = `${S.baseline}_params_uk`;
    main.innerHTML = `<div class="results-head">
        <h1>NIST SP 800-53 Rev. 5</h1>
        <p class="lead-sm">${esc(t("sysIntro"))}</p>
        <p class="notice">${esc(t("sysPreview"))}</p>
        <p class="summary">${esc(fmt(t("sysSummary"), rows.length))} ${S.lang === "uk" ? esc(t("sysMachine")) : ""}</p>
        <div class="exports"><button type="button" class="btn btn-primary" id="y-csv">${esc(t("sysDownload"))}</button></div>
      </div>
      ${rows.length ? `<div class="table-wrap"><table class="system">
        <thead><tr><th scope="col">${esc(t("sysColId"))}</th><th scope="col">${esc(t("sysColName"))}</th><th scope="col">${esc(t("sysColParams"))}</th><th scope="col">${esc(t("sysColCsf"))}</th></tr></thead>
        <tbody>${rows.map((c) => `<tr><th scope="row"><span class="ctl-id">${esc(c.id)}</span></th><td data-label="${esc(t("sysColName"))}">${esc(c.name_en)}${S.lang === "uk" ? `<span class="muted small block">${esc(c.name_uk_machine)}</span>` : ""}</td><td lang="uk" data-label="${esc(t("sysColParams"))}">${esc(c[pcol])}</td><td class="small" data-label="${esc(t("sysColCsf"))}">${esc(c._csf.join(", "))}</td></tr>`).join("")}</tbody>
      </table></div>` : `<p class="empty">${esc(t("sysNone"))}</p>`}`;
    main.querySelector("#y-csv").onclick = () => {
      const header = [t("sysColId"), "name_en", "name_uk_machine", t("sysColParams"), t("sysColCsf"), t("xApplicable"), t("xOrgValue"), t("xPolicy"), t("xStatus"), t("xEvidence")];
      downloadCsv(`sp800-53_${S.baseline}_${new Date().toISOString().slice(0, 10)}.csv`, header,
        rows.map((c) => [c.id, c.name_en, c.name_uk_machine, c[pcol], c._csf.join(", "), "", "", "", "", ""]));
    };
  }

  // ------------------------------------------------------------------ data
  function renderData() {
    const repo = (CFG.repoUrl || "").replace(/\/$/, "");
    const blob = (p) => `${repo}/blob/${CFG.branch || "main"}/${p}`;
    const tree = (p) => `${repo}/${/\.[a-z]+$/.test(p) ? "blob" : "tree"}/${CFG.branch || "main"}/${p}`;
    const res = ((D.pkg && D.pkg.resources) || FILES.map((f) => ({ path: f }))).filter((r) => r.name !== "readable");
    // generated files have no copy in git: link to what they are built from
    const view = (r) => r["x-source"]
      ? `<a href="${esc(tree(r["x-source"]))}" target="_blank" rel="noopener">${esc(t("dataSource"))}</a>`
      : `<a href="${esc(blob("data/" + r.path))}" target="_blank" rel="noopener">${esc(t("dataView"))}</a>`;
    const items = res.map((r) => `<li class="file">
        <span class="file-name">${esc(r.path)}</span>
        ${D.rowCounts[r.path] != null ? `<span class="muted small">${esc(fmt(t("dataRows"), D.rowCounts[r.path]))}</span>` : ""}
        <p>${esc(r.description || "")}</p>
        <p class="file-links">${view(r)}<a href="data/${esc(r.path)}" download>${esc(t("dataRaw"))}</a></p></li>`).join("");
    app.innerHTML = `<article class="page">
      <h1>${esc(t("navData"))}</h1>
      <p class="lead-sm">${esc(t("dataIntro"))}</p>
      ${D.meta ? `<p class="summary">${esc(fmt(t("dataVersion"), D.meta.version, D.meta.date))} ${esc(S.lang === "uk" ? D.meta.note_uk : D.meta.note_en)}</p>` : ""}
      <p><a href="${esc(blob(S.lang === "uk" ? "docs/BLUEPRINT.uk.md" : "docs/BLUEPRINT.md"))}" target="_blank" rel="noopener">${esc(t("dataBlueprint"))}</a></p>
      <section class="readable"><h2>${esc(t("dataReadableTitle"))}</h2><p>${esc(t("dataReadable"))}</p>
        <p><a class="btn btn-primary" href="data/grc-foundation-ua.xlsx" download>${esc(t("dataReadableBtn"))}</a></p></section>
      <h2>${esc(t("dataMachineTitle"))}</h2><p>${esc(t("dataMachine"))}</p>
      <ul class="files">${items}</ul>
      <h2>${esc(t("dataLegend"))}</h2>${relLegend()}</article>`;
  }

  // ------------------------------------------------------------------ boot
  async function boot() {
    readHash();
    if (!S.lang) S.lang = store.get("grc-lang") || ((navigator.language || "").toLowerCase().startsWith("uk") ? "uk" : CFG.defaultLang || "uk");
    if (!I18N[S.lang]) S.lang = "uk";
    app.innerHTML = `<p class="loading">${esc(t("loading"))}</p>`;
    try {
      await loadAll();
    } catch (e) {
      app.innerHTML = `<p class="notice">${esc(fmt(t("loadError"), e.message))}</p>`;
      return;
    }
    window.addEventListener("hashchange", () => { if (readHash()) { render(); window.scrollTo(0, 0); } });
    render();
  }
  boot();
})();
