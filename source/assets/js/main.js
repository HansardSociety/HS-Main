import _ from 'lodash';
import { throttle } from 'lodash/fp';

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
var buttonsGlobal = document.querySelectorAll('.button.js-global-trigger');
var buttonsLocal = document.querySelectorAll('.button.js-local-trigger');

// Global
forEach(buttonsGlobal, function (index, value) {
  value.onclick = function() {
    toggleState(this, 'js-on', document.querySelector('.js-global-state'));
  }
});

// Local
forEach(buttonsLocal, function (index, value) {
  value.onclick = function() {
    var local = this.closest('.js-local-state');
    var exclusive = local.classList.contains('js-exclusive-state');

    // If local state is an exclusive adjacent state...
    if (exclusive) {
      var siblings = local.parentNode.children;

      forEach(siblings, function(index, elem) {

        if ((elem != local) && (elem.classList.contains('js-open'))) {
          elem.classList.toggle('js-open');
          elem.querySelector('.js-on').classList.toggle('js-on');
        }
      });

    }

    toggleState(this, 'js-on', local);
  }
});

////////////////////////////////////////////////////////////
//  Scrolling
////////////////////////////////////////////////////////////

// Navbar scroll
window.addEventListener('scroll', _.throttle(function() {
  var navbar = document.querySelector('.navbar');

  if ( window.pageYOffset > 0 ) {
    navbar.classList.add('js-on');
  } else {
    navbar.classList.remove('js-on');
  }
}, 600));
