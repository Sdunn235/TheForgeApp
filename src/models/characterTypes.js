import Player from '@/models/Player.js';
import Npc from '@/models/Npc.js';

/**
 * Each character class by its type id: { player: Player, npc: Npc }.
 * Used where the code has a type as text and needs the class for it: the
 * forge's Player / NPC radio, and the sample characters.
 *
 * The keys come from the classes (Player.type), so 'player' is still only
 * written once. A lookup table, not a factory: factories are next week.
 */
export const characterTypes = {
    [Player.type]: Player,
    [Npc.type]: Npc,
};
