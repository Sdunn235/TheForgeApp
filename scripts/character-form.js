const characterForm = document.querySelector(".character-form");

if (characterForm) {
    const typeInputs = characterForm.querySelectorAll(
        'input[name="characterType"]'
    );

    const playerField = characterForm.querySelector("[data-player-field]");
    const npcField = characterForm.querySelector("[data-npc-field]");
    const userIdInput = characterForm.elements.userId;
    const npcIdInput = characterForm.elements.npcId;
    const characterNameInput = characterForm.elements.characterName;
    const infoSubmitButton = characterForm.querySelector("[data-info-submit]");

    const steps = [...characterForm.querySelectorAll("[data-step]")];
    const backButtons = characterForm.querySelectorAll(
        "[data-action='back']"
    );

    const message = characterForm.querySelector(
        "[data-character-message]"
    );

    const statRanges = characterForm.querySelectorAll(
        'input[type="range"][name]'
    );

    const characterState = {
        name: "",
        type: "",
        userId: null,
        npcId: null,
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
        skills: [],
        abilities: [],
        spells: [],
        items: []
    };

    const updateCharacterType = () => {
        const selectedType = characterForm.elements.characterType.value;
        const isNpc = selectedType === "npc";

        playerField.classList.toggle("d-none", isNpc);
        npcField.classList.toggle("d-none", !isNpc);

        userIdInput.disabled = isNpc;
        userIdInput.required = !isNpc;

        npcIdInput.disabled = !isNpc;
        npcIdInput.required = isNpc;

        updateInfoButton();
    };

    const updateInfoButton = () => {
        const selectedType = characterForm.elements.characterType.value;
        const activeIdInput = selectedType === "npc"
            ? npcIdInput
            : userIdInput;
        const isComplete = characterNameInput.value.trim() !== ""
            && activeIdInput.value.trim() !== "";

        infoSubmitButton.classList.toggle("btn-disabled", !isComplete);
        infoSubmitButton.classList.toggle("btn-primary", isComplete);
        infoSubmitButton.setAttribute("aria-disabled", String(!isComplete));
    };

    const saveFormData = () => {
        const formData = new FormData(characterForm);
        const selectedType = formData.get("characterType");

        characterState.name = formData.get("characterName");
        characterState.type = selectedType;
        characterState.userId =
            selectedType === "player"
                ? formData.get("userId")
                : null;
        characterState.npcId =
            selectedType === "npc"
                ? formData.get("npcId")
                : null;

        characterState.strength = formData.get("strength");
        characterState.dexterity = formData.get("dexterity");
        characterState.constitution = formData.get("constitution");
        characterState.intelligence = formData.get("intelligence");
        characterState.wisdom = formData.get("wisdom");
        characterState.charisma = formData.get("charisma");


    };

    const showStep = (stepIndex) => {
        steps.forEach((step, index) => {
            step.classList.toggle("d-none", index !== stepIndex);
        });
    };

    const getCurrentStepIndex = () => {
        return steps.findIndex(
            (step) => !step.classList.contains("d-none")
        );
    };

    typeInputs.forEach((input) => {
        input.addEventListener("change", updateCharacterType);
    });

    characterNameInput.addEventListener("input", updateInfoButton);
    userIdInput.addEventListener("input", updateInfoButton);
    npcIdInput.addEventListener("input", updateInfoButton);

    statRanges.forEach((range) => {
        const output = document.getElementById(`${range.id}Value`);

        if (output) {
            output.value = range.value;
            output.textContent = range.value;

            range.addEventListener("input", () => {
                output.value = range.value;
                output.textContent = range.value;
            });
        }
    });

    
    characterForm.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((element) => new bootstrap.Tooltip(element));

    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!characterForm.checkValidity()) {
            characterForm.reportValidity();
            return;
        }

        saveFormData();

        const currentStepIndex = getCurrentStepIndex();
        const nextStepIndex = currentStepIndex + 1;

        if (nextStepIndex < steps.length) {
            showStep(nextStepIndex);
        } else {
            message.classList.remove("d-none", "alert-danger");
            message.classList.add("alert-success");
            message.textContent =
                `Character "${characterState.name}" is ready to save.`;

            console.log("Complete character:", characterState);
        }
    });

    backButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStepIndex = getCurrentStepIndex();

            if (currentStepIndex > 0) {
                showStep(currentStepIndex - 1);
            }
        });
    });

    updateCharacterType();
}