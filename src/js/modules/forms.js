import { postData } from "../services/requests.js";
import Notifications from "./notifications.js";
import errorIcon from "../../img/icons/error.svg";
import warningIcon from "../../img/icons/warning.svg";
import successIcon from "../../img/icons/success.svg";

export default class Forms {
	static notification = false;

	constructor({ triggerForm, databaseName, spinnerSrc, sendDataButton }) {
		this.forms = document.querySelectorAll(triggerForm);
		this.database = databaseName;
		this.spinner = spinnerSrc;
		this.triggerButton = sendDataButton;
	}

	init() {
		this.forms.forEach(form => {
			this.#bindPostData(form, this.database);
		});
	}

	#bindPostData(form, database) {
		form.addEventListener("submit", e => {
			e.preventDefault();
			this.#displayLoader(form, e.target);
			this.#switchButtonText(this.triggerButton);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData(`http://localhost:3000/${database}`, json)
				.then(data => {
					console.log(data);
					document.querySelector(".loader").remove();
					Forms.displaySuccess("Данные успешно отправлены.", "success");
				})
				.catch(error => {
					if (error.name === "NetworkError") {
						Forms.displayError("Пожалуйста, проверьте ваше интернет-соединение");
						document.querySelector(".loader").remove();
					} else if (error instanceof TypeError) {
						Forms.displayError(
							// eslint-disable-next-line max-len
							"Извините, похоже, что-то не так с нашим сервером! Попробуйте позже."
						);
						document.querySelector(".loader").remove();
					} else {
						Forms.displayError(error);
						document.querySelector(".loader").remove();
					}
				})
				.finally(() => {
					this.#switchButtonText(this.triggerButton);
					form.reset();
					Forms.notification = false;
				});
		});
	}

	#displayLoader(form, targetButton) {
		const loaderImg = document.createElement("img");
		loaderImg.classList.add("loader");
		loaderImg.src = this.spinner;
		loaderImg.style.cssText = `
        position: absolute;
        height: 52px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 9999;
      `;
		targetButton.querySelector("button").parentElement.append(loaderImg);
	}

	static displayError(notificationText, notificationType) {
		if (!Forms.notification) {
			Forms.notification = true;
			const notifications = new Notifications({
				notificationText,
				showNotificationAnimationClass: "error-fade-in",
				removeNotificationAnimationClass: "error-fade-out",
				errorIconSrc: errorIcon,
				warningIconSrc: warningIcon,
				successIconSrc: successIcon,
				removeNotificationByTimeout: true,
				timeoutTime: 5000,
				notificationType
			});
			notifications.init();
		}
	}

	static displaySuccess(notificationText, notificationType) {
		const notifications = new Notifications({
			notificationText,
			showNotificationAnimationClass: "error-fade-in",
			removeNotificationAnimationClass: "error-fade-out",
			errorIconSrc: errorIcon,
			warningIconSrc: warningIcon,
			successIconSrc: successIcon,
			removeNotificationByTimeout: true,
			timeoutTime: 5000,
			notificationType
		});
		notifications.init();
	}

	#switchButtonText(selector) {
		const button = document.querySelector(selector);
		// eslint-disable-next-line no-unused-expressions
		button.style.color === "transparent"
			? (button.style.color = "white")
			: (button.style.color = "transparent");
	}
}
