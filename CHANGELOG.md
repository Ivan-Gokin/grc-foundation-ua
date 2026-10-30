# Changelog

## Register: Laws No. 2163-VIII and No. 3475-IV checked against the text (2026-10-30)

- The Law on the Basic Principles of Cybersecurity (No. 2163-VIII, edition of 19.10.2025) and the Law on SSSCIP (No. 3475-IV, edition of 20.04.2025) were read on zakon.rada.gov.ua: both are in force, and the current editions name Law No. 4336-IX as the basis of the amendments. `last_verified` is set to 2026-10-30 for both.
- The two chain links "No. 4336-IX amends No. 2163-VIII" and "No. 4336-IX amends No. 3475-IV" are now `verified=yes`.
- The map of the national cybersecurity system checked its roles against the same texts; this change records that check in the register.

## Register: SSSCIP Order No. 771 on secure internet access (2026-10-29)

- SSSCIP Order No. 771 of 30.08.2023, the regulation on the system of secure internet access for public bodies, added with `role=context` and the `national-cyber-system` tag (register number 300). The map of the national cybersecurity system cites it as the basis of the cyber-protection services the state provides to public bodies.
- One chain link: the order ensures implementation of the organisational and technical model of cyber protection (Resolution No. 1426), `verified=no`.
- Details come from the SSSCIP page that publishes the order; the text has not yet been checked, so `last_verified` is empty.

## Register: institutional acts of the national cybersecurity system (2026-10-29)

- Eleven acts that set who holds which powers in the national cybersecurity system, added with `role=context` and the `national-cyber-system` tag (so the questionnaire does not offer them as requirements): the laws on the NSDC (No. 183/98-VR), the SBU (No. 2229-XII), the National Police (No. 580-VIII), intelligence (No. 912-IX), counter-intelligence activity (No. 374-IV), defence (No. 1932-XII), the prosecutor's office (No. 1697-VII), the Parliamentary Commissioner for Human Rights (No. 776/97-VR) and diplomatic service (No. 1764-VIII); Presidential Decree No. 242/2016 on the NCCC; CMU Order No. 631-r of 24.06.2026, the 2026 action plan for the Cybersecurity Strategy. Register numbers 289–299.
- A new act type, CMU Order (`cmu_order`, ELI path `eli/ua/cmu/order/<year>/<number>`), for Cabinet orders (розпорядження); the sort order of the types after it moves down by one.
- Two chain links: Decree No. 242/2016 is based on the NSDC law; Order No. 631-r ensures implementation of the Cybersecurity Strategy (Decree No. 447/2021). Both `verified=no`.
- Details were taken from open sources; the texts have not yet been checked on zakon.rada.gov.ua, so `last_verified` is empty. The acts are added so that the map of the national cybersecurity system can reference the same register instead of keeping its own list.

## Cloud and AI: providers and users apart, with "and" rules (2026-10-24)

- A fourth question in "Craft your baseline": "Do you provide or use cloud services or artificial intelligence systems?" (provide cloud or data centre services; use cloud or a third-party data centre; develop or supply AI systems; use AI systems). Cloud and AI left question 1. The filters have a matching group, "Technologies you provide or use", with two new types: cloud service users (`cloud-users`) and AI system users (`ai-users`); `cloud` and `ai` now mean providers.
- Applicability rows can require further types (`requires` in `applicability.csv`): NBU Resolution No. 99 now applies to a bank that uses cloud services; the Law on Cloud Services, CMU Resolution No. 154, SSSCIP Order No. 505 and bill No. 16123 apply to public bodies and CII owners that use cloud services (and to providers as before); SSSCIP Order No. 154 (AI) applies to AI users instead of every organisation; the AI Act, the Digital Omnibus on AI and the CoE AI convention also cover AI users. The Acts register and the data workbook show such rows as "Financial sector + Cloud service users". Validation checks the new column.
- Texts say "four questions" where they said three.

## How to contribute: acknowledgements (2026-10-23)

- New "Acknowledgements" section: a Name and Contribution table read from `content/contributors.csv` (name, contribution in Ukrainian and English, an optional link). While it is empty, it invites the reader to be the first and points to the ways to help.
- The page lead no longer names the author: the project's quality depends on other GRC practitioners taking part.

## Home: a description and one button into the questionnaire (2026-10-23)

- The top block of the home page no longer asks the first question. It says what the questionnaire does ("Let's define your context and find the requirements that fit"), lists the three questions, and has one button, "Start the questionnaire", which opens step 1. "Not sure, or just looking?" stays under it.
- The hero text no longer repeats the description.

## Questionnaire: question 2 without "None of these" (2026-10-23)

