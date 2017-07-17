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

  // ** Change state - base **
  // ****************************

  const changeState = function(trigger) {

    var target            = trigger.getAttribute('aria-controls'),
        targetElem        = document.querySelector('#' + target),

        triggerStates     = [ 'JS-on', 'JS-off' ],
        targetElemStates  = [ 'JS-active', 'JS-inactive' ],
        targetTriggers    = document.querySelectorAll(`[aria-controls="${ target }"]`),

        triggerReverse    = trigger.classList.contains('JS-reverse'),
        triggerExclusive  = trigger.classList.contains('JS-exclusive'),

        exclusiveTriggers = document.querySelectorAll('.JS-exclusive'),

        targetSec         = trigger.getAttribute('data-secondary-target'),
        targetSecElem     = document.querySelector('#' + targetSec),
        targetSecInactive = targetSec != undefined && targetSecElem.classList.contains('JS-inactive'),

        noScroll          = 'JS-no-scroll',
        triggerNoScroll   = trigger.classList.contains(noScroll),
        checkNoScroll     = globalState.classList.contains(noScroll);

    // Toggle trigger
    forEach(triggerStates, function(index, state) {
      toggleClass(trigger, state);
    });

    // Toggle target
    forEach(targetElemStates, function(index, state) {
      toggleClass(targetElem, state);
    });

    // Toggle JS-no-scroll
    if (triggerNoScroll) {
      trigger.classList.contains('JS-on')
        ? globalState.classList.add('JS-no-scroll')
        : globalState.classList.remove('JS-no-scroll')
    }

    // Secondary target
    if (targetSecInactive) { toggleClass(targetSecElem, 'JS-active'); }

    // Reverse sibling trigger
    if (triggerReverse) {
      forEach(targetTriggers, function(index, elem) {
        if (elem != trigger) {
          forEach(triggerStates, function(index, state) {
            toggleClass(elem, state);
          });
        }
      });
    }

    // Exclusive state
    if (triggerExclusive) {
      forEach(exclusiveTriggers, function(index, elem) {
        if (elem != trigger) {

          var targetID    = elem.getAttribute('aria-controls');
          var targetElems = document.querySelectorAll('#' + targetID);

          if (elem.classList.contains('JS-on')) {
            toggleClass(elem, 'JS-on');
            toggleClass(elem, 'JS-off');

            forEach(targetElems, function(index, elem) {
              toggleClass(elem, 'JS-active');
              toggleClass(elem, 'JS-inactive');
            });
          }
        }
      });
    }
  }

// ** Toggle state **
// ****************************

  forEach(btns, function(index, btn) {

    btn.onclick = function() {
      changeState(this);
      // exclState(this);
    }
  });
}

export default toggleState();





///////////////////////////////////////////////////////////////////////////////


  // // ** Close all HACK **
  // // ****************************

  // var CLOSEALL = document.querySelectorAll('.btn--CLOSEALL');

  // // Loop through all exclusive triggers
  // forEach(CLOSEALL, function(index, elem) {

  //   elem.onclick = function() {
  //     console.log('CLICK!');

  //     var JS_ON       = document.querySelectorAll('.JS-on');
  //     var JS_ACTIVE   = document.querySelectorAll('.JS-active');

  //     // Loop through all exclusive triggers
  //     forEach(JS_ON, function(index, elem) {
  //       elem.classList.remove('JS-on');
  //       elem.classList.add('JS-off');

  //     });
  //     forEach(JS_ACTIVE, function(index, elem) {
  //       if (elem.classList.toString().indexOf('navbar')) {
  //         elem.classList.remove('JS-active');
  //         elem.classList.add('JS-inactive');
  //       }

  //     });

  //     document.querySelector('body').classList.remove('JS-no-scroll');

  //   }
  // });
