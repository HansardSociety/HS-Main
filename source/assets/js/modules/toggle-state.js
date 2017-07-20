import { forEach } from './core';
import { toggleClass } from './core';

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

const toggleState = () => {

  // ** Variables **
  // ****************************

  var globalState = document.querySelector('.JS-state-global');
  var baseElem    = document.querySelector('.site-container');

  var btnsGlobal  = baseElem.querySelectorAll('.btn.JS-target-global');
  var btns        = baseElem.querySelectorAll('.btn.JS-off, .btn.JS-on');
  var nav         = baseElem.querySelector('.navbar');

  // Change state
  function changeState(trigger) {

    var on                   = 'JS-on';
    var off                  = 'JS-off';
    var active               = 'JS-active';
    var activeHold           = 'JS-active-hold';
    var inactive             = 'JS-inactive';

    var noScroll             = 'JS-no-scroll';
    var checkNoScroll        = globalState.classList.contains(noScroll);

    // Trigger
    var trigger              = trigger;
    var triggerOn            = trigger.classList.contains('JS-on');
    var triggerOff           = trigger.classList.contains('JS-off');
    var triggerTargetID      = trigger.getAttribute('aria-controls');
    var triggerSwitch        = trigger.classList.contains('JS-switch');
    var triggerNoScroll      = trigger.classList.contains(noScroll);
    var triggerExclusive     = trigger.classList.contains('JS-exclusive');
    var triggerExclusiveAll  = baseElem.querySelectorAll('.JS-exclusive');
    var triggerSecTargetAttr = 'data-secondary-target';
    var triggerSecTargetID   = trigger.getAttribute(triggerSecTargetAttr);
    var triggerSecTargetAll  = Array.from(baseElem.querySelectorAll(`button[${ triggerSecTargetAttr }]`));
    var triggerStates        = [ 'JS-on', 'JS-off' ];

    // Target
    var target               = baseElem.querySelector(`#${ triggerTargetID }`);
    var targetSec            = baseElem.querySelector(`#${ triggerSecTargetID }`);
    var targetSecHold        = baseElem.classList.contains(activeHold);
    var targetStates         = [ 'JS-active', 'JS-inactive' ];

    function toggleEachState(states, triggerElem) {
      forEach(states, function(index, state) {
        toggleClass(triggerElem, state);
      });
    }

    // Core states...
    toggleEachState(triggerStates, trigger);
    toggleEachState(targetStates, target);

    // Conditions for all triggers with secondary targets
    function triggersWithSecTargets() {

      var arrRemoveActiveTrigger = triggerSecTargetAll.filter(function(elem) {
        return elem != trigger;
      })

      function noSameSecTargets(elem) {
        if (triggerSecTargetID != elem.getAttribute(triggerSecTargetAttr)) return elem.getAttribute(triggerSecTargetAttr)
      }

      function activeTriggerOnOthersOff(elem) {
        if (trigger.classList.contains(on)) return elem.classList.contains(off)
      }

      function allTriggersOff(elem) {
        if (trigger.classList.contains(off)) return elem.classList.contains(off)
      }

      // If trigger secondary target doesn't match ANY other scondary target...

      if (arrRemoveActiveTrigger.every(noSameSecTargets)) {
        console.log('No shared secondary target!!')
        toggleEachState(targetStates, targetSec)

      } else if (arrRemoveActiveTrigger.every(activeTriggerOnOthersOff)) {
        console.log('All other triggers off!!')
        toggleEachState(targetStates, targetSec)

      } else if (arrRemoveActiveTrigger.every(allTriggersOff)) {
        console.log('Everything off!!')
        toggleEachState(targetStates, targetSec)
      }
    }

    // If trigger has secondary target...
    if (triggerSecTargetID) {
      triggersWithSecTargets()
    }

    // // Exclusive events
    // if (triggerExclusive) {
    //   forEach(triggerExclusiveAll, function(index, elem) {

    //     var target        = elem.getAttribute('aria-controls');
    //     var targetElem    = baseElem.querySelector(`#${ target }`);
    //     var targetSec     = elem.getAttribute(targetSecAttr);
    //     var targetSecElem = baseElem.querySelector(`#${ targetSec }`);

    //     // Only elems != this
    //     if (elem != trigger) {

    //       // Check if on...
    //       if (elem.classList.contains('JS-on')) {

    //         // Core states...
    //         toggleEachState(triggerStates, elem);
    //         toggleEachState(targetElemStates, targetElem);

    //         if (targetSec) {
    //           if (targetSec != trigger.getAttribute(targetSecAttr)
    //           && targetSecElem.classList.contains('JS-active')) {

    //             toggleEachState(targetElemStates, targetSecElem);
    //           }
    //         }
    //       }
    //     }
    //   });
    // }

    // // Switches
    // if (triggerSwitch) {

    //   var triggerControllers = baseElem.querySelectorAll(`[aria-controls="${ target }"]`);

    //   forEach(triggerControllers, function(index, elem) {
    //     if (elem != trigger) {
    //       toggleEachState(triggerStates, elem);
    //     }
    //   })
    // }
  }

  // Invoke
  forEach(btns, function(index, btn) {
    btn.addEventListener('click', function() {
      changeState(this);
    });
  });
}

export default toggleState();
