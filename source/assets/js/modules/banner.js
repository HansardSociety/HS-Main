const bannerHeight = (() => {
  const windowHeight = Math.max(window.innerHeight)
  const vhLg = windowHeight * .9
  const vhMd = windowHeight * .85
  const bannerFull = document.querySelector(".JS-banner--full")
  const bannerSemi = document.querySelector(".JS-banner--semi")
  const bannerImg = document.querySelector(".banner__image")

  const bannerHome = document.querySelectorAll(".JS-banner--full .carousel__item")

  if (bannerFull) bannerFull.style.height = `${ vhLg }px`
  if (bannerSemi) bannerSemi.style.height = `${ vhMd }px`

  // Home banner
  if (bannerHome) {
    for (let carouselItem of bannerHome) {
      carouselItem.style.height = `${ vhLg }px`
    }
  }

  bannerImg.style.height = `${ windowHeight }px`
})()

export { bannerHeight }
