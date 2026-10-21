# Changelog

All notable changes to The Forge are listed here, newest first.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Buffs, Debuffs, Feats, and Inventory are now built from one shared list component. It replaced four hand-built copies of the same heading, + menu, and list.
- One shared navbar for every page, built as a single component. It replaced six copies of the same navbar.
- The dropdown menu component can now show a + button, headings, dividing lines, and a message when there is nothing left to pick.
- NPCs now have a creature type (Beast, Undead, Dragon, and more). New NPCs start as Unknown.
- The roster can be filtered by creature type when showing NPCs.
- The roster can be sorted by Newest.

### Changed
- The + menus for buffs, debuffs, feats, and items now use the shared dropdown menu component.
- All four lists on the forge now have the same look. Inventory's list lost its outer border to match the others.
- The forge now has one "Leave Character Design?" pop-up for every exit. Before, there were two, one for Home and one for the Roster.
- The "add skill category" menu now uses the shared dropdown menu component.
- Clicking the page you are already on in the navbar does nothing. Before, it reloaded the page, which lost unsaved work on the forge.
- The roster's delete pop-up now uses the same shared pop-up as the save confirmation.
- Every character now gets its own number ID that never changes or gets reused. Players still have a User ID, and one user can have many characters.
- Characters can now share the same name.
- The roster search looks by Name or User ID, and the search bar is on its own row so it is longer.

### Fixed
- Closing the leave pop-up on the forge no longer causes a browser accessibility warning.
- Closing the delete pop-up on the roster no longer causes a browser accessibility warning.
- Buffs and debuffs are now saved with the character. They were lost when a character was saved.
- Saving does not cause duplications of characters when rename or change to ID was made.
- Form clears when character is saved. Not all fields were cleared and reset.
- Edit from the roster now loads the right character.


### Removed
- The extra close (X) button in the forge's navbar. Home, Roster, and The Forge already leave the page.