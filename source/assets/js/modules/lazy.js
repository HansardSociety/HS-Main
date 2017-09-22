import Blazy from "blazy";
import { forEach, toggleClass } from "./core";

/*    bLazy: https://github.com/dinbror/blazy
  ========================================================================== */

// Basic init
const blazy = new Blazy();

// Integrate with Swiper carousels
const blazyCarousel = (() => {
  const baseElem = document.querySelector(".site-container");
  const carouselActions = baseElem.querySelectorAll(".carousel__actions");

  forEach(carouselActions, function(index, action) {

    action.addEventListener("click", function() {
      const carouselImages = action.parentNode.querySelectorAll("img");

      forEach(carouselImages, function(index, img) {

        if (img.classList.contains("b-loaded")) {
          // do nothing
        } else {
          blazy.load(img);
        }
      });
    });
  });
})();

// Lazy load AC main registration script
const blazyNewsletterForm = (() => {
  const baseElem = document.querySelector(".site-container");
  const form = baseElem.querySelector("#newsletter-script");
  const formTriggers = baseElem.querySelectorAll('button[aria-controls="modal-monthly-newsletter-subscription"]');

  forEach(formTriggers, function(index, trigger) {

    trigger.addEventListener("click", function() {

      // console.log("Hello")
      if (form.classList.contains("b-loaded")) {
        // do nothing
      } else {
        blazy.load(form);

        console.log("Hellos")
      }
    });
  });
})();


// Export
export { blazy, blazyCarousel, blazyNewsletterForm }
