# The Forge: Code Guide (Vue App 3.0, Organisms)

A study guide for explaining this code: what each piece does, why it is built
that way, and what every bit of syntax means. Each section stands on its own.

**Contents**

1. [The one-minute version](#1-the-one-minute-version)
2. [How the files connect](#2-how-the-files-connect)
3. [The pattern and the rules](#3-the-pattern-and-the-rules)
4. [The three layers, and when something becomes a component](#4-the-three-layers-and-when-something-becomes-a-component)
5. [Component by component](#5-component-by-component)
6. [Following the data: three walkthroughs](#6-following-the-data-three-walkthroughs)
7. [Syntax reference: the template (HTML side)](#7-syntax-reference-the-template-html-side)
8. [Syntax reference: JavaScript](#8-syntax-reference-javascript)
9. [Decisions log: what we chose and what we turned down](#9-decisions-log-what-we-chose-and-what-we-turned-down)
10. [Honest exceptions](#10-honest-exceptions)
11. [Where the assignment stands](#11-where-the-assignment-stands)
12. [Questions I might be asked](#12-questions-i-might-be-asked)

---

## 1. The one-minute version

- **The pattern is "the parent owns, the child shows"** (also called
  Container / Presentational). The page (the root app in `app.js`) owns the
  data. Components get what they show through **props**, work out whatever
  they can from those props in **computed**, and report what the user did with
  **emits**. The parent makes the actual change.
- **The principle is one-way data flow: props go down, events go up.** That
  is the Vue docs' own wording. A component never changes data that does not
  belong to it.
- **Reuse is the main goal.** One `ActionMenu` replaces 13 hand-written
  dropdowns, one `RangeSlider` runs every slider on the forge page, and one
  `ConfirmModal` replaces the four "are you sure?" modals.
- **Six components do real work so far:** RangeSlider, StatCard, ActionMenu,
  SkillCard, AppModal and ConfirmModal. AppCard and PageContentHeader are
  display-only frames. They are used, but they are not counted toward the five.
- **Vue App 3.0 adds organisms** (atomic design, see section 4): whole page
  sections built from the smaller pieces. The first is **AppNavbar**: one
  file replaces six hand-written navbars.
- **Every character has a number ID that never changes** (0, 1, 2...), handed
  out by a counter that only goes up. That one change fixed the
  duplicate-on-save bug at its root and made the save code shorter.

---

## 2. How the files connect

```
scripts/
├── app.js                  the root app: owns the data, registers components
└── components/
    ├── ActionMenu.js       molecule: one dropdown for the whole app
    ├── AppCard.js          molecule: the card frame
    ├── AppModal.js         molecule: the Bootstrap modal shell
    ├── PageContentHeader.js molecule: the big page heading (index only)
    ├── RangeSlider.js      molecule: slider + label + value badge
    ├── ConfirmModal.js     molecule, built on AppModal: "are you sure?"
    ├── StatCard.js         molecule: AppCard + RangeSlider + the points rule
    ├── SkillCard.js        molecule: AppCard + RangeSlider + ActionMenu
    ├── EntryRow.js         molecule: one list row (name, badges, ⋮)
    ├── EntryPanel.js       ORGANISM: heading + count + + menu + EntryRows
    └── AppNavbar.js        ORGANISM: both navbars, every page
└── directives/
    └── tooltip.js          v-tooltip: a Bootstrap tooltip that cleans up after itself
```

Three steps connect a component to a page. All three are needed; skip one and
the tag silently does nothing, or Vue warns `Failed to resolve component`.

1. **Export it** at the bottom of its own file:
   ```js
   export default StatCard;
   ```
2. **Import and register it** in whatever uses it:
   ```js
   import StatCard from './components/StatCard.js';
   // ...
   components: {
       StatCard,
   },
   ```
3. **Use it as a tag**, in kebab-case:
   ```html
   <stat-card :stat="stat" v-model="stat.value" :points-left="statPointsLeft"></stat-card>
   ```

**Who registers what.** A component is registered where it is *used*, not
once for the whole app:

| Registered in | Components | Why there |
|---|---|---|
| `app.js` | ActionMenu, AppCard, AppNavbar, ConfirmModal, EntryPanel, PageContentHeader, RangeSlider, SkillCard, StatCard | The page markup uses these tags directly |
| `EntryPanel.js` | ActionMenu, EntryRow | The + menu and the rows |
| `EntryRow.js` | ActionMenu (+ the `tooltip` directive) | The ⋮ menu and the row's tooltip |
| `StatCard.js` | AppCard, RangeSlider | StatCard's own template uses them |
| `SkillCard.js` | ActionMenu, AppCard, RangeSlider | SkillCard's own template uses them |
| `ConfirmModal.js` | AppModal | Only ConfirmModal uses AppModal |

Directives are registered the same way, in their own `directives: {}`
block: `app.js` registers `tooltip` for the page markup, and `RangeSlider.js`
registers it again for its own template (the vitals' formula tooltips).

This is the same as the teacher's demo, where `ShoppingList` registers
`ShoppingListItem` itself. It also keeps the parts list honest: open a
component and its `components: {}` lists what it is built from.

**All three pages load the same `app.js`.** Each page's HTML is the root
app's template. Vue reads the HTML inside `<div id="app">` and turns it into
the page. That is why page markup has to follow the "in-DOM" rules in
[section 7](#in-dom-rules-why-the-html-side-looks-the-way-it-does).

---

## 3. The pattern and the rules

### The eight rules every component follows

| # | Rule | Why |
|---|---|---|
| 1 | **Never write to a prop.** That includes a field on an object prop (`this.stat.value = 5` is out too). | Vue docs, Props → One-Way Data Flow: *"the child should emit an event to let the parent perform the mutation."* If any child could change shared data, a bug could come from anywhere. If only the owner changes it, there is one place to look. |
| 2 | **Be smart about calculations.** A component works out everything it can from its own props, in `computed`. | This is the "move the logic into the components" part of the assignment. `fillPercent`, `affordableMax` and `menuLabel` all live in the component that uses them. |
| 3 | **One value changing → component `v-model`.** The child has a `modelValue` prop and emits `update:modelValue`. | The parent writes `v-model="stat.value"`, so the parent does the assignment. It is still props down, events up. Vue just writes both halves for you. |
| 4 | **Add / remove / toggle → an event named with a verb**, like `remove`. | The child says what the user wants and the parent runs the method it already has (`removeSkill`). The child does not need to know how the list is stored. |
| 5 | **Events don't bubble.** A parent only hears its direct child, so a middle component passes events up one level. | Vue docs: component events do not bubble. StatCard and SkillCard relay RangeSlider's change up to the page. |
| 6 | **Declare everything:** `props` with a type and `required` or `default`, plus an `emits` list. | Vue warns in the console when a required prop is missing or the wrong type, and the file documents itself. |
| 7 | **Data only one component uses lives in that component.** | The assignment's own example: "options for a select menu". So the variant tables live in their components, and SkillCard holds its own menu items. |
| 8 | **No searching the page and no globals.** Use `ref` + `$refs` instead of `document.querySelector` or `getElementById`. | The assignment forbids DOM manipulation. The Vue docs say refs are for the cases data cannot handle, like handing an element to a library such as Bootstrap. |

### What "DOM manipulation" means here

The test for any line of code: **could data plus the template do this job?**
If yes, doing it by hand breaks the rule.

- Old way: find an element, change it (`querySelector(...)` then `.classList.add(...)`).
- Vue way: change the data, and the template redraws itself.

The Vue docs (Template Refs) name the cases where touching an element *is*
right: *"programmatically focus an input on mount, or initialize a 3rd party
library on an element."* Bootstrap is a third-party library, so AppModal
handing its own element to `new bootstrap.Modal(...)` is that case.

---

## 4. The three layers, and when something becomes a component

```
Layer 3  Pages          the root app (app.js + each page's HTML)
            │  owns the data, runs the methods that change it
            ▼
Layer 2  Feature cards  StatCard, SkillCard
            │  built from layer 1, adds one job each (a rule, a menu)
            ▼
Layer 1  Building blocks ActionMenu, RangeSlider, AppCard, AppModal → ConfirmModal
               generic, know nothing about characters
```

### The same layers in atomic design terms (teacher's feedback)

Atomic design names five levels. This is where each piece of The Forge sits:

| Level | What it is | In The Forge |
|---|---|---|
| Atoms | the smallest parts: a button, a badge, an input | **Bootstrap** gives us these. We don't build them |
| Molecules | a few atoms that work as one small unit | RangeSlider, ActionMenu, AppCard, AppModal → ConfirmModal, StatCard, SkillCard, EntryRow |
| Organisms | a whole section of the page, built from molecules | **AppNavbar** (every page), **EntryPanel** (Buffs, Debuffs, Feats, Inventory) |
| Templates / Pages | the page layout with real data | the three HTML files + app.js |

The teacher's feedback was that the molecules were good, and the next step was
organisms. An organism is still a component; the difference is size. It is a
whole section of the page, so it removes the most repeated markup.

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
  the same spot. Every card has a title and a description, so those are props.
- **Slots carry what differs in shape.** One card holds a slider, another a
  menu, another a button. That goes through slots.

**Variants (looks).** The page picks a look by name (`variant="kebab"`); the
component keeps the Bootstrap classes for each look in its own `data`. So the
page never has Bootstrap class strings for a component's look. **The parent
still decides layout and size.** That is why `class="d-grid"` sits on the
`<action-menu>` tag on the home page: making it full width is the page's call.

---

## 5. Component by component

Each one follows the teacher's `SampleComponent.js` order: `components`,
`data`, `props`, `emits`, `computed`, `methods`, lifecycle hooks, `template`.

### RangeSlider (layer 1) ✅ counts

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

**What to say:** "Every slider in the app is this one component. It doesn't
own the number. It shows it, works out the fill, refuses values past the cap,
and asks the parent to change it."

---

### ActionMenu (layer 1) ✅ counts

**Job:** one dropdown for the whole app: the forge buttons on the home page,
the ⋮ menus on cards, and later the + menus and the roster menus.

| Props | Type | Notes |
|---|---|---|
| `items` | Array, required | Each item: `{ label, href?, icon?, danger? }`, plus any field the parent wants for itself |
| `label` | String, required | Button text, or what a screen reader says for the icon-only ⋮ |
| `variant` | String, default `'kebab'` | `button`, `kebab` or `add` (the + beside a heading), checked by a validator |
| `emptyText` | String, default `''` | shown when no item is a real choice ("Every category added") |

**Emits:** `select`, sending the whole item that was clicked.

**Five kinds of item** (3.0 added the last three, so it could run the + menus):

| The item has... | It draws | On click |
|---|---|---|
| `href` | an `<a>` link | the browser goes there |
| a `label`, no `href` | a `<button>` | emits `select` with the item |
| `header` | a grey heading (`dropdown-header`) | nothing |
| `divider` | a line between groups | nothing |
| `note` | grey text that can't be clicked ("Nothing left here") | nothing |

The template picks one with a `v-if` / `v-else-if` / `v-else` chain, top to
bottom. `hasChoices` (computed) asks "does any item have a `label`?"; if not,
`emptyText` shows. Headers and dividers have no label to use as a `:key`, so
the key is the item's position: `v-for="(item, index) in items" :key="index"`.

**Building a + menu (`addMenu` in app.js).** Every + menu is a heading, then
one choice per catalog entry. The catalog entry rides inside each choice, so
the click hands it back:
```js
addMenu: function (header, entries) {
    const choices = entries.map((entry) => ({ label: entry.name, entry: entry }));
    return [{ header: header }].concat(choices);
},
```
Used for categories, buffs, debuffs and items. On the page,
`@select="addCategory($event.entry)"` unwraps it. Feats builds its own
(`featMenu`) because it has two groups, each with its own note.

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

### AppCard (layer 1), display only

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

### StatCard (layer 2) ✅ counts

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
```html
<range-slider ... :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"></range-slider>
```
StatCard cannot write `v-model="modelValue"` here, because that assigns to
its own prop. So it splits `v-model` into its two halves by hand: pass the
value down, pass the change up. `$event` is what RangeSlider sent.

**Why the pool total stays in app.js:** `statPointsLeft` adds up all six
stats. No single card can see the other five, so the page, which owns all
six, works it out and passes it to each card.

---

### SkillCard (layer 2) ✅ counts

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
  ```html
  <skill-card :skill="skill" v-model="skill.value"
      @remove="removeSkill(category, skill)"></skill-card>
  ```

That is why `remove` carries no data. The page fills in `category` and
`skill` itself.

**Why the items have an `action` field:** matching on the label
(`item.label === 'Remove'`) would break if the wording changed. `action` is
an ID that only code reads.

---

### AppModal (layer 1) ✅ counts

**Job:** the Bootstrap modal shell (header, body, footer). It owns the
Bootstrap `Modal` object for its own element.

| | |
|---|---|
| **Props** | `id` (String, required, given by the page), `title` (String, required) |
| **Data** | `bsModal` (the Bootstrap object), `closing` (true while closing) |
| **Computed** | `titleId`: `id + 'Label'`, so `aria-labelledby` points at the heading |
| **Methods** | `open()`, `close()` (for parents to call through a ref), `onShow()`, `onHide()` |
| **Lifecycle** | `mounted`: create the Bootstrap object and start listening. `beforeUnmount`: stop listening and `dispose()` |

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

### ConfirmModal (built on AppModal) ✅ counts

**Job:** "Are you sure?" Cancel always just closes; Confirm either goes
somewhere (`href`) or emits `confirm`.

| Props | Notes |
|---|---|
| `id`, `title`, `confirmLabel` | required |
| `message` | the body text, unless the page fills the slot |
| `cancelLabel` | default `'Cancel'` |
| `danger` | Boolean: a red confirm button for things you can't undo |
| `href` | if set, confirm is a link; if not, confirm is an event |

**Emits:** `confirm`.

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
| Save | forge | no `href`, so it emits `confirm` → `saveCharacter` |
| Leave | forge | `:href="leaveHref"`: Leave is a link. One modal for every exit, because `askLeave` sets `leaveHref` before opening it. It used to be 2 hand-written modals, one per destination |
| Delete | roster | `danger` + the slot for the bold name. Emits `confirm` → `confirmDelete` |

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
```html
<confirm-modal ref="saveModal" v-bind="saveConfirm" @confirm="saveCharacter"></confirm-modal>
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
| `mounted(el, binding)` | the element just appeared | `new bootstrap.Tooltip(el, { title: binding.value })`. No text, no tooltip. |
| `updated(el, binding)` | the page redrew | if `binding.value !== binding.oldValue`, put the new text in with `setContent` |
| `beforeUnmount(el)` | the element is about to be removed | `dispose()`, which takes the tooltip box off the page |

- **`el` is the element itself**, handed over by Vue, the same idea as a ref.
  Nothing searches the page.
- **`binding.value`** is whatever is in the quotes; **`binding.oldValue`**
  is what it was before the redraw.
- **`bootstrap.Tooltip.getInstance(el)`** asks Bootstrap whether it has a
  tooltip for *this* element. It looks the element up in Bootstrap's own
  list, not on the page.

It's the same create/clean-up pattern as AppModal (`mounted` +
`beforeUnmount`), packaged so any element can use it. It doesn't count as a
component, but it is reuse: one file replaced every tooltip setup in the app.

---

### PageContentHeader (layer 1), display only

**Job:** the big heading block (title over a description). It is used on the
home page only for now. It was kept because future landing pages will reuse
it. It is honestly display-only, so it doesn't count toward the five.

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
| `scroll` | Boolean: long lists scroll (Feats) |
| `variant` | `compact` (small heading, in the Vitals card) or `card` (a card's title) |

**Emits:** `add` (the catalog entry picked from the +), `remove` (the entry,
relayed from EntryRow, rule 5).

**Slots:** default = between the heading and the list (the feat counter);
`#extra` = a **scoped slot** inside every row (inventory's quantity box).

**Passing a function as a prop.** Each panel's badges differ, so the page
hands over the function that works them out:
```html
<entry-panel ... :badges-for="effectBadges"></entry-panel>   <!-- no () -->
```
```html
<entry-row ... :badges="badgesFor(entry)">                     <!-- the panel calls it -->
```
No parentheses on the page means "here is the function," not "call it now."
It's still props down: the page decides, the panel only calls it. Vue methods
always keep their `this`, so passing one around is safe.

**The relay adds the entry:**
```html
<entry-row v-for="entry in entries" ... @remove="$emit('remove', entry)">
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
and the row never touch `qty`.

**What to say:** "Four lists had the same heading, + menu, rows and empty
text. Now they're one organism. The page gives it the list, the menu and a
function for the badges; it reports add and remove. The quantity box goes in
through a scoped slot, so only Inventory has it."

---

### AppNavbar (organism) ✅ counts

**Job:** the navbar on every page: the top bar on large screens and the
bottom bar on phones. It is drawn from one list of links, and it replaces 6
hand-written `<nav>` blocks (2 per page × 3 pages).

| | |
|---|---|
| **Props** | `active` (String, required, `home` / `forge` / `roster`, checked by a validator), `guard` (Boolean: ask before leaving) |
| **Emits** | `leave`, with the `href` the user clicked (only when `guard` is on) |
| **Data** | `links`: `{ id, label, shortLabel, href, icon }` for each page. Only the navbar uses them (rule 7) |
| **Computed** | `homeLink`: the brand link goes home |
| **Methods** | `onClick(event, link)`: the current page does nothing; with `guard`, stop the browser and emit `leave` |

**Why it's an organism:** it is a whole section of the page, not one small
part, and it has its own logic (the active link and the guard).

**Two bars, one list.** Both bars loop over the same `links`. The top bar
shows `label` ("Forge Character") and the phone bar shows `shortLabel` and
`icon` ("Create" with a hammer). Add a page once, and both bars get it.

**The guard (only the forge uses it):**
```html
<app-navbar active="forge" guard @leave="askLeave"></app-navbar>
```
```js
onClick: function (event, link) {
    if (link.id === this.active) {      // already here: reloading would lose work
        event.preventDefault();
        return;
    }
    if (this.guard) {                   // forge: don't leave, ask the page
        event.preventDefault();
        this.$emit('leave', link.href);
    }
},
```
`event.preventDefault()` tells the browser "don't follow this link." It is
the same thing `@submit.prevent` does for the forms. The navbar doesn't know
there is a modal. It only reports where the user wanted to go. The page
decides what to do about it: `askLeave` sets `leaveHref` and opens the one
leave ConfirmModal.

**Why it can sit anywhere inside `#app`:** both bars are `fixed-top` /
`fixed-bottom`, so they show at the top and bottom of the screen wherever
they are in the HTML. That's why the old navbars could move inside `#app`
(Vue only controls what is inside `#app`) without changing the look.

**Two root elements.** The template has two `<nav>` tags side by side.
Vue 3 allows that; Vue 2 needed one wrapper around everything.

**What to say:** "Six copies of the navbar became one component. The page
tells it where you are and whether to ask before leaving. The navbar reports
the click, and the page decides what happens."

---

## 6. Following the data: three walkthroughs

### A. Dragging Strength from 10 to 12

```
1. RangeSlider   onInput: "12" → Number → 12. Under the cap? Yes.
                 $emit('update:modelValue', 12)
2. StatCard      @update:model-value hears it and relays:
                 $emit('update:modelValue', 12)
3. page          v-model="stat.value" → stat.value = 12   (the ONLY assignment)
4. app.js        statPointsLeft recomputes (the pool shrinks by 2)
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
3. page         @remove="removeSkill(category, skill)"
4. app.js       removeSkill finds the skill in category.skills and splices it out
5. back down    v-for redraws; that SkillCard is gone. The skill reappears in
                the category's "Add a skill" menu because availableSkills
                recomputes.
```

### C. Finish → Save

```
1. page        Finish submits the form → nextStep()
2. app.js      last step? → this.$refs.saveModal.open()
3. ConfirmModal open() → this.$refs.modal.open()
4. AppModal    open() → this.bsModal.show()   (Bootstrap animates it in)
5. user        clicks Save Character
6. ConfirmModal confirm() → closes, $emit('confirm')
7. page        @confirm="saveCharacter" → saves, resets the form
```
Notice the shape: **refs go down** (a parent asks a child to do something,
like open), and **events go up** (a child tells a parent something happened).

### D. Saving: a new character vs. an edit (the ID system)

```
NEW CHARACTER                         EDIT FROM THE ROSTER
editingId = null                      ?id=3 in the address bar
                                      loadFromQuery: Number("3") → 3
                                      applyCharacter(found), editingId = 3
collectCharacter → id: null           collectCharacter → id: 3
storeCharacter:                       storeCharacter:
  id is null → takeNextId() → 14        id is 3 → keep it
  findIndex(14) → not found → push      findIndex(3) → found → replace in place
returns 14 → "Saved (#14)"            returns 3 → "Saved (#3)"
```
Then `saveCharacter` puts `blankCharacter` back on the form with
`applyCharacter`, so the next character starts empty.

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
working until `loadFromQuery` converted it.

**The blank form (`blankCharacter`).** The first line of `mounted` takes a
copy of the form with `collectCharacter()` before anything is loaded. At that
moment the form only holds `data()`'s starting values. A save puts that copy
back. The starting values are written once (in `data()`), so a new field can't
be forgotten in the reset.

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
<range-slider ... show-max></range-slider>   showMax is true
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
<stat-card v-model="stat.value"></stat-card>
```
is shorthand for:
```html
<stat-card :model-value="stat.value"
    @update:model-value="newValue => stat.value = newValue"></stat-card>
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
<confirm-modal ref="saveModal" ...>         on a component: $refs.saveModal is the component
```
A ref on a component gives you the component, so you can call its methods:
`this.$refs.saveModal.open()`. Refs replace `getElementById`. A component
only ever sees its own refs.

### `v-bind="object"`: many props at once

```html
<confirm-modal v-bind="saveConfirm"></confirm-modal>
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

### In-DOM rules: why the HTML side looks the way it does

Page markup lives in `.html` files, so the **browser** reads it before Vue
does. Browsers lowercase tag and attribute names and don't understand
self-closing custom tags. So, on the page:

- **kebab-case** tags and props: `<stat-card :points-left="...">`, never
  `<StatCard :pointsLeft="...">`. Vue matches `points-left` to the prop
  `pointsLeft` automatically.
- **Explicit closing tags**: `<stat-card ...></stat-card>`, never
  `<stat-card />`.
- Inside `<ul>`, `<table>` or `<select>`, a component would need
  `is="vue:component-name"`. We haven't needed it yet.

A component's `template:` string is read by Vue, not the browser, so these
rules don't strictly apply there. We follow them anyway so everything reads
the same.

**camelCase in JavaScript, kebab-case in templates:** `emits: ['update:modelValue']`
and `$emit('update:modelValue')` in JS; `@update:model-value` in a template.
Vue translates between them, the same way `image-alt` → `imageAlt`.

---

## 8. Syntax reference: JavaScript

### `import` / `export default`

```js
export default StatCard;                         // at the bottom of StatCard.js
import StatCard from './components/StatCard.js'; // where it is used
```
Each file is a **module**: nothing in it is visible to other files unless it
is exported. That is how we have **no globals**. Every component is a
`const` inside its own file. The `.js` extension and `./` path are required
because the browser loads these files directly (no build step). That is also
why the pages need Live Server: modules don't load from `file://`.

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
project uses `name: function ()` because the rest of `app.js` already did,
and one style throughout reads more easily. Either is correct; arrows are the
only wrong choice for Vue options.

**Arrow shapes you'll see in app.js:**
```js
(entry) => entry.id === saved.id        // one expression: returned automatically
(skill) => { return ...; }              // braces: needs its own return
(stat) => ({ id: stat.id, ... })        // returning an OBJECT: wrap it in ( )
```
The last one needs the parentheses because `{` right after `=>` would be read
as the start of a function body, not an object.

### Template literals: the backticks

```js
template: `
    <div class="card">
        ...
    </div>
`,
```
Backticks make a string that can **span many lines**. A normal `'...'`
string can't. That is why every `template:` uses them. (They can also insert
values with `${...}`, which we don't use, because Vue's `{{ }}` does that
inside templates.)

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

---

## 9. Decisions log: what we chose and what we turned down

| Decision | Why | Turned down |
|---|---|---|
| Strict props down / events up, even for fields on object props | Vue docs recommend it; one owner per piece of data | The teacher's demo edits in place (`item.qty++` in the child). Simpler, but it breaks the docs' rule |
| Children do their own calculations | "Move the logic" without breaking the data rule | Keeping every calculation in app.js |
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
| AppNavbar emits `leave`; the page opens the modal | Navigation and "are you sure?" are separate jobs | The navbar opening a modal it doesn't own |
| The forge's ✕ close button was removed | Home, Roster and the brand already leave | Keeping two ways to do the same thing |
| ActionMenu grew headers, dividers, notes and `emptyText` | Six hand-written + menus all had them; now they're data | A separate AddMenu component |
| One `addMenu(header, entries)` helper | Every + menu is the same shape | A computed per menu built by hand |
| EntryRow + EntryPanel (molecule + organism) | 4 lists had the same shape; a row is reusable on its own | One big component with "if buff / if feat" checks |
| Badges through a function prop (`badgesFor`) | Badges are data, not markup; each list works them out its own way | A slot of badge `<span>`s on the page (Bootstrap classes in the markup) |
| Inventory's quantity box through a scoped slot | Only one list needs it, and it needs to know its row | A `showQty` flag inside EntryRow |
| All four lists use `list-group-flush` | They look the same now | Inventory keeping outer borders |

---

## 10. Honest exceptions

These places touch an element directly, and each has a reason. Better to
name them than have them found.

| Where | What | Why it's there |
|---|---|---|
| `RangeSlider.onInput` | `event.target.value = wanted` | When the parent's value is already at the cap, asking for it again changes nothing, so Vue has nothing to redraw, and the thumb would stay past the cap. This puts it back. It's the element that sent the event, not a page search. |
| `AppModal.mounted` | `new bootstrap.Modal(this.$refs.modal)` | Handing its own element to a third-party library is the case the Vue docs name. The teacher's AppModal does the same. |
| `AppModal.mounted` | `addEventListener('show.bs.modal' / 'hide.bs.modal')` | Vue's `@` can't hear event names with dots. It listens on its own ref only, and is removed in `beforeUnmount`. |
| `v-tooltip` | `new bootstrap.Tooltip(el, ...)` / `dispose()` | The element Vue hands the directive, given to a third-party library and cleaned up when the element goes. Same case as AppModal. |
| `bootstrap` | a global from Bootstrap's `<script>` tag | It belongs to the library, not to us. "No globals" means we don't create any. |
| app.js `downloadCharacter` | `document.createElement('a')` | Creates a temporary download link that is never added to the page. **Question for the teacher.** |
| `AppNavbar.onClick` | `event.preventDefault()` | Not DOM manipulation. It cancels the browser's own action for that one click (following the link), the same as `@submit.prevent`. It touches no elements. |

**Still to remove** (a real page search, scheduled):
- `scrollToStep`: `document.querySelector('.step-tracker')`. Fixed when the step tracker becomes a component.

**Already removed:** `startTooltips` (`document.querySelectorAll` on every
redraw, never cleaned up), now replaced by `v-tooltip`.

---

## 11. Where the assignment stands

### Vue App 3.0 (this assignment): 3–5 improvements + CHANGELOG.md

| Improvement | Status |
|---|---|
| 1. Squash bugs | ✅ buffs/debuffs not saved · duplicate on save after a rename · form not fully cleared after a save · Chrome focus warning on the leave and delete modals |
| 2. More reusable components | ✅ ConfirmModal runs all 3 modals (the leave modal went from 2 copies to 1, with `:href`) · ActionMenu runs the + menus (headers, dividers, notes, empty text) |
| 3. Organisms (teacher's feedback) | ✅ AppNavbar (6 navbars → 1) · EntryPanel + EntryRow (4 lists → 1). StepTracker if time allows |
| 4. Redesigned character IDs (my own idea) | ✅ number IDs from a counter, NPC creature types, names can repeat, roster search by Name / User ID with a creature filter and a Newest sort |
| CHANGELOG.md | 🟡 written as I go; turned into a version heading at the end |

**Removed from app.js in 3.0:** `characterKey`, `nameTaken`, `npcIdTaken`,
`otherCharacters`, `activeId`, the `lookupId` workaround, and the duplicate
reset lines in `saveCharacter`.

**Removed in 2.0:** `levelBar`, `setVital`, `setStatValue`, `fillPercent`,
`affordableMax`, `releaseModalFocus`, `startTooltips`, the root `updated`
hook, and the old `getElementById('confirmSaveModal')`.

**Next (if time allows):** StepTracker (removes the last page search,
`scrollToStep`); the gear menu at phone width; the remaining hand-written ⋮
menus (skill category, abilities, spells) onto ActionMenu.

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

**"Why does the navbar emit instead of opening the modal itself?"**
The navbar's job is navigation. Whether leaving needs a warning, and what the
warning says, is the forge page's business. The navbar reports where the user
wanted to go, and the page decides. That's the same split as ActionMenu, which
reports a pick without knowing what it means.

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

**"Why are the menu items in SkillCard and not in app.js?"**
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

**"What would you do next?"**
Finish converting the last modals, fix the two remaining bugs from class
presentations (duplicate-on-save, buffs not saved), and turn the step tracker
into a component to remove the last page search. Optional: a shared navbar
component, since all three pages copy the same navbar.
