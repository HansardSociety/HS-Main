import Blazy from "blazy";
import { forEach, toggleClass } from "./core";

/*    bLazy: https://github.com/dinbror/blazy
  ========================================================================== */

// Basic init
const blazy = new Blazy();

// Integrate with Swiper carousels
const blazyCarousel = (() => {
  const baseElem = document.querySelector(".site-container");
  const carousel = baseElem.querySelectorAll(".carousel");

  forEach(carousel, function(i, action) {
    const clickEvents = ["click", "touchstart"]

    forEach(clickEvents, function(i, event) {
      action.addEventListener(event, function() {
        const carouselImages = action.parentNode.querySelectorAll("img");

        forEach(carouselImages, function(i, img) {

          if (img.classList.contains("b-loaded")) {
            // do nothing
          } else {
            blazy.load(img);
          }
        });
      });
    })
  });
})();

export { blazy, blazyCarousel }
