import smoothScroll from "smooth-scroll"

/*    Smooth Scroll: https://github.com/cferdinandi/smooth-scroll
  ========================================================================== */

const anchorScroll = () => {
  smoothScroll('a[href^="#"]', {
    offset: 64,
    speed: 600
  })
}

export { anchorScroll }
