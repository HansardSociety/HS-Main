import Blazy from "blazy"

/*    Blazy core
  ========================================================================== */

const blazy = new Blazy()

/*		=Blazy 'clicktivate'
  ========================================================================== */

// Initiates blazy loading on click/ touch
const blazyClicktivate = ({ trigger, events, nestedTargets, nestedElem }) => {
  const allTriggerElems = document.querySelectorAll(trigger)
  const allEvents = events

  for (let triggerElem of allTriggerElems) {
    for (let event of allEvents) {

      triggerElem.addEventListener(event, () => {

        if (nestedTargets) {
          const allTargetElems = triggerElem.querySelectorAll(nestedElem)

          for (let targetElem of allTargetElems) {

            if (targetElem.classList.contains("b-loaded")) {
              // do nothing
            } else {
              blazy.load(targetElem)
            }
          }
        } else {
          const idTarget = triggerElem.getAttribute("aria-controls")
          const idTargetElem = document.querySelector(`#${ idTarget }`)
          const lazyElem = document.querySelector(`#${ idTarget } .b-lazy`)

          if (lazyElem.classList.contains("b-loaded")) {
            // do nothing
          } else {
            blazy.load(lazyElem);
          }
        }
      })
    }
  }
}

// Carousel
const blazyCarousel = (() => blazyClicktivate({
  trigger: ".carousel",
  events: ["click", "touchstart"],
  nestedTargets: true,
  nestedElem: "img"
}))()

// Modal iframes
const blazyModalFrame = (() => blazyClicktivate({
  trigger: ".JS-lazy",
  events: ["click", "touchstart"],
  nestedTargets: false
}))()

// Modal iframes
const blazySearch = (() => blazyClicktivate({
  trigger: ".search",
  events: ["click", "touchstart"],
  nestedTargets: true,
  nestedElem: "img"
}))()


export { blazyCarousel, blazyModalFrame, blazySearch }
