import _ from 'lodash';
import { throttle } from 'lodash/fp';

// Toggle class
function toggleClass(obj, state) {
  obj.classList.toggle(state);
}

// Toggle state
function toggleState(obj, elem, target) {
  var state = obj.getAttribute('data-change-state');

  toggleClass(obj, elem);
  document.querySelector(target).classList.toggle(state);
}

// Button change state
var buttonsGlobal = document.querySelectorAll('.button.js-global');
var buttonsLocal = document.querySelectorAll('.button.js-local');

for (var i = 0; i < buttonsGlobal.length; i++) {
  buttonsGlobal[i].onclick = function() {
    toggleState(this, 'js-on', 'body');
  }
}

// Navbar scroll
window.addEventListener('scroll', _.throttle(function() {
  var navbar = document.querySelector('.navbar');

  if ( window.pageYOffset > 0 ) {
    navbar.classList.add("js-on");
  } else {
    navbar.classList.remove("js-on");
  }
}, 1000));
