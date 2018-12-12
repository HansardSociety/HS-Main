import Flickity from "flickity"

/*		=Options
  ========================================================================== */

var flickityOpts = {
  cellSelector: ".carousel__item",
  contain: true,
  wrapAround: true,
  lazyLoad: false,
  pageDots: true,
  prevNextButtons: false,
  setGallerySize: false,
  cellAlign: "left"
}

/*		=Panel carousel
  ========================================================================== */

const panelCarousel = (function() {
  const allCarouselContainers = document.querySelectorAll(".carousel")

  for (let carouselContainer of allCarouselContainers) {

    const carousel = carouselContainer.querySelector(".carousel__inner")
    const carouselHome = carouselContainer.querySelector(".carousel__inner.carousel__inner--banner")
    const actions = carouselContainer.querySelector(".carousel__actions")
    const prevBtn = actions.querySelector(".carousel__prev")
    const nextBtn = actions.querySelector(".carousel__next")

    /**
     * Initiate Flickity on window load to prevent iOS
     * setting height of item too early.
     */

    document.addEventListener("DOMContentLoaded", function() {


      if (carouselHome) {

        var flickityOptsHome = Object.assign({}, flickityOpts, {
          autoPlay: 5500,
          pauseAutoPlayOnHover: false
        })

        var flickity = new Flickity(carouselHome, flickityOptsHome)

      } else {

        var flickityOptsCards = Object.assign({}, flickityOpts, {})

        if (matchMedia("screen and (max-width: 599px)").matches) {
          var flickityOptsCards = Object.assign({}, flickityOpts, {
            cellAlign: "center"
          })
        }

        var flickity = new Flickity(carousel, flickityOptsCards)
      }

      const allItems = carousel.querySelectorAll(".carousel__item")

      var maxHeight = 0
      for (let item of allItems) {
        var thisHeight = item.clientHeight

        if (thisHeight > maxHeight) maxHeight = thisHeight
      }

      carousel.classList.add("JS-loaded")
      carousel.style.height = `${ maxHeight + 4 }px`

      prevBtn.addEventListener("click", () => {
        flickity.previous()
        flickity.pausePlayer()
      })
      nextBtn.addEventListener("click", () => {
        flickity.next()
        flickity.pausePlayer()
      })
    })
  }
})()

export { panelCarousel }
