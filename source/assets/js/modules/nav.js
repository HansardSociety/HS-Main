import _ from 'lodash';
import { throttle } from 'lodash/fp';
import { forEach, toggleClass } from './core';

///////////////////////////////////////////////////////////
//  Nav
////////////////////////////////////////////////////////////


const shrinkNav = (() => {

  var navbar = document.querySelector('.navbar');
  var navStates = [ 'JS-active', 'JS-active-hold', 'JS-inactive' ];

  function addNavStates() {
    if (navbar.classList.contains('JS-inactive')) {

      forEach(navStates, function(index, state) {
        toggleClass(navbar, state);
      })
    }
  }

  function removeNavStates() {
    if (navbar.classList.contains('JS-active')) {

      forEach(navStates, function(index, state) {
        toggleClass(navbar, state);
      })
    }
  }

  const windowPosition = () => {
    return window.pageYOffset >= 1
    ? addNavStates()
    : removeNavStates();
  };

  window.addEventListener('scroll', _.throttle(function() {

    windowPosition();
  }, 200));
})();

export { shrinkNav }
