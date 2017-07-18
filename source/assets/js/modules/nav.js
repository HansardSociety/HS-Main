import _ from 'lodash';
import { throttle } from 'lodash/fp';
import { forEach, toggleClass } from './core';

///////////////////////////////////////////////////////////
//  Nav
////////////////////////////////////////////////////////////

const navbar = document.querySelector('.navbar');

const shrinkNav = (() => {
  var navStates = [ 'JS-active', 'JS-active-hold', 'JS-inactive' ]

  function addNavStates() {
    forEach(navStates, function(index, state) {
      navbar.classList.add(state)
    })
  }

  function removeNavStates() {
    forEach(navStates, function(index, state) {
      navbar.classList.remove(state)
    })
  }

  window.addEventListener('scroll', _.throttle(function() {

    if (window.pageYOffset >= 1) {
      addNavStates();
    } else {
      removeNavStates();
    }
  }, 200));
})();

export { shrinkNav }
