import { forEach } from './core';
import { toggleClass } from './core';

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

const toggleState = () => {

  // ** Variables **
  // ****************************

  var stateGlobal   = document.querySelector('.JS-state-global'),
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

        targetSec         = trigger.getAttribute('data-secondary-target'),
        targetSecElem     = document.querySelector('#' + targetSec),
        targetSecInactive = targetSec != undefined && targetSecElem.classList.contains('JS-inactive'),

        noScroll          = 'JS-no-scroll',
        triggerNoScroll   = trigger.classList.contains(noScroll),
        checkNoScroll     = stateGlobal.classList.contains(noScroll);

    // Toggle trigger
    forEach(triggerStates, function(index, state) {
      toggleClass(trigger, state);
    });

    // Toggle target
    forEach(targetElemStates, function(index, state) {
      toggleClass(targetElem, trigger.classList.contains('JS-reverse') ? ++index : state);
    });

    if (triggerNoScroll && !checkNoScroll) {
      toggleClass(stateGlobal, noScroll)

    } else {
      stateGlobal.classList.toggle(noScroll)
    }

    // Secondary target
    if (targetSecInactive) { toggleClass(targetSecElem, 'JS-active'); }
  }

  // ** Exclusive state **
  // ****************************

  const exclState = function(trigger) {
    var exclusiveTriggers = document.querySelectorAll('.JS-exclusive');

    // If an exclusive event...
    if (trigger.classList.contains('JS-exclusive')) {

      // Loop through all exclusive triggers
      forEach(exclusiveTriggers, function(index, elem) {

        // If (this) trigger element != other exclusive triggers...
        if ((elem != trigger)
            && (elem.classList.contains('JS-on')
            && (!elem.classList.contains('JS-reverse', 'JS-on')))) {

          // Toggle global or local state depending on elem...
          changeState(elem);
        }
      });
    }
  }

// ** Toggle state **
// ****************************

  forEach(btns, function(index, btn) {

    btn.onclick = function() {
      changeState(this);
      exclState(this);
    }
  });
}

export default toggleState();








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
