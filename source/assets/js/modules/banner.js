const bannerHeight = (() => {
  const windowHeight = Math.max(window.innerHeight)
  const bannerFull = document.querySelector(".JS-banner--full")
  const bannerSemi = document.querySelector(".JS-banner--semi")
  const bannerImg = document.querySelector(".banner__image")

  const bannerHome = document.querySelectorAll(".JS-banner--full .carousel__item")

  if (matchMedia("screen and (min-width: 600px)").matches) {
    var vhLg = Math.ceil(windowHeight * .9)
    var vhMd = Math.ceil(windowHeight * .9)

  } else {
    var vhLg = Math.ceil(windowHeight)
    var vhMd = Math.ceil(windowHeight)
  }


  if (bannerFull) bannerFull.style.height = `${ vhLg }px`
  if (bannerSemi) bannerSemi.style.height = `${ vhLg }px`

  // Home banner
  if (bannerHome) {
    for (let carouselItem of bannerHome) {
      carouselItem.style.height = `${ vhLg }px`
    }
  }

  if (bannerSemi) {
    bannerImg.style.height = `${ windowHeight }px`
  }

  // console.log(`Aspect ratio = ${screen.width / screen.height}`)
})()

export { bannerHeight }
