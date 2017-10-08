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

/*		=Equal height hack: https://codepen.io/desandro/pen/ZXEGVq
  ========================================================================== */

const resize = Flickity.prototype.resize
const resizeClass = "flickity-resize"

Flickity.prototype._createResizeClass = function() {
  this.element.classList.add(resizeClass)
}

Flickity.createMethods.push("_createResizeClass")

Flickity.prototype.resize = function() {
  this.element.classList.remove(resizeClass)
  resize.call(this)
  this.element.classList.add(resizeClass)
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
