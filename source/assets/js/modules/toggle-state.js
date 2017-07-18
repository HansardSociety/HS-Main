import { forEach } from './core';
import { toggleClass } from './core';

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

const toggleState = () => {

  // ** Variables **
  // ****************************

  var globalState   = document.querySelector('.JS-state-global');
  var btnsGlobal    = document.querySelectorAll('.btn.JS-target-global');
  var btns          = document.querySelectorAll('.btn.JS-off, .btn.JS-on');
  var nav           = document.querySelector('.navbar');

  // Change state
  function changeState(trigger) {

    var target            = trigger.getAttribute('aria-controls');
    var targetElem        = document.querySelector(`#${ target }`);

    var triggerStates     = [ 'JS-on', 'JS-off' ];
    var targetElemStates  = [ 'JS-active', 'JS-inactive' ];

    var triggerSwitch     = trigger.classList.contains('JS-switch');
    var triggerExclusive  = trigger.classList.contains('JS-exclusive');

    var exclusiveTriggers = document.querySelectorAll('.JS-exclusive');

    var targetSecAttr     = 'data-secondary-target';
    var targetSec         = trigger.getAttribute(targetSecAttr);
    var targetSecElem     = document.querySelector(`#${ targetSec }`);

    var noScroll          = 'JS-no-scroll';
    var triggerNoScroll   = trigger.classList.contains(noScroll);
    var checkNoScroll     = globalState.classList.contains(noScroll);

    // Toggle trigger
    function toggleEachState(states, triggerElem) {
      forEach(states, function(index, state) {
        toggleClass(triggerElem, state);
      });
    }

    // Core states...
    toggleEachState(triggerStates, trigger);
    toggleEachState(targetElemStates, targetElem);

    if (targetSec) {

      toggleEachState(targetElemStates, targetSecElem);
    }

    // Exclusive events
    if (triggerExclusive) {

      function turnAllOff() {
        forEach(exclusiveTriggers, function(index, elem) {

          var target        = elem.getAttribute('aria-controls');
          var targetElem    = document.querySelector(`#${ target }`);
          var targetSec     = elem.getAttribute(targetSecAttr);
          var targetSecElem = document.querySelector(`#${ targetSec }`);

          // Only elems != this
          if (elem != trigger) {

            // Check if on...
            if (elem.classList.contains('JS-on')) {

              // Core states...
              toggleEachState(triggerStates, elem);
              toggleEachState(targetElemStates, targetElem);

              if (targetSec) {
                if (targetSec != trigger.getAttribute(targetSecAttr)
                && targetSecElem.classList.contains('JS-active')) {

                  toggleEachState(targetElemStates, targetSecElem);
                }
                // else if (targetSecElem.classList.contains('JS-inactive')
                //   &&      !targetSecElem.classList.contains('JS-active-hold')) {

                //   console.log('Two')
                //   toggleEachState(targetElemStates, targetSecElem);
                // }
              }
            }
          }
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

  // Invoke
  forEach(btns, function(index, btn) {
    btn.addEventListener('click', function() {
      changeState(this);
    });
  });
}

export default toggleState();
