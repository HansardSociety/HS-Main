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

///////////////////////////////////////////////////////////
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

const truncate = (container, content) => {

  var container       = container;

  // Get height of non-content container children
  var nonTextHeight   = 0;
  forEach(container.childNodes, (index, elem) => {
    if (!elem.classList.contains('side-card__title')) {
      nonTextHeight = elem.offsetHeight;
    }
  });

  var text            = container.querySelector(content);
  var textLines       = Math.round((text.offsetHeight / 1.5) / 18) + 2; // Add 2 lines for top/ bottom padding
  var textLength      = text.innerText.length;

  var containerLines  = Math.round(((container.offsetHeight - nonTextHeight) / 1.5) / 18);

  // Subtract container lines from text lines to get a
  // negative difference.
  var lineDifference  = (textLines - containerLines);

  // Divide line difference by text lines to get point value,
  // eg. 2 / 8 equals 0.25, and get opposite by subtracting from 1,
  // ie. 0.75. Then multiply this by the number of characters
  // in the text block, reducing the number of characters by
  // the percentage difference between the conatiner lines
  // and text lines.
  var characters      = Math.round(textLength * (1 - (lineDifference / textLines)));
  var truncate        = text.innerText.substr(0, characters).trim() + '…';

  // Only execute if text block is larger than its container
  if (containerLines < textLines) {
    text.innerText = truncate;
  }
};

forEach(document.querySelectorAll('.side-card__content'), function(index, elem) {
  truncate(elem, '.JS-truncate');
});

window.onresize = function() {
  forEach(document.querySelectorAll('.side-card__content'), function(index, elem) {
    truncate(elem, '.JS-truncate');
  });
};

////////////////////////////////////////////////////////////
//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
////////////////////////////////////////////////////////////

smoothScroll.init({ offset: 64 });

////////////////////////////////////////////////////////////
//  Swiper
//  http://idangero.us/swiper/
////////////////////////////////////////////////////////////

var carouselSwiper = new Swiper ('.swiper-container', {

  nextButton: '.carousel__next',
  prevButton: '.carousel__prev',

  direction: 'horizontal',
  loop: false,
  slidesPerView: 'auto',
  keyboardControl: true
});
