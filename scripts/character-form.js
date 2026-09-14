const characterForm = document.querySelector(".character-form");
const characterSwitch = document.querySelector(".character-type-input");
const playerIdField = document.querySelector(".player-id-field");
const npcIdField = document.querySelector(".npc-id-field");
const userIdInput = document.querySelector('[name="userId"]');
const npcIdInput = document.querySelector('[name="npcId"]');
const characterMessage = document.querySelector(".character-message");

characterSwitch.addEventListener("change", () => {
    const isNpc = characterSwitch.checked;

    playerIdField.classList.toggle("d-none", isNpc);
    npcIdField.classList.toggle("d-none", !isNpc);

    userIdInput.disabled = isNpc;
    userIdInput.required = !isNpc;

    npcIdInput.disabled = !isNpc;
    npcIdInput.required = isNpc;
});

characterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(characterForm);
    const isNpc = characterSwitch.checked;

    const character = {
        name: formData.get("characterName"),
        type: isNpc ? "NPC" : "Player",
        userId: isNpc ? null : formData.get("userId"),
        npcId: isNpc ? formData.get("npcId") : null
    };

    characterMessage.className =
        "alert alert-success mt-3 character-message";

    characterMessage.textContent =
        `${character.type} character "${character.name}" is ready to save.`;

    console.log(character);
});