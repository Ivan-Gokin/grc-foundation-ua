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
    "sp800-53/baselines_ua.csv", "sp800-53/map_csf-2.0_sp800-53r5.csv", "sp800-53/profiles.csv",
    "chains.csv", "chain_steps.csv",
  ];
  // The emblem: three 60-degree rhombuses (governance, risk, compliance) turning around a triangle, inside a hexagon.
  // Decorative next to the site name, so it is hidden from screen readers.
  const BRAND_MARK = `<svg class="brand-mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path class="bm-frame" fill-rule="evenodd" d="M67.44 6.36L96.52 43.29L79.07 86.93L32.56 93.64L3.48 56.71L20.93 13.07ZM65.96 10.07L92.56 43.86L76.6 83.79L34.04 89.93L7.44 56.14L23.4 16.21Z"/><path class="bm-arms" d="M35.86 44.63L59.43 36.47L64.14 11.97L40.57 20.13ZM61.72 40.43L57.01 64.93L75.86 81.27L80.58 56.77ZM52.42 64.93L33.56 48.6L9.99 56.77L28.85 73.1Z"/><path class="bm-core" d="M36.84 47.47L58.77 39.87L54.39 62.67Z"/></svg>`;
  // Theme switch icons: a sun and a crescent moon, drawn in the text colour of their button
  const ICON_SUN = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>`;
  const ICON_FLAG = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 21V4m0 0h11l-2 4 2 4H5"/></svg>`;
  const ICON_LOCK = `<svg class="lock" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1.6 0h3.8V5a1.9 1.9 0 0 0-3.8 0z"/></svg>`;
  const ICON_MOON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z"/></svg>`;
  // Theme: light or dark; with no choice made, the system setting decides (the page head sets a saved choice before paint)
  const DARK = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const themeNow = () => document.documentElement.getAttribute("data-theme") || (DARK && DARK.matches ? "dark" : "light");
  function themeButton() {
    const box = document.getElementById("theme");
    if (!box) return;
    const now = themeNow();
    box.dataset.current = now;
    box.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.set === now));
      b.onclick = () => {
        document.documentElement.setAttribute("data-theme", b.dataset.set);
        store.set("grc-theme", b.dataset.set);
        themeButton();
      };
    });
  }
  if (DARK && DARK.addEventListener) DARK.addEventListener("change", themeButton);
  const VIEWS = ["home", "craft", "guide", "controls", "sources", "method", "articles", "about"];
  const SYSTEM_FW = "sp800-53r5"; // the system-level framework, shown inside Controls
  const ARTICLES = ["isms-policy-case-studies", "grc-systems-overview"];
  // "Help me" chapters: content/guide/<id>.<lang>.md, grouped in the menu and the side panel: what to settle before
  // crafting the baseline, what comes after it, and reference. The baseline itself is "Craft your baseline".
  const CHAPTERS = [
    ["roles", "before"], ["compliance", "after"], ["risk", "after"], ["grc", "after"], ["glossary", "ref"],
  ].map(([id, stage]) => ({ id, stage }));
  const CHAPTER_MOVED = { ims: "grc" }; // old chapter ids that live on under another name
  const IN_EFFECT = (st) => st === "in_force";

  const D = {}; // indexes
  const S = {   // state (mirrored in the URL hash)
    lang: null, view: "home", chapter: "roles", step: 1, anchor: "", sectors: [], fw: "iso27001-2022", only: true, rec: true, drafts: true,
    repealed: false, context: false, q: "", type: "", baseline: "open", sprofile: "none", sb: true, sp: true, sl: true,
    scope: "core", mode: "list", pending: false, records: false, article: "",
    all: false, by: "control", chains: false, // controls: ignore the profile, group by act, show the legal basis
  };
  const mdCache = {};
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
    const [sources, types, sectors, groups, appl, rels, provs, maps, fws, iso, csf, b53, m53, profiles, chains, steps] = tables;
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
    D.frameworks = fws.sort((a, b) => +a.sort - +b.sort);
    D.orgFrameworks = D.frameworks.filter((f) => f.tier === "organisation");
    D.controls = { "iso27001-2022": iso.sort((a, b) => +a.sort - +b.sort), "csf-2.0": csf.sort((a, b) => +a.sort - +b.sort) };
    D.controlById = { "iso27001-2022": by(iso), "csf-2.0": by(csf) };
    D.b53 = b53;
    D.profiles = profiles;
    D.chains = chains.sort((a, b) => +a.sort - +b.sort);
    D.chainSteps = {};
    steps.forEach((r) => (D.chainSteps[r.chain_id] = D.chainSteps[r.chain_id] || []).push(r));
    Object.values(D.chainSteps).forEach((list) => list.sort((a, b) => +a.step - +b.step));
    // provisions of each act that appear in a mapping: "where the requirements live" in the chains
    D.mappedProvs = {};
    maps.forEach((m) => {
      if (!m.control_id) return;
      const pr = D.provById[m.provision_id];
      if (pr) (D.mappedProvs[pr.source_id] = D.mappedProvs[pr.source_id] || new Set()).add(pr.id);
    });
    D.profileSources = new Set(profiles.filter((x) => x.kind === "baseline" || x.kind === "sector").map((x) => x.source_id));
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
    const [route, anchor] = location.hash.replace(/^#\/?/, "").split("#");
    const [view, query] = route.split("?");
    S.view = VIEWS.includes(view) ? view : "home";
    if (view === "start") { S.view = "craft"; S.step = 1; } // the old questionnaire
    if (view === "system") { S.view = "controls"; S.fw = SYSTEM_FW; } // old links
    if (view === "data") S.view = "about";
    try { S.anchor = anchor ? decodeURIComponent(anchor) : ""; } catch (e) { S.anchor = ""; }
    const p = new URLSearchParams(query || "");
    if (p.has("lang") && I18N[p.get("lang")]) S.lang = p.get("lang");
    if (p.has("s")) S.sectors = p.get("s").split(",").filter(Boolean);
    if (p.has("fw")) S.fw = p.get("fw");
    ["only", "rec", "drafts", "repealed", "context", "sb", "sp", "sl", "pending", "records"].forEach((k) => { if (p.has(k)) S[k] = p.get(k) === "1"; });
    S.q = p.get("q") || "";
    S.type = p.get("type") || "";
    if (p.has("b")) S.baseline = p.get("b");
    if (p.has("gp")) S.sprofile = p.get("gp");
    if (p.has("scope")) S.scope = p.get("scope") === "reference" ? "reference" : "core";
    if (p.has("mode")) S.mode = p.get("mode") === "chains" ? "chains" : "list";
    S.article = ARTICLES.includes(p.get("a")) ? p.get("a") : "";
    const ch = CHAPTER_MOVED[p.get("c")] || p.get("c");
    S.chapter = CHAPTERS.some((c) => c.id === ch) ? ch : CHAPTERS[0].id;
    if (S.view === "guide" && CRAFT_FROM[ch]) { S.view = "craft"; S.step = CRAFT_FROM[ch]; } // chapters that became steps
    if (S.view === "craft" && p.has("step")) S.step = Math.min(Math.max(parseInt(p.get("step"), 10) || 1, 1), 6);
    S.act = p.get("act") || ""; // an ELI or id, e.g. from an /eli/... link resolved by 404.html
    S.all = p.get("all") === "1";
    S.by = p.get("by") === "act" ? "act" : "control";
    S.chains = p.get("chains") === "1";
    return true;
  }
  function writeHash() {
    const p = new URLSearchParams();
    p.set("lang", S.lang);
    if (S.sectors.length) p.set("s", S.sectors.join(","));
    if (S.view === "controls" && S.fw !== SYSTEM_FW) {
      p.set("fw", S.fw); p.set("only", S.only ? "1" : "0");
      if (S.all) p.set("all", "1");
      if (S.by === "act") p.set("by", "act");
      if (S.chains) p.set("chains", "1");
    }
    if (S.view === "controls" || S.view === "sources") { p.set("rec", S.rec ? "1" : "0"); }
    if (S.view === "controls" && S.fw !== SYSTEM_FW) p.set("drafts", S.drafts ? "1" : "0");
    if (S.view === "sources") {
      p.set("scope", S.scope); p.set("mode", S.mode);
      ["repealed", "context", "pending", "records"].forEach((k) => p.set(k, S[k] ? "1" : "0"));
      if (S.type) p.set("type", S.type);
    }
    if (S.view === "articles" && S.article) p.set("a", S.article);
    if (S.view === "guide") p.set("c", S.chapter);
    if (S.view === "craft") { p.set("step", S.step); if (S.step >= 4) p.set("fw", S.fw); }
    if (S.view === "controls" && S.fw === SYSTEM_FW) { p.set("fw", S.fw); p.set("b", S.baseline); if (S.sprofile !== "none") p.set("gp", S.sprofile); ["sb", "sp", "sl", "drafts"].forEach((k) => p.set(k, S[k] ? "1" : "0")); }
    if (S.q && (S.view === "controls" || S.view === "sources")) p.set("q", S.q);
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
  // Acts are named by the issuer, the number and the date in words, so the date reads at a glance:
  // "CMU No. 373 dated 20 August 2022", "КМУ № 373 від 20 серпня 2022 р."
  const REF_TYPES = {
    uk: [[/^Постанов[аи] Правління (Національного банку України|НБУ)/, "НБУ"], [/^Постанов[аи] (Кабінету Міністрів України|КМУ)/, "КМУ"], [/^Наказ Держспецзв[’']язку/, "Держспецзв’язку"],
      [/^Закон України/, "Закон"], [/^Указ Президента України/, "Указ Президента"], [/^Наказ СБУ/, "СБУ"]],
    en: [[/^NBU Board Resolutions?/, "NBU"], [/^CMU Resolutions?/, "CMU"], [/^SSSCIP Order/, "SSSCIP"], [/^Law of Ukraine/, "Law"], [/^SBU Order/, "SBU"]],
  };
  const MONTHS = {
    uk: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };
  function niceRef(ref) {
    const lang = S.lang === "en" ? "en" : "uk";
    let out = ref;
    REF_TYPES[lang].forEach(([re, to]) => { out = out.replace(re, to); });
    return out.replace(/\s+(of|від)\s+(\d{2})\.(\d{2})\.(\d{4})(?=$|[\s,;)])/g, (_, w, d, m, y) =>
      lang === "en" ? ` dated ${+d} ${MONTHS.en[+m - 1]} ${y}` : ` від ${+d} ${MONTHS.uk[+m - 1]} ${y} р.`);
  }
  const rawRef = (src) => (src ? L(src, "short_ref") || src.number || src.id : "");
  const sourceRef = (src) => niceRef(rawRef(src));
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
    const link = ([v, k]) => `<a href="#/${v}" data-view="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${esc(t(k))}</a>`;
    const cur = (on) => (on ? ' aria-current="page"' : "");
    const menu = (id, label, on, body) => `<details class="nav-menu" id="${id}"><summary${cur(on)}>${esc(label)}</summary><div class="menu">${body}</div></details>`;
    const sub = ([v, k]) => `<li><a href="#/${v}"${cur(S.view === v)}>${esc(t(k))}</a></li>`;
    // Intro, the baseline wizard, the register to explore freely, and the help chapters; Methodology is also in the footer
    const nav = link(["home", "navIntro"]) + link(["craft", "navCraft"])
      + menu("explore-menu", t("navExplore"), S.view === "sources" || S.view === "controls", `<ul>${[["sources", "navSources"], ["controls", "navControls"]].map(sub).join("")}</ul>`)
      + menu("help-menu", t("navHelp"), ["guide", "articles", "method", "about"].includes(S.view), guideLinks(false));
    const repo = (CFG.repoUrl || "").replace(/\/$/, "");
    document.getElementById("header").innerHTML = `
      <div class="brand">${BRAND_MARK}<div class="brand-text"><a href="#/home" class="brand-name"${S.view === "home" ? ' aria-current="page"' : ""}>${esc(t("siteName"))}<span class="flag-ua" role="img" aria-label="${esc(t("flagUa"))}"></span></a></div></div>
      <nav class="nav" aria-label="${esc(t("siteName"))}">${nav}</nav>
      <div class="header-tools"><div class="theme-switch" id="theme" role="group" aria-label="${esc(t("themeGroup"))}"><button type="button" data-set="light" aria-label="${esc(t("themeLight"))}" title="${esc(t("themeLight"))}">${ICON_SUN}</button><button type="button" data-set="dark" aria-label="${esc(t("themeDark"))}" title="${esc(t("themeDark"))}">${ICON_MOON}</button></div><button class="lang" type="button" id="lang" aria-label="${esc(t("langSwitchLabel"))}">${esc(t("langSwitch"))}</button></div>`;
    document.getElementById("lang").onclick = () => { S.lang = S.lang === "uk" ? "en" : "uk"; store.set("grc-lang", S.lang); render(); };
    themeButton();
    const pv = document.getElementById("preview");
    if (pv) { pv.hidden = !CFG.preview; pv.textContent = CFG.preview ? t("previewBanner") : ""; }
    const meta = D.meta ? fmt(t("dataVersion"), D.meta.version, D.meta.date) : "";
    const report = repo ? `<a id="report" href="${esc(repo)}/issues/new?template=report.yml" target="_blank" rel="noopener" title="${esc(t("reportHint"))}">${ICON_FLAG} ${esc(t("footerReport"))}</a>` : "";
    document.getElementById("footer").innerHTML = `<p>${esc(t("footer"))} ${esc(meta)}</p>
      <p class="footer-links"><a href="#/method">${esc(t("navMethod"))}</a>${report}${repo ? `<a href="${esc(repo)}" target="_blank" rel="noopener">GitHub</a>` : ""}</p>`;
    // the issue form gets the address of the page as it is at the moment of the click
    const rep = document.getElementById("report");
    if (rep) rep.addEventListener("click", () => { rep.href = `${repo}/issues/new?template=report.yml&page=${encodeURIComponent(location.href)}`; });
  }

  function render() {
    renderShell();
    writeHash();
    ({ home: renderHome, craft: renderCraft, guide: renderGuide, controls: renderControls, sources: renderSources, method: renderMethod, articles: renderArticles, about: renderAbout })[S.view]();
  }

  // ------------------------------------------------------------------ filter panel (shared)
  function sectorChips(withSearch = true) {
    const chip = (s) => `<label class="chip${D.parents[s.id].length ? " chip-sub" : ""}" title="${esc(L(s, "description"))}"><input type="checkbox" name="sector" value="${esc(s.id)}" ${S.sectors.includes(s.id) ? "checked" : ""}><span>${esc(L(s, "label"))}</span></label>`;
    const groups = D.groups.map((g) => {
      const items = D.sectors.filter((s) => s.selectable === "yes" && s.group === g.id);
      const open = g.sort === "0" || items.some((s) => S.sectors.includes(s.id));
      return `<details class="chip-group"${open ? " open" : ""}><summary>${esc(L(g, "label"))}</summary>${items.map(chip).join("")}</details>`;
    }).join("");
    return `<fieldset class="chips"><legend>${esc(t("orgType"))}</legend>
      <p class="hint">${esc(t("orgTypeHint"))} <a href="#/craft?step=1">${esc(t("orgTypeQuiz"))}</a></p>
      ${withSearch ? searchBox() : ""}
      ${!S.sectors.length ? `<p class="none-note">${esc(t("orgTypeNone"))}</p>` : S.sectors.every((id) => id === "general") ? `<p class="none-note">${esc(t("orgTypeGeneral"))}</p>` : ""}
      ${groups}
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
      Object.assign(S, { sectors: [], only: true, rec: true, drafts: true, repealed: false, context: false, q: "", type: "", sb: true, sp: true, sl: true, pending: false, records: false, all: false });
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
  // Search field (a magnifier instead of a label) and the reset button, at the top of the "who it concerns" filter
  const searchBox = () => `<div class="find">
      <label class="search"><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="q" type="search" value="${esc(S.q)}" placeholder="${esc(t("searchPh"))}" aria-label="${esc(t("search"))}" autocomplete="off"></label>
      <button type="button" class="btn btn-quiet" id="reset">${esc(t("reset"))}</button></div>`;

  // ------------------------------------------------------------------ markdown pages (home, guide, method, about)
  async function loadMd(path) {
    if (mdCache[path] === undefined) {
      try {
        const res = await fetch(path, { cache: "no-cache" });
        mdCache[path] = res.ok ? await res.text() : "";
      } catch (e) { mdCache[path] = ""; }
    }
    return mdCache[path];
  }
  // Renders content/<name>.<lang>.md into el; returns false if the reader has moved on meanwhile.
  async function mdInto(el, name) {
    const view = S.view, lang = S.lang, key = S.chapter + S.article;
    const md = await loadMd(`content/${name}.${lang}.md`);
    if (S.view !== view || S.lang !== lang || S.chapter + S.article !== key || !el.isConnected) return false;
    renderMarkdown(el, md);
    return true;
  }
  function scrollToAnchor() {
    if (!S.anchor) return;
    const target = document.getElementById(S.anchor);
    S.anchor = "";
    if (target) target.scrollIntoView({ block: "start" });
  }
  // A page with a side panel (contents or the guide's chapters) and the text
  function docLayout(panelTitle) {
    app.innerHTML = `<article class="guide"><div class="guide-body">
      <details class="toc" id="toc" open><summary>${esc(panelTitle)}</summary><nav aria-label="${esc(panelTitle)}"></nav></details>
      <div class="prose" id="doc-text"><p class="hint">${esc(t("loading"))}</p></div></div></article>`;
    return document.getElementById("doc-text");
  }

  // ------------------------------------------------------------------ home
  async function renderHome() {
    app.innerHTML = `<article class="home" id="home-text"><p class="hint">${esc(t("loading"))}</p></article>`;
    const el = document.getElementById("home-text");
    if (!(await mdInto(el, "home"))) return;
    const fill = (id, html) => { const x = el.querySelector(`#${id}`); if (x) x.outerHTML = html; };
    fill("home-who", homeWho());
    fill("home-review", homeReview());
    fill("home-changes", homeChanges());
    scrollToAnchor();
  }
  // In the hero: the organisation types as links into the controls table, by group, and the questionnaire
  function homeWho() {
    const pill = (href, label, title) => `<a class="pill" href="${href}"${title ? ` title="${esc(title)}"` : ""}>${esc(label)}</a>`;
    const groups = D.groups.map((g) => {
      const items = D.sectors.filter((s) => s.selectable === "yes" && s.group === g.id && !D.parents[s.id].length);
      if (!items.length) return "";
      return `<div class="who-group"><h3>${esc(L(g, "label"))}</h3><div class="pills">${items.map((s) => pill(`#/craft?step=2&s=${encodeURIComponent(s.id)}`, L(s, "label"), L(s, "description"))).join("")}</div></div>`;
    }).join("");
    return `<section class="home-who" aria-labelledby="who-title">
      <h2 id="who-title">${esc(t("whoTitle"))}</h2>
      <div class="who-groups">${groups}</div>
      <p class="who-foot"><a class="btn btn-primary" href="#/craft?step=1">${esc(t("whoQuiz"))}</a><span>${esc(t("whoNone"))} <a href="#/craft?step=2&s=general">${esc(t("whoAll"))}</a></span></p>
    </section>`;
  }
  // How many mappings a second person has checked, counted from the data
  function homeReview() {
    const total = D.mappings.length;
    const done = D.mappings.filter((m) => m.review_status === "reviewed").length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div class="meter-box"><p class="meter-line"><b>${done}</b> ${esc(fmt(t("homeReviewed"), total))}<span class="muted">${pct}%</span></p>
      <div class="meter" role="img" aria-label="${esc(fmt(t("homeReviewedAria"), done, total))}"><span style="width:${Math.max(pct, done ? 1 : 0)}%"></span></div></div>`;
  }
  // The current data version and what it changed; the full history is the changelog
  function homeChanges() {
    const repo = (CFG.repoUrl || "").replace(/\/$/, "");
    const m = D.meta;
    const note = m ? (S.lang === "uk" ? m.note_uk : m.note_en) : "";
    return `${m ? `<p class="change-head"><b>${esc(m.version)}</b> <span class="muted">${esc(m.date)}</span></p><p>${esc(note)}</p>` : ""}
      ${repo ? `<p class="change-links"><a href="${esc(repo)}/blob/${esc(CFG.branch || "main")}/CHANGELOG.md" target="_blank" rel="noopener">${esc(t("homeAllChanges"))}</a><a href="${esc(repo)}" target="_blank" rel="noopener">${esc(t("homeWatch"))}</a></p>` : ""}`;
  }
  function heroExample() {
    const ex = CFG.heroExample || {};
    const m = D.mappings.find((x) => x.provision_id === ex.provision && x.framework_id === ex.framework && x.control_id === ex.control);
    const p = m && D.provById[m.provision_id];
    const src = p && D.sourceById[p.source_id];
    const c = m && D.controlById[m.framework_id] && D.controlById[m.framework_id][m.control_id];
    if (!(m && p && src && c)) return "";
    const capT = (t("heroCaption") || {})[m.relationship] || "";
    const provRef = `${L(p, "ref")}`;
    return `<figure class="hero-example">
      <div class="hero-pair">
        <div class="hero-card"><span class="hero-kicker">${esc(sourceRef(src))}, ${esc(provRef)}${isDraft(m) ? ` <span class="badge rv-${esc(m.review_status)}">${esc(reviewLabel(m.review_status))}</span>` : ""}</span><span class="hero-text">${esc(L(p, "summary"))}</span></div>
        ${glyph(m.relationship, true)}
        <div class="hero-card"><span class="hero-kicker">${esc(fwLabel(fwRow(m.framework_id)))}, ${esc(c.id)}</span><span class="hero-text">${esc(controlName(m.framework_id, c))}</span></div>
      </div>
      <figcaption>${esc(fmt(capT, provRef, c.id))}</figcaption></figure>`;
  }

  // ------------------------------------------------------------------ Craft your baseline
  // Six steps. Each has short guidance (content/craft/<step>.<lang>.md) and then the answer for this reader:
  // 1 the questionnaire, 2 the profile it gives, 3 who sets the rules, 4 the framework, 5 the acts, 6 the SoA.
  // Mandatory acts and the controls they require cannot be removed; recommended ones can be accepted and the reader
  // can add their own. Choices live only for this visit (nothing is stored) and end up in the download.
  const QUIZ = {
    q1: { multi: true, opts: [["public", ["public-sector"]], ["defence", ["defence"]], ["defind", ["defence-industry"]], ["finance", ["finance"]],
      ["telecom", ["telecom"]], ["infra", ["ics"]], ["health", ["health"]], ["cloud", ["cloud"]], ["platforms", ["platforms"]], ["trust", ["trust"]],
      ["vendors", ["vendors"]], ["suppliers", ["ict-suppliers", "security-services"]], ["ai", ["ai"]], ["other", []]] },
    q2: { multi: true, opts: [["pd", ["personal-data"]], ["sir", ["public-sir"]], ["restricted", ["public-restricted"]], ["secrets", ["state-secrets"]],
      ["nato", ["nato-info"]], ["none", []]] },
    q3: { multi: false, opts: [["no", []], ["c12", ["cii-1-2"]], ["c34", ["cii-3-4"]], ["unknown", ["ki"]]] },
  };
  const QUIZ_EXCLUSIVE = { q1: "other", q2: "none" };
  const QA = { q1: [], q2: ["pd"], q3: "no", touched: false };
  const quizSectors = () => [...new Set(["q1", "q2", "q3"].flatMap((q) => {
    const sel = [].concat(QA[q]);
    return QUIZ[q].opts.filter(([id]) => sel.includes(id)).flatMap(([, ids]) => ids);
  }))].filter((id) => D.sectorById[id]);
  // The questionnaire's answers read back from a profile (a link or the home page's one-click types)
  function quizFromSectors() {
    if (QA.touched || !S.sectors.length) return;
    ["q1", "q2"].forEach((q) => { QA[q] = QUIZ[q].opts.filter(([, ids]) => ids.length && ids.some((id) => S.sectors.includes(id))).map(([id]) => id); });
    if (!QA.q2.length) QA.q2 = ["none"];
    const c = QUIZ.q3.opts.find(([, ids]) => ids.length && ids.some((id) => S.sectors.includes(id)));
    QA.q3 = c ? c[0] : "no";
  }
  const CRAFT_STEPS = ["about", "profile", "actors", "framework", "acts", "soa"];
  const CRAFT_FROM = { context: 2, actors: 3, standard: 4, requirements: 5, soa: 6 }; // old guide chapters now live here
  const CR = { recActs: new Set(), euActs: new Set(), picked: new Set(), unpicked: new Set(), fwChosen: false };
  const CSF_SECTORS = ["public-sector", "defence", "defence-industry", "cii-1-2", "cii-3-4", "ki"];
  // The framework the profile points to, and why
  function recFw() {
    if (S.sectors.some((id) => CSF_SECTORS.includes(id))) return ["csf-2.0", "fwWhyCsf"];
    if (S.sectors.includes("finance")) return ["iso27001-2022", "fwWhyBank"];
    return ["iso27001-2022", "fwWhyIso"];
  }
  const sParam = () => encodeURIComponent(S.sectors.join(",")).replace(/%2C/g, ",");
  const craftHref = (n) => `#/craft?step=${n}${S.sectors.length ? `&s=${sParam()}` : ""}`;
  // Runs fn with some filters set (e.g. rec=false: only the mandatory acts), then puts the reader's filters back
  function withS(patch, fn) {
    const saved = Object.fromEntries(Object.keys(patch).map((k) => [k, S[k]]));
    Object.assign(S, patch);
    try { return fn(); } finally { Object.assign(S, saved); }
  }
  const MANDATORY = { rec: false, all: false, q: "", drafts: true };
  const WITH_REC = { rec: true, all: false, q: "", drafts: true };

  async function renderCraft() {
    const n = S.step;
    const step = CRAFT_STEPS[n - 1];
    app.innerHTML = `<article class="craft"><div class="craft-body">
      <nav class="craft-steps" aria-label="${esc(t("navCraft"))}"><p class="craft-label">${esc(t("navCraft"))}</p>
        <ol>${CRAFT_STEPS.map((k, i) => `<li${i + 1 === n ? ' class="current"' : ""}><a href="${craftHref(i + 1)}"${i + 1 === n ? ' aria-current="step"' : ""}><span class="craft-num">${i + 1}</span><span>${esc(t("cs_" + k))}</span></a></li>`).join("")}</ol>
        <p class="craft-note">${esc(t("craftNote"))}</p></nav>
      <div class="craft-main">
        <p class="kicker">${esc(fmt(t("craftStepOf"), n, CRAFT_STEPS.length))}</p>
        <div class="prose craft-guide" id="craft-guide"><p class="hint">${esc(t("loading"))}</p></div>
        <section class="craft-answer" id="craft-answer" aria-live="polite"></section>
        <nav class="pager craft-pager" aria-label="${esc(t("navCraft"))}">
          ${n > 1 ? `<a class="pager-prev" href="${craftHref(n - 1)}"><span>${esc(t("chPrev"))}</span>${esc(t("cs_" + CRAFT_STEPS[n - 2]))}</a>` : "<span></span>"}
          ${n < CRAFT_STEPS.length && n > 1 ? `<a class="pager-next" href="${craftHref(n + 1)}"><span>${esc(t("chNext"))}</span>${esc(t("cs_" + CRAFT_STEPS[n]))}</a>` : ""}</nav>
      </div></div></article>`;
    const box = document.getElementById("craft-answer");
    if (step !== "about" && !S.sectors.length) box.innerHTML = craftPick();
    else ({ about: craftAbout, profile: craftProfile, actors: craftActors, framework: craftFramework, acts: craftActs, soa: craftSoa })[step](box);
    const md = await loadMd(`content/craft/${step}.${S.lang}.md`);
    const g = document.getElementById("craft-guide");
    if (!g || S.view !== "craft" || S.step !== n) return;
    renderMarkdown(g, md);
    scrollToAnchor();
  }
  // No answers yet
  function craftPick() {
    const items = D.sectors.filter((x) => x.selectable === "yes" && !D.parents[x.id].length);
    return `<div class="craft-card side-pick"><p>${esc(t("craftPickText"))}</p>
      <p><a class="btn btn-primary" href="#/craft?step=1">${esc(t("craftStart"))}</a></p>
      <p class="hint">${esc(t("sidePickOr"))}</p>
      <div class="pills">${items.map((x) => `<a class="pill" href="#/craft?step=${S.step}&s=${encodeURIComponent(x.id)}">${esc(L(x, "label"))}</a>`).join("")}</div></div>`;
  }
  const answerHead = (key) => `<p class="craft-answer-label">${esc(t(key))}</p>`;

  // 1. Three questions
  function craftAbout(box) {
    quizFromSectors();
    const opt = (q, [id]) => {
      const multi = QUIZ[q].multi;
      const on = multi ? QA[q].includes(id) : QA[q] === id;
      return `<label class="q-opt"><input type="${multi ? "checkbox" : "radio"}" name="${q}" value="${esc(id)}" ${on ? "checked" : ""}><span>${esc(t(`qo_${q}_${id}`))}</span></label>`;
    };
    const question = (q, i) => `<fieldset class="q"><legend><span class="q-num">${i}</span>${esc(t(q))}</legend>
      ${t(q + "Hint") !== q + "Hint" ? `<p class="hint">${esc(t(q + "Hint"))}</p>` : ""}
      <div class="q-opts${QUIZ[q].opts.length > 6 ? " q-opts-wide" : ""}">${QUIZ[q].opts.map((o) => opt(q, o)).join("")}</div></fieldset>`;
    box.innerHTML = `<form id="quiz" class="quiz" onsubmit="return false">${["q1", "q2", "q3"].map((q, i) => question(q, i + 1)).join("")}
      <div class="q-actions"><button type="submit" class="btn btn-primary btn-lg" id="q-go">${esc(t("craftToProfile"))}</button>
        <a class="q-skip" href="#/sources?scope=core&s=">${esc(t("qSkip"))}</a></div></form>`;
    const form = box.querySelector("#quiz");
    form.addEventListener("change", (e) => {
      const q = e.target.name;
      if (!QUIZ[q]) return;
      QA.touched = true;
      if (QUIZ[q].multi) {
        const ex = QUIZ_EXCLUSIVE[q];
        if (e.target.checked && e.target.value === ex) form.querySelectorAll(`input[name="${q}"]`).forEach((x) => { if (x.value !== ex) x.checked = false; });
        else if (e.target.checked) { const x = form.querySelector(`input[name="${q}"][value="${ex}"]`); if (x) x.checked = false; }
        QA[q] = [...form.querySelectorAll(`input[name="${q}"]:checked`)].map((x) => x.value);
      } else QA[q] = e.target.value;
    });
    box.querySelector("#q-go").addEventListener("click", () => {
      S.sectors = quizSectors();
      if (!S.sectors.length) S.sectors = ["general"];
      if (!CR.fwChosen) S.fw = recFw()[0];
      location.hash = craftHref(2);
    });
  }

  // 2. The profile the answers give, grouped as in the register; adjustable here
  function craftProfile(box) {
    const groups = D.groups.map((g) => {
      const items = S.sectors.map((id) => D.sectorById[id]).filter((x) => x && x.group === g.id);
      if (!items.length) return "";
      return `<div class="prof-group"><p class="prof-group-label">${esc(L(g, "label"))}</p><ul>${items.map((x) => `<li><b>${esc(L(x, "label"))}</b>${L(x, "description") ? `<span>${esc(L(x, "description"))}</span>` : ""}</li>`).join("")}</ul></div>`;
    }).join("");
    const acts = withS(MANDATORY, () => listedActs("core")).length;
    box.innerHTML = `<div class="craft-card">${answerHead("craftYourAnswer")}
      <div class="prof-groups">${groups || `<p>${esc(t("orgTypeGeneral"))}</p>`}</div>
      <p class="craft-figure">${esc(fmt(t("craftProfileActs"), acts))}</p>
      <details class="craft-adjust"><summary>${esc(t("craftAdjust"))}</summary>${sectorChips(false)}</details></div>`;
    bindPanel(box, () => { QA.touched = false; render(); });
    const det = box.querySelector(".craft-adjust");
    if (craftAdjustOpen) det.open = true;
    det.addEventListener("toggle", () => { craftAdjustOpen = det.open; });
  }
  let craftAdjustOpen = false;

  // 3. Who issued the acts that apply: the bodies that set the rules for this reader
  function craftActors(box) {
    const acts = withS(MANDATORY, () => listedActs("core"));
    const byIssuer = new Map();
    acts.forEach((x) => {
      const type = D.types[x.type];
      const who = (type && L(type, "issuer")) || t("craftIntl");
      if (!byIssuer.has(who)) byIssuer.set(who, []);
      byIssuer.get(who).push(x);
    });
    const rows = [...byIssuer].sort((a, b) => b[1].length - a[1].length).map(([who, xs]) => {
      const types = uniq(xs.map((x) => x.type));
      return `<li><span class="actor-name">${esc(who)}</span><span class="actor-count">${esc(fmt(t("craftActs"), xs.length))}</span>
        <span class="actor-acts">${esc(xs.slice(0, 4).map((x) => shortRef(x, true)).join("; "))}${xs.length > 4 ? "…" : ""}</span>
        <a href="#/sources?scope=core&rec=0&s=${sParam()}${types.length === 1 ? `&type=${esc(types[0])}` : ""}">${esc(t("craftSeeActs"))}</a></li>`;
    }).join("");
    box.innerHTML = `<div class="craft-card">${answerHead("craftYourAnswer")}<ul class="actor-list">${rows}</ul></div>`;
  }

  // 4. The recommended framework, with the reason, and the choice
  function craftFramework(box) {
    const [rec, why] = recFw();
    if (!CR.fwChosen) S.fw = rec;
    const exp = expandedSectors();
    const count = (fw) => withS(MANDATORY, () => Object.keys(driversFor(fw, exp, true)).length);
    const leafs = (fw) => D.controls[fw].filter((c) => ["subcategory", "requirement", "control"].includes(c.level)).length;
    box.innerHTML = `<div class="craft-card">${answerHead("craftYourAnswer")}
      <p class="craft-figure">${esc(fmt(t("craftFwRec"), fwLabel(fwRow(rec))))}</p><p>${esc(t(why))}</p>
      <fieldset class="fw-choice"><legend>${esc(t("craftFwPick"))}</legend>
        ${D.orgFrameworks.map((f) => `<label class="fw-option${S.fw === f.id ? " on" : ""}"><input type="radio" name="craft-fw" value="${esc(f.id)}"${S.fw === f.id ? " checked" : ""}>
          <span><b>${esc(fwLabel(f))}</b>${f.id === rec ? ` <span class="badge cov-full">${esc(t("craftRecommended"))}</span>` : ""}
          <span class="hint block">${esc(fmt(t("craftFwCount"), count(f.id), leafs(f.id)))}</span></span></label>`).join("")}</fieldset></div>`;
    box.querySelectorAll('input[name="craft-fw"]').forEach((r) => r.addEventListener("change", () => {
      S.fw = r.value; CR.fwChosen = true; writeHash();
      box.querySelectorAll(".fw-option").forEach((l) => l.classList.toggle("on", l.querySelector("input").checked));
    }));
  }

  // 5. The acts: mandatory ones as chains (locked), recommended to accept, EU law to follow.
  // The reader's own requirements (contracts, the parent company) are added later in the downloaded file.
  function craftActs(box) {
    const rec = withS(WITH_REC, () => listedActs("core")).filter((x) => x.binding !== "mandatory");
    const eu = withS(WITH_REC, () => listedActs("reference"));
    const check = (set, x) => `<li><label class="craft-check"><input type="checkbox" data-set="${set}" value="${esc(x.id)}"${(set === "rec" ? CR.recActs : CR.euActs).has(x.id) ? " checked" : ""}>
      <span><a href="#/sources?act=${esc(x.id)}">${esc(sourceRef(x))}</a>${L(x, "description") ? `<span class="aa-desc block">${esc(L(x, "description"))}</span>` : ""}</span></label></li>`;
    box.innerHTML = `<div class="craft-card"><h3 class="craft-sub">${esc(t("craftRequired"))}</h3><div id="craft-mandatory"></div></div>
      ${rec.length ? `<div class="craft-card"><h3 class="craft-sub">${esc(fmt(t("craftRecActs"), rec.length))}</h3><ul class="aa-list">${rec.map((x) => check("rec", x)).join("")}</ul></div>` : ""}
      ${eu.length ? `<div class="craft-card"><h3 class="craft-sub">${esc(fmt(t("aaEu"), eu.length))}</h3><ul class="aa-list">${eu.map((x) => check("eu", x)).join("")}</ul></div>` : ""}`;
    drawApplicable(box.querySelector("#craft-mandatory"), true);
    box.querySelectorAll("input[data-set]").forEach((c) => c.addEventListener("change", () => {
      const set = c.dataset.set === "rec" ? CR.recActs : CR.euActs;
      if (c.checked) set.add(c.value); else set.delete(c.value);
    }));
  }

  // 6. The SoA (or the CSF target profile) for the organisation, and the NIST SP 800-53 target profile for its
  // information systems when the information processed calls for it. Two clearly labelled levels, one tab each.
  // Every control has a selector on the left: required ones (by law or by ISO/IEC 27001 clauses 4-10) are locked in;
  // controls from accepted recommended acts start selected; the rest start unselected.
  function craftRows() {
    if (!D.controls[S.fw]) S.fw = "iso27001-2022";
    const exp = expandedSectors();
    const required = withS(MANDATORY, () => driversFor(S.fw, exp, true));
    const all = withS(WITH_REC, () => driversFor(S.fw, exp, true));
    const leaf = D.controls[S.fw].filter((c) => ["subcategory", "requirement", "control"].includes(c.level));
    return leaf.map((c) => {
      const req = (required[c.id] || []).slice().sort((a, b) => a.provision_id.localeCompare(b.provision_id));
      const fromRec = (all[c.id] || []).filter((m) => !req.includes(m) && CR.recActs.has(D.provById[m.provision_id].source_id));
      // ISO/IEC 27001 clauses 4-10 are required by the standard itself, whatever the law says
      const kind = req.length ? "required" : fromRec.length ? "recommended" : c.level === "requirement" ? "standard" : "optional";
      return { c, ds: req.concat(fromRec), kind };
    });
  }
  const isLocked = (r) => r.kind === "required" || r.kind === "standard";
  const isPicked = (r) => isLocked(r) || (r.kind === "recommended" ? !CR.unpicked.has(r.c.id) : CR.picked.has(r.c.id));
  function setPicked(r, on) {
    if (r.kind === "recommended") { if (on) CR.unpicked.delete(r.c.id); else CR.unpicked.add(r.c.id); }
    else if (r.kind === "optional") { if (on) CR.picked.add(r.c.id); else CR.picked.delete(r.c.id); }
  }
  const needsSystems = () => S.sectors.some((id) => ["public-sir", "public-restricted", "nato-info"].includes(id));
  const SYS_STATE = { drafts: true, sb: true, sp: true, sl: true, sprofile: "none" };
  let craftTab = "org";
  function craftSoa(box) {
    const rows = craftRows();
    const fw = fwRow(S.fw);
    const sys = needsSystems();
    if (sys) guessBaseline();
    const sysCount = sys ? withS({ ...SYS_STATE, q: "" }, () => systemRows().length) : 0;
    const base = profilesOf("baseline").find((p) => p.id === S.baseline);
    const ai = rows.flatMap((r) => r.ds).filter((m) => m.review_status === "ai_draft").length;
    const picked = rows.filter(isPicked).length;
    const level = (key, name, sub, count) => `<span class="level-tag">${esc(t(key))}</span><span class="level-name">${esc(name)}</span><span class="level-sub">${esc(sub)}</span>${count !== undefined ? `<span class="level-count">${esc(count)}</span>` : ""}`;
    const orgName = fwLabel(fw), orgDoc = t(S.fw === "csf-2.0" ? "levelProfile" : "levelSoa");
    const sysName = "NIST SP 800-53 Rev. 5", sysDoc = base ? L(base, "label") : t("levelSysDoc");
    if (!sys) craftTab = "org";
    box.innerHTML = `<div class="craft-card">${answerHead("craftYourAnswer")}
        <p>${esc(t(sys ? "levelLeadBoth" : "levelLeadOrg"))}</p>
        ${ai ? `<p class="warn-text">${esc(fmt(t("ctlUnreviewed"), ai, rows.flatMap((r) => r.ds).length))}</p>` : ""}
        <div class="craft-download"><button type="button" class="btn btn-primary" id="soa-xlsx">${esc(t("craftDownload"))}</button><button type="button" class="btn" id="soa-csv">CSV</button>
          <a href="${craftHref(4)}">${esc(t("craftChangeFw"))}</a></div></div>
      ${sys ? `<div class="level-tabs" role="tablist" aria-label="${esc(t("cs_soa"))}">
          <button type="button" role="tab" id="tab-org" aria-controls="pane-org" aria-selected="${String(craftTab === "org")}" class="level-tab level-org">${level("levelOrg", orgName, orgDoc, fmt(t("levelPicked"), picked, rows.length))}</button>
          <button type="button" role="tab" id="tab-sys" aria-controls="pane-sys" aria-selected="${String(craftTab === "sys")}" class="level-tab level-sys">${level("levelSys", sysName, sysDoc, fmt(t("toolSysSum"), sysCount))}</button></div>` : ""}
      <section class="craft-card level-pane level-org" id="pane-org" role="${sys ? "tabpanel" : "region"}" aria-labelledby="${sys ? "tab-org" : "org-title"}"${craftTab === "org" ? "" : " hidden"}>
        ${sys ? "" : `<h3 class="level-title" id="org-title">${level("levelOrg", orgName, orgDoc, fmt(t("levelPicked"), picked, rows.length))}</h3>`}
        <div class="soa-legend"><span>${ICON_LOCK} ${esc(t("soaLocked"))}</span><span class="badge">${esc(t("soaRecommended"))}</span>
          <span class="soa-bulk"><button type="button" class="link-btn" id="pick-all">${esc(t("soaPickAll"))}</button><button type="button" class="link-btn" id="pick-none">${esc(t("soaPickNone"))}</button></span></div>
        <div class="soa-list ctl-list" id="soa-list"></div>
        ${gapsHtml(withS(MANDATORY, () => gapRows()), fw)}</section>
      ${sys ? `<section class="craft-card level-pane level-sys" id="pane-sys" role="tabpanel" aria-labelledby="tab-sys"${craftTab === "sys" ? "" : " hidden"}>
        <p class="hint">${esc(t("craftSysHint"))}</p><div id="craft-sys"></div></section>` : ""}`;
    const list = box.querySelector("#soa-list");
    const drawList = () => {
      let body = "", last = null;
      rows.forEach((r) => {
        const g = topGroup(r.c);
        if (g && g !== last) { last = g; body += `<h4 class="ctl-group">${esc(g.id)} ${esc(L(g, "name"))}</h4>`; }
        body += soaRow(r);
      });
      list.innerHTML = body;
    };
    drawList();
    const sumOrg = () => {
      const n = fmt(t("levelPicked"), rows.filter(isPicked).length, rows.length);
      box.querySelectorAll(".level-org .level-count").forEach((x) => { x.textContent = n; });
    };
    list.addEventListener("toggle", (e) => {
      const d = e.target;
      if (!d.matches || !d.matches("details.soa-detail") || !d.open || d.dataset.drawn) return;
      d.dataset.drawn = "1";
      const r = rows.find((x) => x.c.id === d.dataset.ctl);
      if (r) d.querySelector(".ctl-body").innerHTML = driversBody(r.c.id, r.ds);
    }, true);
    list.addEventListener("change", (e) => {
      const c = e.target.closest("input[data-pick]");
      if (!c) return;
      const r = rows.find((x) => x.c.id === c.dataset.pick);
      if (r) { setPicked(r, c.checked); c.closest(".soa-row").classList.toggle("soa-off", !c.checked); sumOrg(); }
    });
    const bulk = (on) => { rows.filter((r) => !isLocked(r)).forEach((r) => setPicked(r, on)); drawList(); sumOrg(); };
    box.querySelector("#pick-all").onclick = () => bulk(true);
    box.querySelector("#pick-none").onclick = () => bulk(false);
    if (sys) {
      const sysBox = box.querySelector("#craft-sys");
      const show = (tab) => {
        craftTab = tab;
        ["org", "sys"].forEach((k) => {
          box.querySelector(`#tab-${k}`).setAttribute("aria-selected", String(k === tab));
          box.querySelector(`#pane-${k}`).hidden = k !== tab;
        });
        if (tab === "sys" && !sysBox.innerHTML) drawSideSystem(sysBox);
      };
      box.querySelector("#tab-org").onclick = () => show("org");
      box.querySelector("#tab-sys").onclick = () => show("sys");
      box.querySelector(".level-tabs").addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        const next = craftTab === "org" ? "sys" : "org";
        show(next); box.querySelector(`#tab-${next}`).focus();
      });
      if (craftTab === "sys") drawSideSystem(sysBox);
    }
    box.querySelector("#soa-xlsx").onclick = () => exportCraft("xlsx");
    box.querySelector("#soa-csv").onclick = () => exportCraft("csv");
  }
  function soaRow(r) {
    const on = isPicked(r);
    const sel = isLocked(r)
      ? `<span class="soa-req" title="${esc(t(r.kind === "standard" ? "soaStandard" : "soaRequired"))}">${ICON_LOCK}<span class="sr-only">${esc(t(r.kind === "standard" ? "soaStandard" : "soaRequired"))}</span></span>`
      : `<input type="checkbox" data-pick="${esc(r.c.id)}"${on ? " checked" : ""} aria-label="${esc(fmt(t("soaPickLabel"), r.c.id))}">`;
    const acts = uniq(r.ds.map((m) => D.provById[m.provision_id].source_id));
    const note = r.kind === "standard" ? `<span class="ctl-acts soa-std">${esc(t("soaStandard"))}</span>`
      : `<span class="ctl-acts">${esc(acts.map((id) => shortRef(D.sourceById[id])).join(" · "))}</span>`;
    const mark = r.kind === "recommended" ? `<span class="badge">${esc(t("soaRecommended"))}</span>` : "";
    const head = `<span class="ctl-id">${esc(r.c.id)}</span><span class="ctl-name">${esc(controlName(S.fw, r.c))}</span>${note}<span class="soa-mark">${mark}</span>`;
    const main = r.ds.length
      ? `<details class="soa-detail" data-ctl="${esc(r.c.id)}"><summary class="ctl-head">${head}<span class="chev" aria-hidden="true"></span></summary><div class="ctl-body"></div></details>`
      : `<div class="ctl-head soa-flat">${head}<span></span></div>`;
    return `<div class="soa-row soa-${r.kind}${on ? "" : " soa-off"}"><div class="soa-sel">${sel}</div>${main}</div>`;
  }
  // The download: every control with Applicable yes or no, the acts (mandatory, accepted, followed) and, when
  // needed, the system profile. The reader adds their own controls and requirements as new rows.
  function exportCraft(kind) {
    const rows = craftRows();
    const yes = S.lang === "uk" ? "так" : "Y", no = S.lang === "uk" ? "ні" : "N";
    const status = { required: t("soaRequired"), standard: t("soaStandard"), recommended: t("soaRecommended"), optional: t("soaOptional") };
    const why = { required: t("xWhyLaw"), standard: t("xWhyStandard"), recommended: t("xWhyRec"), optional: t("xWhyOwnDecision") };
    const soaHeader = [t("xControlId"), t("xControl"), t("xBaseline"), t("xDrivers"), t("xCoverage"), t("xParam"),
      t("xApplicable"), t("xReason"), t("xOrgValue"), t("xPolicy"), t("xPolicySuggested"), t("xOwner"), t("xStatus"), t("xEvidence")];
    const soa = rows.map((r) => {
      const { c, ds, kind } = r;
      const on = isPicked(r);
      const drv = ds.map((m) => { const p = D.provById[m.provision_id]; return `${sourceRef(D.sourceById[p.source_id])}, ${L(p, "ref")} [${GLYPH[m.relationship]} ${covLabel(m.coverage)}${reviewMark(m)}]`; }).join("\n");
      const cov = ds.length ? (ds.some((m) => m.coverage === "full") ? t("fullNote") : t("partialNote")) : "";
      const par = ds.filter((m) => L(m, "parameter")).map((m) => `${L(m, "parameter")} (${sourceRef(D.sourceById[D.provById[m.provision_id].source_id])}, ${L(D.provById[m.provision_id], "ref")})`).join("\n");
      const pol = [...new Set(ds.map((m) => L(m, "policy")).filter(Boolean))].join("\n");
      return [c.id, controlName(S.fw, c), status[kind], drv, cov, par, on ? yes : no, on ? why[kind] : "", "", "", pol, "", "", ""];
    });
    if (kind === "csv") { downloadCsv(`baseline_${stamp()}.csv`, soaHeader, soa); return; }
    const actRow = (x, st) => [st, sourceRef(x), sourceTitle(x), typeLabel(x.type), L(x, "description"), D.mappedProvs[x.id] ? D.mappedProvs[x.id].size : "", x.url || ""];
    const acts = withS(MANDATORY, () => listedActs("core")).map((x) => actRow(x, t("xActRequired")))
      .concat(withS(WITH_REC, () => listedActs("core")).filter((x) => CR.recActs.has(x.id)).map((x) => actRow(x, t("xActAccepted"))))
      .concat(withS(WITH_REC, () => listedActs("reference")).filter((x) => CR.euActs.has(x.id)).map((x) => actRow(x, t("xActFollowed"))));
    const sheets = [
      { name: S.fw === "csf-2.0" ? "Profile" : "SoA", header: soaHeader, rows: soa, widths: [10, 50, 18, 55, 12, 35, 12, 30, 30, 30, 40, 20, 20, 30] },
      { name: S.lang === "uk" ? "Акти" : "Acts", header: [t("xBaseline"), t("srcColRef"), t("xTitle"), t("xType"), t("xDescription"), t("xReqCount"), t("xUrl")], rows: acts, widths: [16, 40, 60, 20, 60, 12, 40] },
    ];
    if (needsSystems()) {
      guessBaseline();
      const sys = withS({ ...SYS_STATE, q: "" }, () => systemRows());
      sheets.push({ name: "NIST SP 800-53", header: [t("sysColId"), "name_en", "name_uk_machine", t("sysColBaseline"), t("sysColParams"), t("sysColPlan"), t("sysColLaw"), t("xSource"), t("xApplicable"), t("xOrgValue"), t("xPolicy"), t("xStatus"), t("xEvidence")],
        rows: sys.map((c) => [c.id, c.name_en, c.name_uk_machine, c._base ? yes : "", c._base ? c[`${S.baseline}_params_uk`] || "" : "", c._plan.join(", "), c._law.join(", "), c._acts.map((id) => sourceRef(D.sourceById[id])).join("; "), "", "", "", "", ""]),
        widths: [12, 40, 40, 12, 40, 30, 30, 40, 12, 24, 24, 16, 24] });
    }
    downloadWorkbook(`baseline_${stamp()}.xlsx`, sheets);
  }

  // ------------------------------------------------------------------ guide
  const chapterTitle = (id) => t("ch_" + id);
  // Links to every chapter (grouped by stage) and article: the header menu and the guide's side panel.
  // current: the open chapter or article id, whose headings the side panel lists under it.
  function guideLinks(withCurrent, heads) {
    const cur = S.view === "guide" ? S.chapter : S.view === "articles" ? S.article : S.view === "method" || S.view === "about" ? S.view : "";
    const item = (href, id, label) => `<li${withCurrent && id === cur ? ' class="current"' : ""}><a href="${href}"${id === cur ? ' aria-current="page"' : ""}>${esc(label)}</a>${withCurrent && id === cur && heads ? heads : ""}</li>`;
    const groups = [["before", t("stage_before")], ["after", t("stage_after")], ["ref", t("stage_ref")]];
    let html = "";
    groups.forEach(([stage, label]) => {
      const chs = CHAPTERS.filter((c) => c.stage === stage);
      const items = chs.map((c) => item(`#/guide?c=${c.id}`, c.id, chapterTitle(c.id))).join("")
        + (stage === "ref" ? ARTICLES.map((a) => item(`#/articles?a=${a}`, a, t("art_" + a))).join("") + item("#/method", "method", t("navMethod")) + item("#/about", "about", t("navAbout")) : "");
      html += `${label ? `<p class="menu-group">${esc(label)}</p>` : ""}<ul>${items}</ul>`;
    });
    return html;
  }
  async function renderGuide() {
    const i = CHAPTERS.findIndex((c) => c.id === S.chapter);
    const ch = CHAPTERS[i];
    const el = docLayout(t("navHelp"));
    if (!(await mdInto(el, `guide/${ch.id}`))) return;
    if (ch.stage !== "ref") el.insertAdjacentHTML("afterbegin", `<p class="kicker">${esc(t("stage_" + ch.stage))}</p>`);
    const legend = el.querySelector("#legend");
    if (legend) legend.outerHTML = relLegend();
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
    el.insertAdjacentHTML("beforeend", `<nav class="pager" aria-label="${esc(t("navHelp"))}">
      ${prev ? `<a class="pager-prev" href="#/guide?c=${prev.id}"><span>${esc(t("chPrev"))}</span>${esc(chapterTitle(prev.id))}</a>` : "<span></span>"}
      ${next ? `<a class="pager-next" href="#/guide?c=${next.id}"><span>${esc(t("chNext"))}</span>${esc(chapterTitle(next.id))}</a>` : ""}</nav>`);
    buildToc(document.getElementById("toc"), el, true);
    scrollToAnchor();
  }
  // ------------------------------------------------------------------ the NIST SP 800-53 target profile (craft step 6)
  let sysBaseGuessed = false;
  // The baseline profile that the kind of information in the answers points to
  function guessBaseline() {
    if (sysBaseGuessed) return;
    sysBaseGuessed = true;
    if (S.sectors.includes("nato-info")) S.baseline = "nato";
    else if (S.sectors.includes("public-restricted")) S.baseline = "dsk";
    else if (S.sectors.includes("public-sir")) S.baseline = "open";
  }
  const searchField = () => `<label class="search ctl-search"><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="q" type="search" value="${esc(S.q)}" placeholder="${esc(t("ctlSearchPh"))}" aria-label="${esc(t("search"))}" autocomplete="off"></label>`;
  function bindSearch(body, redraw) {
    const q = body.querySelector("#q");
    let timer;
    q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { S.q = q.value; redraw(); }, 200); });
  }
  // The 20 control families of NIST SP 800-53 Rev. 5: headings in the list, so the reader can find their way
  const FAMILIES_53 = {
    AC: ["Access Control", "Керування доступом"], AT: ["Awareness and Training", "Обізнаність і навчання"], AU: ["Audit and Accountability", "Аудит і підзвітність"],
    CA: ["Assessment, Authorization, and Monitoring", "Оцінювання, авторизація і моніторинг"], CM: ["Configuration Management", "Керування конфігурацією"],
    CP: ["Contingency Planning", "Планування на випадок надзвичайних ситуацій"], IA: ["Identification and Authentication", "Ідентифікація та автентифікація"],
    IR: ["Incident Response", "Реагування на інциденти"], MA: ["Maintenance", "Технічне обслуговування"], MP: ["Media Protection", "Захист носіїв"],
    PE: ["Physical and Environmental Protection", "Фізичний захист і захист середовища"], PL: ["Planning", "Планування"], PM: ["Program Management", "Керування програмою"],
    PS: ["Personnel Security", "Безпека персоналу"], PT: ["PII Processing and Transparency", "Обробка персональних даних і прозорість"], RA: ["Risk Assessment", "Оцінювання ризиків"],
    SA: ["System and Services Acquisition", "Придбання систем і послуг"], SC: ["System and Communications Protection", "Захист систем і комунікацій"],
    SI: ["System and Information Integrity", "Цілісність систем та інформації"], SR: ["Supply Chain Risk Management", "Керування ризиками ланцюга постачання"],
  };
  // NIST SP 800-53 controls for the reader's systems, with where each one comes from
  function drawSideSystem(body) {
    guessBaseline();
    const bases = profilesOf("baseline");
    if (!bases.some((p) => p.id === S.baseline)) S.baseline = "none";
    const s = encodeURIComponent(S.sectors.join(",")).replace(/%2C/g, ",");
    body.innerHTML = `<div class="ctl-tools">
        <label class="ctl-fw"><span class="sr-only">${esc(t("sysBaseline"))}</span><select id="base-select">
          <option value="none"${S.baseline === "none" ? " selected" : ""}>${esc(t("sysBaseline"))}: ${esc(t("sysNone0"))}</option>
          ${bases.map((p) => `<option value="${esc(p.id)}"${S.baseline === p.id ? " selected" : ""}>${esc(L(p, "label"))}</option>`).join("")}</select></label>
        ${searchField()}</div>
      <div id="sys-list"></div>
      <p class="aa-links"><a href="#/controls?fw=${SYSTEM_FW}&b=${esc(S.baseline)}&s=${s}" id="sys-full">${esc(t("sideFull"))}</a></p>`;
    const list = body.querySelector("#sys-list");
    const draw = () => {
      const rows = withS(SYS_STATE, () => systemRows());
      const n = (f) => rows.filter(f).length;
      const tag = (label) => `<span class="badge">${esc(label)}</span>`;
      list.innerHTML = `<p class="ctl-summary">${esc(fmt(t("toolSysSum"), rows.length))}. ${esc(fmt(t("kpiSysSub"), n((c) => c._base || c._sector), n((c) => c._plan.length), n((c) => c._law.length)))}</p>
        <ul class="sys-list">${rows.map((c, i) => `${i === 0 || rows[i - 1].family !== c.family ? `<li class="sys-family"><span class="ctl-id">${esc(c.family)}</span><span>${esc((FAMILIES_53[c.family] || [])[S.lang === "uk" ? 1 : 0] || "")}</span></li>` : ""}<li><span class="ctl-id">${esc(c.id)}</span>
          <span class="sys-name">${esc(S.lang === "uk" && c.name_uk_machine ? c.name_uk_machine : c.name_en)}</span>
          <span class="sys-tags">${c._base || c._sector ? tag(t("sysColBaseline")) : ""}${c._plan.length ? tag(t("sysColPlan")) : ""}${c._law.length ? tag(c._acts.length ? c._acts.map((id) => shortRef(D.sourceById[id])).join(" · ") : t("sysColLaw")) : ""}${c._ai ? ` <span class="badge rv-ai_draft">${esc(t("aiDraft"))}</span>` : ""}</span></li>`).join("")}</ul>`;
    };
    body.querySelector("#base-select").addEventListener("change", (e) => {
      S.baseline = e.target.value;
      body.querySelector("#sys-full").href = `#/controls?fw=${SYSTEM_FW}&b=${encodeURIComponent(S.baseline)}&s=${s}`;
      draw();
    });
    bindSearch(body, draw);
    draw();
  }

  // ------------------------------------------------------------------ craft step 5: the reader's mandatory acts as chains
  // An act has direct requirements when its provisions are mapped to controls or it is a baseline security profile.
  // Chains keep only such acts: each sits under the nearest act above it that has them too, so a law that only
  // empowers a regulator is skipped but the link through it is kept. Acts that only amend another act are shown on
  // it ("amended by"). "Show full chains" puts every applicable act back.
  let actsFull = false;
  const hasReq = (id) => !!(D.mappedProvs[id] && D.mappedProvs[id].size) || D.profileSources.has(id);
  // The register's default view for the reader's profile: in force, with requirements, records hidden
  function listedActs(scope) {
    const keys = ["scope", "repealed", "pending", "context", "records"];
    const saved = Object.fromEntries(keys.map((k) => [k, S[k]]));
    Object.assign(S, { scope, repealed: false, pending: false, context: false, records: false });
    try { const exp = expandedSectors(); return D.sources.filter((s) => sourceVisible(s, exp, true)); } finally { Object.assign(S, saved); }
  }
  function drawApplicable(box) {
    const acts = withS(MANDATORY, () => listedActs("core"));
    const set = new Set(acts.map((x) => x.id));
    const rank = (id) => { const x = D.sourceById[id]; return [D.typeOrder.indexOf(x.type), x.adopted || "9999"]; };
    const byRank = (a, b) => { const ra = rank(a), rb = rank(b); return ra[0] - rb[0] || ra[1].localeCompare(rb[1]); };
    const amender = (id) => !hasReq(id) && (D.relsOut[id] || []).some((r) => r.relation === "amends" && set.has(r.related_id));
    const keep = new Set(acts.map((x) => x.id).filter((id) => !amender(id) && (actsFull || hasReq(id))));
    const ups = (id) => (D.relsOut[id] || []).filter((r) => HIER_REL.has(r.relation)).map((r) => r.related_id);
    const shownParent = (id) => {
      const seen = new Set([id]);
      let level = ups(id);
      while (level.length) {
        const hit = level.filter((p) => keep.has(p) && p !== id).sort(byRank)[0];
        if (hit) return hit;
        const next = [];
        level.forEach((p) => { if (!seen.has(p)) { seen.add(p); next.push(...ups(p)); } });
        level = next;
      }
      return null;
    };
    const kids = {}, parent = {};
    [...keep].forEach((id) => { const p = shownParent(id); if (p) { parent[id] = p; (kids[p] = kids[p] || []).push(id); } });
    const roots = [...keep].filter((id) => !parent[id]).sort(byRank);
    const chained = roots.filter((id) => kids[id]);
    const alone = roots.filter((id) => !kids[id]);
    const others = acts.map((x) => x.id).filter((id) => !keep.has(id) && !amender(id)).sort(byRank);
    const node = (id) => {
      const x = D.sourceById[id];
      const am = amendedBy(id);
      const desc = L(x, "description");
      return `<span class="aa-node${hasReq(id) ? "" : " aa-pale"}"><a href="#/sources?act=${esc(id)}">${esc(sourceRef(x))}</a> ${chainWeight(x)}
        ${desc ? `<span class="aa-desc"${isFallback(x, "description") ? ' lang="uk"' : ""}>${esc(desc)}</span>` : ""}
        ${am.length ? `<span class="act-amended">${esc(t("relIn_amends"))} ${esc(am.map((a) => shortRef(a, true)).join("; "))}</span>` : ""}</span>`;
    };
    let inChains = 0;
    const walk = (id, depth, seen) => {
      inChains++;
      const ch = (kids[id] || []).filter((k) => !seen.has(k)).sort(byRank);
      ch.forEach((k) => seen.add(k));
      return `<li>${node(id)}${ch.length && depth < 8 ? `<ul>${ch.map((k) => walk(k, depth + 1, seen)).join("")}</ul>` : ""}</li>`;
    };
    const chainsHtml = chained.map((id) => `<ul class="tree aa-chain">${walk(id, 0, new Set([id]))}</ul>`).join("");
    box.innerHTML = `<section class="aa" id="aa">
      <div class="aa-head"><p class="aa-summary">${esc(fmt(t("aaSummary"), acts.length, inChains, alone.length))}</p>
        <button type="button" class="btn btn-line" id="aa-full" aria-pressed="${String(actsFull)}">${esc(t(actsFull ? "chainsHide" : "chainsShow"))}</button></div>
      ${chained.length ? `<h4>${esc(t("aaChains"))}</h4><p class="hint">${esc(t(actsFull ? "aaChainsHintFull" : "aaChainsHint"))}</p><div class="chains aa-chains">${chainsHtml}</div>` : ""}
      ${alone.length ? `<h4>${esc(t("aaAlone"))}</h4><ul class="aa-list">${alone.map((id) => `<li>${node(id)}</li>`).join("")}</ul>` : ""}
      ${others.length ? `<details class="aa-more"><summary>${esc(fmt(t("aaOther"), others.length))}</summary><p class="hint">${esc(t("aaOtherHint"))}</p><ul class="aa-list">${others.map((id) => `<li>${node(id)}</li>`).join("")}</ul></details>` : ""}
      <p class="aa-links"><a href="#/sources?scope=core&s=${sParam()}&rec=0">${esc(t("aaOpenActs"))}</a></p>
    </section>`;
    const btn = document.getElementById("aa-full");
    if (btn) btn.onclick = () => {
      actsFull = !actsFull;
      drawApplicable(box);
      const again = document.getElementById("aa-full");
      if (again) again.focus();
    };
  }

  async function renderMethod() {
    const el = docLayout(t("tocTitle"));
    if (!(await mdInto(el, "method"))) return;
    fillMethod(el);
    const ex = el.querySelector("#mapping-example");
    if (ex) ex.outerHTML = heroExample();
    buildToc(document.getElementById("toc"), el, false);
    scrollToAnchor();
  }
  // ids of Methodology headings that other views link to
  const METHOD_ANCHORS = {
    uk: { chains: "ланцюги-актів-і-дедублікація", mapping: "як-зіставляються-вимоги-із-заходами", grc: "імпорт-у-grc-системи" },
    en: { chains: "chains-of-acts-and-deduplication", mapping: "how-requirements-are-mapped-to-controls", grc: "import-into-grc-systems" },
  };
  const methodAnchor = (k) => (METHOD_ANCHORS[S.lang] || METHOD_ANCHORS.uk)[k];
  function relLegend() {
    return `<dl class="legend" aria-label="${esc(t("dataLegend"))}">${Object.keys(GLYPH).map((r) => `<div>${glyph(r)}<dt>${esc(r)}</dt><dd>${esc(relWords(r))}</dd></div>`).join("")}</dl>`;
  }

  // ------------------------------------------------------------------ controls
  // One view for both levels: the ISMS frameworks (organisation) and SP 800-53 (information system).
  function fwPicker() {
    const radio = (f) => `<label class="radio"><input type="radio" name="fw" value="${esc(f.id)}" ${S.fw === f.id ? "checked" : ""}><span>${esc(fwLabel(f))}</span></label>`;
    const group = (tier, label) => `<p class="fw-group">${esc(label)}</p>${D.frameworks.filter((f) => f.tier === tier).map(radio).join("")}`;
    return `<fieldset><legend>${esc(t("framework"))}</legend>${group("organisation", t("fwGroupIsms"))}${group("system", t("fwGroupSystem"))}</fieldset>`;
  }
  // The controls page: the reader's profile on top, then the toolbar, then one row per control that opens in place.
  const OPEN = new Set(); // rows the reader has opened: "c:<control id>" or "a:<act id>"; kept while the page is used
  let drawerOpen = false; // the profile's filters, shown under the profile bar
  const ctlExp = () => (S.all ? null : expandedSectors());
  const uniq = (xs) => [...new Set(xs)];
  const shortRef = (src) => sourceRef(src); // one name for an act everywhere

  function renderControls() {
    if (S.fw === SYSTEM_FW) return renderSystem();
    if (!D.controls[S.fw]) S.fw = "iso27001-2022";
    app.innerHTML = `<div class="ctl-page">${profileBar(true)}
      <div id="ctl-head"></div>${ctlToolbar()}
      <section class="ctl-results" id="ctl-list" aria-live="polite"></section></div>`;
    bindProfile(app);
    const fwSel = app.querySelector("#fw-select");
    fwSel.addEventListener("change", () => { S.fw = fwSel.value; render(); });
    app.querySelectorAll("[data-scope-set]").forEach((b) => b.addEventListener("click", () => { S.all = b.dataset.scopeSet === "all"; render(); }));
    app.querySelectorAll("[data-by]").forEach((b) => b.addEventListener("click", () => { S.by = b.dataset.by; render(); }));
    drawControls();
  }

  // The reader's profile: the chosen organisation types as chips, with every filter behind "Edit"
  function profileBar(withOptions) {
    const chips = S.sectors.filter((id) => D.sectorById[id]).map((id) => {
      const label = L(D.sectorById[id], "label");
      return `<span class="pchip">${esc(label)}<button type="button" class="pchip-x" data-drop="${esc(id)}" aria-label="${esc(fmt(t("profileRemove"), label))}" title="${esc(fmt(t("profileRemove"), label))}">×</button></span>`;
    }).join("");
    const opts = withOptions ? `<fieldset><legend>${esc(t("options"))}</legend>${toggle("only", t("optOnlyMapped"))}${toggle("rec", t("optRecommended"))}${toggle("drafts", t("optDrafts"))}</fieldset>` : "";
    return `<div class="profile-bar"><div class="profile-row">
        ${chips || `<span class="muted">${esc(t("profileNone"))}</span>`}
        <button type="button" class="link-btn" id="p-edit" aria-expanded="false" aria-controls="p-drawer">${esc(t("profileEdit"))}</button>
        <span class="profile-gap"></span>
        <button type="button" class="btn btn-line" id="p-copy">${esc(t("copyLink"))}</button></div>
      <div class="profile-drawer" id="p-drawer" hidden>${sectorChips(false)}${opts}</div></div>`;
  }
  function bindProfile(root) {
    const edit = root.querySelector("#p-edit"), drawer = root.querySelector("#p-drawer");
    const show = (on) => { drawerOpen = on; drawer.hidden = !on; edit.setAttribute("aria-expanded", String(on)); };
    show(drawerOpen);
    edit.addEventListener("click", () => show(!drawerOpen));
    root.querySelectorAll("[data-drop]").forEach((b) => b.addEventListener("click", () => { S.sectors = S.sectors.filter((x) => x !== b.dataset.drop); render(); }));
    const copy = root.querySelector("#p-copy");
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(location.href); copy.textContent = t("copied"); } catch (e) { window.prompt(t("copyLink"), location.href); }
      setTimeout(() => { copy.textContent = t("copyLink"); }, 1800);
    });
    bindPanel(root, (soft) => (soft ? (writeHash(), drawControls()) : render()));
  }

  function ctlToolbar() {
    const opt = (f) => `<option value="${esc(f.id)}"${S.fw === f.id ? " selected" : ""}>${esc(fwLabel(f))}</option>`;
    const seg = (attr, label, items, cur) => `<div class="seg" role="group" aria-label="${esc(label)}">${items.map(([v, l]) => `<button type="button" data-${attr}="${esc(v)}" aria-pressed="${String(cur === v)}">${esc(l)}</button>`).join("")}</div>`;
    return `<div class="ctl-tools">
      <label class="ctl-fw"><span class="sr-only">${esc(t("framework"))}</span><select id="fw-select">${D.frameworks.map(opt).join("")}</select></label>
      ${S.sectors.length ? seg("scope-set", t("scopeLabel"), [["mine", t("scopeMine")], ["all", t("scopeAll")]], S.all ? "all" : "mine") : ""}
      ${seg("by", t("modeLabel"), [["control", t("byControl")], ["act", t("byAct")]], S.by)}
      <label class="search ctl-search"><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="q" type="search" value="${esc(S.q)}" placeholder="${esc(t("ctlSearchPh"))}" aria-label="${esc(t("search"))}" autocomplete="off"></label>
    </div>`;
  }

  function controlRows() {
    const exp = ctlExp();
    const drivers = driversFor(S.fw, exp, S.drafts);
    const all = D.controls[S.fw];
    const leaf = all.filter((c) => ["subcategory", "requirement", "control"].includes(c.level));
    const q = S.q.trim().toLowerCase();
    const rows = [];
    leaf.forEach((c) => {
      const ds = (drivers[c.id] || []).slice().sort((a, b) => a.provision_id.localeCompare(b.provision_id));
      if (S.only && !ds.length) return;
      if (q) {
        const hay = [c.id, controlName(S.fw, c), L(c, "name"), ...ds.map((m) => { const p = D.provById[m.provision_id]; const s = D.sourceById[p.source_id]; return `${sourceRef(s)} ${rawRef(s)} ${L(p, "ref")} ${L(p, "summary")} ${sourceTitle(s)}`; })].join(" ").toLowerCase();
        if (!hay.includes(q)) return;
      }
      rows.push({ c, ds });
    });
    return { rows, leafCount: leaf.length, drivers, exp };
  }

  // Key figures above a table: a label, one big number, one line under it (the system view)
  function kpi(label, value, sub, cls) {
    return `<div class="kpi${cls ? " " + cls : ""}"><p class="kpi-label">${esc(label)}</p><p class="kpi-value">${esc(value)}</p>${sub ? `<p class="kpi-sub">${esc(sub)}</p>` : ""}</div>`;
  }
  function kpiUpdated() {
    if (!D.meta) return "";
    const d = new Date(D.meta.date + "T00:00:00");
    const date = isNaN(d) ? D.meta.date : (S.lang === "uk" ? d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }) : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
    return kpi(t("kpiUpdated"), date, fmt(t("kpiVersion"), D.meta.version));
  }
  function kpiAi(ai, total) {
    return ai
      ? kpi(t("kpiAi"), fmt(t("kpiOf"), ai, total), t("kpiAiSub"), "kpi-warn")
      : kpi(t("kpiAi"), "0", t("kpiAiNone"));
  }

  const rowRender = {}; // row key -> function that draws the row again (after it is opened or closed)
  function drawControls() {
    const head = document.getElementById("ctl-head"), list = document.getElementById("ctl-list");
    if (!head || !list) return;
    const { rows, leafCount, drivers } = controlRows();
    const fw = fwRow(S.fw);
    const withDrivers = Object.keys(drivers).length;
    const provSet = new Set(), srcSet = new Set();
    Object.values(drivers).flat().forEach((m) => { provSet.add(m.provision_id); srcSet.add(D.provById[m.provision_id].source_id); });
    const gaps = gapRows();
    const shown = rows.flatMap((r) => r.ds).concat(gaps);
    const unreviewed = shown.filter((m) => m.review_status !== "reviewed").length;

    head.innerHTML = `<div class="ctl-title"><div>
        ${S.view === "guide" ? "" : `<h1>${esc(t("navControls"))}</h1>`}
        <p class="ctl-summary">${esc(fmt(t("ctlSummary"), withDrivers, leafCount, provSet.size, srcSet.size))}${unreviewed ? ` <span class="warn-text">${esc(fmt(t("ctlUnreviewed"), unreviewed, shown.length))}</span>` : ""}</p></div>
      <details class="dl-menu"><summary class="btn btn-primary">${esc(t("exportsTitle"))}</summary>
        <div class="dl-list"><p class="dl-file">${esc(L(fw, "output"))}</p>
          <button type="button" class="btn" id="x-xlsx">Excel</button><button type="button" class="btn" id="x-csv">CSV</button></div></details></div>`;
    head.querySelector("#x-csv").onclick = () => exportSoa(rows, "csv");
    head.querySelector("#x-xlsx").onclick = () => exportSoa(rows, "xlsx");

    Object.keys(rowRender).forEach((k) => delete rowRender[k]);
    let body = "", jump = [];
    if (S.by === "act") body = actRowsHtml(rows);
    else {
      let lastGroup = null;
      rows.forEach(({ c, ds }) => {
        const g = topGroup(c);
        if (g && g !== lastGroup) {
          lastGroup = g;
          const id = "grp-" + g.id.replace(/[^A-Za-z0-9]/g, "_");
          jump.push([id, g.id]);
          const hTag = S.view === "guide" ? "h3" : "h2"; // inside a guide chapter the chapter's own h2s stay the contents
          body += `<${hTag} class="ctl-group" id="${esc(id)}">${esc(g.id)} ${esc(L(g, "name"))}</${hTag}>`;
        }
        const key = "c:" + c.id;
        rowRender[key] = () => controlRow(c, ds);
        body += controlRow(c, ds);
      });
    }
    if (gaps.length) jump.push(["gaps", t("gapsJump")]);
    const keys = Object.keys(rowRender);
    const anyOpen = keys.some((k) => OPEN.has(k));
    const rels = uniq(shown.map((m) => m.relationship)).filter((r) => GLYPH[r]);
    list.innerHTML = `
      <div class="ctl-bar">
        ${S.by === "control" && jump.length > 1 ? `<nav class="jump" aria-label="${esc(t("jumpTo"))}">${jump.map(([id, label]) => `<a href="#${esc(id)}" data-jump-to="${esc(id)}">${esc(label)}</a>`).join("")}</nav>` : "<span></span>"}
        <div class="ctl-bar-btns">
          ${S.by === "control" && rows.length ? `<button type="button" class="btn btn-line" id="t-chains" aria-pressed="${String(S.chains)}">${esc(t(S.chains ? "chainsHide" : "chainsShow"))}</button>` : ""}
          ${keys.length ? `<button type="button" class="btn btn-line" id="t-all">${esc(t(anyOpen ? "collapseAll" : "expandAll"))}</button>` : ""}
        </div></div>
      ${rows.length ? `<div class="ctl-list">${body}</div>` : `<p class="empty">${esc(t("noControls"))}</p>${otherFwHint()}`}
      ${gapsHtml(gaps, fw)}
      <p class="ctl-legend">${rels.map((r) => `${glyph(r)} ${esc(relWords(r))}`).join(" · ")}${S.chains && S.by === "control" ? ` · <span class="chain-arrow">↳</span> ${esc(t("rel_based_on"))}` : ""} · <a href="#/method#${methodAnchor("mapping")}">${esc(t("legendMore"))}</a><br>${esc(L(fw, "text_note"))}</p>`;

    const sw = list.querySelector("#switch-fw");
    if (sw) sw.onclick = () => { S.fw = sw.dataset.fw; render(); };
    const ch = list.querySelector("#t-chains");
    if (ch) ch.onclick = () => { S.chains = !S.chains; writeHash(); drawControls(); };
    const tall = list.querySelector("#t-all");
    if (tall) tall.onclick = () => {
      if (keys.some((k) => OPEN.has(k))) keys.forEach((k) => OPEN.delete(k)); else keys.forEach((k) => OPEN.add(k));
      drawControls();
    };
    list.onclick = (e) => {
      const rowHead = e.target.closest("[data-row]");
      if (rowHead) {
        const k = rowHead.dataset.row;
        if (OPEN.has(k)) OPEN.delete(k); else OPEN.add(k);
        const el = rowHead.closest(".ctl-row");
        if (el && rowRender[k]) {
          el.outerHTML = rowRender[k]();
          const again = list.querySelector(`[data-row="${CSS.escape(k)}"]`);
          if (again) again.focus();
        }
        const btn = list.querySelector("#t-all");
        if (btn) btn.textContent = t(keys.some((x) => OPEN.has(x)) ? "collapseAll" : "expandAll");
        return;
      }
      const go = e.target.closest("[data-goto]");
      if (go) {
        e.preventDefault();
        S.by = "control"; OPEN.add("c:" + go.dataset.goto); S.anchor = "ctl-" + go.dataset.goto;
        render();
        return;
      }
      const j = e.target.closest("[data-jump-to]");
      if (j) {
        e.preventDefault();
        const target = document.getElementById(j.dataset.jumpTo);
        if (target) { if (target.tagName === "DETAILS") target.open = true; target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    };
    if (S.anchor) {
      const id = S.anchor; S.anchor = "";
      setTimeout(() => { const x = document.getElementById(id); if (x) { if (x.tagName === "DETAILS") x.open = true; x.scrollIntoView({ block: "start" }); } }, 0);
    }
  }

  // provisions checked against the whole framework with no counterpart (empty control_id)
  function gapRows() {
    const exp = ctlExp();
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
      const badge = m.review_status === "reviewed" ? `<span class="badge cov-full">${esc(t("reviewed"))}</span>` : "";
      return `<li><span class="driver-ref">${esc(sourceRef(src))}, ${esc(L(p, "ref"))}</span> ${badge}
        <p${isFallback(p, "summary") ? ' lang="uk"' : ""}>${esc(L(p, "summary"))}</p>${L(m, "policy") ? `<p class="muted"><b>${esc(t("driverPolicy"))}:</b> ${esc(L(m, "policy"))}</p>` : ""}
        <p class="prov-links">${src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(t("openText"))} ↗</a>` : ""}${reportLink(m, "")}</p></li>`;
    }).join("");
    return `<details class="gaps" id="gaps"><summary><h2>${esc(fmt(t("gapsTitle"), fwLabel(fw), gaps.length))}</h2></summary>
      <p class="hint">${esc(t("gapsIntro"))}</p><ul class="gap-list">${items}</ul></details>`;
  }

  function otherFwHint() {
    const other = D.orgFrameworks.find((f) => f.id !== S.fw);
    if (!other) return "";
    const n = Object.keys(driversFor(other.id, ctlExp(), S.drafts)).length;
    return n ? `<p><button type="button" class="btn" id="switch-fw" data-fw="${esc(other.id)}">${esc(fmt(t("switchFw"), fwLabel(other), n))}</button></p>` : "";
  }

  function topGroup(c) {
    const ctrls = D.controlById[S.fw];
    let cur = ctrls[c.parent];
    while (cur && cur.parent && ctrls[cur.parent] && S.fw === "iso27001-2022") cur = ctrls[cur.parent];
    return cur || null;
  }

  // One control: id, name, the acts behind it and their fit. Opening it shows the provisions, grouped by act.
  function controlRow(c, ds) {
    const key = "c:" + c.id;
    const open = ds.length && OPEN.has(key);
    const acts = uniq(ds.map((m) => D.provById[m.provision_id].source_id));
    const fits = uniq(ds.map((m) => m.relationship)).filter((r) => GLYPH[r]);
    return `<div class="ctl-row${open ? " open" : ""}" id="ctl-${esc(c.id)}">
      <button type="button" class="ctl-head" data-row="${esc(key)}" aria-expanded="${String(!!open)}"${ds.length ? "" : " disabled"}>
        <span class="ctl-id">${esc(c.id)}</span>
        <span class="ctl-name">${esc(controlName(S.fw, c))}</span>
        <span class="ctl-acts">${ds.length ? esc(acts.map((id) => shortRef(D.sourceById[id])).join(" · ")) : esc(t("noDrivers"))}</span>
        <span class="ctl-fit">${fits.map((r) => glyph(r)).join("")}</span>
        <span class="chev" aria-hidden="true"></span></button>
      ${open ? `<div class="ctl-body">${driversBody(c.id, ds)}</div>` : ""}</div>`;
  }

  // Later acts in force that amend this one: they change the requirement itself, so they always show
  function amendedBy(id) {
    return (D.relsIn[id] || []).filter((r) => r.relation === "amends" && D.sourceById[r.source_id] && IN_EFFECT(D.sourceById[r.source_id].status)).map((r) => D.sourceById[r.source_id]);
  }
  function actHead(src, extra) {
    const am = amendedBy(src.id);
    return `<p class="act-head"><span class="act-name">${esc(sourceRef(src))}</span>${extra || ""}${am.length ? ` <span class="act-amended">${esc(t("relIn_amends"))} ${esc(am.map((x) => shortRef(x, true)).join("; "))}</span>` : ""}</p>`;
  }
  // The legal-basis hierarchy of the register (the same relations the chains view draws)
  const HIER_REL = new Set(["based_on", "transposes", "applies", "ensures_implementation_of"]);
  const basisOf = (id) => uniq((D.relsOut[id] || []).filter((r) => HIER_REL.has(r.relation) && D.sourceById[r.related_id]).map((r) => r.related_id));
  function driversBody(ctlId, ds) {
    const bySrc = new Map();
    ds.forEach((m) => { const sid = D.provById[m.provision_id].source_id; if (!bySrc.has(sid)) bySrc.set(sid, []); bySrc.get(sid).push(m); });
    const block = (sid, ms, extra) => `<div class="act-block">${actHead(D.sourceById[sid], extra)}${ms.map((m) => provLine(m, ctlId)).join("")}</div>`;
    if (!S.chains) return [...bySrc].map(([sid, ms]) => block(sid, ms)).join("");
    // Full chains: each act goes under the law it shares with most other acts of this control (ties: a law in the
    // reader's profile); its other bases are named beside it. Laws outside the profile are marked.
    const exp = ctlExp();
    const inProfile = (id) => !exp || sourceApplies(D.sourceById[id], exp);
    const freq = {};
    bySrc.forEach((_, sid) => basisOf(sid).forEach((pid) => { freq[pid] = (freq[pid] || 0) + 1; }));
    const score = (pid) => freq[pid] * 10 + (inProfile(pid) ? 1 : 0);
    const groups = new Map();
    bySrc.forEach((ms, sid) => {
      const ps = basisOf(sid);
      const home = ps.slice().sort((a, b) => score(b) - score(a))[0] || "";
      if (!groups.has(home)) groups.set(home, []);
      groups.get(home).push([sid, ms, ps.filter((x) => x !== home)]);
    });
    const order = [...groups.keys()].sort((a, b) => (a === "" ? 1 : 0) - (b === "" ? 1 : 0) || (inProfile(b) ? 1 : 0) - (inProfile(a) ? 1 : 0));
    return order.map((pid) => {
      const kids = groups.get(pid).map(([sid, ms, also]) => block(sid, ms, also.length ? ` <span class="act-also">${esc(t("alsoUnder"))} ${esc(also.map((x) => shortRef(D.sourceById[x])).join(", "))}</span>` : "")).join("");
      if (!pid) return `<div class="law-group"><p class="law-head muted">${esc(t("noBasis"))}</p><div class="law-kids">${kids}</div></div>`;
      const law = D.sourceById[pid];
      const own = inProfile(pid);
      return `<div class="law-group${own ? "" : " law-pale"}"><p class="law-head"><b>${esc(sourceRef(law))}</b> <span class="muted">· ${esc(sourceTitle(law))}</span>${own ? "" : ` <span class="badge">${esc(t("notOnList"))}</span>`}</p><div class="law-kids">${kids}</div></div>`;
    }).join("");
  }

  // A link that opens the "mapping error" issue form with the provision, framework and control filled in
  function reportLink(m, ctlId) {
    const repo = (CFG.repoUrl || "").replace(/\/$/, "");
    if (!repo) return "";
    const ctl = ctlId || m.control_id || "";
    const q = new URLSearchParams({ template: "mapping-error.yml", provision: m.provision_id, framework: m.framework_id === "csf-2.0" ? "NIST CSF 2.0" : "ISO/IEC 27001:2022" });
    if (ctl) q.set("control", ctl);
    q.set("title", `${m.provision_id}${ctl ? " → " + ctl : ""}`);
    return `<a href="${esc(repo)}/issues/new?${esc(q.toString())}" target="_blank" rel="noopener">${esc(t("reportMapping"))}</a>`;
  }

  // One provision: fit, reference and links on a line; its text (marked when it is the Ukrainian original), the
  // author's note, and the rest of the mapping's details behind "More"
  function provLine(m, ctlId) {
    const p = D.provById[m.provision_id];
    const src = D.sourceById[p.source_id];
    const orig = isFallback(p, "summary");
    const more = [
      L(m, "parameter") ? `<p><b>${esc(t("colParam"))}:</b> ${esc(L(m, "parameter"))}</p>` : "",
      p.applies_to ? `<p><b>${esc(t("appliesOnly"))}:</b> ${p.applies_to.split(";").map((s) => esc(L(D.sectorById[s], "label") || s)).join("; ")}</p>` : "",
      L(m, "policy") ? `<p><b>${esc(t("driverPolicy"))}:</b> ${esc(L(m, "policy"))}</p>` : "",
      p.notes ? `<p><b>${esc(t("driverCaveat"))}:</b> <span${S.lang === "en" ? ' lang="uk"' : ""}>${esc(p.notes)}</span></p>` : "",
      `<p class="muted">${esc(t("driverMeta"))}: ${esc(relWords(m.relationship))}, ${esc(m.rationale)}${m.strength ? `, ${esc(m.strength)}/10` : ""}; ${esc(reviewLabel(m.review_status))}; ${esc(m.mapped_by)}${m.reviewed_by ? `, ${esc(m.reviewed_by)}` : ""}; ${esc(m.date)}</p>`,
    ].join("");
    return `<div class="prov">
      <div class="prov-line"><span class="prov-fit">${glyph(m.relationship)} ${esc(covLabel(m.coverage))}</span>
        <span class="prov-ref">${esc(L(p, "ref"))}${m.review_status === "reviewed" ? ` <span class="badge cov-full">${esc(t("reviewed"))}</span>` : ""}</span>
        <span class="prov-links">${src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(t("openText"))} ↗</a>` : ""}${reportLink(m, ctlId)}</span></div>
      ${L(p, "summary") ? `<p class="prov-text"${orig ? ' lang="uk"' : ""}>${esc(L(p, "summary"))}${orig ? ` <span class="prov-orig" lang="${esc(S.lang)}">${esc(t("originalUk"))}</span>` : ""}</p>` : ""}
      ${L(m, "notes") ? `<p class="prov-note"><b>${esc(t("driverNote"))}:</b> <span${isFallback(m, "notes") ? ' lang="uk"' : ""}>${esc(L(m, "notes"))}</span></p>` : ""}
      <details class="prov-more"><summary>${esc(t("provMore"))}</summary>${more}</details></div>`;
  }

  // "By act": each act with its provisions and the controls they map to
  function actRowsHtml(rows) {
    const bySrc = new Map();
    rows.forEach(({ c, ds }) => ds.forEach((m) => {
      const p = D.provById[m.provision_id];
      if (!bySrc.has(p.source_id)) bySrc.set(p.source_id, new Map());
      const pm = bySrc.get(p.source_id);
      if (!pm.has(p.id)) pm.set(p.id, []);
      pm.get(p.id).push([c, m]);
    }));
    const rank = (id) => D.typeOrder.indexOf(D.sourceById[id].type);
    return [...bySrc.keys()]
      .sort((a, b) => rank(a) - rank(b) || (D.sourceById[b].adopted || "").localeCompare(D.sourceById[a].adopted || ""))
      .map((sid) => { const key = "a:" + sid; rowRender[key] = () => actRow(sid, bySrc.get(sid)); return actRow(sid, bySrc.get(sid)); })
      .join("");
  }
  function actRow(sid, provMap) {
    const key = "a:" + sid;
    const open = OPEN.has(key);
    const src = D.sourceById[sid];
    const nCtl = new Set([...provMap.values()].flat().map(([c]) => c.id)).size;
    const am = amendedBy(sid);
    const body = open ? `<div class="ctl-body act-body">${am.length ? `<p class="act-head"><span class="act-amended">${esc(t("relIn_amends"))} ${esc(am.map((x) => shortRef(x, true)).join("; "))}</span></p>` : ""}${[...provMap].map(([pid, list]) => {
      const p = D.provById[pid];
      const orig = isFallback(p, "summary");
      return `<div class="prov">
        <div class="prov-line prov-line-act"><span class="prov-ref">${esc(L(p, "ref"))}</span>
          <span class="prov-links">${src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(t("openText"))} ↗</a>` : ""}${reportLink(list[0][1], "")}</span></div>
        ${L(p, "summary") ? `<p class="prov-text"${orig ? ' lang="uk"' : ""}>${esc(L(p, "summary"))}${orig ? ` <span class="prov-orig" lang="${esc(S.lang)}">${esc(t("originalUk"))}</span>` : ""}</p>` : ""}
        <ul class="prov-ctls">${list.map(([c, m]) => `<li>${glyph(m.relationship)} <a href="#ctl-${esc(c.id)}" data-goto="${esc(c.id)}"><b>${esc(c.id)}</b> ${esc(controlName(S.fw, c))}</a></li>`).join("")}</ul></div>`;
    }).join("")}</div>` : "";
    return `<div class="ctl-row act-row${open ? " open" : ""}" id="act-${esc(sid)}">
      <button type="button" class="ctl-head" data-row="${esc(key)}" aria-expanded="${String(open)}">
        <span class="ctl-name act-title">${esc(sourceRef(src))}<span class="muted act-sub">${esc(sourceTitle(src))}</span></span>
        <span class="ctl-acts">${esc(fmt(t("actCounts"), provMap.size, nCtl))}</span>
        <span class="chev" aria-hidden="true"></span></button>
      ${body}</div>`;
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
  function downloadXlsx(name, sheet, header, rows, widths) {
    return downloadWorkbook(name, [{ name: sheet, header, rows, widths }]);
  }
  // Several sheets, each with filters on and its header frozen, and an "about" sheet with the version and the link
  async function downloadWorkbook(name, sheets) {
    const fw = S.fw, sectors = S.sectors.join(", ") || "all"; // read before the await
    await loadXlsx();
    const wb = XLSX.utils.book_new();
    sheets.forEach(({ name: sheet, header, rows, widths }) => {
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      ws["!cols"] = (widths || header.map(() => 24)).map((w) => ({ wch: w }));
      ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }) };
      ws["!freeze"] = { xSplit: 1, ySplit: 1 };
      XLSX.utils.book_append_sheet(wb, ws, sheet.slice(0, 31));
    });
    const ai = D.mappings.filter((m) => m.framework_id === fw && m.review_status === "ai_draft").length;
    const meta = [["note", ai ? t("aiFileNote") : ""], ["version", D.meta ? D.meta.version : ""], ["date", new Date().toISOString().slice(0, 10)], ["framework", fw], ["sectors", sectors], ["url", location.href]];
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
`;
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
        ${D.unverifiedAppl && S.mode === "list" ? `<p class="hint">${esc(t("srcUnverified"))}</p>` : ""}
        ${S.mode === "list" ? `<div class="exports"><button type="button" class="btn btn-primary" id="s-csv">${esc(t("srcDownload"))}</button><button type="button" class="btn" id="s-xlsx">${esc(t("srcDownloadX"))}</button></div>` : `<p class="lead-sm">${esc(t("chainsIntro"))} <a href="#/method#${methodAnchor("chains")}">${esc(t("navMethod"))} →</a></p>`}
      </div>`;
    main.innerHTML = head + (S.mode === "chains" && S.scope === "core" ? keyChainsHtml() + `<h2 class="chains-all">${esc(t("chainsAll"))}</h2>` : "")
      + (S.mode === "chains" ? chainsHtml(rows) : sourcesTable(rows));
    main.querySelectorAll("a[data-scope]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); S.scope = a.dataset.scope; S.type = ""; render(); }));
    main.querySelectorAll("a[data-mode]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); S.mode = a.dataset.mode; writeHash(); drawSources(main); }));
    const csvBtn = main.querySelector("#s-csv");
    if (csvBtn) {
      csvBtn.onclick = () => exportSources(rows, "csv");
      main.querySelector("#s-xlsx").onclick = () => exportSources(rows, "xlsx");
    }
    // after the hashchange handler has scrolled to the top
    if (S.anchor) { const id = S.anchor; S.anchor = ""; setTimeout(() => { const target = document.getElementById(id); if (target) target.scrollIntoView({ block: "start" }); }, 0); }
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
  // Where the requirements of an act live: mapped provisions, a baseline profile, or a framework act
  function chainWeight(x) {
    const n = D.mappedProvs[x.id] ? D.mappedProvs[x.id].size : 0;
    if (n) return `<span class="badge weight-req" title="${esc(t("weightReqHint"))}">${esc(fmt(t("weightReq"), n))}</span>`;
    if (D.profileSources.has(x.id)) return `<span class="badge weight-req">${esc(t("weightProfile"))}</span>`;
    if (x.role === "context") return `<span class="badge">${esc(t("weightFrame"))}</span>`;
    return "";
  }
  // Key chains: a narrated path through the register, step by step (chains.csv + chain_steps.csv)
  function keyChainsHtml() {
    if (!D.chains.length) return "";
    const exp = expandedSectors();
    const items = D.chains.map((c) => {
      const steps = (D.chainSteps[c.id] || []).map((st) => {
        const x = D.sourceById[st.source_id];
        if (!x) return "";
        const yours = exp && sourceApplies(x, exp) ? ` <span class="badge cov-full">${esc(t("chainYours"))}</span>` : "";
        return `<li><span class="kc-act"><a href="#src-${esc(x.id)}" data-jump="${esc(x.id)}">${esc(sourceRef(x))}</a>${L(st, "ref") ? `, ${esc(L(st, "ref"))}` : ""}</span>
          <span class="kc-title">${esc(sourceTitle(x))}</span>
          <span class="kc-role">${esc(L(st, "role"))}</span>
          <span class="kc-badges">${chainWeight(x)}${!IN_EFFECT(x.status) ? ` <span class="badge st-${esc(x.status)}">${esc(statusLabel(x.status))}</span>` : ""}${yours}</span></li>`;
      }).join("");
      return `<section class="key-chain" id="chain-${esc(c.id)}"><h2>${esc(L(c, "title"))}</h2><p>${esc(L(c, "summary"))}</p><ol class="kc-steps">${steps}</ol></section>`;
    }).join("");
    return `<div class="key-chains"><p class="kicker">${esc(t("chainsKey"))}</p>${items}</div>`;
  }
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
    const direct = new Set(rows.map((x) => x.id));
    const label = (id, rel, link) => {
      const x = D.sourceById[id];
      const side = (D.relsIn[id] || []).filter((r) => !HIER.has(r.relation))
        .map((r) => `${esc(relIn(r))} <a href="#src-${esc(r.source_id)}" data-jump="${esc(r.source_id)}">${esc(sourceRef(D.sourceById[r.source_id]))}</a>${esc(pendingMark(r.source_id))}`);
      const cls = (x.status === "repealed" ? " repealed" : "") + (S.sectors.length && !direct.has(id) ? " chain-ctx" : "");
      return `${rel && rel !== "based_on" ? `<span class="badge" title="eli:${esc(rel)}">${esc(t("rel_" + rel))}</span> ` : ""}<a class="chain-node${cls}" href="#src-${esc(id)}" data-jump="${esc(id)}">${esc(sourceRef(x))}</a>`
        + `${!IN_EFFECT(x.status) ? ` <span class="badge st-${esc(x.status)}">${esc(statusLabel(x.status))}</span>` : ""}${x.scope === "reference" ? ` <span class="badge">${esc(t("badgeEu"))}</span>` : ""}`
        + ` <span class="muted small">${esc(sourceTitle(x).slice(0, 110))}</span>`
        + ` ${chainWeight(x)}`
        + (side.length ? ` <span class="chain-side">(${side.join("; ")})</span>` : "")
        + (link && link.basis_uk ? `<span class="chain-basis">${esc(link.basis_uk)}${link.confidence === "medium" ? ` <span class="badge" title="${esc(t("confMedium"))}">${esc(t("confMediumShort"))}</span>` : ""}</span>` : "");
    };
    const walk = (id, link, depth) => {
      const rel = link ? link.relation : null;
      const ch = (kids[id] || []).filter((r) => show.has(r.source_id)).sort((a, b) => cmp(a.source_id, b.source_id));
      if (seen.has(id) && ch.length) return `<li>${label(id, rel, link)} <span class="muted small">${esc(t("seeAbove"))}</span></li>`;
      seen.add(id);
      if (!ch.length || depth > 8) return `<li>${label(id, rel, link)}</li>`;
      return `<li>${label(id, rel, link)}<ul>${ch.map((r) => walk(r.source_id, r, depth + 1)).join("")}</ul></li>`;
    };
    const ctxNote = S.sectors.length ? `<p class="hint">${esc(t("chainsCtx"))}</p>` : "";
    return `${ctxNote}<div class="chains">${roots.map((id) => `<ul class="tree">${walk(id, null, 0)}</ul>`).join("")}</div>`;
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

  // ------------------------------------------------------------------ articles (part of the guide's menu)
  async function renderArticles() {
    if (!S.article) {
      app.innerHTML = `<article class="page"><h1>${esc(t("navArticles"))}</h1><p class="lead-sm">${esc(t("articlesIntro"))}</p>
        <ul class="files">${ARTICLES.map((a) => `<li class="file"><a class="file-name" href="#/articles?a=${a}">${esc(t("art_" + a))}</a><p>${esc(t("artd_" + a))}</p></li>`).join("")}</ul></article>`;
      return;
    }
    const el = docLayout(t("navHelp"));
    if (!(await mdInto(el, `articles/${S.article}`))) return;
    buildToc(document.getElementById("toc"), el, true);
    scrollToAnchor();
  }

  // Side panel. Guide pages (inGuide): all chapters and articles, with the open one's h2 headings under it.
  // Other pages: their own h2/h3 headings. The heading in view is highlighted while scrolling.
  let tocObserver = null;
  function buildToc(box, el, inGuide) {
    if (!box) return;
    const heads = [...el.querySelectorAll(inGuide ? "h2" : "h2, h3")];
    heads.forEach((h) => { if (!h.id) h.id = slugify(h.textContent); });
    const headList = heads.length ? `<ul class="toc-heads">${heads.map((h) => `<li class="l${h.tagName[1]}"><a href="#${esc(h.id)}">${esc(h.textContent)}</a></li>`).join("")}</ul>` : "";
    box.querySelector("nav").innerHTML = inGuide ? guideLinks(true, headList) : headList;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    box.open = !narrow;
    const inPage = [...box.querySelectorAll('a[href^="#"]:not([href^="#/"])')];
    inPage.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (target) {
        for (let d = target.closest("details"); d; d = d.parentElement.closest("details")) d.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (window.matchMedia("(max-width: 900px)").matches) box.open = false;
    }));
    if (tocObserver) tocObserver.disconnect();
    if (!("IntersectionObserver" in window) || !inPage.length) return;
    const links = Object.fromEntries(inPage.map((a) => [decodeURIComponent(a.getAttribute("href").slice(1)), a]));
    tocObserver = new IntersectionObserver((entries) => {
      const seen = entries.filter((x) => x.isIntersecting).map((x) => x.target);
      if (!seen.length) return;
      Object.values(links).forEach((a) => a.removeAttribute("aria-current"));
      const a = links[seen[0].id];
      if (a) { a.setAttribute("aria-current", "true"); if (!narrow) a.scrollIntoView({ block: "nearest" }); }
    }, { rootMargin: "-90px 0px -70% 0px" });
    heads.forEach((h) => tocObserver.observe(h));
  }

  // Markdown with a few conventions: a paragraph starting with **Мета.** / **Goal.**, **Результат.** / **Result.**
  // or **Типові помилки** / **Common mistakes** (plus the list after it) becomes a callout; a paragraph that is
  // only *italic* text under a heading is the "Covers:" line.
  const CALLOUTS = [[/^(Мета|Goal)\.?$/, "goal"], [/^(Результат|Result)\.?$/, "result"], [/^(Типові помилки|Common mistakes)\.?$/, "pitfalls"]];
  function renderMarkdown(el, md) {
    el.innerHTML = marked.parse(md);
    el.querySelectorAll("p > strong:first-child").forEach((st) => {
      const p = st.parentElement;
      if (p.firstChild !== st) return;
      const hit = CALLOUTS.find(([re]) => re.test(st.textContent.trim()));
      if (!hit) return;
      const box = document.createElement("div");
      box.className = `callout callout-${hit[1]}`;
      p.replaceWith(box);
      box.appendChild(p);
      const next = box.nextElementSibling;
      if (hit[1] === "pitfalls" && next && /^(UL|OL)$/.test(next.tagName)) box.appendChild(next);
    });
    el.querySelectorAll("p").forEach((p) => {
      const only = p.children.length === 1 && p.firstElementChild.tagName === "EM" && p.textContent.trim() === p.firstElementChild.textContent.trim();
      const prev = p.previousElementSibling;
      if (only && prev && (/^H[1-4]$/.test(prev.tagName) || prev.classList.contains("chapter-lead"))) p.classList.add("step-refs");
    });
    el.querySelectorAll("h1, h2, h3, h4").forEach((h) => { if (!h.id) h.id = slugify(h.textContent); });
    el.querySelectorAll("table").forEach((tb) => { const w = document.createElement("div"); w.className = "table-wrap"; tb.replaceWith(w); w.appendChild(tb); });
    el.querySelectorAll('a[href^="#"]:not([href^="#/"])').forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (target) {
        for (let d = target.closest("details"); d; d = d.parentElement.closest("details")) d.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }));
    el.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });
  }

  // ------------------------------------------------------------------ system level (preview)
  // Where each SP 800-53 control comes from (data/sp800-53/profiles.csv):
  //   baseline / sector profiles  - a column of baselines_ua.csv named by the profile id (+ <id>_params_uk);
  //   plan                        - the CSF subcategories that the plan act's provisions require;
  //   CSF and legislation         - the CSF subcategories that all other acts require.
  // CSF subcategories expand to SP 800-53 through the NIST mapping (map_csf-2.0_sp800-53r5.csv).
  const profilesOf = (kind) => D.profiles.filter((p) => p.kind === kind).sort((a, b) => +a.sort - +b.sort);
  function renderSystem() {
    const radios = (name, list, value) => [{ id: "none", label_uk: t("sysNone0"), label_en: t("sysNone0") }, ...list]
      .map((p) => `<label class="radio"><input type="radio" name="${name}" value="${esc(p.id)}" ${value === p.id ? "checked" : ""}><span>${esc(L(p, "label"))}${p.source_id ? `<span class="muted small block">${esc(sourceRef(D.sourceById[p.source_id]))}</span>` : ""}</span></label>`).join("");
    const bases = profilesOf("baseline"), sectors = profilesOf("sector");
    if (!bases.some((p) => p.id === S.baseline)) S.baseline = "none";
    if (!sectors.some((p) => p.id === S.sprofile)) S.sprofile = "none";
    const panel = `${fwPicker()}
      <fieldset><legend>${esc(t("sysBaseline"))}</legend>${radios("baseline", bases, S.baseline)}</fieldset>
      <fieldset><legend>${esc(t("sysSector"))}</legend>${sectors.length ? radios("sprofile", sectors, S.sprofile) : `<p class="hint">${esc(t("sysSectorNone"))}</p>`}</fieldset>
      ${sectorChips()}
      <fieldset><legend>${esc(t("sysShow"))}</legend>${toggle("sb", t("sysFromBaseline"))}${toggle("sp", t("sysFromPlan"))}${toggle("sl", t("sysFromLaw"))}${toggle("drafts", t("optDrafts"))}</fieldset>
