import Blazy from "blazy"

const lazyLoading = (() => {

  const blazy = new Blazy()

  /* =Blazy activate
    ***************************************************************************/

  const blazyActivate = ({ trigger, events, nestedTargets, nestedElem, delay }) => {
    const allTriggerElems = document.querySelectorAll(trigger)
    const allEvents = events
    const timeout = delay ? delay : 0

    for (let triggerElem of allTriggerElems) {
      for (let event of allEvents) {

        triggerElem.addEventListener(event, () => {

          if (nestedTargets) {
            const allTargetElems = triggerElem.querySelectorAll(nestedElem)

            for (let targetElem of allTargetElems) {

              if (targetElem.classList.contains("b-loaded")) {
                // do nothing
              } else {
                setTimeout(() => {
                  blazy.load(targetElem)
                }, timeout);
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
  blazyActivate({
    trigger: ".carousel",
    events: ["click", "touchstart"],
    nestedTargets: true,
    nestedElem: "img"
  })

  // iFrame
  blazyActivate({
    trigger: ".JS-site-search",
    events: ["click", "touchstart"],
    nestedTargets: true,
    nestedElem: "iframe",
    delay: 200
  })
})()

export { lazyLoading }
