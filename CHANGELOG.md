# Changelog

All notable changes to The Forge are listed here, newest first.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [3.2.5] - 2026-10-27

Vue App 3.0 - SFC. Changes since Vue App 3.0 (commit C0014, 2026-10-21).

### Added
- The Forge is now a Vue app made with the Vue CLI (Vite). It runs with `npm install` and then `npm run dev`.
- Moving between Home, the Forge, and the Roster no longer reloads the page. One app shows each page in place.
- A component gallery page (`/gallery`) that shows every component on its own, from the smallest pieces up to whole sections.
- A shared "points left" badge for stat points, feat slots, and spells known. It turns red when over, amber when exactly spent, and blue when some are left.
- A shared button for learning abilities and spells. Grey means it can't be taken yet, purple means it can, and green means it's learned.
- A shared filter chip with a ✕ for the roster's search and type filters.
- A shared spell card for the Spells step, with its level, mana cost, menu, and Learn button.
- A shared collapsing section for skill categories, abilities, spell schools, and feats.
- A shared Back and Save bar for all six forge steps.
- A shared row of buttons for the roster's Character Type and Sort By.
- The browser's Back button now asks before leaving the forge, the same as the navbar does.

### Changed
- Feats now open and close like the other sections on the forge. Before, the feat list scrolled inside its own small box.
- Every component is now its own `.vue` file, with its own styles kept inside it so they can't change anything else on the page.
- The world's data (skills, abilities, spells, effects, feats, items, and the sample characters) now lives in its own files instead of inside the page code.
- The roster now reads each saved character through one shared character model, so a missing field is filled in once instead of on every card.
- Bootstrap now comes from npm instead of a link, and each part of the app loads only the Bootstrap pieces it uses.
- Saving a character you were editing now clears the character from the address bar. Before, refreshing the page loaded the old character into the new form.

### Removed
- The old three-page setup: `index.html`, `creation-character.html`, `view-characters.html`, and the 2,520-line `app.js` that ran all three.
- Styles that nothing used anymore, and two class names in the forge that did nothing.
- The compiled `forge.css` file and the separate Sass watcher. Vite builds the styles now.

### Fixed
- Clicking an item's quantity label in the inventory now selects that item's quantity box. Before, an item and a skill with the same name (Dagger) shared an ID, so the label could point at the skill's slider.
- Leaving the forge after saying yes to the pop-up no longer risks freezing the next page's scrolling. The forge now waits for the pop-up to finish closing before it leaves.

## [3.0.0] - 2026-10-21

Vue App 3.0. Changes since Vue App 2.0 (commit C0011, 2026-10-06).

### Added
- One shared navbar component for every page. It replaced six copies of the same navbar.
- One shared list component for Buffs, Debuffs, Feats, and Inventory. It replaced four hand-built copies of the same heading, + menu, and list.
- The dropdown menu component can now show a + button, headings, dividing lines, and a message when there is nothing left to pick.
- NPCs now have a creature type (Beast, Undead, Dragon, and more). New NPCs start as Unknown.
- The roster can be filtered by creature type when showing NPCs.
- The roster can be sorted by Newest.

### Changed
- Every + and ⋮ menu now uses the shared dropdown menu component: skill categories, abilities, each spell school, spell cards, buffs, debuffs, feats, items, and the roster cards. Before, five of them were hand-written.
- All four lists on the forge now look the same. Inventory's list lost its outer border to match the others.
- The forge now has one "Leave Character Design?" pop-up for every exit. Before, there were two, one for Home and one for the Roster.
- The roster's delete pop-up now uses the same shared pop-up as the save confirmation.
- Every character now gets its own number ID that never changes and is never reused. Players still have a User ID, and one user can have many characters.
- Characters can now share the same name.
- The roster search looks by Name or User ID, and the search bar is on its own row so it is longer.

### Removed
- The extra close (✕) button in the forge's navbar. Home, Roster, and The Forge already leave the page.

### Fixed
- Buffs and debuffs are now saved with the character. Before, they were lost on save.
- Saving a character after renaming it or changing its ID no longer makes a duplicate copy.
- Saving now clears the whole form. Before, some fields kept the last character's values.
- Edit from the roster now loads the right character.
- Clicking the page you are already on in the navbar does nothing. Before, it reloaded the page, which lost unsaved work on the forge.
- Closing the leave pop-up on the forge or the delete pop-up on the roster no longer causes a browser accessibility warning.
