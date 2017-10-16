import Flickity from "flickity"

/*		=Options
  ========================================================================== */

var flktyOpts = {
  cellSelector: ".carousel__item",
  contain: true,
  cellAlign: "left",
  initialIndex: 1,
  lazyLoad: false,
  pageDots: false,
  prevNextButtons: false,
  friction: .8,
  selectedAttraction: .1
}

/*		=Panel carousel
  ========================================================================== */

const panelCarousel = (() => {
  const allContainers = document.querySelectorAll(".carousel")

  for (let container of allContainers) {
    const carousel = container.querySelector(".carousel__inner")
    const actions = container.querySelector(".carousel__actions")
    const prevBtn = actions.querySelector(".carousel__prev")
    const nextBtn = actions.querySelector(".carousel__next")

    // Core config
    const flkty = new Flickity(carousel, flktyOpts)

    // Prev/ next buttons
    prevBtn.addEventListener("click", () => flkty.previous())
    nextBtn.addEventListener("click", () => flkty.next())
  }
})()

export { panelCarousel }
