const bannerHeight = (() => {
  const windowHeight = Math.max(window.innerHeight)
  const bannerFull = document.querySelector(".JS-banner--full")
  const bannerSemi = document.querySelector(".JS-banner--semi")
  const bannerImg = document.querySelector(".banner__image")

  const bannerHome = document.querySelectorAll(".JS-banner--full .carousel__item")

  if (matchMedia("screen and (min-width: 600px)").matches) {
    var vhLg = Math.ceil((windowHeight * .9) / 18)
    var vhMd = Math.ceil((windowHeight * .9) / 18)

  } else {
    var vhLg = windowHeight
    var vhMd = windowHeight - 8
  }


  if (bannerFull) bannerFull.style.height = `${ vhLg }rem`
  if (bannerSemi) bannerSemi.style.height = `${ vhMd }rem`

  // Home banner
  if (bannerHome) {
    for (let carouselItem of bannerHome) {
      carouselItem.style.height = `${ vhLg }rem`
    }
  }

  if (bannerSemi) {
    bannerImg.style.height = `${ windowHeight }rem`
  }
})()

export { bannerHeight }
