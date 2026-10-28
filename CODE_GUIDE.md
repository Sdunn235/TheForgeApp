# The Forge: Code Guide (Vue App 3.0 - SFC)

A study guide for explaining this code: what each piece does, why it is built
that way, and what every bit of syntax means. Each section stands on its own.

**Contents**

1. [The one-minute version](#1-the-one-minute-version)
2. [How the files connect](#2-how-the-files-connect)
3. [The pattern and the rules](#3-the-pattern-and-the-rules)
4. [Atomic design, and when something becomes a component](#4-atomic-design-and-when-something-becomes-a-component)
5. [Component by component](#5-component-by-component)
6. [Following the data: walkthroughs](#6-following-the-data-walkthroughs)
7. [Syntax reference: the template (HTML side)](#7-syntax-reference-the-template-html-side)
8. [Syntax reference: JavaScript](#8-syntax-reference-javascript)
9. [Decisions log: what we chose and what we turned down](#9-decisions-log-what-we-chose-and-what-we-turned-down)
10. [Honest exceptions](#10-honest-exceptions)
11. [Where the assignment stands](#11-where-the-assignment-stands)
12. [Questions I might be asked](#12-questions-i-might-be-asked)
13. [Code smells I found, and the refactoring for each](#13-code-smells-i-found-and-the-refactoring-for-each)
14. [Design principles in The Forge](#14-design-principles-in-the-forge)
15. [Data, helpers and the Character model](#15-data-helpers-and-the-character-model)
16. [Single File Components, Vite and the router](#16-single-file-components-vite-and-the-router)

---

## 1. The one-minute version

- **The Forge is a Vite app made with the Vue CLI** (`npm create vue@latest`).
  Every component is a **Single File Component** (`.vue`): its HTML, its code
  and its own scoped CSS in one file. Vite compiles them; `npm run dev` runs it.
- **One app, four pages.** Vue Router swaps the page (a **view**) without a
  reload: Home `/`, the Forge `/forge`, the Roster `/roster`, and the
  component Gallery `/gallery`. The old three HTML pages and the 2,520-line
  `app.js` that served all of them are gone.
- **The pattern is "the parent owns, the child shows"** (Container /
  Presentational). A view owns the data. Components get what they show through
  **props**, work out what they can in **computed**, and report what the user
  did with **emits**. The parent makes the change.
- **The principle is one-way data flow: props go down, events go up.** That is
  the Vue docs' own wording. A component never changes data that isn't its own.
- **The world's data lives apart from the pages** (MVVM's Model): the
  catalogs in `src/data/`, small tools in `src/helpers/`, and a `Character`
  class in `src/models/`.
- **18 components in atomic order:** 3 atoms, 13 molecules, 2 organisms (see
  section 4). One `ActionMenu` runs every dropdown, one `RangeSlider` every
  slider, one `ConfirmModal` every "are you sure?", one `AccordionPanel` every
  collapsing section.
- **Options API throughout** (`export default { data, props, computed,
  methods }`), the same style as before. No Composition API.
- **Every character has a number ID that never changes** (0, 1, 2...), handed
  out by a counter that only goes up.

---

## 2. How the files connect

```
index.html                  one page: <div id="app"> and <script src="/src/main.js">
src/
├── main.js                 starts the app: styles, Bootstrap, the router, App.vue
├── App.vue                 the frame: <AppNavbar /> + <RouterView /> (the current page)
├── router/index.js         which address shows which view
├── views/                  PAGES (atomic design's top level)
│   ├── HomeView.vue        /          the video banner + one card per design area
│   ├── ForgeView.vue       /forge     building or editing a character (six steps)
│   ├── RosterView.vue      /roster    every saved character: search, filter, sort, sheet
│   └── GalleryView.vue     /gallery   every component on its own, in atomic order
├── components/
│   ├── atoms/              BudgetBadge, ToggleButton, FilterChip
│   ├── molecules/          RangeSlider, ActionMenu, AppCard, AppModal, ConfirmModal,
│   │                       PageContentHeader, StatCard, SkillCard, SpellCard, EntryRow,
│   │                       AccordionPanel, StepNav, ChoiceGroup
│   └── organisms/          AppNavbar, EntryPanel
├── directives/tooltip.js   v-tooltip: a Bootstrap tooltip that cleans up after itself
├── data/                   the world: catalogs and starting lists (section 15)
├── helpers/                small tools with no "this" (section 15)
├── models/Character.js     a saved character, as a class (section 15)
└── sass/
    ├── _tools.scss         variables and mixins only (no CSS)
    └── app.scss            Bootstrap + the truly app-wide rules
public/images/anvil.png     served as /images/anvil.png
```

**The start-up chain:** `index.html` loads `src/main.js`. `main.js` loads the
styles, makes the app from `App.vue`, plugs in the router and mounts it on
`#app`. `App.vue` draws the navbar and a `<RouterView />`, and the router puts
the view for the current address there.

Three steps connect a component to whatever uses it. Skip one and Vue warns
`Failed to resolve component`.

1. **Export it.** In a `.vue` file the component object is exported directly:
   ```js
   export default { props: { ... }, ... };
   ```
2. **Import and register it** in whatever uses it:
   ```js
   import StatCard from '@/components/molecules/StatCard.vue';
   // ...
   components: {
       StatCard,
   },
   ```
3. **Use it as a tag**, PascalCase and self-closing inside a `.vue` template:
   ```vue
   <StatCard :stat="stat" v-model="stat.value" :points-left="statPointsLeft" />
   ```

**Who registers what.** A component is registered where it is *used*, not
once for the whole app. Open any component and its `components: {}` lists what
it is built from:

| Registered in | Uses | Why there |
|---|---|---|
| `App.vue` | AppNavbar | the navbar on every page |
| `HomeView` | ActionMenu, AppCard, PageContentHeader | the forge cards |
| `ForgeView` | AccordionPanel, ActionMenu, BudgetBadge, ConfirmModal, EntryPanel, RangeSlider, SkillCard, SpellCard, StatCard, StepNav, ToggleButton | the six steps |
| `RosterView` | ActionMenu, ChoiceGroup, ConfirmModal, FilterChip | the toolbar, the cards, delete |
| `EntryPanel` | ActionMenu, EntryRow | the + menu and the rows |
| `EntryRow` | ActionMenu (+ `tooltip`) | the ⋮ and the row's tooltip |
| `StatCard` | AppCard, RangeSlider | its frame and slider |
| `SkillCard` | ActionMenu, AppCard, RangeSlider | its frame, menu and slider |
| `SpellCard` | ActionMenu, AppCard, ToggleButton | its frame, menu and Learn button |
| `ConfirmModal` | AppModal | the modal shell |

Directives work the same way, in `directives: {}`. RangeSlider, EntryRow,
ToggleButton and the views that put tooltips on their own markup each register
`tooltip`.

**The one exception: `<RouterView>` and `<RouterLink>`.** These come from the
router itself. `app.use(router)` in `main.js` registers them for the whole
app, so no file imports them.

This is the same idea as the teacher's demo, where `ShoppingList` registers
`ShoppingListItem` itself.

---

## 3. The pattern and the rules

### The eight rules every component follows

| # | Rule | Why |
|---|---|---|
| 1 | **Never write to a prop.** That includes a field on an object prop (`this.stat.value = 5` is out too). | Vue docs, Props → One-Way Data Flow: *"the child should emit an event to let the parent perform the mutation."* If any child could change shared data, a bug could come from anywhere. If only the owner changes it, there is one place to look. |
| 2 | **Be smart about calculations.** A component works out everything it can from its own props, in `computed`. | This is the "move the logic into the components" part. `fillPercent`, `affordableMax`, `budgetClass` and SpellCard's `learnTitle` all live in the component that uses them. |
| 3 | **One value changing → component `v-model`.** The child has a `modelValue` prop and emits `update:modelValue`. | The parent writes `v-model="stat.value"`, so the parent does the assignment. It is still props down, events up. Vue just writes both halves for you. (RangeSlider, StatCard, SkillCard, ChoiceGroup.) |
| 4 | **Add / remove / toggle → an event named with a verb**, like `remove` or `toggle`. | The child says what the user wants and the parent runs the method it already has (`removeSkill`). The child does not need to know how the list is stored. |
| 5 | **Events don't bubble.** A parent only hears its direct child, so a middle component passes events up one level. | Vue docs: component events do not bubble. StatCard relays RangeSlider; SpellCard relays ToggleButton; ConfirmModal relays AppModal's `closed`. |
| 6 | **Declare everything:** `props` with a type and `required` or `default`, plus an `emits` list. | Vue warns in the console when a required prop is missing or the wrong type, and the file documents itself. |
| 7 | **Data only one component uses lives in that component.** | The assignment's own example: "options for a select menu". So the variant tables, SkillCard's and SpellCard's menus, and the navbar's links live in their components. |
| 8 | **No searching the page and no globals.** Use `ref` + `$refs` instead of `document.querySelector` or `getElementById`, and `import` instead of globals. | The assignment forbids DOM manipulation. The Vue docs say refs are for the cases data cannot handle, like handing an element to a library such as Bootstrap. **There is no `document.querySelector` left anywhere in `src/`.** |

### What "DOM manipulation" means here

The test for any line of code: **could data plus the template do this job?**
If yes, doing it by hand breaks the rule.

- Old way: find an element, change it (`querySelector(...)` then `.classList.add(...)`).
- Vue way: change the data, and the template redraws itself.

The Vue docs (Template Refs) name the cases where touching an element *is*
right: *"programmatically focus an input on mount, or initialize a 3rd party
library on an element."* Bootstrap is a third-party library, so AppModal
handing its own element to `new Modal(...)` is that case, and so is ForgeView
asking its own tracker element (`this.$refs.tracker`) to scroll into view.

---

## 4. Atomic design, and when something becomes a component

Atomic design names five levels. This is where each piece of The Forge sits,
and the folders under `src/components/` follow it:

| Level | The test | In The Forge |
|---|---|---|
| **Atoms** | one control or element with a small job of its own, built from none of our components | **BudgetBadge** (the red / amber / blue "left" rule), **ToggleButton** (grey / purple / green), **FilterChip** (a filter with ✕). Bootstrap gives the plain atoms (a button, an input) |
| **Molecules** | a small unit with one job, built from atoms and other small pieces | RangeSlider, ActionMenu, AppCard, AppModal → ConfirmModal, PageContentHeader, StatCard, SkillCard, **SpellCard**, EntryRow, **AccordionPanel**, **StepNav**, **ChoiceGroup** |
| **Organisms** | a whole section of a page | **AppNavbar** (every page), **EntryPanel** (Buffs, Debuffs, Feats, Inventory) |
| **Templates / Pages** | the layout with real data | the four **views** in `src/views/` |

```
ForgeView (page)
├── EntryPanel (organism) ── EntryRow (molecule) ── ActionMenu (molecule)
├── AccordionPanel (molecule)
│     └── SpellCard (molecule) ── AppCard + ActionMenu + ToggleButton (atom)
├── StatCard (molecule) ── AppCard + RangeSlider
├── StepNav (molecule)
└── BudgetBadge (atom)
```

The teacher's feedback on 2.0 was that the molecules were good and the next
step was organisms. For 3.0 - SFC the put-off atoms were built too, so the
molecules could be made from real atoms (SpellCard is built on ToggleButton).

**The Gallery page (`/gallery`)** shows every component on its own with
sample props, in this order, with a "Last event" line that shows every emit
reaching the page. It's how each component was tested before the real pages
used it.

**The test for "should this be a component?"** It must pass at least one:

1. It is **used in 2 or more places**, or
2. it has **its own job or logic**.

The test cut four components that were planned early:

| Cut | Why |
|---|---|
| ForgeDropdownButton | Too narrow. Every dropdown in the app is one component (ActionMenu). |
| ForgeCard | Used once with no logic, once AppCard existed. |
| ForgeList | Just a grid and a `v-for`. The page can do that itself. |
| HeroBanner, PageContent | Single use, display only. |

**Props vs slots.** Both pass things into a component. The rule we use:

- **Props carry what every instance has,** always the same kind of thing in
  the same spot. Every card has a title, so `title` is a prop.
- **Slots carry what differs in shape.** One card holds a slider, another a
  menu, another a button. That goes through slots.

**Variants (looks).** The page picks a look by name (`variant="kebab"`); the
component keeps the Bootstrap classes for each look in its own `data`. **The
parent still decides layout and size.** That is why `class="d-grid"` sits on
the `<ActionMenu>` tag on the home page: making it full width is the page's call.

---

## 5. Component by component

Each one is a `.vue` file with three blocks: `<script>`, `<template>`, and
(when it has its own CSS) `<style scoped>`. Inside `<script>` the options
follow the teacher's `SampleComponent.js` order: `components`, `data`,
`props`, `emits`, `computed`, `methods`, lifecycle hooks.

The 3.0 components come first, then the ones built for 3.0 - SFC.

### RangeSlider (molecule) ✅ counts

**Job:** a slider with its label and value badge, as one piece. It is used for
Level, HP/MP/SP, all six stats, and every skill.

| Props | Type | Notes |
|---|---|---|
| `id` | String, required | Links the `<label for>` and `<output for>` to the input |
| `label` | String, required | Visible text, or screen-reader-only in the `card` look |
| `min`, `max` | Number, required | The track's range |
| `modelValue` | Number, required | The value. `v-model` on the tag fills it in |
| `cap` | Number, default `null` | The highest value allowed *right now*. `null` = no cap |
| `tooltip` | String, default `''` | Hover text on the label |
| `fillClass` | String, default `''` | Overrides the track colour (HP red, MP blue...) |
| `showMax` | Boolean, default `false` | The badge reads "12 / 50" instead of "12" |
| `variant` | String, required | `level`, `vital` or `card`, checked by a validator |

**Emits:** `update:modelValue`.

**Computed:**
- `look`: picks this slider's entry from the `variants` table.
- `fillPercent`: how far along the track the thumb sits, as a percentage.
  The Sass reads it from the CSS variable `--range-fill` to colour the filled
  part of the track.
  ```js
  const span = this.max - this.min;
  const filled = span === 0 ? 0 : (this.modelValue - this.min) / span * 100;
  return Math.round(filled) + '%';
  ```
  Line by line: `span` is the track length. If the track has no length (min
  equals max) the answer is 0, because dividing by zero would give `NaN`.
  Otherwise, find how far past `min` the value is, divide by the length, and
  times 100 for a percentage. Then round it and add `'%'`, so CSS gets `"55%"`.

**Methods:** `onInput(event)` runs on every drag.
- A slider hands back **text** (`"12"`), so `Number(...)` turns it into a number.
- If the value is past the `cap`, it is pulled back to the cap.
- Then the component emits the allowed value. It never assigns it.

**Why `:value` + `@input` and not `v-model` inside the template?** `v-model`
would assign to `modelValue`, which is a prop (rule 1). Splitting it lets the
slider *show* the parent's value and *ask* for a new one.

**Its CSS is in its own `<style scoped>`:** the filled-track mixin and the
five track colours (`.range-health` ... `.range-level`), the label widths and
the Level row. They style only this component, so nothing else can be
changed by them. The colours come from `$forge-colors` in `_tools.scss`.

**What to say:** "Every slider in the app is this one component. It doesn't
own the number. It shows it, works out the fill, refuses values past the cap,
and asks the parent to change it."

---

### ActionMenu (molecule) ✅ counts

**Job:** one dropdown for the whole app: the forge buttons on the home page,
every + and ⋮ menu on the forge, and the ⋮ on each roster card. (The only
dropdown left in plain HTML is the roster's creature-type filter, which shows
the current pick rather than a list of actions.)

| Props | Type | Notes |
|---|---|---|
| `items` | Array, required | Each item: `{ label, href?, icon?, danger? }`, plus any field the parent wants for itself |
| `label` | String, required | Button text, or what a screen reader says for the icon-only ⋮ |
| `variant` | String, default `'kebab'` | `button`, `kebab` or `add` (the + beside a heading), checked by a validator |
| `emptyText` | String, default `''` | shown when no item is a real choice ("Every category added") |

**Emits:** `select`, sending the whole item that was clicked.

**Six kinds of item** (3.0 added header, divider and note for the + menus;
3.0 - SFC added `to` for the router):

| The item has... | It draws | On click |
|---|---|---|
| `to` | a `<RouterLink>` | another page of this app, **no reload** (`{ name: 'forge' }`) |
| `href` | an `<a>` link | the browser goes there (the `#` placeholders) |
| a `label`, no `href` | a `<button>` | emits `select` with the item |
| `header` | a grey heading (`dropdown-header`) | nothing |
| `divider` | a line between groups | nothing |
| `note` | grey text that can't be clicked ("Nothing left here") | nothing |

The template picks one with a `v-if` / `v-else-if` / `v-else` chain, top to
bottom. `hasChoices` (computed) asks "does any item have a `label`?"; if not,
`emptyText` shows. Headers and dividers have no label to use as a `:key`, so
the key is the item's position: `v-for="(item, index) in items" :key="index"`.

**Building a + menu (`addMenu` in `helpers/menus.js`).** Every + menu is a
heading, then one choice per catalog entry. The catalog entry rides inside
each choice, so the click hands it back:
```js
export function addMenu(header, entries) {
    const choices = entries.map((entry) => ({ label: entry.name, entry: entry }));
    return [{ header: header }].concat(choices);
}
```
Used for categories, buffs, debuffs, items and each spell school. On the page,
`@select="addCategory($event.entry)"` unwraps it. Feats builds its own
(`featMenu`) because it has two groups, each with its own note.

**Menus that belong to one row (methods, not computed).** A skill category's
⋮ lists *that* category's skills, and a roster card's ⋮ has *that*
character's Edit link and lock wording. Computed can't take an argument, so
these are methods the template calls with the row: `skillCategoryMenu(category)`
on the forge and `cardMenu(character)` on the roster. Each item carries an `action` (`'remove'`,
`'lock'`, `'download'`, `'delete'`), and a matching `pickFrom...` method
reads it and calls the real method:
```js
pickFromCategory: function (category, item) {
    if (item.action === 'remove') {
        this.removeCategory(category);
    } else {
        this.addSkill(category, item.entry);
    }
},
```
A menu that never changes is a plain list in `data`: ForgeView's
`abilityMenu`, and the ⋮ inside SkillCard, SpellCard and EntryRow. To pin a ⋮
to a card's corner the page writes `<ActionMenu class="card-kebab" />`. A
class on a component tag lands on the component's outer element, so
ActionMenu doesn't need a prop for it.

**Its CSS (scoped):** `.btn-kebab` (the 44px touch target for ⋮ and +) and
`.add-skill-menu`. The dropdown colours stay app-wide in `app.scss`, because
the roster's plain creature filter uses them too.

**Why it sends the whole item and not just the label:** the parent can put
its own fields on an item (SkillCard adds `action: 'remove'`). ActionMenu
ignores fields it doesn't use and hands them back untouched. The menu doesn't
need to know what "Remove" means. Only the parent knows that.

**Why one menu and not one per page section:** the teacher warned about
near-duplicate components, and all 13 dropdowns have the same shape: a
button, a list, and items that are links or actions. The differences are looks
(variants) and extras (icon, danger), which are data, not new components.

**What to say:** "The menu shows choices and reports which one was picked.
It never decides what a choice does. The emit is what makes it more than a
display piece."

---

### AppCard (molecule), display only

**Job:** the card frame every card in the app uses.

| Props | Notes |
|---|---|
| `title` (required), `description`, `image`, `imageAlt` | What every card has |

| Slots | Where it shows |
|---|---|
| default | the card body, under the description |
| `#footer` | its own strip at the bottom (the home page's forge button) |
| `#menu` | the top-right corner (SkillCard's ⋮) |

**Design calls:**
- **One look.** It started with two looks (`feature` and `tile`); the tile
  look won for the whole app, so the variant table was removed. A lookup table
  with one entry is code with no job. It comes back if a second look ever does.
- **The title is always an `<h3>` with the class `h5`.** The tag is for the
  page outline (screen readers jump between headings by level). The class only
  sets the size. Bootstrap's `.h1`–`.h6` classes make any element *look* like
  that heading size.
- **`v-if="$slots.menu"`** draws the corner only if the page filled it, and
  **`:class="{ 'pe-5': $slots.menu }"`** pads the title only then, so long
  names don't run under the ⋮.
- `description` is a **prop**, not a slot: every card has one (props vs slots
  rule).

**Lesson learned:** if a page fills a slot the component doesn't have, Vue
**silently throws the content away**. When the ⋮ went missing, the cause was
AppCard missing its `<slot name="menu">`.

---

### StatCard (molecule) ✅ counts

**Job:** one attribute on the Stats step, plus the rule *you can't spend
points you don't have*.

| Props | Notes |
|---|---|
| `stat` (Object, required) | id, label, description, min, max. Read only |
| `modelValue` (Number, required) | the stat's value, filled by `v-model` |
| `pointsLeft` (Number, required) | what's left in the shared pool |

**Emits:** `update:modelValue`.

**Computed, `affordableMax`** (moved here from app.js):
```js
return Math.min(this.stat.max, this.modelValue + this.pointsLeft);
```
The highest this stat can go is whichever comes first: its own ceiling, or
what it has now plus what's left in the pool.

In app.js it was a **method** taking `(stat)`, because one function served
six cards. Inside the component the stat is already a prop, so it needs no
argument. That means it can be a **computed**, which Vue caches until
`modelValue` or `pointsLeft` changes.

**The relay (rule 5):**
```vue
<RangeSlider ... :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)" />
```
StatCard cannot write `v-model="modelValue"` here, because that assigns to
its own prop. So it splits `v-model` into its two halves by hand: pass the
value down, pass the change up. `$event` is what RangeSlider sent.

**Why the pool total stays in ForgeView:** `statPointsLeft` adds up all six
stats. No single card can see the other five, so the page, which owns all
six, works it out and passes it to each card.

---

### SkillCard (molecule) ✅ counts

**Job:** one skill the character has: its card, slider and ⋮ menu.

| | |
|---|---|
| **Props** | `skill` (Object, required), `modelValue` (Number, required) |
| **Emits** | `update:modelValue` (slider moved), `remove` (Remove picked) |
| **Data** | `menuItems`: Edit (a link) and Remove (a button, red, trash icon) |
| **Computed** | `menuLabel`: `'Actions for ' + skill.name`, for screen readers |
| **Methods** | `onSelect(item)`: if `item.action === 'remove'`, emit `remove` |

**Who knows what:**
- ActionMenu doesn't know what "remove" means.
- SkillCard doesn't know which **category** it is in, or how to take a skill
  out of a list.
- The page knows both. It is already inside the category loop:
  ```vue
  <SkillCard :skill="skill" v-model="skill.value" @remove="removeSkill(category, skill)" />
  ```

That is why `remove` carries no data. The page fills in `category` and
`skill` itself.

**Why the items have an `action` field:** matching on the label
(`item.label === 'Remove'`) would break if the wording changed. `action` is
an ID that only code reads.

---

### AppModal (molecule) ✅ counts

**Job:** the Bootstrap modal shell (header, body, footer). It owns the
Bootstrap `Modal` object for its own element.

| | |
|---|---|
| **Props** | `id` (String, required, given by the page), `title` (String, required) |
| **Emits** | `closed`: the modal has **finished** closing (the slide is over) |
| **Data** | `bsModal` (the Bootstrap object), `closing` (true while closing) |
| **Computed** | `titleId`: `id + 'Label'`, so `aria-labelledby` points at the heading |
| **Methods** | `open()`, `close()` (for parents to call through a ref), `onShow()`, `onHide()`, `onHidden()` |
| **Lifecycle** | `mounted`: create the Bootstrap object and start listening. `beforeUnmount`: stop listening and `dispose()` |

**Bootstrap by import (the teacher's option 3):** `import { Modal } from 'bootstrap'`
at the top, then `new Modal(this.$refs.modal)`. Only the Modal part is
brought in, and there is no `bootstrap` global any more.

**Why `closed` exists:** the forge's leave pop-up must not move to another
page while it is still sliding shut. If the forge went away mid-slide,
Bootstrap would never finish its clean-up, and the next page would stay
**unscrollable** (Bootstrap locks scrolling while a modal is open). So
AppModal listens for Bootstrap's `hidden.bs.modal` and emits `closed`, and
the forge leaves only then.

**Refs instead of IDs.** `ref="modal"` on the outer `<div>` means
`this.$refs.modal` *is* that element, this component's own and nobody
else's. There is no searching the page.

**Lifecycle hooks.** `mounted` runs once the element exists, so that is when
Bootstrap can be given it. `beforeUnmount` runs just before it is removed, so
that is when we clean up. Creating something in `mounted` and disposing of it
in `beforeUnmount` is the pattern the tooltip bug fix will use too.

**The focus fix, and why `inert`.** When a modal closes, Bootstrap hides it
from screen readers (`aria-hidden`) while the clicked button still has focus.
Chrome warns about that, and Bootstrap 5.3.8 still has the bug (we tested
it). Chrome's warning itself suggests the `inert` attribute, which makes the
browser drop focus from inside an element. So:

```
Bootstrap starts closing → onHide sets closing = true      (data)
Vue redraws              → :inert="closing" adds inert     (template)
browser                  → drops focus from inside
Bootstrap (300ms later)  → adds aria-hidden: nothing is focused, no warning
```

`onShow` sets it back to `false` so the buttons work the next time it opens.
No code reaches for the focused element. The template does the work from
data. The timing works because the `fade` class makes Bootstrap wait about
300ms, while Vue redraws almost instantly.

**Why `addEventListener` here:** Vue's `@` can't listen for
`hide.bs.modal`, because Vue reads the dots as modifiers (like
`@click.prevent`). So AppModal listens on its **own** element through its ref,
the third-party-library case from the Vue docs. See [section 10](#10-honest-exceptions).

**Why the ID comes from the page:** Bootstrap links like
`data-bs-target="#leavePageModal"` find a modal by ID, so HTML needs one. The
rule is: never hard-code an ID inside a component's template; let the page
supply it as data.

---

### ConfirmModal (molecule, built on AppModal) ✅ counts

**Job:** "Are you sure?" Cancel always just closes; Confirm either goes
somewhere (`href`) or emits `confirm`. It also relays AppModal's `closed`.

| Props | Notes |
|---|---|
| `id`, `title`, `confirmLabel` | required |
| `message` | the body text, unless the page fills the slot |
| `cancelLabel` | default `'Cancel'` |
| `danger` | Boolean: a red confirm button for things you can't undo |
| `href` | if set, confirm is a link; if not, confirm is an event |

**Emits:** `confirm`, and `closed` (relayed from AppModal, rule 5).

**Methods:** `open()` passes straight through to AppModal. `confirm()` closes
the modal, then emits. The page never needs to know AppModal exists.

**Slot fallback content:**
```html
<slot>{{ message }}</slot>
```
This means "show what the page put here, **or** the message if it put
nothing." The save modal uses the message. The roster's delete modal fills
the slot with the character's name in bold, because a plain-text prop can't
carry bold text.

**Three modals, one component:**

| Modal | Page | How confirm works |
|---|---|---|
| Save | ForgeView | emits `confirm` → `saveCharacter` |
| Leave | ForgeView | `@confirm` says yes (`leaveApproved = true`); `@closed` then moves to the page the player asked for (`finishLeave`). One modal for every way out, the browser's Back button included (walkthrough E) |
| Delete | RosterView | `danger` + the slot for the bold name. Emits `confirm` → `confirmDelete` |

`href` is still supported (Confirm as a plain link), but nothing uses it now:
inside one app, leaving is the router's job.

Converting the leave and delete modals also fixed the Chrome `aria-hidden`
focus warning on them (bug from class), because they now get AppModal's
`inert` fix for free.

**Two layers of refs.** The page calls `this.$refs.saveModal.open()` on its
ConfirmModal, and ConfirmModal calls `this.$refs.modal.open()` on its
AppModal. Each layer only talks to the one directly below it.

**The text lives in data** (no paragraphs in page markup):
```js
saveConfirm: {
    id: 'confirmSaveModal',
    title: 'Save This Character?',
    message: 'This will save the character and start a new blank form.',
    confirmLabel: 'Save Character',
    cancelLabel: 'Keep Editing',
},
```
and the page hands the whole object over at once:
```vue
<ConfirmModal ref="saveModal" v-bind="saveConfirm" @confirm="saveCharacter" />
```

---

### v-tooltip (a custom directive, not a component)

**Job:** give any element a Bootstrap tooltip that is created when the
element appears, updated when its text changes, and **removed when the element
is removed**.

```html
<li ... v-tooltip="effect.description">
<i ... v-tooltip="'Locked for comparison'"></i>   <!-- fixed text: quotes inside quotes -->
```

**The bug it fixes (from class presentations).** The old code
(`startTooltips`) ran `document.querySelectorAll('[data-bs-toggle="tooltip"]')`
on load and after **every** redraw, and never cleaned anything up. Bootstrap
draws a tooltip's box at the end of `<body>`, not inside the element, so when
a buff was removed while its tooltip was showing, Vue deleted the row and the
box stayed on screen. A second bug had the same cause: Bootstrap keeps the text
it was created with, so the ability and spell "Learn" tooltips showed outdated
text after you learned something.

**Why a directive and not a component.** The Vue docs: custom directives are
*"mainly intended for reusing logic that involves low-level DOM access on
plain elements."* The tooltips sit on plain elements (list rows, labels,
buttons). Wrapping each one in a component just to clean up a tooltip would be
heavy. A directive is a set of lifecycle hooks you can attach to any element.
You already use Vue's built-in ones: `v-if`, `v-for`, `v-model`.

| Hook | When Vue runs it | What it does |
|---|---|---|
| `mounted(el, binding)` | the element just appeared | `new Tooltip(el, { title: binding.value })`. No text, no tooltip. |
| `updated(el, binding)` | the page redrew | if `binding.value !== binding.oldValue`, put the new text in with `setContent` |
| `beforeUnmount(el)` | the element is about to be removed | `dispose()`, which takes the tooltip box off the page |

- **`el` is the element itself**, handed over by Vue, the same idea as a ref.
  Nothing searches the page.
- **`binding.value`** is whatever is in the quotes; **`binding.oldValue`**
  is what it was before the redraw.
- **`Tooltip.getInstance(el)`** asks Bootstrap whether it has a tooltip for
  *this* element. It looks the element up in Bootstrap's own list, not on the
  page. `Tooltip` comes from `import { Tooltip } from 'bootstrap'` at the top
  of `tooltip.js` (the teacher's option 3).

It's the same create/clean-up pattern as AppModal (`mounted` +
`beforeUnmount`), packaged so any element can use it. It doesn't count as a
component, but it is reuse: one file replaced every tooltip setup in the app.

---

### PageContentHeader (molecule), display only

**Job:** the big heading block (title over a description). It is used on the
home page only for now. It was kept because future landing pages will reuse
it. It is honestly display-only, so it doesn't count toward the five. Its
`.page-heading` and `.lead` spacing are in its own scoped style.

### EntryRow (molecule) ✅ counts

**Job:** one row in a list: a buff, a feat, an item. Name, badges, the ⋮ menu
(Edit / Remove) and the hover tooltip.

| | |
|---|---|
| **Props** | `entry` (Object, required: name, description), `badges` (Array of `{ tag, badgeClass }`, default `[]`) |
| **Emits** | `remove` (no data; the panel knows which row) |
| **Data** | `menuItems`: Edit (link) and Remove (button, red), with `action`, like SkillCard |
| **Slot** | default: extras before the ⋮ (inventory's quantity box) |
| **Directive** | `v-tooltip="entry.description"` on the row |

**An Array default must be a function:**
```js
badges: { type: Array, default: function () { return []; } },
```
Same reason `data` is a function: every row needs its own empty list, not one
list shared by all of them.

**Why `tag` / `badgeClass`:** the page's `featKinds` and `featSources` were
already written in that shape, so `featBadges` just returns two of them.

---

### EntryPanel (organism) ✅ counts

**Job:** a heading with a count and a + menu over a list of EntryRows. Used
**4 times**: Buffs, Debuffs (one `v-for` over `effectGroups`), Feats, Inventory.
It replaced about 250 lines of hand-written markup.

| Props | Notes |
|---|---|
| `title`, `entries`, `addItems`, `addLabel`, `emptyText` | required |
| `addEmptyText` | the + menu's "nothing left" (default `'Nothing left to add'`; Feats passes `""` because each group has its own note) |
| `countClass` | a count pill beside the title; `''` = no count |
| `badgesFor` | **a function**: given an entry, returns its badges |
| `variant` | `compact` (small heading, in the Vitals card) or `card` (a card's title) |

**The `scroll` prop is gone (class feedback).** Feats used to scroll inside a
16rem box. Now the Feats section is an AccordionPanel that collapses like
every other section, so EntryPanel's list simply grows. The prop and its
`.feat-list` CSS were deleted.

**Emits:** `add` (the catalog entry picked from the +), `remove` (the entry,
relayed from EntryRow, rule 5).

**Slots:** default = between the heading and the list (the feat counter);
`#extra` = a **scoped slot** inside every row (inventory's quantity box).

**Passing a function as a prop.** Each panel's badges differ, so the page
hands over the function that works them out:
```vue
<EntryPanel ... :badges-for="effectBadges" />     <!-- no () -->
```
```vue
<EntryRow ... :badges="badgesFor(entry)">         <!-- the panel calls it -->
```
No parentheses on the page means "here is the function," not "call it now."
It's still props down: the page decides, the panel only calls it. Vue methods
always keep their `this`, so passing one around is safe.

**The relay adds the entry:**
```vue
<EntryRow v-for="entry in entries" ... @remove="$emit('remove', entry)">
```
The row says "remove me" with no data. The panel is inside the `v-for`, so it
knows which entry, adds it, and passes it up. The page's
`@remove="removeFeat"` gets the feat.

**The scoped slot (inventory).** A normal slot can't know which row it's in.
A scoped slot hands the row's data back to the page:
```html
<!-- EntryPanel, inside each row -->
<slot name="extra" :entry="entry"></slot>

<!-- the page -->
<template #extra="{ entry }">
    <input type="number" ... v-model.number="entry.qty" />
</template>
```
`{ entry }` unpacks what the slot sends. Inside, `entry` is *this row's* item.
`v-model` on `entry.qty` doesn't break the props rule: slot content is the
page's own markup, and `entry` is the page's own inventory item. The panel
and the row never touch `qty`. For the same reason, the box's
`.item-qty-input` width is in **ForgeView's** scoped style, not EntryPanel's:
slot content belongs to the page that writes it.

**What to say:** "Four lists had the same heading, + menu, rows and empty
text. Now they're one organism. The page gives it the list, the menu and a
function for the badges; it reports add and remove. The quantity box goes in
through a scoped slot, so only Inventory has it."

---

### AppNavbar (organism) ✅ counts

**Job:** the navbar on every page: the top bar on large screens and the
bottom bar on phones, drawn from one list of links. `App.vue` draws it once
for the whole app. In 3.0 it replaced 6 hand-written `<nav>` blocks.

| | |
|---|---|
| **Data** | `links`: `{ id, label, shortLabel, to, icon }` for each page. Only the navbar uses them (rule 7) |
| **Props / emits** | none any more (see below) |
| **CSS (scoped)** | the top bar's min-height and the phone bar's size. The phone bar's height lives in `_tools.scss`, because `app.scss` pads the bottom of the page by the same amount |

**Router links.** Each link is a `<RouterLink :to="link.to">`, not an
`<a href>`, so changing page doesn't reload the app. `active-class="active"`
gives the current page Bootstrap's highlight, and RouterLink adds
`aria-current="page"` by itself.

**What the router made unnecessary (sourcemaking: Remove Parameter):**

| Gone | Was for | Now |
|---|---|---|
| `active` prop | the page telling the navbar where it was | the router knows; RouterLink marks the link |
| `onClick` | stopping a click on the page you're on | RouterLink does nothing on a click to where you already are |
| `guard` prop + `leave` emit | the forge's "are you sure?" | moved into the forge as `beforeRouteLeave`, which also catches the browser's Back button (walkthrough E) |

**Two bars, one list.** Both bars loop over the same `links`. The top bar
shows `label` ("Forge Character") and the phone bar shows `shortLabel` and
`icon` ("Create" with a hammer). Add a page once, and both bars get it.

**Two root elements.** The template has two `<nav>` tags side by side.
Vue 3 allows that; Vue 2 needed one wrapper around everything.

**What to say:** "One navbar for every page. The router knows which page is
showing, so the navbar doesn't need to be told, and leaving the forge is the
forge's own question, not the navbar's."

---

### BudgetBadge (atom) ✅ counts

**Job:** the "how much is left" badge: stat points, feat slots, spells known.
It owns one rule: **red** below 0, **amber** at exactly 0, **blue** above.

| | |
|---|---|
| **Props** | `left` (Number, required): what is unspent. Below 0 = over budget |
| **Computed** | `budgetClass`: three outcomes need an `if`, which a template can't hold |
| **Slot** | the badge's text; empty = it shows `left` (fallback content) |

```vue
<BudgetBadge :left="statPointsLeft" />                                    <!-- "12" -->
<BudgetBadge :left="featsLeft">{{ feats.length }} / {{ featAllowance }}</BudgetBadge>
```
**Why an atom with logic:** that rule was written out **three times** in
`app.js` (`statPointsBadge`, `featsBadgeClass`, `spellsBadgeClass`, identical
code). Now the three can't disagree (Duplicate Code → Extract Class). The page
still works out `left`, because it owns the numbers.

---

### ToggleButton (atom) ✅ counts

**Job:** a checkbox drawn as a button: each ability's toggle and each spell's
Learn button. **Grey** = can't take it, **purple** = can, **green** = have it.

| | |
|---|---|
| **Props** | `id` (links the label to its checkbox), `checked`, `disabled`, `tooltip`, `small` |
| **Emits** | `toggle`: the player clicked it |
| **Slot** | the button's text |
| **CSS (scoped)** | `.toggle-button` and its three states (was `.ability-toggle` in `forge.scss`; the spells used it too, so "ability" was the wrong word) |

**Why `toggle` and not `v-model`:** the page's "is it on?" is worked out from
a list (`learnedAbilities.includes(...)`), so there is no single field for
`v-model` to write to. The page runs its own `toggleAbility` / `toggleSpell`,
which may refuse (requirements not met, spellbook full).

**One `<span>` around the checkbox and label,** so a class the page puts on
`<ToggleButton>` (SpellCard's `align-self-start`) has one element to land on.
`.btn-check:disabled + .toggle-button` still works scoped, because both
elements are in this one template.

---

### FilterChip (atom) ✅ counts

**Job:** a grey pill showing one active filter, with a ✕ to clear it: the
roster's "Name contains ..." and "Type: NPCs".

| | |
|---|---|
| **Props** | `clearLabel`: what a screen reader says for the ✕ |
| **Emits** | `clear` |
| **Slot** | the chip's text |

The page decides what clearing means: `@clear="searchTerm = ''"`. It uses
`role="status"` (announced politely), where the old pills used `role="alert"`
(which interrupts).

---

### SpellCard (molecule) ✅ counts

**Job:** one spell the character carries: its card, level and cost badges,
⋮ menu and Learn button. Built **like SkillCard**: AppCard is the frame and
the pieces go in its slots (composition, not inheritance).

```
SpellCard
├── AppCard       the frame
│   ├── #menu  →  ActionMenu      Edit / Remove
│   └── slot   →  badges + description + ToggleButton (Learn)
```

| | |
|---|---|
| **Props** | `spell` (Object, required), `learned` (Boolean), `bookFull` (Boolean: the page counts, because only the page sees every spell) |
| **Emits** | `toggle` (relayed from ToggleButton), `remove` |
| **Data** | `menuItems`: Edit and Remove (was `spellMenu` in app.js) |
| **Computed** | `levelLabel` ("Cantrip" / "Level 2"), `costLabel`, `toggleId`, `canToggle`, `learnTitle` (the three tooltip texts) |

**Seven methods left app.js with it:** `spellMenu`, `pickFromSpell`,
`spellLevelLabel`, `spellCostLabel`, `canLearnSpell`, `spellLearnTitle` and
`spellDomId`. Each one took a spell and worked something out for one card.
Inside the card the spell is already a prop, so they became computed (the
same move as StatCard's `affordableMax`). The level and cost wording lives in
`helpers/labels.js`, because the roster's spellbook shows it too.

---

### AccordionPanel (molecule) ✅ counts

**Job:** one collapsing section: a header button, an optional menu beside it,
and a body that opens and closes. Used for **Skills** (one per category),
**Abilities**, **Spells** (one per school) and **Feats**.

| | |
|---|---|
| **Props** | `id` (a base unique on the page, e.g. `'skill-' + category.id`), `title` |
| **Computed** | `panelId` (`id + '-panel'`), `panelTarget` (`'#' + panelId`) |
| **Slots** | `#menu` (beside the header), default (the body) |
| **CSS (scoped)** | the header font size, the chevron moved to the left, the header row that takes the button's colours, the keyboard focus ring around the whole row |

**Why the page still passes an id:** Bootstrap's collapse finds the body by
id (`data-bs-target`), so one must exist, and only the page knows what makes
each panel unique. The component builds the rest. That replaced **six**
methods in app.js: `panelId/Target`, `abilityPanelId/Target` and
`spellPanelId/Target`.

**The Feats fix (class feedback).** Feats used to be a card whose list
scrolled inside a 16rem box, unlike everything else in the app. Now it is an
AccordionPanel: the counter, then "Current Feats" with its +, then the list,
and the whole section collapses like Skills or Spells.

**Why the `.accordion` wrapper stays on the page:** several panels share one
wrapper, so the group is the page's layout, not one panel's.

---

### StepNav (molecule) ✅ counts

**Job:** the Back / Save bar at the bottom of every forge step. 6 copies → 1.

| | |
|---|---|
| **Props** | `saveLabel` (required: "Save Stats", "Finish"), `first` (step 1: Back is off), `saveDisabled` |
| **Emits** | `back` |
| **CSS (scoped)** | `.card-navigation` and the button sizes (smaller below 576px so labels stay on one line) |

**Why Save has no emit:** it stays a real `type="submit"` button. A button
inside a component is still a button inside the form, so the form's own
`@submit.prevent="nextStep"` runs, and the browser checks required fields first.

```vue
<StepNav save-label="Save Info" first :save-disabled="!infoComplete" />
<StepNav save-label="Save Stats" @back="goBack" />
```

---

### ChoiceGroup (molecule) ✅ counts

**Job:** a row of buttons where exactly one is picked: the roster's
Character Type filter and Sort By.

| | |
|---|---|
| **Props** | `modelValue` (the picked id, filled by `v-model`), `options` (`[{ id, label }]`), `name` (groups the radios, and builds each id), `label` (for screen readers) |
| **Emits** | `update:modelValue` (rule 3) |

Inside, each radio uses `:checked` + `@change`, not `v-model`: `v-model` there
would assign to the component's own prop (rule 1). The parent's `v-model`
does the assigning, the same split as RangeSlider.

```vue
<ChoiceGroup name="rosterSort" label="Sort the roster" :options="sorts" v-model="sort" />
```

---

## 6. Following the data: walkthroughs

### A. Dragging Strength from 10 to 12

```
1. RangeSlider   onInput: "12" → Number → 12. Under the cap? Yes.
                 $emit('update:modelValue', 12)
2. StatCard      @update:model-value hears it and relays:
                 $emit('update:modelValue', 12)
3. ForgeView     v-model="stat.value" → stat.value = 12   (the ONLY assignment)
4. ForgeView     statPointsLeft recomputes (the pool shrinks by 2)
5. back down     StatCard gets modelValue 12 and a new pointsLeft
                 → affordableMax recomputes
                 RangeSlider gets modelValue 12 → fillPercent recomputes,
                 badge shows 12
```
Every card's `affordableMax` updates too, because every card gets the new
`pointsLeft`. That is how one card's spending limits the others without them
ever talking to each other.

### B. Removing a skill

```
1. ActionMenu   Remove is a button item → $emit('select', item)
2. SkillCard    onSelect(item): item.action === 'remove' → $emit('remove')
3. ForgeView    @remove="removeSkill(category, skill)"
4. ForgeView    removeSkill → removeFrom(category.skills, skill)  (helpers/lists.js)
5. back down    v-for redraws; that SkillCard is gone. The skill reappears in
                the category's "Add a skill" menu because availableSkills
                recomputes.
```

### C. Finish → Save

```
1. StepNav     Finish is a submit button → the form's @submit runs nextStep()
2. ForgeView   last step? → this.$refs.saveModal.open()
3. ConfirmModal open() → this.$refs.modal.open()
4. AppModal    open() → this.bsModal.show()   (Bootstrap animates it in)
5. user        clicks Save Character
6. ConfirmModal confirm() → closes, $emit('confirm')
7. ForgeView   @confirm="saveCharacter" → storeCharacter (storage.js), resets the form
```
Notice the shape: **refs go down** (a parent asks a child to do something,
like open), and **events go up** (a child tells a parent something happened).

### D. Saving: a new character vs. an edit (the ID system)

```
NEW CHARACTER                         EDIT FROM THE ROSTER
editingId = null                      ?id=3 in the address bar
                                      loadCharacter(this.$route.query.id): Number("3") → 3
                                      applyCharacter(found), editingId = 3
collectCharacter → id: null           collectCharacter → id: 3
storeCharacter (helpers/storage.js):  storeCharacter:
  id is null → takeNextId() → 14        id is 3 → keep it
  findIndex(14) → not found → push      findIndex(3) → found → replace in place
returns 14 → "Saved (#14)"            returns 3 → "Saved (#3)"
```
Then `saveCharacter` puts `blankCharacter` back on the form, so the next
character starts empty. After an **edit** it also clears `?id=3` from the
address (`this.$router.replace({ name: 'forge' })`), so a refresh doesn't load
the old character into the new form.

**Why this fixed the duplicate bug:** the old ID was *built from* the name
and User ID. Rename a character and its ID changed, so the save couldn't find
the original and added a second copy. Now the ID is a number that has nothing
to do with the name, so a rename can't lose it.

**The counter (`takeNextId`).** The next number lives in local storage under
`theForgeNextId`, **apart from the roster**. Each new save takes it and adds 1.
Why apart: if the next ID were "the highest on the roster + 1", deleting the
newest character would hand its number out again, and an old Edit link, a
downloaded file, or the locked list would then point at the wrong character.
A counter that only goes up never gives a number out twice.

**Text vs. numbers.** Storage and the address bar only hold text, so the
number is converted on the way in (`Number(...)`) and the way out
(`String(...)`). `3 === "3"` is false, which is exactly why Edit stopped
working until the load converted it.

**The blank form (`blankCharacter`).** The first line of `mounted` takes a
copy of the form with `collectCharacter()` before anything is loaded. At that
moment the form only holds `data()`'s starting values. A save puts that copy
back. The starting values are written once (in `data()`), so a new field can't
be forgotten in the reset.

### E. Leaving the forge (the router asks first)

```
1. user         clicks "Roster" in the navbar (or a Home link, or Back)
2. router       before leaving, asks ForgeView: beforeRouteLeave(to)
3. ForgeView    guardLeave(to): not approved yet →
                leaveTo = '/roster', open the leave pop-up, return false
4. router       false = stay. The address doesn't change.
5. user         clicks Leave
6. ConfirmModal $emit('confirm') → @confirm="leaveApproved = true"
7. AppModal     Bootstrap finishes sliding it shut → $emit('closed')
8. ConfirmModal relays it → @closed="finishLeave"
9. ForgeView    leaveApproved? yes → this.$router.push('/roster')
10. router      asks again; guardLeave sees the yes, resets it, returns true → goes
```
**Cancel** closes the pop-up too, so `closed` still fires, but `leaveApproved`
is false and nothing happens.

**Why it waits for `closed`:** moving at step 6 would take the forge (and its
pop-up) off the screen mid-slide. Bootstrap would never finish its clean-up,
and the next page would stay unscrollable.

**The same page, a new address** (`/forge?id=3` → `/forge`, the navbar's
Forge link while editing) doesn't leave the forge, so the router calls
`beforeRouteUpdate` instead. It asks the same question, and on a yes it loads
what the new address wants (a blank form).

**Why this is better than the 3.0 navbar guard:** the router asks before
*any* move, so the browser's **Back** button is caught too. The old guard only
caught clicks on the navbar's own links. These hooks are Options API: they sit
in `export default { ... }` next to `mounted`.

---

## 7. Syntax reference: the template (HTML side)

### The colon `:`: "this is JavaScript, not text"

```html
variant="card"         the text "card"
:min="stat.min"        the value of stat.min (a number, from JavaScript)
:cap="affordableMax"   the value of the computed affordableMax
```
Without the colon, Vue passes the exact characters as a string. With it, Vue
runs what's in the quotes as JavaScript. `:min="1"` gives the **number** 1,
while `min="1"` gives the **text** "1", and the `Number` prop type would warn.
`:` is short for `v-bind:`.

**A boolean prop with no value means `true`:**
```html
<RangeSlider ... show-max />   showMax is true
```

**Binding to `null` removes the attribute:**
```html
:title="tooltip || null"
```
If `tooltip` is empty, `||` falls through to `null` and the `title` attribute
isn't drawn at all, instead of an empty `title=""`.

### The at sign `@`: "when this happens, run this"

```html
@input="onInput"                                   call the method
@remove="removeSkill(category, skill)"             call it with arguments
@update:model-value="$emit('update:modelValue', $event)"   relay an event
```
`@` is short for `v-on:`. On a normal element it hears browser events
(`click`, `input`). On a component tag it hears that component's emits.
**`$event`** is the thing that came with the event: the browser event object,
or the value a component emitted.

### `v-model`: two-way binding, built from one prop and one event

On a component, this:
```html
<StatCard v-model="stat.value" />
```
is shorthand for:
```html
<StatCard :model-value="stat.value"
    @update:model-value="newValue => stat.value = newValue" />
```
So the parent still does the assignment, and props-down/events-up still
holds. **`v-model` must point at real data** (`stat.value`,
`vitals[bar.id]`), never at a computed copy. Assigning to a computed copy
changes nothing.

### `{{ }}`: print a value as text

```html
<h3 class="card-title h5">{{ title }}</h3>
```
Vue prints it as text, never as HTML, so it is safe from injected markup.

### `v-if` / `v-else`: draw it or don't

```html
<a v-if="item.href" ...>...</a>
<button v-else ...>...</button>
```
If the condition is false, the element **is not on the page at all**. That is
different from `v-show`, which draws it and hides it with CSS. The forge steps
use `v-show` so each step keeps what you typed while hidden.

### `v-for` + `:key`: one per item

```html
<div class="col" v-for="stat in stats" :key="stat.id">
```
`:key` gives each copy an identity. When a skill is removed, Vue removes
*that* card instead of shuffling values between the cards that are left. Use
something unique and stable, like an ID.

### `:class`: three forms

```html
class="card h-100"                       always these
:class="look.rowClass"                   a string from data
:class="{ 'text-danger': item.danger }"  "add text-danger IF item.danger is true"
```
A plain `class` and a bound `:class` on the same tag are **merged**. The
fixed classes stay, and the bound ones are added. In the object form, the key
is the class name and the value switches it on or off.

### `:style` with a CSS variable

```html
:style="{ '--range-fill': fillPercent }"
```
This sets a CSS custom property on the element. The Sass reads
`var(--range-fill)` to paint the track. JavaScript supplies the number, and CSS
does the drawing.

### Slots

| In the component | On the page | Meaning |
|---|---|---|
| `<slot></slot>` | content between the tags | the default hole |
| `<slot name="menu"></slot>` | `<template #menu> ... </template>` | a named hole |
| `<slot>{{ message }}</slot>` | (nothing) | **fallback**: shown when the page fills nothing |
| `v-if="$slots.footer"` | | "did the page fill this slot?" |

`#menu` is short for `v-slot:menu`. **Slot content is built where it is
written** (on the page or in the parent), so it can use the parent's data. The
component only decides *where* it goes.

**Scoped slots: the component hands data back to the slot.**

| In the component | On the page | Meaning |
|---|---|---|
| `<slot name="extra" :entry="entry"></slot>` | `<template #extra="{ entry }">` | the slot sends `entry`; the page unpacks it with `{ }` |

Used when the slot sits inside a `v-for` and the page needs to know which
item this copy is for (EntryPanel's quantity box).

### `ref` and `$refs`

```html
<div ref="modal" ...>                       on an element: $refs.modal is the element
<ConfirmModal ref="saveModal" ... />       on a component: $refs.saveModal is the component
```
A ref on a component gives you the component, so you can call its methods:
`this.$refs.saveModal.open()`. Refs replace `getElementById`. A component
only ever sees its own refs.

### `v-bind="object"`: many props at once

```html
<ConfirmModal v-bind="saveConfirm" />
```
Each key of `saveConfirm` lands on the prop with the same name. It's the same
as writing `:id="saveConfirm.id" :title="saveConfirm.title" ...` five times.

### `$emit`, `$slots`, `$refs`, `$event`

The `$` marks things Vue provides on every component:

| | What it is |
|---|---|
| `$emit('name', value)` | send an event to the parent |
| `$slots` | which slots the parent filled |
| `$refs` | this component's ref'd elements and child components |
| `$event` | (in a template handler) what came with the event |

### Custom directives: `v-tooltip`

```html
<li v-tooltip="effect.description">
```
A `v-` attribute we wrote ourselves. Like `:`, what's in the quotes is
**JavaScript**, so fixed text needs its own quotes inside:
`v-tooltip="'Locked for comparison'"`. Without the inner `'...'`, Vue would
look for a variable named `Locked`. Registered in `directives: { tooltip: vTooltip }`;
Vue adds the `v-` itself. See [v-tooltip in section 5](#v-tooltip-a-custom-directive-not-a-component).

### Inside a `.vue` file: the three blocks, and why the old in-DOM rules are gone

```vue
<script>
export default { props: { ... }, computed: { ... } };   // the component object
</script>

<template>
    <AppCard :title="skill.name">                        <!-- the HTML -->
        <RangeSlider ... />
    </AppCard>
</template>

<style scoped lang="scss">
.card-kebab { ... }                                      /* this component's own CSS */
</style>
```

**Vite compiles every `.vue` file before the browser sees it.** In 3.0 the
page HTML lived in `.html` files, and the **browser** read it first, so it
had to follow the in-DOM rules: kebab-case tags (`<stat-card>`) and explicit
closing tags. Those rules no longer apply. Inside a `.vue` template the Vue
style guide's choice is used:

- **PascalCase component tags**, so a component never looks like plain HTML:
  `<StatCard>`, `<RouterLink>`.
- **Self-closing** when there is nothing inside: `<StatCard ... />`.
- Props and events stay **kebab-case** on the tag (`:points-left`,
  `@update:model-value`). Vue matches them to `pointsLeft` and
  `update:modelValue` in JavaScript.

**`<style scoped>`.** Vite stamps every element in the template with an
attribute like `data-v-7ba5bd90`, and rewrites each rule to match it:
`.range-health` becomes `.range-health[data-v-7ba5bd90]`. So the CSS can only
touch this component's own HTML. Two details:

- A class the parent puts on a component tag lands on the component's outer
  element, and the parent's scoped rules reach that one element too.
- **Slot content belongs to the page that writes it.** ForgeView's
  `.item-qty-input` styles the quantity box it puts in EntryPanel's `#extra`
  slot, from ForgeView's own scoped style.

**`lang="scss"`** lets the block use Sass, and its first line pulls in the
shared variables and mixins: `@use "@/sass/tools" as *;`. `_tools.scss` makes
**no CSS** of its own (only variables, functions and mixins), so pulling it
into 20 components doesn't repeat any CSS 20 times.

**What stays app-wide in `app.scss`:** Bootstrap with our overrides, and the
rules many components share or that no component owns: the `.card` look, the
dropdown colours (the roster's plain creature filter uses them too),
`.card-kebab` (pages put it on ActionMenu), badge spacing, and the padding
under the phone navbar (`<body>` is outside every component, so no scoped
style can reach it).

**camelCase in JavaScript, kebab-case on tags:** `emits: ['update:modelValue']`
and `$emit('update:modelValue')` in JS; `@update:model-value` on a tag.
Vue translates between them, the same way `image-alt` → `imageAlt`.

---

## 8. Syntax reference: JavaScript

### `import` / `export` (default and named)

```js
export default { ... };                                        // StatCard.vue: one thing
import StatCard from '@/components/molecules/StatCard.vue';    // no braces, any name

export const skillCatalog = [ ... ];                           // skills.js: several things
import { skillCatalog, skillRange } from '@/data/skills.js';   // braces, exact names

import { Modal } from 'bootstrap';                             // a package from npm, by name
```
Each file is a **module**: nothing in it is visible to other files unless it
is exported. That is how we have **no globals**. A component or a class is one
thing, so it uses `export default`; a data or helper file holds several
things, so it uses named exports (more in section 15).

**`@/` means `src/`** (set up in `vite.config.js`), so a path reads the same
from any folder. **A bare name** like `'bootstrap'` means "the package in
`node_modules`". Vite finds it; the browser never sees these paths, because
Vite bundles everything first. That's why the app runs through `npm run dev`
and not by opening `index.html`.

### A component is just an object

```js
const StatCard = {
    props: { ... },
    computed: { ... },
    template: `...`,
};
```
`{ }` makes an object, and each `name: value` pair is a property. Vue reads
the properties it knows (`props`, `data`, `computed`, `methods`, `emits`,
`components`, `template`, `mounted`...) and builds the component from them.

### `function ()` vs `=>`: why both appear, and where each one goes

This is the one people ask about most.

**Rule: Vue's own options use `function ()`. Callbacks inside them use `=>`.**

```js
computed: {
    affordableMax: function () {            // Vue option: function ()
        return Math.min(this.stat.max, this.modelValue + this.pointsLeft);
    },
},
```
```js
otherCharacters: function () {               // Vue option: function ()
    return this.roster.filter((entry) => entry.id !== this.editingId);
},                                           //       ↑ callback: arrow
```

**Why: it's all about `this`.**

- A **`function ()`** gets its `this` from *how it is called*. Vue calls
  `data`, `computed`, `methods` and the lifecycle hooks with `this` set to the
  component. That's how `this.modelValue` and `this.$emit` work.
- An **arrow `=>`** has **no `this` of its own**. It borrows the `this` of
  the code around it.

So:
- An **arrow as a Vue option** would borrow `this` from the module, which is
  `undefined`. `this.modelValue` would crash. The Vue docs warn: *"you
  should avoid using arrow functions when defining methods, as that prevents
  Vue from binding the appropriate `this` value."*
- An **arrow as a callback** inside a method borrows the *method's* `this`,
  which is the component. That is exactly what you want. In the example
  above, `this.editingId` inside the arrow still means the component's
  `editingId`. With a `function ()` callback there, `filter` would call it
  with no `this`, and it would crash.

**The teacher's demo writes `data() { ... }`** (method shorthand). That is
the same as `data: function () { ... }`: same `this`, shorter to write. This
project uses `name: function ()` because the code already did when the move
to `.vue` files started, and one style throughout reads more easily. Either is
correct; arrows are the only wrong choice for Vue options.

**This is the Options API,** the style the whole project uses: the component
is one object with `data`, `props`, `computed`, `methods` and hooks, and
`this` reaches all of them. (The other style, the Composition API, uses
`<script setup>`, `ref()` and `computed(() => ...)` instead. None of the
Forge's files use it.)

**Arrow shapes you'll see throughout:**
```js
(entry) => entry.id === saved.id        // one expression: returned automatically
(skill) => { return ...; }              // braces: needs its own return
(stat) => ({ id: stat.id, ... })        // returning an OBJECT: wrap it in ( )
```
The last one needs the parentheses because `{` right after `=>` would be read
as the start of a function body, not an object.

### Template literals: the backticks (3.0 only)

In 3.0 each component's HTML was a backtick string inside the object
(`` template: `<div class="card">...</div>`, ``). Backticks make a string that
can span many lines. In a `.vue` file the HTML moved into its own
`<template>` block, so the components no longer need them.

### Classes, getters and promises (new in 3.0 - SFC)

```js
export default class Character {
    constructor(saved) { this.name = saved.name || ''; }   // runs once per "new"
    get level() { return this.vitals.level; }              // a getter: thorin.level, no ()
    statValue(id) { ... }                                  // a method: takes an argument
}
```
Inside a class there is no `function` keyword and no commas between members.
More in section 15.

```js
this.$router.replace({ name: 'forge' }).then(() => {
    this.message.text = text;                              // runs once the move is done
});
```
Moving to another address takes a moment (the router asks the page first),
so `replace()` hands back a **promise**: a "this will finish later". `.then`
runs its arrow when it does. ForgeView uses it once, to show the "saved"
message after the address is cleared.

### `data` is a function that returns an object

```js
data: function () {
    return {
        bsModal: null,
        closing: false,
    };
},
```
**Why a function and not just an object:** every copy of a component needs
its **own** data. Six StatCards on a page get six fresh objects. If `data`
were one shared object, closing one modal would set `closing` on all of them.

### Props: type, required, default, validator

```js
props: {
    title: { type: String, required: true },     // must be given
    cap: { type: Number, default: null },        // optional, falls back to null
    variant: {
        type: String,
        default: 'kebab',
        validator: function (value) {
            return ['button', 'kebab'].includes(value);
        },
    },
},
```
- `type` makes Vue warn if a parent passes the wrong kind of value.
- `required: true` makes Vue warn if it's missing.
- `default` is what to use when the parent leaves it off.
- `validator` returns `true` if the value is allowed. A typo like
  `variant="buton"` gets a console warning. Then `look` comes back
  `undefined`, so a red error follows. That's a loud, early failure, which is
  what you want.

### `computed` vs `methods`

| | `computed` | `methods` |
|---|---|---|
| Used like | a value: `affordableMax` | a call: `onInput(event)` |
| Runs | when something it reads changes; otherwise the cached answer is reused | every time it's called |
| Takes arguments | no | yes |
| Use it for | values worked out from data or props | actions, event handlers |

`affordableMax` moved from a method to a computed because, inside StatCard,
it no longer needs an argument.

**Rule of thumb from a real bug:** if the HTML uses it as a **value**
(`:add-items="featMenu"`), it's computed. If the HTML **calls** it
(`addMenu(...)`) or **hands it over to be called** (`:badges-for="featBadges"`),
it's a method. `featMenu` was once pasted into `methods`, so the page handed
ActionMenu a function instead of a list, ActionMenu's `items.some(...)`
crashed, and the whole forge page stopped drawing.

### Small operators used throughout

| Syntax | Meaning | Example |
|---|---|---|
| `===` / `!==` | equal / not equal, **without** type conversion (`'1' === 1` is false) | `span === 0` |
| `a ? b : c` | ternary: if `a` then `b`, else `c` | `this.danger ? 'btn-danger' : 'btn-primary'` |
| `a \|\| b` | `a` if it has a value, otherwise `b` | `fillClass \|\| look.fillClass` |
| `!` | not | `!category.skills.some(...)` |
| `const` / `let` | `const` can't be reassigned; `let` can | `let wanted` changes when capped |
| `Number(x)` | text → number | `Number(event.target.value)` |
| `Math.min(a, b)` | the smaller of the two | `affordableMax` |
| `Math.round(x)` | nearest whole number | `fillPercent` |
| `array.includes(x)` | is `x` in the array? | the validators |
| `'Actions for ' + name` | join text | `menuLabel` |
| `{ ...stat, value: 16 }` | spread: a new object with all of `stat`'s fields, then `value` set | `buildStats` in `seed.js` |
| `list.flatMap(...)` | map each entry to a list, then flatten into one list | `Character.abilities` |

---

## 9. Decisions log: what we chose and what we turned down

| Decision | Why | Turned down |
|---|---|---|
| Strict props down / events up, even for fields on object props | Vue docs recommend it; one owner per piece of data | The teacher's demo edits in place (`item.qty++` in the child). Simpler, but it breaks the docs' rule |
| Children do their own calculations | "Move the logic" without breaking the data rule | Keeping every calculation in the page |
| One ActionMenu for all dropdowns | Teacher wants reuse; every dropdown has the same shape | ForgeDropdownButton (home only), one component per menu |
| Looks as variants inside the component | No Bootstrap class strings in page markup; one place to change a look | Passing `button-class="..."` from the page |
| No paragraphs in markup; text in data | Content in one place; markup stays structure | Typing the text into the HTML |
| Same prop names everywhere (`title`, `description`) | Learn once, use everywhere | name / label / heading used interchangeably |
| `description` is a prop, not a slot | Every card has one (props vs slots rule) | A slot for it |
| AppCard has one look | The tile look won on every page | Keeping a `feature` variant nothing uses |
| Card title `<h3 class="h5">` | Tag = outline, class = size | Different tags per card type by accident |
| StatCard and SkillCard as separate components | Each has its own job (points rule vs menu) | One "do everything" card with flags |
| Skill menu items in SkillCard's data, with `action` | Only SkillCard uses them (rule 7); `action` survives wording changes | Matching on the label text |
| `remove` carries no data; the page adds `category` | The card doesn't need to know where it lives | Passing the category into SkillCard |
| AppModal + ConfirmModal (two components) | The shell is reusable for non-confirm modals later | One modal component that does everything |
| A `v-tooltip` directive for tooltips | Tooltips sit on plain elements; the directive's hooks create, update and dispose them per element | A tooltip component wrapped around every row; keeping `querySelectorAll` and adding cleanup to it |
| `inert` from data for the focus warning | No reaching for the focused element; Chrome's own advice | `document.activeElement.blur()` (page-wide read, direct change) |
| Commit at milestones (C0009 baseline, C0010 first components, C0011 six components + tooltip fix, C0012 bug fixes + IDs) | Each commit is a working state I can show or go back to | Committing after every small edit |
| Character ID = a number from a counter that only goes up | It never changes, so a rename can't lose the character. That fixed the duplicate bug at its root | Building the ID from the name + User ID (the old way); "highest + 1" (a deleted number comes back) |
| The counter is stored apart from the roster | It remembers numbers even after their characters are deleted | Working the next ID out from the roster |
| Names can repeat | Real games allow it; the number ID keeps characters apart | `nameTaken` blocking a second "Thorin" |
| NPCs have a creature type (D&D list + Unknown), not an NPC ID | A type is a description, and descriptions repeat. Unknown is the default, so it's never blank | A typed NPC ID that had to be unique |
| Search = typed (Name, User ID); filter = picked from a list (Player/NPC, creature type) | A simple test for which control fits | Creature type as a search field |
| Reset the form by putting back a copy taken in `mounted` | The starting values are written once, in `data()` | Typing every starting value again in `saveCharacter` |
| AppNavbar emits `leave`; the page opens the modal (3.0) | Navigation and "are you sure?" are separate jobs | The navbar opening a modal it doesn't own. In 3.0 - SFC the router took this over (below) |
| The forge's ✕ close button was removed | Home, Roster and the brand already leave | Keeping two ways to do the same thing |
| ActionMenu grew headers, dividers, notes and `emptyText` | Six hand-written + menus all had them; now they're data | A separate AddMenu component |
| One `addMenu(header, entries)` helper | Every + menu is the same shape | A computed per menu built by hand |
| EntryRow + EntryPanel (molecule + organism) | 4 lists had the same shape; a row is reusable on its own | One big component with "if buff / if feat" checks |
| Badges through a function prop (`badgesFor`) | Badges are data, not markup; each list works them out its own way | A slot of badge `<span>`s on the page (Bootstrap classes in the markup) |
| Inventory's quantity box through a scoped slot | Only one list needs it, and it needs to know its row | A `showQty` flag inside EntryRow |
| All four lists use `list-group-flush` | They look the same now | Inventory keeping outer borders |
| **3.0 - SFC:** | | |
| Convert in place, in this repo on `main` | One project, one history; `legacy/` kept the old version running for side-by-side checks until the end | A new folder or repo; a branch |
| `npm create vue@latest` in a temp folder outside the repo, then bring the files in | In a folder that already has files, the CLI offers to delete them all | Running the CLI in the project folder |
| No global installs; everything in `package.json` | The teacher's rule: `npm install` alone sets the project up anywhere | `npm install -g` |
| Vue Router, one app with four views | "Proper Vue": pages change without a reload, and one place (the router) knows the page | Vite's multi-page mode, keeping three HTML pages |
| Options API, kept | The style the project and the teacher's demos already use; the Vue docs support both | Rewriting everything in `<script setup>` (Composition API) |
| Catalogs in `src/data/`, tools in `src/helpers/`, a `Character` class in `src/models/` | MVVM: the Model apart from the views; app.js was a Large Class (section 13) | Moving all of app.js into ForgeView as one big file |
| Named exports for data and helpers, default for components and the class | A data file holds several things; a component is one thing | Default-exporting an object of everything |
| Working state stays in the view (`skillCategories`, `effects`...) | A module runs once, so a shared `[]` would outlive the page | An empty `[]` exported from `data/` |
| Bootstrap from npm; option 3 imports (`{ Modal }`, `{ Tooltip }`) + `import 'bootstrap'` once in main.js | One copy of Bootstrap, so the modal's ✕ and AppModal share one Modal object | `'bootstrap/dist/js/bootstrap'` (a second copy: the ✕ would stop working) |
| Styles load before `App.vue` in main.js | Component rules build on Bootstrap's instead of losing ties to it | Importing `app.scss` after the app |
| `_tools.scss` (variables only) + `app.scss` (app-wide rules) | Every scoped block can use the same colours without repeating any CSS | One big stylesheet; copying variables into each component |
| PascalCase, self-closing tags in `.vue` templates | The Vue style guide; the in-DOM rules no longer apply | Keeping kebab-case tags |
| The leave guard is `beforeRouteLeave` / `beforeRouteUpdate` in ForgeView | Catches every way out, including the browser's Back | The navbar's `guard` prop |
| Leave only after the pop-up has finished closing (`closed`) | Leaving mid-slide left the next page unscrollable | Moving on `confirm` |
| Feats in an AccordionPanel (class feedback) | It collapses like everything else; no box to scroll | EntryPanel's `scroll` box |
| Build the put-off atoms (BudgetBadge, ToggleButton, FilterChip) before the molecules | Atomic order; each one owns a rule that was written out more than once | Only converting the existing components |
| A `/gallery` page | Tests every component on its own, and shows the atomic design | Testing only inside the real pages |
| Drop the `roster` prefix inside RosterView | Inside its own file the prefix says nothing new | `rosterSearchTerm`, `rosterPage`... |
| No Pinia (shared store) yet | localStorage already connects the forge and the roster | Adding a new tool mid-assignment (backlog B-31) |

---

## 10. Honest exceptions

These places touch an element directly, and each has a reason. Better to
name them than have them found.

| Where | What | Why it's there |
|---|---|---|
| `RangeSlider.onInput` | `event.target.value = wanted` | When the parent's value is already at the cap, asking for it again changes nothing, so Vue has nothing to redraw, and the thumb would stay past the cap. This puts it back. It's the element that sent the event, not a page search. |
| `AppModal.mounted` | `new Modal(this.$refs.modal)` | Handing its own element to a third-party library is the case the Vue docs name. The teacher's AppModal does the same. |
| `AppModal.mounted` | `addEventListener('show.bs.modal' / 'hide.bs.modal' / 'hidden.bs.modal')` | Vue's `@` can't hear event names with dots. It listens on its own ref only, and is removed in `beforeUnmount`. |
| `v-tooltip` | `new Tooltip(el, ...)` / `dispose()` | The element Vue hands the directive, given to a third-party library and cleaned up when the element goes. Same case as AppModal. |
| `ForgeView.scrollToStep` | `this.$refs.tracker.scrollIntoView(...)` | The page's own element, reached through its own ref. Scrolling is something data can't do. |
| `RosterView.downloadCharacter` | `document.createElement('a')` | Creates a temporary download link that is never added to the page. **Question for the teacher (B-18).** It is the only `document.` left in `src/`. |

**Removed in 3.0 - SFC:**
- **The `bootstrap` global.** Bootstrap comes from npm, and each file imports
  the part it uses (`import { Modal } from 'bootstrap'`).
- **`AppNavbar.onClick`'s `event.preventDefault()`.** RouterLink handles it.
- **`scrollToStep`'s `document.querySelector('.step-tracker')`,** the last
  page search. It's a ref now.

**Removed in 2.0:** `startTooltips` (`document.querySelectorAll` on every
redraw, never cleaned up), now replaced by `v-tooltip`.

---

## 11. Where the assignment stands

### Vue App 3.0 - SFC (this assignment)

| The assignment asks for | Where it is |
|---|---|
| Create a new Vue app via the CLI | `npm create vue@latest` (Vite + Vue Router), in this repo. `npm install`, then `npm run dev` |
| Install dependencies like Sass, Bootstrap | `package.json`: bootstrap, bootstrap-icons, sass, vue, vue-router (local only, no global installs) |
| Models/helpers in exportable `.js` files | `src/data/` (9 files), `src/helpers/` (7 files), `src/models/Character.js` (section 15) |
| Components in `.vue` files, with imports | 18 components in `src/components/{atoms,molecules,organisms}`, 4 views in `src/views/` |
| CSS in each component's `<style>`, scoped where possible | 10 components and views have `<style scoped>` (the rest use Bootstrap classes only). `app.scss` keeps only the app-wide rules (761 → 171 lines) |
| Polish from class feedback | **Feats** no longer scrolls in a box; it collapses like the rest (AccordionPanel) |
| Turn in without `node_modules` | `.gitignore` covers `node_modules/` and `dist/` |

**Also done:**
- `app.js` (2,520 lines) is broken up and deleted.
- The browser's Back button now asks before leaving the forge.
- The last page search is gone.
- A `/gallery` page, and the put-off atoms.
- Saving an edit clears `?id=` from the address.

### Vue App 3.0: 3–5 improvements + CHANGELOG.md (the assignment before this one)

| Improvement | Status |
|---|---|
| 1. Squash bugs | ✅ buffs/debuffs not saved · duplicate on save after a rename · form not fully cleared after a save · Chrome focus warning on the leave and delete modals |
| 2. More reusable components | ✅ ConfirmModal runs all 3 modals (the leave modal went from 2 copies to 1, with `:href`) · ActionMenu runs the + menus (headers, dividers, notes, empty text) and now every + and ⋮ menu in the app (the last 5 hand-written ones moved over) |
| 3. Organisms (teacher's feedback) | ✅ AppNavbar (6 navbars → 1) · EntryPanel + EntryRow (4 lists → 1). StepTracker if time allows |
| 4. Redesigned character IDs (my own idea) | ✅ number IDs from a counter, NPC creature types, names can repeat, roster search by Name / User ID with a creature filter and a Newest sort |
| CHANGELOG.md | ✅ `## [3.0.0] - 2026-10-21` |

**Removed from app.js in 3.0:** `characterKey`, `nameTaken`, `npcIdTaken`,
`otherCharacters`, `activeId`, the `lookupId` workaround, and the duplicate
reset lines in `saveCharacter`.

**Removed in 2.0:** `levelBar`, `setVital`, `setStatValue`, `fillPercent`,
`affordableMax`, `releaseModalFocus`, `startTooltips`, the root `updated`
hook, and the old `getElementById('confirmSaveModal')`.

**Next (in BACKLOG.md):** StepTracker (B-06), CharacterCard (B-07), the gear
menu at phone width (B-13), and one component per forge step with a shared
store (B-31).

---

## 12. Questions I might be asked

**"What's the difference between a molecule and an organism?"**
Size and job. A molecule is a small unit, like a slider with its label and
badge. An organism is a whole section of the page built from smaller pieces,
like the navbar. Both are components; the organism removes more repeated
markup at once.

**"Why don't deleted IDs get reused?"**
Other things remember IDs: the Edit link (`?id=3`), a downloaded JSON file,
the locked list. If 3 were deleted and handed out again, those would point at
a different character. The counter only goes up, the same way a database's
auto-number works. Gaps in the numbers cost nothing.

**"Why is the counter stored separately from the roster?"**
If the next ID were worked out from the roster (highest + 1), deleting the
newest character would make its number come back. The roster forgets deleted
characters; the counter doesn't.

**"Why does EntryPanel take a function instead of a list of badges?"**
The badges are different for every row, and different for every list. The
page knows how to work them out (a buff's duration, a feat's source), so it
hands the panel the function and the panel calls it once per row. The panel
stays the same for all four lists.

**"What is a scoped slot?"**
A slot that sends data back to the page. EntryPanel puts the page's `#extra`
content inside every row and hands it that row's `entry`, so the quantity box
knows which item it belongs to.

**"How does the forge ask before you leave?"**
The router asks the forge first, with `beforeRouteLeave`. The forge opens the
pop-up and says "not yet" (`return false`). If the player says Leave, the forge
waits until the pop-up has finished closing, then moves on itself
(walkthrough E). Because the router asks before *every* move, the browser's
Back button is caught too. The navbar doesn't know any of this; its job is
only navigation.

**"Why doesn't the child just change the value? Your demo did."**
The Vue docs say a child should emit and let the parent change it. If only
the owner changes data, a wrong value can only come from one place. The
demo's way is shorter, but if a dozen components can all edit the same
character, finding a bug means checking all of them.

**"Isn't `v-model` two-way binding? Doesn't that break one-way flow?"**
On a component, `v-model` is shorthand for a prop going down plus an event
coming up. The parent still makes the assignment. It's one-way flow with less
typing.

**"Why does StatCard pass the slider's event up instead of handling it?"**
StatCard doesn't own the stat, the page does. Events only go up one level, so
StatCard relays it. StatCard's own job is the limit (`affordableMax`), and it
does handle that.

**"Why are there both StatCard and SkillCard? Isn't that duplication?"**
They share everything that's the same through AppCard and RangeSlider. What's
left is different: StatCard enforces the points pool, and SkillCard has a menu
and can be removed. Merging them would mean one component full of "if this is
a stat..." checks.

**"Why is ActionMenu one component for buttons, ⋮ menus and + menus?"**
They are all a button that opens a list of choices. The differences are looks
(variants) and item extras (icons, red text), which are data. One component
means one place to fix a bug or change behaviour.

**"Where did you use refs instead of IDs?"**
AppModal hands `this.$refs.modal` to Bootstrap, and the page opens the save
modal with `this.$refs.saveModal.open()`. The old code used
`document.getElementById`. IDs that remain exist only because HTML needs them
(a label's `for`, `aria-labelledby`, Bootstrap's `data-bs-target`), and they
come from data, never hard-coded inside a component.

**"Why `function ()` instead of arrow functions?"**
Vue sets `this` to the component when it calls `data`, `computed`, `methods`
and the hooks, and only a regular function receives that `this`. Arrows don't
have their own `this`. Inside methods, arrows *are* used for callbacks like
`.filter(...)`, because there they borrow the method's `this`. See
[section 8](#function--vs--why-both-appear-and-where-each-one-goes).

**"What's the colon for?"**
`:` means "the value in the quotes is JavaScript." Without it, it's plain
text. `:min="stat.min"` passes the number; `min="stat.min"` would pass the
words "stat.min".

**"What does `$event` mean in the relay?"**
It's whatever the child emitted. When RangeSlider emits
`update:modelValue` with 12, `$event` is 12.

**"How do you handle a modal without `getElementById`?"**
The modal is a component with `ref="modal"` on its own element. It gives that
element to Bootstrap in `mounted` and disposes of it in `beforeUnmount`. The
page reaches the component through its own ref and calls `open()`.

**"What's `inert` doing in AppModal?"**
It fixes a Chrome accessibility warning. Bootstrap hides a closing modal from
screen readers while its button still has focus. `inert` tells the browser
to drop focus from inside first. It's driven by a data value (`closing`), so
the template sets it, not hand-written element code.

**"Why are the menu items in SkillCard and not in the page?"**
Only SkillCard uses them. The assignment's own example of data that belongs in
a component is a select menu's options.

**"How did you fix the tooltips that stayed on screen?"**
The old code found every tooltip with `querySelectorAll` and never cleaned
up. Bootstrap draws the box at the end of the page, so deleting the row left
it behind. I wrote a custom directive, `v-tooltip`. Vue hands it the element
when it appears (create the tooltip), when the page redraws (update the text),
and just before it's removed (`dispose()`, which takes the box away). The Vue
docs say directives are for exactly this: low-level element work on plain
elements.

**"Is v-tooltip a component?"**
No. A component brings its own HTML. A directive adds behaviour to an element
that already exists, like `v-if` or `v-model` do. It doesn't count toward the
five, but it fixed a bug from class and replaced every tooltip setup with one
file.

**"Why Single File Components?"**
One file per component, with its HTML, code and CSS together, and the CSS
scoped so it can't leak. Vite compiles them, so the templates get checked
before the browser sees them, and npm packages can be imported by name. The
cost is a build step: the app runs through `npm run dev`, not by opening a
file (section 14 has the pros and cons).

**"What does `scoped` do?"**
Vite stamps the component's elements with an attribute like `data-v-7ba5bd90`
and adds it to each rule, so the rule only matches this component's own HTML.

**"Why is there a `_tools.scss`?"**
A `<style scoped>` block is compiled on its own, so it can't see `app.scss`'s
variables. `_tools.scss` holds only the variables and mixins, which make no
CSS, so every block can pull it in without repeating any CSS.

**"Is this the Options API or the Composition API?"**
Options API. Each component is one `export default { data, props, computed,
methods }` object. Even the router hooks (`beforeRouteLeave`) are options in
that object. No file uses `<script setup>`.

**"Why a router instead of three pages?"**
Changing page doesn't reload the app, the navbar doesn't need to be told
where it is, and the forge can ask before *any* move, Back included. It also
let `app.js` split into one view per page (SRP).

**"What would you do next?"**
StepTracker as an organism (about 60 lines out of ForgeView), a CharacterCard
for the roster, and then one component per forge step. That last one needs
a shared store such as Pinia, so the steps don't have to pass every change up
through the page (BACKLOG.md, B-31).

---

## 13. Code smells I found, and the refactoring for each

Names from sourcemaking.com (Code Smells and Refactoring Techniques). The
numbers are from `scripts/app.js` at C0014: 2,520 lines in all, with `data`
about 860 of them, `methods` about 1,200, and `computed` about 365. **All of
these refactorings are now done:** `app.js` was emptied step by step, every
step checked against the old code, and then deleted.

| Smell (group) | Where | Refactoring | Where it goes |
|---|---|---|---|
| **Large Class** (Bloaters) | `app.js` is one root app doing the jobs of three pages | Extract Class | Home / Forge / Roster views, plus components |
| **Divergent Change** (Change Preventers) | `app.js` changes for home reasons, forge reasons and roster reasons | Extract Class, Move Method | the three views |
| **Long Method** (Bloaters) | `buildSampleCharacter`, about 120 lines | Extract Method: one small builder each for skills, feats, spells, items | `helpers/samples.js` |
| **Duplicate Code** (Dispensables) | `.find((entry) => entry.id === x)` about 20 times; `indexOf` + `splice` about 10 times; `statPointsBadge`, `featsBadgeClass` and `spellsBadgeClass` are the same code; 3 `panelId` / `panelTarget` pairs | Extract Method; Extract Class | `helpers/lists.js`, a BudgetBadge atom, an AccordionPanel molecule |
| **Dead Code** (Dispensables) | `lockLabel` (never called); CSS nothing uses (`.btn-expand`, `.stat-label`, `.stat-score`, `.sheet-bar`, `.btn-icon`, `.fixed-top .btn-close`); Bootstrap's CSS loaded twice (the CDN link + inside `forge.css`); a second Popper script | Remove it | — |
| **Comments** (Dispensables) | comments that are no longer true: `spellsKnown` says "Nothing reads this yet"; the `nextStep` comment written twice; the watch comment sitting above the wrong lines; "character-form.js" in the scss (no such file) | Fix or remove | — |
| **Feature Envy** (Couplers) | about 12 `characterX(character)` methods on the roster that only read the character they are given | Move Method | a `Character` model class (`models/Character.js`) |
| **Data Clumps** (Bloaters) | copying a catalog entry onto a character field by field (`id`, `name`, `description`...) in several places | Extract Method | builder helpers |
| **Long Parameter List** (Bloaters) | AppNavbar needs `active`, `guard` and a `leave` event, only because it can't see which page it is on | Remove Parameter: Vue Router knows the page, and the forge's "are you sure?" moves into the forge itself (`beforeRouteLeave`) | AppNavbar, ForgeView |

**How I'll avoid it next time:** apply the "is it a component?" test from
section 4 before code piles up, and give each file one reason to change (SRP,
section 14). With SFC, a file that grows past a few hundred lines is a sign
something wants to be extracted.

---

## 14. Design principles in The Forge

The unit's principles, each with a real example from this code.

| Principle | What it means | In The Forge |
|---|---|---|
| **DRY** (Don't Repeat Yourself) | each piece of knowledge is written once | One ActionMenu runs every dropdown. One `addMenu` builds every + menu. The HP / MP / SP formulas are written once (`maxHpFor`...) and used by the forge and the roster, so the two can't disagree |
| **SRP** (Single Responsibility) | one class, one reason to change | Each component has one job: RangeSlider slides, ActionMenu lists choices, ConfirmModal asks "are you sure?". Each view has one page's job. `app.js` broke this rule (three pages' jobs), which is why it was split up and deleted (section 13) |
| **Composite** | build a tree where the parts and the whole are used the same way | The atomic design tree: EntryPanel holds EntryRows, each EntryRow holds an ActionMenu. The page treats an organism the same as a molecule: props in, events out |
| **Decorator** | wrap something to add behaviour without changing it | ConfirmModal wraps AppModal and adds confirm / cancel. StatCard wraps RangeSlider and adds the points cap. `v-tooltip` adds a tooltip to any element without changing it |
| **Composition over inheritance** | build from parts instead of extending a parent class | SkillCard = AppCard + RangeSlider + ActionMenu. Nothing uses `extends`. The planned Character model has one `type` field, not Player and NPC subclasses, because they only differ in one badge |
| **MVVM** (Model-View-ViewModel) | keep the data, the screen, and the code that connects them apart | Model: the catalogs and saved characters (after SFC: `src/data/`, `src/models/`). View: the `<template>`. ViewModel: a component's `data`, `computed` and `methods`. A Vue component does all three in one file; moving the catalogs out is the "break it apart" step |

### Single File Components: pros and cons

| Pros | Cons |
|---|---|
| One file per component: template, script and style together | Needs Node and a build step (Vite); the browser can't open a `.vue` file |
| `<style scoped>` keeps a component's CSS from leaking into others | One more tool to learn and set up |
| The template is compiled ahead of time, so the in-DOM rules (section 7) no longer apply | Errors can come from the build, not only the browser |
| Real `import` of npm packages (`import { Modal } from 'bootstrap'`), so no globals | The project must be run with `npm run dev`, not opened directly |

---

## 15. Data, helpers and the Character model

The project is now a Vite app (`npm create vue@latest`, then `npm install`,
then `npm run dev`). Before any component moved, everything in `app.js` that
was **not page code** moved out into plain `.js` modules. `app.js` went from
**2,520 to 1,447 lines**, and every step was checked against the old code
(the same 14 sample characters, field for field).

### Where things live now

```
src/
├── data/        the world: what exists. Never changed while the app runs
│   ├── character.js   startingStats, npcTypes, levelRange, stat point rules
│   ├── skills.js      skillCatalog, skillRange
│   ├── abilities.js   abilityCatalog
│   ├── spells.js      spellCatalog, startingSpellSchools
│   ├── effects.js     effectCatalog
│   ├── feats.js       featCatalog, featKinds, featSources, featsPerLevel
│   ├── items.js       itemCatalog, itemSlots, startingGearSlots, itemQtyRange
│   ├── forges.js      the home page's design area cards
│   └── samples.js     sampleRoster (the 14 sample specs)
├── helpers/     small tools with no "this": arguments in, answer out
│   ├── lists.js       findById, removeFrom, notOwned, deepCopy
│   ├── formulas.js    maxHpFor / MpFor / SpFor, vitalFormulas, spellsKnownFor, featsEarnedFor, statPointsFor
│   ├── builders.js    makeCategory, makeSkill, makeFeat, makeSpell, makeItem, makeEffect
│   ├── storage.js     everything that touches localStorage
│   ├── seed.js        buildSampleCharacter, seedRoster
│   ├── menus.js       addMenu
│   └── labels.js      spellLevelLabel, spellCostLabel, itemSlotLabel
└── models/
    └── Character.js   a saved character, as a class
```

**The sorting test.** World data (the same for everyone, never edited) goes in
`data/`. One page's working state or wording (`vitals`, the modal texts, the
roster's filters) stays with that page's view. Data only one component uses
stays in that component (rule 7). Splitting everything into files would be a
smell too (Shotgun Surgery: one change, five files).

### Named exports vs default exports

```js
// named: many per file, marked where they are made. Braces on import, exact names
export const skillCatalog = [ ... ];
export const skillRange = { min: 1, max: 100 };
import { skillCatalog, skillRange } from '@/data/skills.js';

// default: one main thing per file. No braces, any name
export default class Character { ... }
import Character from '@/models/Character.js';
```
Data and helper files hold many things, so they use named exports. A
component or a model is one thing, so it uses a default export. A misspelled
name in the braces stops Vite with an error naming the missing export, rather
than quietly giving `undefined`. **`@/` means `src/`** (set up in
`vite.config.js`), so the path is the same from any folder.

**A module runs once.** Every file that imports `startingStats` gets the
*same* array. So a view never edits an imported array; it copies it into its
own `data()` first. That's why the files say `startingStats` and
`startingGearSlots`, and why lists the player fills (`skillCategories`,
`effects`, `feats`, `inventory`) stayed with the page.

### Helpers: functions with no `this`

```js
maxHpFor: function (constitution, level) { ... },   // a method: inside the component, has "this"
export function maxHpFor(constitution, level) { ... } // a helper: on its own, no "this"
```
A helper can't reach into any component's data. Everything comes in as an
argument, so one helper serves the forge, the roster and the samples without
depending on any of them.

**Private by not exporting.** `storage.js` keeps its three key names as plain
`const`s with no `export`. Nothing outside the file can see them, so nothing
outside can mistype them. That's encapsulation, done with a module.

**The spread `...`** copies an object's fields into a new one:
`{ ...stat, value: 16 }` is a new object with all of `stat`'s fields and
`value` set to 16. `stat` itself is not changed.

**Long Method, fixed.** `buildSampleCharacter` was one 120-line method. It's
now six small builders in `seed.js` (stats, skills, feats, spells, items,
gear), plus a short function that puts them together. The builders aren't
exported: they're the file's own working parts.

### The Character model (a class)

The roster had about 12 methods like `characterLevel(character)` that only
dug into the character they were handed (**Feature Envy**). They moved onto
the character itself (**Move Method**):

```js
const thorin = new Character(saved);   // the constructor runs once
thorin.level;                          // a getter: read like a field, like computed
thorin.statValue('strength');          // a method: takes an argument, like methods
```

| In the class | Like Vue's | Example |
|---|---|---|
| `constructor(saved)` | `data()` | copies the saved fields, and fills in anything an older save is missing |
| `get level()` | `computed` | `level`, `isNpc`, `typeLabel`, `tagLabel`, `vitalBars`, `abilities`, `spellbook`, `gear` |
| `statValue(id)` | `methods` | anything that needs an argument |

**Missing fields are fixed once, in the constructor**
(`this.stats = saved.stats || []`), instead of in every method.

**The prototype underneath.** The fields live on each character. The getters
and methods live *once*, on `Character.prototype`, and all characters share
them (`thorin.statValue === lyra.statValue` is `true`). That's also why
`JSON.stringify(thorin)` writes only the fields: Download JSON still saves
plain data.

**The model knows facts, not looks (MVVM).** It gives `isNpc` and the HP
numbers, never `bg-primary` or `text-bg-health`. Colours stay in the view.

**One class, no subclasses.** Players and NPCs differ in one field (`type`),
so there's no Player/NPC inheritance. That's composition over inheritance.

### Questions I might be asked

**"Why is the data in separate files?"** It's the world's reference data, the
MVVM Model, not one page's working state. It made `app.js` a Large Class
doing three pages' jobs. Now each file holds one area (skills, spells,
items...), and any page can import just what it needs.

**"Why named exports here but default exports for components?"** A data file
has several things in it. A component or a class is one thing.

**"Why a class, when Vue components already have computed?"** The roster
needs these answers for *saved* characters, many at once, and not inside one
component. A class puts the logic with the data it's about, and each
character answers for itself.

---

## 16. Single File Components, Vite and the router

### How the project was made a Vue CLI project

The teacher's steps: `npm create vue@latest`, `npm install`, `npm run dev`.

1. The old CDN version was copied to `legacy/` (ignored by git) to keep it
   running for side-by-side checks. It was deleted before turning in.
2. `npm create vue@latest forge-scaffold` ran in a folder **outside** the
   repo, with Router picked, TypeScript off and the example code skipped. In a
   folder that already has files, the CLI offers to delete them all, so it
   never ran in the project. It's a one-off download, **not a global install**.
3. `vite.config.js`, `jsconfig.json`, `src/main.js`, `src/App.vue` and
   `src/router/` came in from the scaffold. `package.json` was merged: it
   became `"type": "module"`, got the `dev` / `build` / `preview` scripts,
   and lost the old `sass` watcher (Vite compiles SCSS itself).
4. `git mv` moved the files that carried over (`forge.scss` → `src/sass/app.scss`,
   the anvil image → `public/images/`, each component → its `.vue` file), so
   their history follows them.

| Command | What it does |
|---|---|
| `npm install` | reads `package.json` and downloads everything into `node_modules/` |
| `npm run dev` | runs the app at `http://localhost:5173`; every save reloads the page |
| `npm run build` | makes the finished site in `dist/` |

**Why `node_modules` and `dist` aren't turned in:** both can be made again
from `package.json` (and `package-lock.json`, which pins the exact versions).

### main.js, line by line

```js
import './sass/app.scss';                          // 1. styles first
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap';                                // 2. Bootstrap's JS, once
const app = createApp(App);
app.use(router);                                   // 3. plug in the router
app.mount('#app');                                 // 4. draw it into index.html
```

1. **Styles first,** so every component's scoped CSS lands after Bootstrap's
   and builds on it. The other way round, Bootstrap would win any tie.
2. **`import 'bootstrap'`** turns on the `data-bs-` attributes the dropdowns
   and accordions use. It's the *same* copy that AppModal and the tooltip
   import parts from, so there is one Modal object per modal. The teacher's
   "global" option (`'bootstrap/dist/js/bootstrap'`) would load a second copy,
   and the modal's ✕ would stop working.
3. **`app.use(router)`** also registers `<RouterView>` and `<RouterLink>` for
   every component.

### The router (`src/router/index.js`)

```js
routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/forge', name: 'forge', component: ForgeView },
    { path: '/roster', name: 'roster', component: RosterView },
    { path: '/gallery', name: 'gallery', component: GalleryView },
    { path: '/:pathMatch(.*)*', redirect: '/' },   // anything else goes home
],
```
- **`path`** is what the address bar shows. **`name`** is what the code uses
  (`{ name: 'forge' }`), so a path can change without touching any link.
- **`<RouterLink :to="...">`** draws a normal `<a>`, but changing page doesn't
  reload the app.
- **`this.$route`** is where you are now (`this.$route.query.id` reads `?id=3`).
  **`this.$router`** moves you (`push`, `replace`).
- **Route guards** are Options API hooks a view can have:
  `beforeRouteLeave(to)` (leaving this page) and `beforeRouteUpdate(to)`
  (same page, new address). Returning `false` cancels the move (walkthrough E).

### What moved where (the big picture)

| 3.0 (CDN, three pages) | 3.0 - SFC |
|---|---|
| `index.html`, `creation-character.html`, `view-characters.html` | `HomeView`, `ForgeView`, `RosterView` (+ `GalleryView`), one `index.html` |
| `scripts/app.js`, 2,520 lines | data → `src/data/`, tools → `src/helpers/`, the roster's methods → `Character`, each page's code → its view; then deleted |
| `scripts/components/*.js` with `template:` strings | `src/components/{atoms,molecules,organisms}/*.vue` |
| `scss/forge.scss` → `css/forge.css` (watcher) | `src/sass/app.scss` + `_tools.scss` + each component's `<style scoped>`, compiled by Vite |
| Bootstrap from a CDN `<script>` (a global) | Bootstrap from npm, imported by the files that use it |
| Live Server | `npm run dev` |