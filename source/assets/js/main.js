import _ from 'lodash';
import { throttle } from 'lodash/fp';

// Toggle class
function toggleClass(obj, state) {
  obj.classList.toggle(state);
}

// Toggle state
function toggleState(obj, elem) {
  var state = obj.getAttribute('data-change-state');

  toggleClass(obj, elem);
  document.querySelector('body').classList.toggle(state);
}

// Button change state
var buttons = document.querySelectorAll('.button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function() {
    toggleState(this, 'js-on');
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
