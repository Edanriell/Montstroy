import { getResource } from "../services/requests.js";
import Modal from "./modal.js";
import Notifications from "./notifications.js";
import errorIcon from "../../img/icons/error.svg";
import warningIcon from "../../img/icons/warning.svg";
import successIcon from "../../img/icons/success.svg";
import image1 from "../../img/projects/1/1.jpg";
import image2 from "../../img/projects/2/2.jpg";
import image3 from "../../img/projects/3/3.jpg";
import image4 from "../../img/projects/4/4.jpg";
import image5 from "../../img/projects/5/5.jpg";
import image6 from "../../img/projects/6/6.jpg";
import image7 from "../../img/projects/7/7.jpg";
import image8 from "../../img/projects/8/8.jpg";
import image9 from "../../img/projects/9/9.jpg";

export default class ItemModal {
	static notification = false;

	imageLibrary = [
		{
			image: image1,
			id: "asdasd125"
		},
		{
			image: image2,
			id: "1231231"
		},
		{
			image: image3,
			id: "ashw1352156"
		},
		{
			image: image4,
			id: "5315sdgs"
		},
		{
			image: image5,
			id: "hgjgklgjk2462"
		},
		{
			image: image6,
			id: "d62sd"
		},
		{
			image: image7,
			id: "dfbdfb2352525"
		},
		{
			image: image8,
			id: "fhkjfedg2134523"
		},
		{
			image: image9,
			id: "asdasd1252"
		}
	];

	constructor({
		itemModalSelector,
		triggersParentElement,
		database,
		spinnerSrc,
		triggerIsButton
	}) {
		this.modal = document.querySelector(itemModalSelector);
		this.db = database;
		this.spinner = spinnerSrc;
		this.triggersParent = document.querySelector(triggersParentElement);
		this.triggersLive = this.triggersParent.children;
		this.triggerButton = triggerIsButton;
	}

	init() {
		if (this.triggerButton) {
			for (const element of this.triggersLive) {
				element.querySelector("button").addEventListener("click", this.#cardOnClick);
			}
		} else {
			for (const element of this.triggersLive) {
				element.addEventListener("click", this.#cardOnClick);
			}
		}
	}

	#cardOnClick = event => {
		this.#fetchData(event.target, this.#getId(event.target));
	};

	#fetchData(element, id) {
		this.#displaySpinner(this.#checkTrigger(element));
		getResource(this.db)
			.then(data => {
				this.#hideSpinner(this.#checkTrigger(element));
				this.#createItemModal(id, data);
			})
			.catch(error => {
				if (error.name === "NetworkError") {
					ItemModal.displayNotification(
						"Пожалуйста, проверьте ваше интернет-соединение",
						"error"
					);
					this.#hideSpinner(this.#checkTrigger(element));
				} else if (error instanceof TypeError) {
					this.#hideSpinner(this.#checkTrigger(element));
					ItemModal.displayNotification(
						"Извините, похоже, что-то не так с нашим сервером! Попробуйте позже.",
						"error"
					);
				} else {
					this.#hideSpinner(this.#checkTrigger(element));
					ItemModal.displayNotification(error, "error");
				}
			})
			.finally((ItemModal.notification = false));
	}

	#createItemModal(id, data) {
		const filteredData = data.filter(item => {
			return item.id === id;
		});
		const [{ name, fullDescription }] = filteredData;
		this.#updateItemModalContent(name, this.#findImage(id), fullDescription);
		this.#showModal();
	}

	#findImage(id) {
		const targetImage = this.imageLibrary.filter(image => {
			return image.id === id;
		});
		return targetImage[0].image;
	}

	#updateItemModalContent(name, mainImage, fullDescription) {
		const ItemName = this.modal.querySelector("[data-product-modal='item-name']");
		const mainImg = this.modal.querySelector("[data-product-modal='main-image']");
		const description = this.modal.querySelector("[data-product-modal='main-description']");

		ItemName.innerText = name;
		mainImg.src = mainImage;
		description.innerText = fullDescription;
	}

	#displaySpinner(element) {
		element.style.pointerEvents = "none";
		element.style.userSelect = "none";
		element.children[0].style.cssText = `
      filter: blur(8px);
    `;
		const loaderImg = document.createElement("img");
		loaderImg.classList.add("loader");
		loaderImg.src = this.spinner;
		loaderImg.style.cssText = `
        position: absolute;
        height: 80px;
        width: 80px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
      `;
		element.append(loaderImg);
	}

	#hideSpinner(element) {
		document.querySelector(".loader").remove();
		element.children[0].style.cssText = `
      filter: blur(0);
    `;
		element.style.pointerEvents = "auto";
		element.style.userSelect = "auto";
	}

	static displayNotification(notificationText, notificationType) {
		if (!ItemModal.notification) {
			ItemModal.notification = true;
			const notifications = new Notifications({
				notificationText,
				errorIconSrc: errorIcon,
				warningIconSrc: warningIcon,
				successIconSrc: successIcon,
				showNotificationAnimationClass: "error-fade-in",
				removeNotificationAnimationClass: "error-fade-out",
				removeNotificationByTimeout: true,
				timeoutTime: 5000,
				notificationType
			});
			notifications.init();
		}
	}

	#showModal() {
		const modal = new Modal({
			modalSelector: ".product-modal",
			modalWrapperSelector: ".product-modal__wrapper",
			showAnimationClass: "modal-fade-in",
			hideAnimationClass: "modal-fade-out",
			closeModalTriggerBtn: "[data-product-modal='close-modal']",
			closeModalWindowByEsc: true,
			closeModalWindowByClickAndBtn: true
		});
		modal.showModal();
	}

	#checkTrigger = element => {
		if (this.triggerButton) {
			const { parentElement } = element;
			const newElement = parentElement.parentElement;
			return newElement;
		}
		return element;
	};

	#getId(targetElement) {
		if (this.triggerButton) {
			return targetElement.parentElement.id;
		}
		return targetElement;
	}
}
