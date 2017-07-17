import _ from 'lodash';
import { throttle } from 'lodash/fp';

///////////////////////////////////////////////////////////
//  Nav
////////////////////////////////////////////////////////////

const navbar = document.querySelector('.navbar');

const shrinkNav = (() => {

  window.addEventListener('scroll', _.throttle(function() {

    if (window.pageYOffset >= 1) {
      navbar.classList.add('JS-active');
      navbar.classList.remove('JS-inactive');

    } else {
      navbar.classList.add('JS-inactive');
      navbar.classList.remove('JS-active');
    }
  }, 500));
})();

export { shrinkNav }
