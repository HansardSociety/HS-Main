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

var buttons = document.querySelectorAll('.button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function() {
    toggleState(this, 'js-on');
  }
}
