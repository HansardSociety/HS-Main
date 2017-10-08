/*    bLazy: https://github.com/dinbror/blazy
  ========================================================================== */

import Blazy from "blazy"

const blazy = new Blazy()

const blazyCarousel = (() => {
  const allCarousels = document.querySelectorAll(".carousel")
  const clickEvents = ["click", "touchstart"]

  for (let carousel of allCarousels) {
    for (let event of clickEvents) {

      carousel.addEventListener(event, () => {
        const images = carousel.querySelectorAll("img")

        for (let img of images) {

          if (img.classList.contains("b-loaded")) {
            // do nothing
          } else {
            blazy.load(img)
          }
        }
      })
    }
  }
})()

export { blazyCarousel }
