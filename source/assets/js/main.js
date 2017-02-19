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

// Show offcanvas
document.querySelector('[data-change-state]').onclick = function() {
  toggleState(this, 'js-on');
}
