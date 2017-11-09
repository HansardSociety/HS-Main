import Flickity from "flickity"

/*		=Options
  ========================================================================== */

var flktyOpts = {
  cellSelector: ".carousel__item",
  cellAlign: "left",
  contain: true,
  friction: 1,
  groupCells: true,
  initialIndex: 0,
  lazyLoad: false,
  pageDots: false,
  prevNextButtons: false,
  selectedAttraction: .1,
  setGallerySize: false
}

/*		=Panel carousel
  ========================================================================== */

const panelCarousel = (() => {
  const allCarouselContainers = document.querySelectorAll(".carousel")

  for (let carouselContainer of allCarouselContainers) {
    const carousel = carouselContainer.querySelector(".carousel__inner")
    const actions = carouselContainer.querySelector(".carousel__actions")
    const prevBtn = actions.querySelector(".carousel__prev")
    const nextBtn = actions.querySelector(".carousel__next")

    /**
     * Initiate Flickity on window load to prevent iOS
     * setting height of item too early.
     */
    window.addEventListener("load", function() {
      const flkty = new Flickity(carousel, flktyOpts)
      const allItems = carousel.querySelectorAll(".carousel__item")

      var maxHeight = 0

      for (let item of allItems) {
        var thisHeight = item.clientHeight

        if (thisHeight > maxHeight) maxHeight = thisHeight
      }

      carousel.classList.add("JS-loaded")
      carousel.style.height = `${ maxHeight + 4 }px`

      prevBtn.addEventListener("click", () => flkty.previous())
      nextBtn.addEventListener("click", () => flkty.next())
    })
  }
})()

export { panelCarousel }