- Question 2 now asks "Do you process any categories of information protected by law?" ("Чи обробляєте ви категорії інформації, захищені законом?"); leaving every option unticked means none, so the "None of these" option is gone. The Ukrainian options read in the nominative case to match.

## The wizard keeps its answers; thin data said plainly; a self-explaining workbook (2026-10-23)

- "Craft your baseline" keeps its own profile and framework apart from the filters in Explore: opening an act, the Acts register or the NIST SP 800-53 page no longer wipes or changes the answers, and the header link resumes where the reader left. Links from the wizard no longer switch off recommended acts in Explore.
- Until the reader picks a framework, the wizard follows the recommendation for the current profile, also when a link opens a later step directly; a framework picked on purpose stays in the link (`fwc=1`).
- Once the reader has made a choice (an act accepted, a control ticked, a framework picked), leaving or reloading the page asks first; the question stops after the download. "Start over" in the step list clears everything (a second click confirms).
- Step 4 recommends the framework the acts are actually mapped to when the sector's usual one has nothing yet, and says so; when neither has anything, it says that too. Step 6 says plainly when no control is required by law and offers to switch to the framework that has some.
- Step 6: ISO/IEC 27001 clauses 4–10 are a separate block, not counted as SoA rows; the pinned bar's count follows the open tab; a "Skip to the download" link for keyboard users; "Your answer" is the h2 of each step.
- The workbook (`soa_…xlsx` or `target-profile_…xlsx`): README first (profile, framework, data version, link, what each sheet and column means, the relation symbols), then SoA or Target profile, Clauses 4–10, No counterpart (provisions no control covers), Acts (with Owner, Reviewed on, Notes and rows for your own requirements), Regulators (role, contact, channel, reporting deadline to fill in) and, when needed, NIST SP 800-53 (clear column names; Applicable pre-filled for the baseline profile). Headers and the first columns are frozen in every sheet.
- Links write plain commas (`s=finance,personal-data`); "1 act" instead of "1 acts".

## A way out at the top of the questionnaire (2026-10-23)

- At the top of the questions, on the home page and in step 1: "Not sure, or just looking?" with two links, "Requirements for any organisation" (the baseline for every organisation, step 2) and "All acts" (the full register). It replaces the "Skip" link that sat at the bottom of step 1.

## Home: the questionnaire starts on the home page (2026-10-23)

- The top block of the home page is now the questionnaire's first question, "What does your organisation do?". "Next question" carries the answer into "Craft your baseline" and opens it at question 2. It replaces the list of organisation types and the separate "Answer three questions" button.
- On phones the "How it works" cards stack in one column again.
- Ukrainian step counters read "Крок 1 із 6" and "Запитання 1 із 3", so the З in capitals is not mistaken for a 3.

## How to contribute: mappings checked by industry (2026-10-23)

- Under the overall review meter, "Checked by industry" shows how many mappings a person has checked for laws, banks and the financial sector, critical infrastructure, government, defence and NATO, and everything else, grouped as in the mapping roadmap.

## Guides and How to contribute (2026-10-23)

- The "Help me" menu is now "Guides": it holds the guidance chapters for the reader.
- New "How to contribute" page in the header (`#/contribute`): where help is needed most (the review meter and a link to the mapping roadmap), the ways to help, and how to work with the author. It gathers what was split between the home page's "How you can help" and About's "Cooperation and feedback"; both now point to it.

## The brand cut on two corners only; the header ribbon (2026-10-23)

- Every cut corner is now top right and bottom left, as in the design system: primary buttons, the current item in the header, the theme switch thumb.
- The header navigation group and the theme switch are cut the same way, with the cut edge drawn; so are the dropdown menus.

## Meters and cut corners from the design system (2026-10-23)

- Progress is shown with the design system's Meter: a row of equal segments (one segment is 4%), filled in a series colour, empty ones outlined, the exact figure to the right. Used for the mapping roadmap on About (acts mapped, mappings reviewed) and for the review meter on the home page.
- Cut corners (top right and bottom left, with the cut edge drawn) on the remaining cards: the home page's step and help cards, its "Help check the mappings" and "What changed" panels, the "Know your sector" block, the roadmap milestones and the framework options.

## Answer first, a pinned download, a clearer home page, the mapping roadmap (2026-10-23)

