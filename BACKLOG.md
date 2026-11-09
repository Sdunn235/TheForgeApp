# Backlog

Everything The Forge could still use, in one place. When an item is done, it
moves to **Done** and gets a line in `CHANGELOG.md`.

## How to use it

- **Add:** put a new row at the bottom of **Inbox**, with the next number (B-23, B-24...). A rough note is fine.
- **Pick:** move a row up to **Now** when we start it. Keep **Now** to one or two items.
- **Organize:** move rows between **Next** and **Later** to set the order. The top of each list goes first.
- **Done:** move the row to **Done**, add the date, and write its changelog line.

**Size:** S = under an hour · M = one or two hours · L = an evening or more

**Kind:** component · reuse (an existing component used in more places) · bug · cleanup · feature · docs

---

## Now

Vue App 4.0 - Models & Collections: built 2026-11-09, waiting on the browser check.

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-36 | Browser check of 4.0 (`npm run dev`) | bug | | S | Roster search/filter/sort/paging · edit + save keeps the ID · Player ↔ NPC keeps stats · equip/swap/drop a dagger · a feat past the allowance is Bonus · delete · gallery |

## Next

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-06 | StepTracker: progress bar + numbered dots | component | organism | M | `dotLeft`, `dotLabel`, `stepDisabled`, `progress*` move in |

## Later

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-07 | CharacterCard: one roster card | component | organism | L | Built from ActionMenu + SheetSection. Easier once the Character model (B-26) exists |
| B-08 | SheetSection: a heading + "label … value" rows + "None" text | component | molecule | M | 6 sections on each character sheet. Needed by B-07 |
| B-31 | Step components + a shared store | component | organism | L | One component per forge step. Needs Pinia (or similar) so the steps don't relay every change. Next assignment, maybe |
| B-11 | PagerNav: Previous / page numbers / Next | component | molecule | S | Roster only today; reusable for future list pages |
| B-13 | Gear menu runs off the screen at phone width | bug | | S | Found 2026-10. Check the equip `<select>` and the + menus at 375px |
| B-14 | The Edit links in every ⋮ menu go to `#` | feature | | L | Needs the design pages (Skill / Spell / Item Design) that don't exist yet |
| B-17 | The warning icon on the delete pop-up | feature | | S | Lost when it became a ConfirmModal. Would need an `icon` prop on AppModal |
| B-18 | Ask the teacher about `downloadCharacter` | question | | S | It creates a temporary link with `document.createElement('a')`. Is that OK under "no DOM manipulation"? |

## Inbox

New ideas go here first. Sort them into Next or Later when we plan.

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-20 | Move the form's prose into data | cleanup | | S | e.g. the step intros and the empty-list texts still typed in the HTML |
| B-21 | Empty-state alerts on the roster | component | molecule | S | "Nothing forged yet" / "No character matches". Maybe too small to be worth it |
| B-22 | Gear panel | component | organism | M | Single use today, so it fails the "2+ uses OR own logic" test. The gear logic now lives in Inventory, so a panel would only show it |
| B-37 | Bring storage back with factories | feature | | M | Next assignment. Turn saved plain data back into Players / Npcs (`helpers/storage.js` is commented out) |

---

## Done

| # | Item | Done | Notes |
|---|---|---|---|
| B-33 | Entry models (Skill, Spell, Item, Feat, Effect on one Entry) + Stat | 2026-11-09 | `builders.js` and `labels.js` deleted |
| B-34 | Collections: Collection, EntryGroup, FeatList, Inventory, Roster | 2026-11-09 | Roster search/sort and ids; Inventory equip |
| B-35 | Character → Player / Npc; the forge runs on one character; storage off, roster in App.vue | 2026-11-09 | ForgeView 1,304 → 920 lines |
| B-32 | Component gallery page | 2026-10-27 | `/gallery` |
| | Buffs/debuffs saved · duplicate on rename · form resets after a save | 2026-10-18 | C0012 |
| | Number IDs from a counter, NPC creature types, names can repeat, roster search/filter/sort | 2026-10-19 | C0012 |
| | Roster delete pop-up → ConfirmModal (fixed the focus warning) | 2026-10-20 | |
| | AppNavbar: 6 navbars → 1, one leave pop-up, ✕ removed | 2026-10-20 | first organism |
| | ActionMenu: + look, headings, lines, notes, empty text | 2026-10-20 | |
| | EntryRow + EntryPanel: Buffs, Debuffs, Feats, Inventory | 2026-10-20 | second organism |
| B-28 | Scoped styles + dead CSS: `.btn-expand`, `.stat-label/score`, `.sheet-bar`, `.btn-icon`, both `.btn-close` rules, `$position-values` | 2026-10-27 | app.scss 761 → 171 lines |
| B-29 | Dead code sweep: no-op classes (`card-title-dark`, `character-form`), every export checked for a user | 2026-10-27 | Stale comments were fixed as each file moved |
| B-27 | Vue Router + views: Home, Roster, Forge, Gallery. Leave guard = beforeRouteLeave (also catches Back). app.js deleted | 2026-10-27 | Phase 4. Last page search gone |
| B-24 | Feats collapse like the rest (AccordionPanel); the scroll box is gone (class feedback) | 2026-10-27 | ForgeView, Abilities step |
| B-12 | FilterChip atom + RosterView (Phase 4b): the roster runs on the Character model, ChoiceGroup and FilterChip | 2026-10-27 | Roster prefixes dropped inside the view (`searchTerm`, `page`, `creatureFilter`...) |
| B-09 | AccordionPanel molecule (EntryPanel's `scroll` + `.feat-list` removed, closes B-16) | 2026-10-27 | Used on the forge in 4c |
| B-02 | StepNav molecule (`.card-navigation` scoped) | 2026-10-27 | Used on the forge in 4c |
| B-04 | ChoiceGroup molecule (component v-model) | 2026-10-27 | Used on the roster in 4b |
| B-03 | SpellCard (AppCard + ActionMenu + ToggleButton) + `helpers/labels.js` | 2026-10-27 | 7 spell methods left app.js |
| B-10 | ToggleButton atom (`.ability-toggle` → scoped `.toggle-button`) | 2026-10-24 | |
| B-30 | BudgetBadge atom (was B-19) | 2026-10-24 | Replaced 3 identical badge computeds |
| B-23 | Vue CLI project (Vite + Router), 11 components → `.vue` with scoped styles | 2026-10-24 | Phases 1, 3a, 3b. B-28 partly done (moved CSS); the dead-CSS part is left |
| B-25 | Data modules: 9 files in `src/data/`, named exports | 2026-10-24 | Proven equal to the old data |
| B-26 | Helpers (lists, formulas, builders, storage, seed, menus) + the Character model | 2026-10-24 | app.js 2,520 → 1,447 lines. B-15 done as `tagLabel` |
| B-05 | CHANGELOG polish: one `## [3.0.0]` heading | 2026-10-21 | C0014 |
| B-01 | The last hand-written dropdowns → ActionMenu (skill category ⋮, ability ⋮, school +, spell card ⋮, roster card ⋮) | 2026-10-21 | The roster's creature-type filter stays a plain dropdown: it shows the current pick, not a menu of actions |
