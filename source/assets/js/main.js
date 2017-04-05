import _ from 'lodash';
import { throttle } from 'lodash/fp';

////////////////////////////////////////////////////////////
//  Global Variables
////////////////////////////////////////////////////////////

var navbar = document.querySelector('.navbar');

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

// Toggle class
function toggleClass(obj, className) {
  obj.classList.toggle(className);
}

// Toggle state
function toggleState(trigger, className, target) {
  var state = trigger.getAttribute('data-change-state');

  // Toggle trigger class
  toggleClass(trigger, className);

  // Toggle target scope state
  toggleClass(target, state);

}

// For-each loop
var forEach = function(array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

////////////////////////////////////////////////////////////
//  Buttons
////////////////////////////////////////////////////////////

var globalState = document.querySelector('.js-global-state');

// If exclusive event
function exclusiveState(trigger) {
  var exclusiveTriggers = document.querySelectorAll('.js-trigger-exclusive');

  // If an exclusive event...
  if (trigger.classList.contains('js-trigger-exclusive')) {

    // Loop through all exclusive triggers
    forEach(exclusiveTriggers, function(index, elem) {

      // If (this) trigger element != other exclusive triggers...
      if ((elem != trigger) && (elem.classList.contains('js-on'))) {

        // Toggle global or local state depending on elem...
        elem.classList.toString().indexOf('global') > -1 ? toggleState(elem, 'js-on', globalState) : toggleState(elem, 'js-on', elem.closest('.js-local-state'))
      }
    });
  }
}

// Button change state
var buttonsGlobal = document.querySelectorAll('.button.js-trigger-global');
var buttonsLocal = document.querySelectorAll('.button.js-trigger-local');

// Global state change
forEach(buttonsGlobal, function (index, button) {

  button.onclick = function() {
    var trigger = this;

    // Toggle global state
    toggleState(trigger, 'js-on', globalState);

    // If exclusive event
    exclusiveState(trigger);

    // If menu is activated, shrink navbar...
    var menuDesktopOn = globalState.classList.toString().indexOf('js-show-menu-desktop') > -1;
    var navbarOn = navbar.classList.toString().indexOf('js-on') > -1;

    if (menuDesktopOn === true && navbarOn === false) {
      navbar.classList.toggle('js-on');

    } else if (menuDesktopOn === false && window.pageYOffset < 1) {
      navbar.classList.remove('js-on');
    }
  }
});

// Local state change
forEach(buttonsLocal, function (index, value) {

  value.onclick = function() {
    var localState = this.closest('.js-local-state');

    toggleState(this, 'js-on', localState);

    // If exclusive event
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