- Each step of "Craft your baseline" shows its title and one paragraph, then the answer; the rest of the guidance is behind "Why this, and what to do". The browser tab names the step, and focus moves to its heading after each step change (the same for every page).
- Step 6: the selected count and the download stay pinned to the bottom of the screen while the list scrolls; after step 6, "What next" leads to "Where the real work begins".
- Step 5: with no chains of acts, the summary and headings no longer mention chains.
- Step 1: "facilities" instead of "objects" in the critical infrastructure question.
- Home: "Answer three questions" is the main button in the top block; the organisation types come second, with "Any other organisation" for shops, offices, schools and services.
- About: a mapping roadmap. Laws first, then regulations for banks, critical infrastructure, government, defence and NATO, and everything else, each with its progress counted from the data.
- Data: the Law Enforcement Directive and the ePrivacy Directive are no longer suggested for "personal data" (they concern law-enforcement authorities and electronic communications providers); NATO AC/35-D/2000-REV7, 2001-REV2 and 2002-REV4 are marked as superseded by the next revision; the two ND TZI 25 documents are named apart (TR EOT-95, TR TZI-PEMVN-95).

## Act names with the date in words; the SoA picked on the left; two levels in the last step (2026-10-23)

- Every act is named by its issuer, number and date in words, e.g. "CMU No. 373 dated 20 August 2022" / "КМУ № 373 від 20 серпня 2022 р.", across the site, the exports and the texts.
- Last step: each control has a selector on the left. A lock marks the ones required by law or by ISO/IEC 27001 clauses 4-10 (they cannot be unticked); controls from accepted recommended acts start ticked; the rest start unticked; "Select all" and "Clear the optional ones". The download lists every control with Applicable yes or no.
- Last step: the organisation level (ISO/IEC 27001 SoA or NIST CSF 2.0 target profile) and the information system level (NIST SP 800-53 Rev. 5) are two labelled tabs with their own colour and count; the SP 800-53 list is grouped under its 20 control families.
- The boxes for your own requirements and controls are gone: add them as rows in the downloaded file.
- ДСК is "Information for internal use (DSK)" in English and "Інформація для службового використання (ДСК)" in Ukrainian.

## Craft your baseline, Explore and Help me (2026-10-22)

- New primary section "Craft your baseline" (`#/craft`): six steps, each with short plain-language guidance and then the answer for the reader. 1. About your organisation (three questions). 2. Your profile (the categories the law names, adjustable). 3. Who sets your rules (the bodies that issued the acts binding you). 4. Your framework (recommended by profile, with the reason: CSF 2.0 for CI, public sector and defence; ISO/IEC 27001 for banks because of NBU No. 95, and otherwise). 5. Your laws and regulations (mandatory acts as chains and locked; recommended acts to accept; EU law to follow; your own requirements). 6. Your Statement of Applicability (controls required by law or by ISO/IEC 27001 clauses 4-10, locked; controls from accepted acts; optional controls to include; your own controls; provisions no control covers; the NIST SP 800-53 target profile when the information processed calls for it).
- The download is one Excel workbook: SoA or target profile with a status and a reason for each control, the acts (required, accepted, followed, own), the NIST SP 800-53 profile when needed, and "about". Choices are kept only for the visit; nothing is stored.
- Header: Intro, Craft your baseline, Explore (Acts, Controls: the full register with filters, as before) and Help me (Roles and authorities; Information systems, Where the real work begins, GRC engineering; glossary, articles, methodology, about).
- The chapters Organisational context, External actors, Choosing the framework, Applicable acts and Controls and the SoA became steps 2-6 and are removed from the guide; their old links and `#/start` open the matching step. Chapter numbers (I.1-III.2) are gone; references are updated. The end-of-chapter tool boxes are removed.
- Buttons follow the brand's cut corners: the primary button has four, every other button, pill, segmented control and chip has two (top right, bottom left), with the cut edge drawn in the border colour.

## Guide: the matching tool at the end of the chapter, collapsed (2026-10-22)

- The side panel became a box at the end of the chapter, collapsed by default. Its summary carries the key figure (e.g. "Your controls · 111 of 118"); a link near the top of the chapter opens it and scrolls to it. Once opened, it stays open from chapter to chapter until closed.
- II.3 "Information systems" got the same box: NIST SP 800-53 controls for the reader's systems, with the baseline profile (preset from the information types in the answers), search, and where each control comes from (baseline profile, cyber protection plan, the acts behind it).

## Guide: acts and controls in a panel beside the text (2026-10-22)

- II.1 "Applicable acts" shows the reader's acts as chains in a panel beside the chapter, and II.2 "Controls and the SoA" shows the reader's controls there (framework, search, rows that open in place, chains, jump to clause, SoA download, a link to the full Controls page). Both are filtered by the answers.
- On wide screens the panel is a third column that follows the scroll and can be hidden; on narrower screens a button opens it as a drawer.
- With no answers yet, the panel offers the four questions or one click on an organisation type that keeps the reader on the same chapter.

## Guide II.1: your applicable acts as chains (2026-10-22)

