class projectsHoverEffects {
	constructor({ triggerItems }) {
		this.triggers = document.querySelectorAll(triggerItems);
	}

	init() {
		this.triggers.forEach(trigger => {
			trigger.addEventListener("mouseenter", () => {
				this.#setStyles(trigger);
			});
		});
		this.triggers.forEach(trigger => {
			trigger.addEventListener("mouseleave", () => {
				this.#setDefaultStyles(trigger);
			});
		});
	}

	#setStyles(trigger) {
		const triggerImage = trigger.querySelector("img");
		const triggerText = trigger.querySelector("p");
		triggerImage.style.cssText = `
    transition: all 0.2s ease-in-out;
    filter: brightness(100%);
    `;
		triggerText.style.cssText = `
    transition: all 0.2s ease-in-out;
    opacity: 100%;
    `;
	}

	#setDefaultStyles(trigger) {
		const triggerImage = trigger.querySelector("img");
		const triggerText = trigger.querySelector("p");
		triggerImage.style.cssText = `
    filter: brightness(30%);
    transition: all 0.2s ease-in-out;
    `;
		triggerText.style.cssText = `
    transition: all 0.2s ease-in-out;
    opacity: 66%;
    `;
	}
}

export default projectsHoverEffects;
