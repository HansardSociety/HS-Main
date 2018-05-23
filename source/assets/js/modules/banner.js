const bannerHeight = (() => {
  const vhFull = Math.max(window.innerHeight * .875)
  const vhSemi = Math.max(window.innerHeight * .75)
  const bannerFull = document.querySelector(".JS-banner--full")
  const bannerSemi = document.querySelector(".JS-banner--semi")
  const bannerHome = document.querySelectorAll(".JS-banner--full .carousel__item")
  const bannerImg = document.querySelector(".banner__image")

  if (bannerFull) bannerFull.style.height = `${ vhFull }px`
  if (bannerSemi) bannerSemi.style.height = `${ vhSemi }px`
  if (bannerHome) {
    for (let carouselItem of bannerHome) {
      carouselItem.style.height = `${ vhFull }px`
    }
  }

  bannerImg.style.height = `${ vhFull }px`
})()

export { bannerHeight }