- II.1 "Applicable acts" shows the acts for the reader's profile: first the regulatory chains, then the acts that stand on their own.
- Chains keep only acts with direct requirements (provisions mapped to controls, or a baseline security profile). Each sits under the nearest act above it that has them too, so a law that only empowers a regulator is skipped while the link through it is kept. Acts that only amend another act are shown on it ("amended by").
- Other applicable acts (empowering laws, acts not yet broken down into provisions) and the EU law worth following are listed in collapsed sections; "Show full chains" puts every act back into the trees.

## Guide in three stages, new home page (2026-10-22)

- The guide follows three stages. I. Governance: roles and authorities, organisational context (the questionnaire), external actors (new), choosing the framework (now with what the sector suggests). II. Compliance: applicable acts (with the EU law worth following), controls and the SoA, information systems. III. Risk management: "Where the real work begins" and GRC engineering (new).
- The integrated management system chapter is folded into GRC engineering, together with the GRC paragraph from step 1 and the tools section from stage 2; old links to it open GRC engineering.
- External actors is a first draft from the register (Laws No. 2163-VIII, 4336-IX, 1882-IX, CMU Resolution No. 1426, the NBU and the SSSCIP as sector regulators); the map of the national system's actors is still to come.
- Chapter numbers follow the stages (I.1-III.2); references between chapters, the Methodology and the blueprint are updated.
- Home: the organisation types and the questionnaire sit in the top block; the three stages link to their chapters; a GRC engineering strip; "Help check the mappings" with a review meter counted from the data and four ways to help; "What changed" with the current data version, the changelog and the repository.

## Controls page and header: less clutter (2026-10-22)

- Header: four sections (Guide, Controls, Acts, About); the site name leads home. Methodology moved to the guide menu's reference group and the footer; the "Report" link moved to the footer.
- Controls: the filter panel is replaced by a profile bar (the chosen organisation types as removable chips, "Edit" opens the filters, "Copy link") and one toolbar: framework, "My profile / All acts" (the unfiltered list for the framework), "By control / By act", search.
- The three figure tiles became one summary line; the two download buttons became one "Download" menu.
- Each control is one row: id, name, the acts behind it in short form and the relation symbols. A row opens in place and shows the provisions grouped by act, with the acts that amend them; the provision text is marked as the Ukrainian original when there is no translation; the parameter, where it belongs, caveat and mapping details are behind "Details".
- "Show full chains" groups the acts of an open row under the law they were issued under (from source_relations.csv); laws outside the reader's profile are marked. Off by default: such laws empower the regulator and set no requirements of their own.
- Jump to a clause, "Expand all / Collapse all", and a one-line legend under the table. "By act" lists each act with its provisions and the controls they map to.
- Every provision has "Report an error": the mapping-error issue form opens with the provision, framework and control filled in.
- Questionnaire: the figures are links (applicable acts, controls, gaps); when no control is mapped for the answers, the result says why and what to do instead of showing zeros.

## Header (2026-10-22)

- The sections in the header are a segmented control: each section is a clear button and the current one is filled with the accent colour. "Intro" (the home page) is a section of its own, first in the row.
- A "Report" button in the top right corner opens a new GitHub issue form ("Something is wrong on the site") with the address of the current page filled in; on narrow screens it shows only the flag icon. The privacy section on About says what the button sends and when.

## Preview banner (2026-10-19)

- The lemon preview banner keeps dark text in the light theme too (it turned white there).

## Home page: the top block follows the theme (2026-10-18)

- The hero frame was always dark indigo, so switching to the light theme seemed to do nothing on the home page. In the light theme it is now drafting paper with the blue grid, ink text and the steel-blue emblem with a teal core; the dark theme is unchanged.

## About: plans (2026-10-18)

