const bannerHeight = (() => {
  const vhFull = Math.max(window.innerHeight)
  const vhSemi = Math.max(window.innerHeight * .6666)
  const bannerFull = document.querySelector('.JS-banner--full')
  const bannerSemi = document.querySelector('.JS-banner--semi')
  const bannerImg = document.querySelector('.banner__image')

  if (bannerFull) bannerFull.style.height = `${ vhFull }px`
  if (bannerSemi) bannerSemi.style.height = `${ vhSemi }px`

  bannerImg.style.height = `${ vhFull }px`
})()

export { bannerHeight }
