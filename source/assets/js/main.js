import _ from 'lodash';
import { throttle } from 'lodash/fp';
import smoothScroll from 'smooth-scroll';
import swiper from 'swiper';

////////////////////////////////////////////////////////////
//  Core funcations
////////////////////////////////////////////////////////////

// For-each loop
const forEach = function(array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

// Toggle class
const toggleClass = function(obj, className) {
  obj.classList.toggle(className);
}

////////////////////////////////////////////////////////////
//  New JS
////////////////////////////////////////////////////////////

// ** Variables **
// ****************************

var stateGlobal   = document.querySelector('.JS-state-global'),
    btnsGlobal    = document.querySelectorAll('.btn.JS-target-global'),
    btns          = document.querySelectorAll('.btn.JS-off, .btn.JS-on'),
    nav           = document.querySelector('.navbar');

// ** Toggle state - base **
// ****************************

const changeState = function(trigger) {
  var target               = trigger.getAttribute('aria-controls'),
      targetElem           = document.querySelector('#' + target),

      triggerStates        = [ 'JS-on', 'JS-off' ],
      targetElemStates     = [ 'JS-active', 'JS-inactive' ],

      targetSec            = trigger.getAttribute('data-secondary-target'),
      targetSecElem        = document.querySelector('#' + targetSec),
      targetSecInactive    = targetSec != undefined && targetSecElem.classList.toString().indexOf('JS-inactive') > -1,

      noScroll             = 'JS-no-scroll',
      triggerNoScroll      = trigger.classList.toString().indexOf(noScroll) > -1,
      checkNoScroll        = stateGlobal.classList.toString().indexOf(noScroll) > -1;

  // Toggle trigger
  forEach(triggerStates, function(index, state){
    toggleClass(trigger, state);
  });

  // Toggle target
  forEach(targetElemStates, function(index, state){
    toggleClass(targetElem, state);
  });

  // Activate no-scroll
  if (triggerNoScroll && !checkNoScroll) {
    toggleClass(stateGlobal, noScroll);

  } else {
    stateGlobal.classList.remove(noScroll);
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

      // document.querySelector('body').classList.remove('JS-no-scroll');

      // If (this) trigger element != other exclusive triggers...
      if ((elem != trigger) && (elem.classList.contains('JS-on'))) {

        // Toggle global or local state depending on elem...
        changeState(elem);
      }

    });
  }
}

// ** Close all HACK **
// ****************************

var CLOSEALL = document.querySelectorAll('.btn--CLOSEALL');

// Loop through all exclusive triggers
forEach(CLOSEALL, function(index, elem) {

  elem.onclick = function() {
    console.log('CLICK!');

    var JS_ON       = document.querySelectorAll('.JS-on');
    var JS_ACTIVE   = document.querySelectorAll('.JS-active');

    // Loop through all exclusive triggers
    forEach(JS_ON, function(index, elem) {
      elem.classList.remove('JS-on');
      elem.classList.add('JS-off');

    });
    forEach(JS_ACTIVE, function(index, elem) {
      if (elem.classList.toString().indexOf('navbar')) {
        elem.classList.remove('JS-active');
        elem.classList.add('JS-inactive');
      }

    });

    document.querySelector('body').classList.remove('JS-no-scroll');

  }
});



// ** Local state change **
// ****************************

forEach(btns, function(index, btn) {

  btn.onclick = function() {
    changeState(this);
    exclState(this);
  }
});

////////////////////////////////////////////////////////////
//  Navbar
////////////////////////////////////////////////////////////

window.addEventListener('scroll', _.throttle(function() {

  if (window.pageYOffset >= 1) {
    navbar.classList.add('JS-active');
    navbar.classList.remove('JS-inactive');

  } else {
    navbar.classList.add('JS-inactive');
    navbar.classList.remove('JS-active');
  }
}, 500));

////////////////////////////////////////////////////////////
//  Truncate text
////////////////////////////////////////////////////////////