- The monitoring item describes how it would work (scheduled checks of the Rada open data and regulators' sites, each new act queued as a GitHub issue for review); a new item on subscribing to changes (RSS/Atom feed and GitHub releases per data version, no addresses collected, Telegram if there is demand).

## Home page (2026-10-18, less text)

- The hero keeps one short paragraph; "What you get" is folded into "What problem it solves" (the minimum set of controls, three short points, and two compact links: for the organisation, for an information system).
- "Who it is for" is folded into "How it works": step 1 is now a picker of organisation types by group (legal status, information, sector, suppliers) that opens the controls table filtered for that type, plus "Requirements for every organisation" and a link to the four questions.
- The controls filter explains when only the requirements for every organisation are shown.

## Citations (2026-10-18)

- Ukrainian acts are cited in full everywhere: type, issuer, number and date (e.g. "SSSCIP Order No. 75 of 30.01.2026", "CMU Resolution No. 1533 of 26.11.2025") in the Methodology tables, the guide, the system profile notes, the chains and the source descriptions and comments. Short references of laws, presidential decrees and bills now carry their date too ("Law of Ukraine No. 2163-VIII of 05.10.2017").
- NIST documents always carry the NIST prefix ("NIST SP 800-53", "NIST CSF 2.0"), including the Methodology comparison table, interface labels and data file descriptions; "ISO 27001" is written as "ISO/IEC 27001".
- A number stays on the same line as its "№"/"No.", and NIST document names in the comparison table do not wrap.

## Site content (2026-10-18, home and open data)

- Home: a new "What problem it solves" section (not missing a requirement, not doing work twice, having the legal basis for each control); "What you get" is now one sentence — the minimum set of controls to include in your ISMS or system profile to comply with the laws that apply to you — followed by the two levels (organisation, information system). The mapping example moved to the Methodology, the three stages to the start of guide step 1.
- Methodology: "Open data" and "Import into GRC systems" are one section; the files are a table (file, rows, description) whose names are the download links.

## Site content (2026-10-18, About and Methodology)

- About is now about the project as an organisation: what it is and for whom, cooperation and feedback (with who makes it and the contacts, given once), a new Privacy section (no data collected; the questionnaire only sets the filters and its answers stay in the part of the address after "#"; the browser remembers only the language and the theme; a note on GitHub Pages logs), licence, plans and the disclaimer.
- Methodology explains how the project is made and how to repeat it: how the project is built (moved from About), new sections on how the data is updated and checked, on the use of AI, and on the tools with steps to build a similar project; the open data downloads and the maintainer links moved here from About. The old "Data quality" section is folded into "How the data is updated and checked".
- The section on GRC and the integrated management system moved from the Methodology to the guide, step 6, as "What GRC is and why integrate".

## Site navigation (2026-10-18)

- The header menu follows the order of use: Controls, Sources, Guide, Methodology, About.

## Site design (2026-10-18, preview banner)

- The preview banner ("Preview: the data is still being checked…") is lemon (series-lemon) with dark text in both themes, so it stands out from the page.

## Site layout (2026-10-18, filters)

- Filter panel (Controls, Sources, SP 800-53): the search field and "Reset filters" moved up, right under the "Who the requirements concern" title and above the legal status groups. The note "No type selected: showing requirements for all organisation types" now sits right under them, only while nothing is selected, instead of above the results.

## Site design (2026-10-18, colours)

- Colours follow the design system's latest tokens: the dark theme is "Midnight" (#0c0f22, blue-indigo) with a more visible blue-lavender grid, and darker surfaces, rules and tiles to match; the home frame uses the same midnight in both themes. The light theme is unchanged.

## Site layout (2026-10-18)

- Controls: the figures a reader needs first are three tiles across the width: controls with legal drivers (with provisions, acts and partial coverage under it), the date the data was updated (with its version), and how many mappings were generated by AI and not yet read by a person. The legend and notes sit under them in two columns. Downloads are one line: the draft SoA (or target profile) as CSV or Excel; the export of mappings one per row and the note about blank columns are removed. The SP 800-53 view gets the same tiles under its title.
- About: the contents links to headings that are added after the text loads ("For people: everything in one table", "For software") now work, and a link to a heading inside a collapsed section opens it.

## Site design (design system "Іван Гокін", version 2)

- Colours come from the design system's tokens. The dark theme is indigo with a lavender grid instead of night blue; the light theme is unchanged.
- A theme switch next to the language switch: a sun and a moon on a track, with a notched accent thumb under the current theme; without a choice the system setting decides, and a choice is remembered in the browser.
- The top block of the home page is a frame: indigo with a lavender grid, four corner marks, and the emblem with the site's name under it.
- Cards have cut corners (top right and bottom left) instead of square ones; the primary button keeps all four corners cut.
- Violet for arrows and connectors (chain links, step arrows, relation symbols, quotes); series colours mark categories (the two requirement levels, the key chains), the lavender ramp marks the three stages.
- Text is ink or muted: headings, identifiers and card titles are no longer coloured; the accent stays for labels, step numbers, big numbers and links. Every number is set in IBM Plex Sans.
- Header and footer are surfaces with a double rule; no shadows.

## Site design (2026-10-17, 3)

- An emblem next to the site name and as the favicon: three 60-degree rhombuses (governance, risk, compliance) turning around a triangle in the accent colour, inside a hexagon whose corners meet the rhombus tips. It follows the light and dark themes.
- Home: the decorative rings next to the headline are replaced by the emblem itself, large, with the letters G, R and C.

## Site design (2026-10-17, 2)

- The flag of Ukraine next to the site name in the header (official colours in both themes).

## data-2026.10.11 (2026-10-17)

From the author's article "We have FISMA at home" (LinkedIn, updated 2026):

- Key chains: the ISMS chain says who the baseline measures are mandatory for; the information-system chain adds item 25 of CMU Resolution No. 373, the security profile procedure in Resolution No. 712, SSSCIP Order No. 354/2024 (assessment of controls, the SP 800-53A counterpart), the NIST counterparts of each document and the advice to build open-information systems into the ISMS and inherit controls; a new chain "Incident response: from NIST SP 800-61 to a national approach" (Decree 37/2022 → CMU 299/2023 → Order 570/2023 → CMU 1533/2025 → Order 143/2026).
- SSSCIP Order No. 570/2023 is marked as repealed (replaced by Order No. 143/2026).
- Methodology: a table of the NIST document family and their Ukrainian counterparts, the FISMA parallel, and a link to the article.
- Guide, stage 2: a starting map for a public authority or a critical infrastructure operator.
- Links to a key chain (`#/sources?...#chain-<id>`) now scroll to it.

## data-2026.10.10 (2026-10-17)

- Chains get context. The "Chains" tab now opens with **key chains**, each step with the provision that matters and what it does: "Baseline cyber protection measures: the ISMS in the public sector" (Law 2163-VIII → CMU 1426 → SSSCIP Order 75/2026) and "Protecting information systems: KSZI, authorisation and NIST SP 800-53 baseline profiles" (Law 80/94-VR → CMU 373 → CMU 712/2025 → ND TZI 3.6-004-21 → ND TZI 3.6-006-24 → Orders 409/2025 and 419/2025). New data files `chains.csv` and `chain_steps.csv`, checked by the validator.
- In the full tree every link shows its legal basis (and a "medium confidence" mark where it comes from secondary sources), and every act shows where its requirements live: how many of its provisions are in the controls table, "SP 800-53 baseline profile", or "framework, no direct requirements".
- With organisations selected, acts that do not apply to them directly are dimmed in the tree (they are there as the legal basis), and steps of the key chains that do apply are marked.
- The Methodology's chain example moved to the key chains; the Methodology links there.
- Data fixes: the malformed record `ua-ndtzi-3.6` is now `ua-ndtzi-3.6-004-21` (number, title and ELI corrected); CMU Resolution No. 373 carries its current title "On approving the Minimum requirements for the protection of information, electronic communication, information and communication and technological systems".

## Site design (2026-10-17)

- New look: cool retro-futurist deco on graph paper. The light theme is drafting paper with a blue grid and a steel-blue accent, the dark theme a night-blue chart table with an ice-blue accent; teal is the second colour and coral is kept for warnings and partial coverage. Double rules under the header and above the footer, notched primary buttons, ring-shaped relationship symbols.
- Type: Tektur (variable, condensed to 85%) for titles, navigation, labels and control identifiers; IBM Plex Sans for reading text and tables. Literata is removed. Both fonts stay self-hosted.
- Home: a decorative "gate" next to the headline (hidden on phones), numbered diamonds in "How it works", and the three stages as rising columns with Roman numerals.
- The favicon follows the new palette. No data changes.

## data-2026.10.9 (2026-10-17)

- The Methodology's chain example now uses the order in force: law → CMU Resolution No. 1426 → SSSCIP Order No. 75/2026. The link Order 54/2025 `based_on` 1426 is removed; Order 75/2026 `based_on` 1426 is added with `confidence=medium` (item 5 of the Regulation requires the baseline measures; the order's preamble cites Resolutions No. 518 and No. 373).
- Filter panels: the search field (a magnifier instead of the "Search" label) and "Reset filters" sit right under "Who the requirements concern".
- Plans: a reverse mapping from the NIST SP 800-53 baseline profiles to ISMS controls, to show what can be met once at management-system level instead of in every system; GRC import listed as its own item.

