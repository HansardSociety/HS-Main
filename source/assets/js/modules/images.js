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

// Export
export { blazy, blazyCarousel }
