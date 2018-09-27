const bannerHeight = (() => {
  const windowHeight = Math.max(window.innerHeight)
  const bannerFull = document.querySelector(".JS-banner--full")
  const bannerSemi = document.querySelector(".JS-banner--semi")
  const bannerImg = document.querySelector(".banner__image")

  const bannerHome = document.querySelectorAll(".JS-banner--full .carousel__item")

  if (matchMedia("screen and (min-width: 600px)").matches) {
    var vhLg = windowHeight * .825
    var vhMd = windowHeight * .825

  } else {
    var vhLg = windowHeight
    var vhMd = windowHeight - 8
  }


  if (bannerFull) bannerFull.style.height = `${ vhLg }px`
  if (bannerSemi) bannerSemi.style.height = `${ vhMd }px`

  // Home banner
  if (bannerHome) {
    for (let carouselItem of bannerHome) {
      carouselItem.style.height = `${ vhLg }px`
    }
  }

  if (bannerSemi) {
    bannerImg.style.height = `${ windowHeight }px`
  }
})()

export { bannerHeight }
