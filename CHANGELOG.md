# Changelog

All notable changes to The Forge are listed here, newest first.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- 10/20/2026
- NPCs now have a creature type (Beast, Undead, Dragon, and more). New NPCs start as Unknown.
- The roster can be filtered by creature type when showing NPCs.
- The roster can be sorted by Newest.

### Changed
- 10/20/2026
- Every character now gets its own number ID that never changes or gets reused. Players still have a User ID, and one user can have many characters.
- Characters can now share the same name.
- The roster search looks by Name or User ID, and the search bar is on its own row so it is longer.

### Fixed
- 10/20/26
- Buffs and debuffs are now saved with the character. They were lost when a character was saved.
- Saving does not cause duplications of characters when rename or change to ID was made.
- Form clears when character is saved. Not all fields were cleared and reset.
- Edit from the roster now loads the right character.


### Removed