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

    var noScroll             = 'JS-no-scroll';
    var checkNoScroll        = globalState.classList.contains(noScroll);

    // Trigger
    var trigger              = trigger;
    var triggerTargetID      = trigger.getAttribute('aria-controls');
    var triggerSwitch        = trigger.classList.contains('JS-switch');
    var triggerNoScroll      = trigger.classList.contains(noScroll);
    var triggerExclusive     = trigger.classList.contains('JS-exclusive');
    var triggerExclusiveAll  = baseElem.querySelectorAll('.JS-exclusive');
    var triggerSecTargetAttr = 'data-secondary-target';
    var triggerSecTargetID   = trigger.getAttribute(triggerSecTargetAttr);
    var triggerSecTargetAll  = baseElem.querySelectorAll(`button[${ triggerSecTargetAttr }]`);
    var triggerStates        = [ 'JS-on', 'JS-off' ];

    // Target
    var target               = baseElem.querySelector(`#${ triggerTargetID }`);
    var targetSec            = baseElem.querySelector(`#${ triggerSecTargetID }`);
    var targetStates         = [ 'JS-active', 'JS-inactive' ];

    // Toggle trigger
    function toggleEachState(states, triggerElem) {
      forEach(states, function(index, state) {
        toggleClass(triggerElem, state);
      });
    }

    var mapTriggersWithSecTargets = new Map();

    function triggersWithSecTargetMap() {
      forEach(triggerSecTargetAll, function(index, elem) {

        mapTriggersWithSecTargets.set(index, {
          'trigger':   elem == trigger,
          'targetID':  elem.getAttribute(triggerSecTargetAttr),
          'on':        elem.classList.contains('JS-on'),
          'elem': elem
        })
      });
    }

    function validateMap() {
      for (let [key, val] of mapTriggersWithSecTargets) {
        // console.log(val.trigger, val.elem)

        if (val.trigger) {
          console.log('Broken here: ', val.elem)
          break;

        } else {
          console.log('Unbroken here: ', val.elem)
          // return true;
        }
      }
    }

    // Core states...
    toggleEachState(triggerStates, trigger);
    toggleEachState(targetStates, target);

    // If trigger has secondary target...
    if (triggerSecTargetID) {

      triggersWithSecTargetMap();
      validateMap();

      // console.log(validateMap())

      // if (verifyMap() == false) console.log('This == that trigger')

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
