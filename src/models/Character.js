import { npcTypes } from '@/data/character.js';
import { abilityCatalog } from '@/data/abilities.js';
import { findById } from '@/helpers/lists.js';
import { maxHpFor, maxMpFor, maxSpFor } from '@/helpers/formulas.js';

// A saved character, as the roster reads it. MVVM's Model: it knows the
// character's facts and how to work things out from them, and nothing about
// how a page shows them (no Bootstrap classes in here).
//
// These used to be about 12 roster methods in app.js that each took a
// character and dug into it (Feature Envy). Now they live on the character
// itself (Move Method).
//
// One class for players and NPCs alike: they differ in one field (type), so
// no Player / NPC subclasses (composition over inheritance).
export default class Character {
    // constructor:    Runs once per "new Character(saved)". Copies the saved
    //                 fields onto this object and fills in anything an older
    //                 save is missing, so nothing below has to check.
    constructor(saved) {
        this.id = saved.id;
        this.name = saved.name || '';
        this.type = saved.type || 'player';
        this.userId = saved.userId || '';
        this.npcType = saved.npcType || '';
        // The defaults first, then whatever was saved on top of them
        this.vitals = { level: 1, hp: 0, mp: 0, sp: 0, ...saved.vitals };
        this.stats = saved.stats || [];
        this.skillCategories = saved.skillCategories || [];
        this.learnedAbilities = saved.learnedAbilities || [];
        this.feats = saved.feats || [];
        this.featAllowance = saved.featAllowance || 0;
        this.spellSchools = saved.spellSchools || [];
        this.learnedSpells = saved.learnedSpells || [];
        this.gearSlots = saved.gearSlots || [];
        this.inventory = saved.inventory || [];
        this.effects = saved.effects || [];
        this.savedAt = saved.savedAt || '';
    }

    // getters:    Read like fields (thorin.level, no brackets), worked out
    //             fresh each time, the way computed properties are.

    get isNpc() {
        return this.type === 'npc';
    }

    get level() {
        return this.vitals.level;
    }

    get typeLabel() {
        return this.isNpc ? 'NPC' : 'Player';
    }

    // The grey badge: a player's User ID, or an NPC's creature type by its
    // readable label ("Beast", not "beast"). Was characterIdLabel (B-15).
    get tagLabel() {
        if (this.isNpc) {
            const kind = findById(npcTypes, this.npcType);

            return kind === undefined ? 'Unknown' : kind.label;
        }

        return this.userId;
    }

    // HP / MP / SP, each as current out of its ceiling. The ceilings come
    // from the same formulas the forge uses, so a roster card and the forge
    // always agree. Same name as the forge's vitalBars: the same idea.
    get vitalBars() {
        const constitution = this.statValue('constitution');

        return [
            { id: 'hp', label: 'HP', value: this.vitals.hp, max: maxHpFor(constitution, this.level) },
            { id: 'mp', label: 'MP', value: this.vitals.mp, max: maxMpFor(this.statValue('wisdom'), this.level) },
            {
                id: 'sp',
                label: 'SP',
                value: this.vitals.sp,
                max: maxSpFor(this.statValue('dexterity'), constitution, this.level),
            },
        ];
    }

    // Learned abilities as full catalog entries, so the sheet shows names
    // rather than the ids that were stored. A chain: flatMap lays every
    // skill's abilities out in one list, then filter keeps the learned ones.
    get abilities() {
        return abilityCatalog
            .flatMap((entry) => entry.abilities)
            .filter((ability) => this.learnedAbilities.includes(ability.id));
    }

    // Learned spells, found in the character's own schools, so a spell keeps
    // whatever level and cost it was saved with.
    get spellbook() {
        return this.spellSchools
            .flatMap((school) => school.spells)
            .filter((spell) => this.learnedSpells.includes(spell.id));
    }

    // Gear slots with the equipped item turned into its name.
    get gear() {
        return this.gearSlots.map((slot) => {
            const item = findById(this.inventory, slot.equipped);

            return {
                id: slot.id,
                label: slot.label,
                itemName: item === undefined ? 'Empty' : item.name,
                filled: item !== undefined,
            };
        });
    }

    // methods:    Like getters, but they take an argument.

    // One attribute's value by id, or 0 if this character does not have it.
    statValue(id) {
        const stat = findById(this.stats, id);

        return stat === undefined ? 0 : stat.value;
    }
}