## data-2026.10.8 (2026-10-17)

- One licence for the whole project: data, texts and code are under CC BY 4.0 (`LICENSE` now holds its full text; `LICENSE-DATA.md` is gone, its third-party notes moved to the README). Vendored libraries and fonts keep their own licences.
- New chain: SSSCIP Order No. 54/2025 `based_on` CMU Resolution No. 1426 (item 5 of the Regulation on the organisational and technical model of cyber protection); the basis of 1426 now cites item 15 of Art. 8(3) of Law No. 2163-VIII. The Methodology walks through this chain as an example of how an ISMS is required in public authorities, including the replacement of Order No. 54 by Order No. 75/2026.
- Methodology: new section on importing the data into GRC systems (CISO Assistant YAML libraries, OSCAL) as an on-request option; the questionnaire result links to it.
- Every piece of information now lives in one place: the full disclaimer only in About (short form in the footer); relationship symbols and coverage only in the Methodology (plus a collapsible key in Controls); the sources of SP 800-53 requirements only in the system view; the integrated-system how-to only in guide step 6; repository layout, procedures and local commands only in the blueprint and CONTRIBUTING. About explains the project's logic without file paths; the README is now a short maintainer entry point.
- Clearer wording: the chains hint, the SP 800-53 preview note and source descriptions, the "who it concerns" review note, the guide's "follow the chains" step, the rationale of a mapping; baseline measures and the cyber protection plan are one row in the kinds of requirements. The GRC systems article no longer says KSZI is built on SP 800-53.

