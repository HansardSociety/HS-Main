import _ from 'lodash';
import { throttle } from 'lodash/fp';

////////////////////////////////////////////////////////////
//  Global Variables
////////////////////////////////////////////////////////////

var globalState = document.querySelector('.js-global-state');
var navbar = document.querySelector('.navbar');

////////////////////////////////////////////////////////////
//  Toggle state
////////////////////////////////////////////////////////////

// Toggle class
function toggleClass(obj, state) {
  obj.classList.toggle(state);
}

// Toggle state
function toggleState(obj, elem, target) {
  var state = obj.getAttribute('data-change-state');

  toggleClass(obj, elem);
  target.classList.toggle(state);
}

// For-each loop
var forEach = function (array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

////////////////////////////////////////////////////////////
//  Buttons
////////////////////////////////////////////////////////////

// Button change state
var buttonsGlobal = document.querySelectorAll('.button.js-trigger-global');
var buttonsLocal = document.querySelectorAll('.button.js-trigger-local');

// Global
forEach(buttonsGlobal, function (index, value) {
  var exclusiveTriggers = document.querySelectorAll('.js-trigger-exclusive');

  value.onclick = function() {
    var trigger = this;

    // Toggle global state
    toggleState(trigger, 'js-on', globalState);

    // If an exclusive event...
    if (trigger.classList.contains('js-trigger-exclusive')) {

      // Loop through all exclusive triggers
      forEach(exclusiveTriggers, function(index, elem) {

        // If (this) trigger element != other exclusive triggers...
        if ((elem != trigger) && (elem.classList.contains('js-on'))) {
          var state = elem.getAttribute('data-change-state')

          // Remove on- and global-states
          toggleState(elem, 'js-on', globalState);
        }
      });
    }

    // If menu is activated, shrink navbar...
    var menuOn = globalState.classList.toString().indexOf('js-show-menu') > -1
    var navbarOn = navbar.classList.toString().indexOf('js-on') > -1

    if (menuOn === true && navbarOn === false) {
      navbar.classList.toggle('js-on');

    } else if (menuOn === false && window.pageYOffset < 1) {
      navbar.classList.remove('js-on');
    }
  }
});

// Local
forEach(buttonsLocal, function (index, value) {
  value.onclick = function() {
    var local = this.closest('.js-local-state');

    toggleState(this, 'js-on', local);
  }
});

////////////////////////////////////////////////////////////
//  Scrolling
////////////////////////////////////////////////////////////

// Navbar shrink
window.addEventListener('scroll', _.throttle(function() {

  if ( window.pageYOffset >= 1 ) {
    navbar.classList.add('js-on');
  } else {
    navbar.classList.remove('js-on');
  }
}, 600));
