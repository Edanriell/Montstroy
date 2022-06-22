import "../sass/main.sass";
import "swiper/css";
import Swiper, { Navigation, Autoplay, Mousewheel } from "swiper";
import Forms from "./modules/forms";
import Modal from "./modules/modal";
import ItemModal from "./modules/itemModal";
import ProjectsHoverEffects from "./modules/hoverEffects";
import Scroll from "./modules/scroll";
import spinner from "../img/spinner.svg";

Swiper.use([Navigation, Autoplay, Mousewheel]);

window.addEventListener("load", () => {
	const modal = new Modal({
		triggerBtns: "[data-modal]",
		modalSelector: ".modal",
		modalWrapperSelector: ".modal__wrapper",
		showAnimationClass: "modal-fade-in",
		hideAnimationClass: "modal-fade-out",
		closeModalTriggerBtn: ".modal-btn-close",
		closeModalWindowByEsc: true,
		closeModalWindowByClickAndBtn: true
	});

	const itemModal = new ItemModal({
		itemModalSelector: ".product-modal",
		triggersParentElement: ".projects__list",
		database: "http://localhost:3000/projects",
		spinnerSrc: spinner,
		triggerIsButton: true
	});

	const slider = new Swiper(".swiper", {
		navigation: {
			nextEl: ".slider-controls__next-partner",
			prevEl: ".slider-controls__prev-partner"
		},
		autoplay: {
			delay: 2500,
			disableOnInteraction: true
		},
		mousewheel: true,
		slidesPerView: 4,
		spaceBetween: 30,
		loop: true
	});

	const form = new Forms({
		triggerForm: "#form",
		databaseName: "collectedData",
		spinnerSrc: spinner,
		sendDataButton: "#send-data"
	});

	const feedbackForm = new Forms({
		triggerForm: "#feedback",
		databaseName: "feedback",
		spinnerSrc: spinner,
		sendDataButton: "#send-feedback-data"
	});

	const projectsHoverEffects = new ProjectsHoverEffects({
		triggerItems: ".project-list__item"
	});

	const scroll = new Scroll({
		scrollBtnParent: "main"
	});

	slider.init();
	modal.init();
	itemModal.init();
	form.init();
	feedbackForm.init();
	projectsHoverEffects.init();
	scroll.init();
});
