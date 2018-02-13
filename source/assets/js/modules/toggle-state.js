import { forEach, toggleClass } from "./core"

const toggleState = (() => {

  const globalState = document.querySelector(".JS-state-global")
  const baseElem = document.querySelector(".site-container")

  const btnsGlobal = baseElem.querySelectorAll(".JS-target-global")
  const btns = baseElem.querySelectorAll(".JS-off, .JS-on")

  // Change state
  function changeState(activeTrigger) {

    // Core
    const on = "JS-on"
    const off = "JS-off"
    const active = "JS-active"
    const activeHold = "JS-active-hold"
    const inactive = "JS-inactive"
    const noScroll = "JS-no-scroll"

    // Global
    const globalNoScroll = globalState.classList.contains(noScroll)

    // Trigger
    const triggerStates = [ "JS-on", "JS-off" ]
    const trigger = activeTrigger
    const triggerTargetID = trigger.getAttribute("aria-controls")
    const triggerSwitch = trigger.classList.contains("JS-switch")
    const triggerNoScroll = trigger.classList.contains(noScroll)
    const triggerExclusive = trigger.classList.contains("JS-exclusive")
    const triggerSecTargetAttr = "data-secondary-target"
    const triggerSecTargetID = trigger.getAttribute(triggerSecTargetAttr)
    const triggerSecTargetAll = Array.from(baseElem.querySelectorAll(`[${ triggerSecTargetAttr }]`))

    // Target
    const targetStates = [ "JS-active", "JS-inactive" ]
    const target = baseElem.querySelector(`#${ triggerTargetID }`)
    const targetHold = target.classList.contains(activeHold)
    const targetSec = triggerSecTargetID && baseElem.querySelector(`#${ triggerSecTargetID }`)
    const targetSecHold = triggerSecTargetID && targetSec.classList.contains(activeHold)

    function toggleEachState(states, elem) {
      forEach(states, function(index, state) {
        toggleClass(elem, state)
      })
    }

    // Core states...
    toggleEachState(triggerStates, trigger)
    toggleEachState(targetStates, target)

    // Determine trigger on/off classes states after state change...
    const triggerOn = trigger.classList.contains(on)
    const triggerOff = trigger.classList.contains(off)

    // Conditions for all triggers with secondary targets
    function triggersWithSecTargets() {

      // Remove active trigger from array of secondary triggers...
      const arrRemoveActiveTrigger = triggerSecTargetAll.filter(function(elem) {
        return elem != trigger
      })

      function checkUniqueSecTarget(elem) {
        if (triggerSecTargetID != elem.getAttribute(triggerSecTargetAttr))
          return elem.getAttribute(triggerSecTargetAttr)
      }

      function checkTriggerOff(elem) {
        return elem.classList.contains(off)
      }

      // If trigger secondary target doesn't match ANY other secondary target...
      if (arrRemoveActiveTrigger.every(checkUniqueSecTarget)) {
        toggleEachState(targetStates, targetSec)

      } else if (triggerOn && !targetSecHold && arrRemoveActiveTrigger.every(checkTriggerOff)) {
        toggleEachState(targetStates, targetSec)

      } else if (triggerOff && !targetSecHold && arrRemoveActiveTrigger.every(checkTriggerOff)) {
        toggleEachState(targetStates, targetSec)
      }
    }

    // Exclusive triggers
    function triggersWithExclusiveStates() {

      // All triggers
      const allTriggersOn = Array.from(baseElem.querySelectorAll(".JS-on"))
      const arrRemoveActiveTrigger = allTriggersOn.filter(function(elem) {
        return elem != trigger
      })

      for (let elem of arrRemoveActiveTrigger) {
        const altTargetID = elem.getAttribute("aria-controls")
        const altTarget = baseElem.querySelector(`#${ altTargetID }`)
        const altTargetSecID = elem.getAttribute(triggerSecTargetAttr)
        const altTargetSec = baseElem.querySelector(`#${ altTargetSecID }`)

        toggleEachState(triggerStates, elem)
        toggleEachState(targetStates, altTarget)

        if (altTargetSecID
        &&  altTargetSec != targetSec ) toggleEachState(targetStates, altTargetSec)
      }
    }

    function changeGlobalState(elem) {

      if (triggerOn && !globalNoScroll) toggleClass(globalState, noScroll)
      else if (triggerOff) globalState.classList.remove(noScroll)
    }

    function triggersWithSwitch() {
      const connectedSwitches = Array.from(baseElem.querySelectorAll(`[aria-controls="${ triggerTargetID }"]`))
      const arrRemoveActiveTrigger = connectedSwitches.filter(function(elem) {
        return elem != trigger
      })

      for (let elem of arrRemoveActiveTrigger) {
        toggleEachState(triggerStates, elem)
      }
    }

    // [1]
    // Must activate triggers" secondary targets before
    // exclusive triggers shut everything down...
    // If trigger has secondary target...
    if (triggerSecTargetID) triggersWithSecTargets()

    // [2]
    // If trigger is exclusive...
    if (triggerExclusive && triggerOn) triggersWithExclusiveStates()

    // [3]
    // If trigger affects global state...
    if (triggerNoScroll) changeGlobalState(trigger)

    // [4]
    // If triggers part of "switch" with other triggers...
    if (triggerSwitch) triggersWithSwitch()
  }

  // Invoke
  forEach(btns, function(index, btn) {
    btn.addEventListener("click", function() {
      changeState(this)
    })
  })
})()

export { toggleState }
