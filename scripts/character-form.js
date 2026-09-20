// Drives the character creation form: swaps the ID field between player and
// NPC, steps through the cards, and gathers the values on submit.

const characterForm = document.querySelector(".character-form");

// Only run on pages that actually have the form.
if (characterForm) {

    // Grab everything we need once, up front
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

    // Step tracker above the form
    const stepProgress = characterForm.querySelector("[data-step-progress]");
    const stepDots = characterForm.querySelectorAll("[data-step-dot]");

    // Modal shown by the Finish button on the last step
    const confirmSaveModal = document.getElementById("confirmSaveModal");
    const confirmSaveButton = document.querySelector("[data-confirm-save]");

    // Page-scoped: the Level slider sits outside the form, in the Vitals card
    const statRanges = document.querySelectorAll(
        'input[type="range"][name]'
    );

    // Everything we collect, filled in step by step
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

    // Show the ID field for the selected type and hide the other.
    // Disabling the unused one keeps it out of the submitted data.
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

    // Grey out the first Save button until a name and an ID are both filled in
    const updateInfoButton = () => {
        const selectedType = characterForm.elements.characterType.value;
        const activeIdInput = selectedType === "npc"
            ? npcIdInput
            : userIdInput;
        const isComplete = characterNameInput.value.trim() !== ""
            && activeIdInput.value.trim() !== "";

        // Bootstrap styles .btn:disabled, and the attribute blocks submitting
        infoSubmitButton.disabled = !isComplete;
    };

    // Copy the current form values into characterState
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

    // Fill the tracker bar to the current step and light up its dots
    const updateStepTracker = (stepIndex) => {
        const percent = (stepIndex / (steps.length - 1)) * 100;

        if (stepProgress) {
            stepProgress.setAttribute("aria-valuenow", Math.round(percent));
            stepProgress.querySelector(".progress-bar")
                .style.width = `${percent}%`;
        }

        stepDots.forEach((dot, index) => {
            const reached = index <= stepIndex;

            dot.classList.toggle("btn-primary", reached);
            dot.classList.toggle("btn-secondary", !reached);
        });
    };

    // Show one step and hide the rest, then bring it into view so the page
    // does not stay scrolled down at the Vitals card above the form
    const showStep = (stepIndex) => {
        steps.forEach((step, index) => {
            step.classList.toggle("d-none", index !== stepIndex);
        });

        updateStepTracker(stepIndex);

        steps[stepIndex].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    // The visible step is the only one without d-none on it
    const getCurrentStepIndex = () => {
        return steps.findIndex(
            (step) => !step.classList.contains("d-none")
        );
    };

    // Listeners
    typeInputs.forEach((input) => {
        input.addEventListener("change", updateCharacterType);
    });

    characterNameInput.addEventListener("input", updateInfoButton);
    userIdInput.addEventListener("input", updateInfoButton);
    npcIdInput.addEventListener("input", updateInfoButton);

    // Each slider writes its value into the matching <output> badge
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

    // Start the tooltips for the whole page
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((element) => new bootstrap.Tooltip(element));

    // Each Save button submits the form and moves to the next step.
    // On the last step, ask for confirmation before saving.
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
        } else if (confirmSaveModal) {
            bootstrap.Modal.getOrCreateInstance(confirmSaveModal).show();
        }
    });

    // Confirming the save clears the form and starts over at step one.
    // A real save would send characterState to the server first.
    if (confirmSaveButton) {
        confirmSaveButton.addEventListener("click", () => {
            const savedName = characterState.name;

            console.log("Complete character:", characterState);

            characterForm.reset();

            // reset() restores the markup defaults, so the pieces driven by
            // JS have to be put back by hand
            statRanges.forEach((range) => {
                range.dispatchEvent(new Event("input"));
            });

            updateCharacterType();
            showStep(0);

            message.classList.remove("d-none", "alert-danger");
            message.classList.add("alert-success");
            message.textContent =
                `Character "${savedName}" saved. Starting a new character.`;
        });
    }

    // Back buttons step backwards, stopping at the first step
    backButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentStepIndex = getCurrentStepIndex();

            if (currentStepIndex > 0) {
                showStep(currentStepIndex - 1);
            }
        });
    });

    // Set the right ID field and tracker state on first load
    updateCharacterType();
    updateStepTracker(getCurrentStepIndex());
}