## data-2026.10.7 (2026-10-16)

- New home page (`#/home`, the brand link): what the project does, a four-step "how it works" diagram, the two levels of requirements (the ISMS on ISO/IEC 27001 or NIST CSF 2.0; information systems on NIST SP 800-53 baseline profiles) with the Ukrainian names of the standards, what you get, the three stages (governance → compliance → risk management) and audience cards.
- New questionnaire (`#/start`): four questions (sectors, several allowed; information processed; critical infrastructure category; standard, or "suggest one") that set the filters and show the number of applicable acts, controls and requirements with no counterpart, with links to the controls, the acts, the SoA download and, for state, official or NATO information, the SP 800-53 baseline. A "skip" option shows everything. Answers are not sent or stored.
- Guide split into chapters (`content/guide/<id>.<lang>.md`, `#/guide?c=<id>`): stage 1 has six steps, starting with the new "Roles and authorities" (management, collective body, CISO, owners, three lines, segregation of duties, what regulators require); then compliance, risk management and the glossary. The header has a "Guide" menu with all chapters and the reference articles; the side panel lists them with the open chapter's headings; back / next links at the bottom. The "If you are..." table gave way to the questionnaire.
- New Methodology page (`content/method.*.md`): base standards, OCEG GRC and the integrated management system, NIST IR 8477 STRM, kinds of requirements (including what registration with the Ministry of Justice means), chains and deduplication with ELI, data quality.
- About is now Markdown (`content/about.*.md`): open source and data, how the project is built, data downloads, plans, feedback and cooperation.

## data-2026.10.6 (2026-10-16)

- The System level view is merged into Controls: the control set picker has two groups, "Management system (ISMS)" with ISO/IEC 27001 and NIST CSF 2.0, and "Information system" with NIST SP 800-53. Old `#/system` links open it there.
- "Data" is now "About": what the project is, links (blueprint, repository, change history, contact), the readable workbook, the machine-readable files (collapsed) and a list of plans: reviewing the AI mappings, monitoring new publications, a "Latest changes" page, diagrams, sector profiles, SP 800-53 to ISO 27001 and OSCAL.
- Guide: a contents panel on the left with the current section highlighted (collapsible on phones); text restructured into shorter blocks, tables and goal / result / common-mistakes callouts, in both languages. Tables in the guide scroll sideways on phones instead of breaking words.
- Terminology: «зацікавлені сторони» instead of «заінтересовані» in the project's own texts (guide, ISO 27001 labels); quotations of the official CSF 2.0 translation and of Order No. 75/2026 keep the original wording.

## data-2026.10.5 (2026-10-16)

- System level reworked: each SP 800-53 control shows where the requirement comes from: the baseline security profile (SSSCIP Orders No. 409/2025, 419/2025, 843/2025, with parameters), the cyber protection plan (baseline measures of Order No. 75/2026, by object category), or CSF and legislation (CSF subcategories required by other acts). Sector security profiles have a place in the view and the data model (`kind=sector`) but none is approved yet.
- New `data/sp800-53/profiles.csv` describing these sources; the validator checks it.
- Preview mode: `noindex` on the site, a "Preview, please do not share" banner (`preview: true` in `config.js`), and the built site kept as an artifact of every Actions run.

## data-2026.10.4 (2026-10-16)

- Provisions and mappings moved from `data/provisions.csv` and `data/mappings.csv` to Excel workbooks `mappings/*.xlsx` (`nbu`, `law-80-94-vr`, `cmu-373-736`, `ssscip-75-2026`): a «Вимоги» sheet per workbook and one sheet per framework, linked by act + paragraph, with header notes and drop-down lists. The conversion was lossless, except that the duplicate provision `ua-law-80-94-vr:a8-p4-gap` was merged into `a8-p4` as its "no counterpart" link.
- Nothing generated is kept in git any more. `scripts/build.py` builds the site into `_site/` and adds `provisions.csv`, `mappings.csv`, `eli.jsonld` and the new readable workbook `grc-foundation-ua.xlsx` (register, chains and mappings with names and texts joined in). GitHub Actions (`site.yml`) checks every pull request and publishes `main` to Pages; the Pages source is now "GitHub Actions".
- Removed for compactness: the one-off import and migration scripts (`import_legacy.py`, `merge_register_2026_10.py`, `import_strm_2026_10.py`, `migrate_to_eli_2026_10.py`, `legacy_translations_en.csv`), `build_eli.py` (now part of `build.py`), `.nojekyll` and `validate.yml`. What they did is recorded in the entries below.
- The Data page now offers the readable workbook first and links generated files to what they are built from.
- Removed the archived CSF 1.1 integration matrix (`data/archive/`). The repository and site addresses now point to github.com/Ivan-Gokin; the readable workbook gives full ELI addresses.