`;
    const main = workspace(panel, "system-main");
    bindPanel(app, (soft) => (soft ? (writeHash(), drawSystem(main)) : render()));
    app.querySelectorAll('input[name="sprofile"]').forEach((el) => el.addEventListener("change", () => { S.sprofile = el.value; writeHash(); drawSystem(main); }));
    drawSystem(main);
  }
  function systemRows() {
    const exp = expandedSectors();
    const planSrc = new Set(profilesOf("plan").map((p) => p.source_id));
    const plan = {}, law = {}; // CSF id -> mappings
    Object.entries(driversFor("csf-2.0", exp, S.drafts)).forEach(([csf, ms]) => ms.forEach((m) => {
      const bucket = planSrc.has(D.provById[m.provision_id].source_id) ? plan : law;
      (bucket[csf] = bucket[csf] || []).push(m);
    }));
    const expand = (byCsf) => {
      const out = {}; // SP 800-53 id or whole family ("PT") -> CSF ids
      Object.keys(byCsf).forEach((csf) => (D.csfTo53[csf] || []).forEach((id) => (out[id] = out[id] || new Set()).add(csf)));
      return out;
    };
    const p53 = expand(plan), l53 = expand(law);
    const forCtl = (map, c) => [...new Set([...(map[c.id] || []), ...(map[c.family] || [])])].sort();
    const q = S.q.trim().toLowerCase();
    return D.b53.filter((c) => {
      if (c.withdrawn === "yes") return false;
      c._base = S.baseline !== "none" && c[S.baseline] === "yes";
      c._sector = S.sprofile !== "none" && c[S.sprofile] === "yes";
      c._plan = forCtl(p53, c);
      c._law = forCtl(l53, c);
      const lawMaps = c._law.flatMap((csf) => law[csf]);
      c._acts = [...new Set(lawMaps.map((m) => D.provById[m.provision_id].source_id))];
      c._ai = lawMaps.some((m) => m.review_status === "ai_draft") || c._plan.some((csf) => plan[csf].some((m) => m.review_status === "ai_draft"));
      if (!((S.sb && (c._base || c._sector)) || (S.sp && c._plan.length) || (S.sl && c._law.length))) return false;
      if (q && ![c.id, c.name_en, c.name_uk_machine, c[`${S.baseline}_params_uk`], ...c._plan, ...c._law].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }
  function drawSystem(main) {
    const rows = systemRows();
    const prof = (id) => D.profiles.find((p) => p.id === id);
    const base = prof(S.baseline), sector = prof(S.sprofile);
    const pcol = `${S.baseline}_params_uk`, scol = `${S.sprofile}_params_uk`;
    const n = (f) => rows.filter(f).length;
    const outside = base ? n((c) => !c._base && (c._plan.length || c._law.length)) : 0;
    const csfTitle = (id) => { const c = D.controlById["csf-2.0"][id]; return c ? controlName("csf-2.0", c) : ""; };
    const csfList = (ids) => (ids.length ? ids.map((id) => `<code title="${esc(csfTitle(id))}">${esc(id)}</code>`).join(" ") : `<span class="muted">—</span>`);
    const src = (k, title, text) => `<div class="sys-src"><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`;
    const cols = [base && t("sysColBaseline"), sector && t("sysColSector"), t("sysColPlan"), t("sysColLaw")].filter(Boolean);
    const cell = (c) => [
      base && `<td data-label="${esc(t("sysColBaseline"))}">${c._base ? `<span class="mark">✓</span> ${esc(c[pcol] || "")}` : `<span class="muted">—</span>`}</td>`,
      sector && `<td data-label="${esc(t("sysColSector"))}">${c._sector ? `<span class="mark">✓</span> ${esc(c[scol] || "")}` : `<span class="muted">—</span>`}</td>`,
      `<td data-label="${esc(t("sysColPlan"))}">${csfList(c._plan)}</td>`,
      `<td data-label="${esc(t("sysColLaw"))}">${csfList(c._law)}${c._acts.length ? `<span class="muted small block">${esc(c._acts.map((id) => sourceRef(D.sourceById[id])).join("; "))}</span>` : ""}${c._ai ? ` <span class="badge rv-ai_draft">${esc(t("aiDraft"))}</span>` : ""}</td>`,
    ].filter(Boolean).join("");
    main.innerHTML = `<div class="results-head kpi-head">
        <h1>NIST SP 800-53 Rev. 5</h1>
        <div class="kpis">
          ${kpi(t("kpiSys"), String(rows.length), fmt(t("kpiSysSub"), n((c) => c._base || c._sector), n((c) => c._plan.length), n((c) => c._law.length)) + (outside ? " " + fmt(t("sysOutside"), outside) : ""))}
          ${kpiUpdated()}
          ${kpiAi(n((c) => c._ai), rows.length)}
        </div>
        <p class="lead-sm">${esc(t("sysIntro"))}</p>
        <dl class="sys-sources">${src("b", t("sysSrcBaselineT"), t("sysSrcBaseline"))}${src("p", t("sysSrcPlanT"), t("sysSrcPlan"))}${src("l", t("sysSrcLawT"), t("sysSrcLaw"))}${src("s", t("sysSrcSectorT"), profilesOf("sector").length ? t("sysSrcSector") : t("sysSrcSector") + " " + t("sysSectorNone"))}</dl>
        <p class="notice">${esc(t("sysPreview"))}</p>
        <p class="hint">${esc(t("sysIsoNote"))} ${S.lang === "uk" ? esc(t("sysMachine")) : ""}</p>
        <div class="exports"><button type="button" class="btn btn-primary" id="y-csv">${esc(t("sysDownload"))}</button></div>
      </div>
      ${rows.length ? `<div class="table-wrap"><table class="system">
        <thead><tr><th scope="col">${esc(t("sysColId"))}</th>${cols.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((c) => `<tr><th scope="row"><span class="ctl-id">${esc(c.id)}</span><span class="ctl-name">${esc(c.name_en)}</span>${S.lang === "uk" ? `<span class="muted small block">${esc(c.name_uk_machine)}</span>` : ""}</th>${cell(c)}</tr>`).join("")}</tbody>
      </table></div>` : `<p class="empty">${esc(t("sysNone"))}</p>`}`;
    main.querySelector("#y-csv").onclick = () => {
      const header = [t("sysColId"), "name_en", "name_uk_machine", t("sysColBaseline"), t("sysColParams"), t("sysColSector"), t("sysColPlan"), t("sysColLaw"), t("xSource"),
        t("xApplicable"), t("xOrgValue"), t("xPolicy"), t("xStatus"), t("xEvidence")];
      const yes = S.lang === "uk" ? "так" : "Y";
      downloadCsv(`sp800-53_${S.baseline}_${new Date().toISOString().slice(0, 10)}.csv`, header,
        rows.map((c) => [c.id, c.name_en, c.name_uk_machine, c._base ? yes : "", c._base ? c[pcol] : "", c._sector ? yes : "", c._plan.join(", "), c._law.join(", "),
          c._acts.map((id) => sourceRef(D.sourceById[id])).join("; "), "", "", "", "", ""]));
    };
  }

  // ------------------------------------------------------------------ about
  // The text is content/about.<lang>.md; the version, links, data files and plans are filled in here.
  async function renderAbout() {
    const el = docLayout(t("tocTitle"));
    if (!(await mdInto(el, "about"))) return;
    const plans = el.querySelector("#about-plans");
    if (plans) plans.outerHTML = `<p>${esc(t("plansIntro"))}</p><ul class="plans">${(t("plans") || []).map(([h, d]) => `<li><b>${esc(h)}</b> ${esc(d)}</li>`).join("")}</ul>`;
    buildToc(document.getElementById("toc"), el, false);
    scrollToAnchor();
  }
  // Methodology placeholders: the data version, the maintainer links and the open data files
  function fillMethod(el) {
    const repo = (CFG.repoUrl || "").replace(/\/$/, "");
    const blob = (p) => `${repo}/blob/${CFG.branch || "main"}/${p}`;
    const fill = (id, html) => { const x = el.querySelector(`#${id}`); if (x) x.outerHTML = html; };
    fill("method-version", D.meta ? `<p class="summary">${esc(fmt(t("dataVersion"), D.meta.version, D.meta.date))} ${esc(S.lang === "uk" ? D.meta.note_uk : D.meta.note_en)}</p>` : "");
    fill("method-links", `<p class="about-links"><a href="${esc(blob(S.lang === "uk" ? "docs/BLUEPRINT.uk.md" : "docs/BLUEPRINT.md"))}" target="_blank" rel="noopener">${esc(t("dataBlueprint"))}</a>
        <a href="${esc(repo)}" target="_blank" rel="noopener">${esc(t("aboutRepo"))}</a>
        <a href="${esc(blob("CHANGELOG.md"))}" target="_blank" rel="noopener">${esc(t("aboutChangelog"))}</a></p>`);
    const res = ((D.pkg && D.pkg.resources) || FILES.map((f) => ({ path: f }))).filter((r) => r.name !== "readable");
    const rowsOf = (r) => (D.rowCounts[r.path] != null ? String(D.rowCounts[r.path]) : "—");
    const files = `<div class="table-wrap"><table class="files-table">
        <thead><tr><th scope="col">${esc(t("dataColFile"))}</th><th scope="col" class="num">${esc(t("dataColRows"))}</th><th scope="col">${esc(t("dataColDesc"))}</th></tr></thead>
        <tbody>${res.map((r) => `<tr><th scope="row"><a href="data/${esc(r.path)}" download>${esc(r.path)}</a></th><td class="num">${esc(rowsOf(r))}</td><td>${esc(r.description || "")}</td></tr>`).join("")}</tbody></table></div>`;
    fill("method-data", `<p>${esc(t("dataIntro"))}</p>
      <section class="readable"><h3>${esc(t("dataReadableTitle"))}</h3><p>${esc(t("dataReadable"))}</p>
        <p><a class="btn btn-primary" href="data/grc-foundation-ua.xlsx" download>${esc(t("dataReadableBtn"))}</a></p></section>
      <h3>${esc(t("dataMachineTitle"))}</h3><p>${esc(t("dataMachine"))}</p>${files}`);
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
    // the header menus close on a click outside them or on Escape; opening one closes the other
    const menus = () => [...document.querySelectorAll(".nav-menu")];
    document.addEventListener("click", (e) => {
      menus().forEach((m) => { if (m.open && !m.contains(e.target)) m.open = false; });
      if (e.target.closest(".nav-menu .menu a")) menus().forEach((m) => { m.open = false; });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      menus().forEach((m) => { if (m.open) { m.open = false; m.querySelector("summary").focus(); } });
    });
    render();
  }
  boot();
})();