function truncate(container, text) {

  var container       = container,
      containerLines  = Math.round((container.offsetHeight / 1.5) / 18),

      text            = container.querySelector(text),
      textLines       = Math.round((text.offsetHeight / 1.5) / 18),
      textLength      = text.innerText.length,

      // Subtract container lines from text lines to get a
      // negative difference.
      lineDifference  = (textLines - containerLines),

      // Divide line difference by text lines to get point value,
      // eg. 2 / 8 = 0.25, and get opposite by subtracting from 1,
      // ie. 0.75. Then multiply this by the number of characters
      // in the text block, reducing the number of characters by
      // the percentage difference between the conatiner lines
      // and text lines.
      characters      = Math.round(textLength * (1 - (lineDifference / textLines))),
      truncate        = text.innerText.substr(0, characters).trim() + '…';

  // Only execute if text block is larger than its container
  if (containerLines < textLines) {
    text.innerText = truncate;
  }
};

forEach(document.querySelectorAll('.side-card__title'), function(index, elem) {
  truncate(elem, '.title');

  window.onresize = function() {
    truncate(elem, '.title');
  }
});

////////////////////////////////////////////////////////////
//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
////////////////////////////////////////////////////////////

smoothScroll.init({ offset: 64 });

////////////////////////////////////////////////////////////
//  Swiper
//  http://idangero.us/swiper/
////////////////////////////////////////////////////////////

var mySwiper = new Swiper ('.swiper-container', {

  nextButton: '.carousel__next',
  prevButton: '.carousel__prev',

  direction: 'horizontal',
  loop: false,
  slidesPerView: 'auto',
  keyboardControl: true
});















// ////////////////////////////////////////////////////////////
// //  ARCHIVE
// ////////////////////////////////////////////////////////////
//
// // ** Variables **
// // ****************************
//
// var globalState   = document.querySelector('.js-state-global'),
//     buttonsGlobal = document.querySelectorAll('.btn.js-trigger-global'),
//     buttonsLocal  = document.querySelectorAll('.btn.js-trigger-local'),
//     navbar        = document.querySelector('.navbar');
//
// // ** Toggle state - base **
// // ****************************
//
// function toggleState(trigger, className, target) {
//   var state = trigger.getAttribute('data-state-action'),
//       page  = trigger.getAttribute('data-state-page');
//
//   // Toggle trigger class
//   toggleClass(trigger, className);
//
//   // Toggle target scope state
//   toggleClass(target, state);
//
//   if (page != undefined) {
//     toggleClass(globalState, page);
//   }
// }
//
// // ** If exclusive state **
// // ****************************
//
// const exclusiveState = function(trigger) {
//   var exclusiveTriggers = document.querySelectorAll('.JS-exclusive');
//
//   // If an exclusive event...
//   if (trigger.classList.contains('JS-exclusive')) {
//
//     // Loop through all exclusive triggers
//     forEach(exclusiveTriggers, function(index, elem) {
//
//       // If (this) trigger element != other exclusive triggers...
//       if ((elem != trigger) && (elem.classList.contains('JS-on'))) {
//
//         // Toggle global or local state depending on elem...
//         elem.classList.toString().indexOf('JS-exclusive') > -1 ? toggleState(elem, 'JS-on', globalState) : toggleState(elem, 'JS-on', elem.closest('.js-state-local'))
//       }
//     });
//   }
// }
//
// // ** Global state change **
// // ****************************
// // Needed if target element demands specific changes to global state
//
// forEach(buttonsGlobal, function (index, button) {
//
//   button.onclick = function() {
//     var trigger = this;
//
//     // Toggle global state
//     toggleState(trigger, 'js-on', globalState);
//
//     // If exclusive event
//     exclusiveState(trigger);
//   }
// });
//
// // ** Local state change **
// // ****************************
//
// forEach(buttonsLocal, function (index, button) {
//
//   button.onclick = function() {
//     var localState = this.closest('.js-state-local');
//
//     // Toggle local state
//     toggleState(this, 'js-on', localState);
//
//     // Toggle off state
//     toggleClass(localState, 'js-off');
//
//     // If exclusive state
//     exclusiveState(this);
//   }
// });