## data-2026.10.3 (2026-10-16)

- Regulatory chains rebuilt on the European Legislation Identifier (ELI). `source_relations.csv` now uses ELI ontology 1.5 properties: `issued_under` → `based_on` (103), `replaces` → `repeals` (16), `implements` → `transposes` (EU directives, 3), `applies` (EU regulations, 3) or `ensures_implementation_of` (treaties, 3); `amends` unchanged. Three links were reclassified: Law 4336-IX → Regulation 2024/792 (`related_to`), SSSCIP order 843/2025 → UA-NATO Security Agreement and Decree 37/2022 → Decree 447/2021 (`ensures_implementation_of`). New `adopts` (ELI-DL) for a law adopted from a bill.
- New `eli` column in `sources.csv`: the official ELI for the 28 EU acts, and an unofficial ELI-pattern path (`eli/ua/vru/law/2017/2163-viii`) for everything else, since Ukraine has no official ELI yet.
- New generated `data/eli.jsonld` (`scripts/build_eli.py`, checked in CI): the register and chains as ELI metadata; links from drafts as `eli-dl:foresees_change_of`.
- `404.html` resolves `/eli/...` addresses to the act in the register. The site shows the ELI of each act, labels links with ELI terms, and adds the ELI to the sources export.

## data-2026.10.2 (2026-10-16)

- **AI-generated, not yet proofread:** 315 provisions and 335 mappings for eight NBU resolutions (95/2017, 178/2022, 43/2021, 4/2021, 64/2018, 88/2019, 99/2025, 67/2024) to ISO/IEC 27001:2022, and 37 provisions and 70 mappings for Law No. 80/94-VR to NIST CSF 2.0, from two STRM workbooks (NIST IR 8477).
- New `review_status=ai_draft`, shown as "AI, not reviewed" with a warning above the controls table and in every export. The 22 earlier draft mappings written by Claude are now `ai_draft` too.
- New `policy_uk`/`policy_en` columns in `mappings.csv` (where the requirement belongs), shown on the site and added to the SoA export.
- Requirements with no counterpart in the framework (`no_relationship` with an empty `control_id`) are listed below the controls table.
- Provision caveats (edition used, numbering to verify) are shown with each driver.
- Law 80/94 is now tagged as applying to every organisation (universal norms) and to CII owners; its provisions carry `applies_to` for state information resources, CII and finance.

## data-2026.10.1 (2026-10-16)

- Merged the extended register: 288 sources (252 core, 36 EU reference), each with `register_no`, a description and "concerns" text in both languages, and `scope`/`domain` columns.
- New source types: international agreements, Ukrainian bills (watch list), Ministry of Justice and other orders, EU acts and proposals.
- Entity types rebuilt as 25 tags in four groups (`sector_groups.csv`), with multiple parents; 522 applicability rows (draft).
- 159 regulatory relations with legal basis, source URL and confidence; new "Chains" view.
- EU acts on a separate reference tab, never in the controls table. Bills, unratified treaties, repealed acts and records-management acts are hidden by default.
- New "Articles" section (ISMS policy case studies, GRC systems overview). Guide rewritten around the three GRC engineering stages.
- CSF 1.1 integration matrix moved to `data/archive/`.

## data-2026.10 (2026-10-16)

- Initial import from grc-one-stop-shop-ua: 211 Ukrainian and NATO sources (EU acts excluded), applicability by sector (draft), 10 regulatory relations (draft).
- CSF 2.0 controls with the SSSCIP 2026 Ukrainian text; 68 SSSCIP baseline measures as provisions mapped to CSF 2.0 (imported).
- ISO/IEC 27001:2022 clauses and Annex A controls with the project's own labels.
- 10 provisions of CMU Resolutions 373/2006 and 736/2016 with 22 draft mappings to both frameworks.
- SP 800-53 Rev. 5 with Ukrainian baselines (open, official, NATO) and the NIST CSF 2.0 to SP 800-53 mapping.
