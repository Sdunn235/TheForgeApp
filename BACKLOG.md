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

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| | | | | | |

## Next

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-01 | The last hand-written dropdowns → ActionMenu | reuse | molecule | S | Skill category ⋮, ability ⋮, each school's +, the spell card ⋮, the roster card ⋮. Makes "one dropdown for the whole app" true |
| B-02 | StepNav: the Back / Save buttons at the bottom of each step | component | molecule | S | 6 copies → 1. Props: save label, first step (Back off), disabled |
| B-03 | SpellCard | component | molecule | M | Built on AppCard + ActionMenu, like SkillCard. Level/cost labels and the Learn tooltip move inside it |
| B-04 | ChoiceGroup: the button-bar radios | component | molecule | S | The roster's Character Type + Sort By. `v-model` + a list of options |
| B-05 | CHANGELOG polish | docs | | S | One `## [3.0.0] - date` heading; remove the date bullets; check every line |

## Later

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-06 | StepTracker: progress bar + numbered dots | component | organism | M | Removes the last `document.querySelector` (`scrollToStep`) |
| B-07 | CharacterCard: one roster card | component | organism | L | Built from ActionMenu + SheetSection. About 10 `characterX(character)` methods move out of app.js |
| B-08 | SheetSection: a heading + "label … value" rows + "None" text | component | molecule | M | 6 sections on each character sheet. Needed by B-07 |
| B-09 | AccordionPanel: header + optional menu + collapsing body | component | molecule | M | Skills, Abilities, Spells + the roster's sheet. Removes 6+ `panelId` / `Target` methods |
| B-10 | ToggleButton: the "Learn" buttons | component | molecule | S | Abilities and spells. `v-model`, disabled, tooltip |
| B-11 | PagerNav: Previous / page numbers / Next | component | molecule | S | Roster only today; reusable for future list pages |
| B-12 | FilterChip: the grey pill with ✕ | component | molecule | S | 2 on the roster. Emits `clear` |
| B-13 | Gear menu runs off the screen at phone width | bug | | S | Found 2026-10. Check the equip `<select>` and the + menus at 375px |
| B-14 | The Edit links in every ⋮ menu go to `#` | feature | | L | Needs the design pages (Skill / Spell / Item Design) that don't exist yet |
| B-15 | Rename `characterIdLabel` | cleanup | | S | It now shows a User ID or a creature type, not an ID. e.g. `characterTagLabel` |
| B-16 | Rename the `feat-list` CSS class | cleanup | | S | EntryPanel's `scroll` uses it for any list, not just feats |
| B-17 | The warning icon on the delete pop-up | feature | | S | Lost when it became a ConfirmModal. Would need an `icon` prop on AppModal |
| B-18 | Ask the teacher about `downloadCharacter` | question | | S | It creates a temporary link with `document.createElement('a')`. Is that OK under "no DOM manipulation"? |

## Inbox

New ideas go here first. Sort them into Next or Later when we plan.

| # | Item | Kind | Level | Size | Notes |
|---|---|---|---|---|---|
| B-19 | "Label: [badge]" counters | component | atom | S | Stat Points + Spells Known. Display only, so it wouldn't count as a working component |
| B-20 | Move the form's prose into data | cleanup | | S | e.g. the step intros and the empty-list texts still typed in the HTML |
| B-21 | Empty-state alerts on the roster | component | molecule | S | "Nothing forged yet" / "No character matches". Maybe too small to be worth it |
| B-22 | Gear panel | component | organism | M | Single use today, so it fails the "2+ uses OR own logic" test, unless the gear logic moves into it |

---

## Done

| # | Item | Done | Notes |
|---|---|---|---|
| | Buffs/debuffs saved · duplicate on rename · form resets after a save | 2026-10-18 | C0012 |
| | Number IDs from a counter, NPC creature types, names can repeat, roster search/filter/sort | 2026-10-19 | C0012 |
| | Roster delete pop-up → ConfirmModal (fixed the focus warning) | 2026-10-20 | |
| | AppNavbar: 6 navbars → 1, one leave pop-up, ✕ removed | 2026-10-20 | first organism |
| | ActionMenu: + look, headings, lines, notes, empty text | 2026-10-20 | |
| | EntryRow + EntryPanel: Buffs, Debuffs, Feats, Inventory | 2026-10-20 | second organism |
