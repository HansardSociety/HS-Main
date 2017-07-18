import { forEach } from './core';
import { toggleClass } from './core';

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

const toggleState = () => {

  // ** Variables **
  // ****************************

  var globalState   = document.querySelector('.JS-state-global'),
      btnsGlobal    = document.querySelectorAll('.btn.JS-target-global'),
      btns          = document.querySelectorAll('.btn.JS-off, .btn.JS-on'),
      nav           = document.querySelector('.navbar');

  // Change state
  function changeState(trigger) {

    var target            = trigger.getAttribute('aria-controls'),
        targetElem        = document.querySelector(`#${ target }`),

        triggerStates     = [ 'JS-on', 'JS-off' ],
        targetElemStates  = [ 'JS-active', 'JS-inactive' ],

        triggerSwitch     = trigger.classList.contains('JS-switch'),
        triggerExclusive  = trigger.classList.contains('JS-exclusive'),

        exclusiveTriggers = document.querySelectorAll('.JS-exclusive'),

        targetSecAttr     = 'data-secondary-target',
        targetSec         = trigger.getAttribute(targetSecAttr),
        targetSecElem     = document.querySelector(`#${ targetSec }`),

        noScroll          = 'JS-no-scroll',
        triggerNoScroll   = trigger.classList.contains(noScroll),
        checkNoScroll     = globalState.classList.contains(noScroll);

    // Toggle trigger
    function toggleEachState(states, triggerElem) {
      forEach(states, function(index, state) {
        toggleClass(triggerElem, state);
      });
    }

    // Core states...
    toggleEachState(triggerStates, trigger);
    toggleEachState(targetElemStates, targetElem);
    if (targetSec && targetSecElem.classList.contains('JS-inactive')) {
      toggleEachState(targetElemStates, targetSecElem);
    }

    // Exclusive events
    if (triggerExclusive) {

      function turnAllOff() {
        forEach(exclusiveTriggers, function(index, elem) {

          var targetEx        = elem.getAttribute('aria-controls'),
              targetElemEx    = document.querySelector(`#${ targetEx }`),
              targetSecAttrEx = 'data-secondary-target',
              targetSecEx     = elem.getAttribute(targetSecAttrEx),
              targetSecElemEx = document.querySelector(`#${ targetSecEx }`);

          // Only elems != this
          if (elem != trigger) {

            // Check if on...
            if (elem.classList.contains('JS-on')) {
              console.log('<== External elems that were on')

              // Core states...
              toggleEachState(triggerStates, elem);
              toggleEachState(targetElemStates, targetElemEx);

              // Close secondary targets not shared by this trigger...
              if (targetSecEx && targetSec != targetSecEx) {
                toggleEachState(targetElemStates, targetSecElemEx);
              }
            }

          } else if (elem == trigger) {
            if (elem.classList.contains('JS-off')) {
              toggleEachState(targetElemStates, targetSecElemEx);
            }
          }

          // else {
          //   console.log('This element')

          //   // if (targetSec && targetSecElem.classList.contains('JS-inactive')) {
          //   //   toggleEachState(targetElemStates, targetSecElemEx);
          //   // }
          // }

          // // if (elem == trigger) {
          // //   console.log('External elems off')
          // //   // console.log(`${ targetEx }: External elems off`)
          // //   // toggleEachState(targetElemStates, targetSecElemEx);
          // // }
        });
      }

      turnAllOff();
    }

    // Switches
    if (triggerSwitch) {

      var triggerControllers = document.querySelectorAll(`[aria-controls="${ target }"]`);

      forEach(triggerControllers, function(index, elem) {
        if (elem != trigger) {
          toggleEachState(triggerStates, elem);
        }
      })
    }



  }

// ** Toggle state **
// ****************************

  forEach(btns, function(index, btn) {

    btn.addEventListener('click', function() {
      changeState(this);
    });
  });
}

export default toggleState();
