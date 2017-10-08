// For-each loop
const forEach = (array, cb, scope) => {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
}

// Toggle class
const toggleClass = (obj, className) => {
  obj.classList.toggle(className);
}

export { forEach, toggleClass }
