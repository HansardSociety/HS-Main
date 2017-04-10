import _ from 'lodash';
import { throttle } from 'lodash/fp';
import smoothScroll from 'smooth-scroll';

////////////////////////////////////////////////////////////
//  Core funcations
////////////////////////////////////////////////////////////

// Toggle class
function toggleClass(obj, className) {
  obj.classList.toggle(className);
}

// For-each loop
var forEach = function(array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

////////////////////////////////////////////////////////////
//  States
////////////////////////////////////////////////////////////

// ** Variables **
// ****************************

var globalState   = document.querySelector('.js-global-state'),
    buttonsGlobal = document.querySelectorAll('.button.js-trigger-global'),
    buttonsLocal  = document.querySelectorAll('.button.js-trigger-local'),
    navbar        = document.querySelector('.navbar');

// ** Toggle state - base **
// ****************************

function toggleState(trigger, className, target) {
  var state = trigger.getAttribute('data-state-action'),
      page  = trigger.getAttribute('data-state-page');

  // Toggle trigger class
  toggleClass(trigger, className);

  // Toggle target scope state
  toggleClass(target, state);

  if (page != undefined) {
    toggleClass(globalState, page);
  }
}

// ** If exclusive state **
// ****************************

function exclusiveState(trigger) {
  var exclusiveState = document.querySelectorAll('.js-state-exclusive');

  // If an exclusive event...
  if (trigger.classList.contains('js-state-exclusive')) {

    // Loop through all exclusive triggers
    forEach(exclusiveState, function(index, elem) {

      // If (this) trigger element != other exclusive triggers...
      if ((elem != trigger) && (elem.classList.contains('js-on'))) {

        // Toggle global or local state depending on elem...
        elem.classList.toString().indexOf('global') > -1 ? toggleState(elem, 'js-on', globalState) : toggleState(elem, 'js-on', elem.closest('.js-local-state'))
      }
    });
  }
}

// ** Global state change **
// ****************************
// Needed if target element demands specific changes to global state

forEach(buttonsGlobal, function (index, button) {

  button.onclick = function() {
    var trigger = this;

    // Toggle global state
    toggleState(trigger, 'js-on', globalState);

    // If exclusive event
    exclusiveState(trigger);

    // If menu is activated, shrink navbar...
    var menuDesktopOn = globalState.classList.toString().indexOf('js-show-menu-desktop') > -1,
        navbarOn      = navbar.classList.toString().indexOf('js-on') > -1;

    if (menuDesktopOn === true && navbarOn === false) {
      navbar.classList.toggle('js-on');

    } else if (menuDesktopOn === false && window.pageYOffset < 1) {
      navbar.classList.remove('js-on');
    }
  }
});

// ** Local state change **
// ****************************

forEach(buttonsLocal, function (index, button) {

  button.onclick = function() {
    var localState = this.closest('.js-local-state');

    // Toggle local state
    toggleState(this, 'js-on', localState);

    // Toggle off state
    toggleClass(localState, 'js-off');

    // If exclusive state
    exclusiveState(this);
  }
});

////////////////////////////////////////////////////////////
//  Scrolling
////////////////////////////////////////////////////////////

// Navbar shrink
window.addEventListener('scroll', _.throttle(function() {

  if (window.pageYOffset >= 1) {
    navbar.classList.add('js-on');
  } else {
    navbar.classList.remove('js-on');
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

  // const TEXT          = text.innerText;


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
