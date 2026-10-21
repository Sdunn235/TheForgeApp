# Changelog

All notable changes to The Forge are listed here, newest first.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
