import { findById } from '@/helpers/lists.js';

// Everything that touches localStorage, in one place. The forge and the
// roster are separate views, so this is how they share characters.
// localStorage can throw (a private window, a full quota, someone editing
// it by hand). Losing the roster beats the app refusing to load, so these
// fail quietly and say so in the console.

// Not exported: nothing outside this file needs the key names, so nothing
// outside can get them wrong.
const storageKey = 'theForgeCharacters';    // the roster: one array of characters
const seedFlagKey = 'theForgeSamplesAdded'; // set once the samples are added
const nextIdKey = 'theForgeNextId';         // the id counter, kept apart from the roster

export function readCharacters() {
    try {
        const raw = window.localStorage.getItem(storageKey);

        return raw === null ? [] : JSON.parse(raw);
    } catch (error) {
        console.warn('Could not read saved characters:', error);

        return [];
    }
}

export function writeCharacters(characters) {
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(characters));
    } catch (error) {
        console.warn('Could not save characters:', error);
    }
}

// Hand out the next character id and move the counter on. The counter only
// goes up, so an id is never handed out twice, even after a delete.
export function takeNextId() {
    let next = 0;

    try {
        const stored = window.localStorage.getItem(nextIdKey);

        if (stored !== null) {
            next = Number(stored);
        }

        window.localStorage.setItem(nextIdKey, String(next + 1));
    } catch (error) {
        console.warn('Could not update the id counter:', error);
    }

    return next;
}

// One saved character by id, or undefined.
export function findCharacter(id) {
    return findById(readCharacters(), id);
}

// Save a character. A new one (id null) takes the next id from the counter.
// An edit already has its id, so it finds itself and is replaced in place,
// no matter what was renamed. Hands back the id it was saved under.
export function storeCharacter(saved) {
    const characters = readCharacters();

    if (saved.id === null) {
        saved.id = takeNextId();
    }

    const index = characters.findIndex((entry) => entry.id === saved.id);

    if (index === -1) {
        characters.push(saved);
    } else {
        characters[index] = saved;
    }

    writeCharacters(characters);

    return saved.id;
}

// Writes the shortened list straight back, so the roster and what is stored
// cannot disagree.
export function deleteCharacter(id) {
    writeCharacters(readCharacters().filter((entry) => entry.id !== id));
}

// Have the samples been added in this browser? If storage cannot be read,
// say yes, so a broken storage is never filled with samples.
export function samplesAdded() {
    try {
        return window.localStorage.getItem(seedFlagKey) !== null;
    } catch (error) {
        return true;
    }
}

export function markSamplesAdded() {
    try {
        window.localStorage.setItem(seedFlagKey, 'done');
    } catch (error) {
        console.warn('Could not record that samples were added:', error);
    }
}
