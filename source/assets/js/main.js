import _ from 'lodash';
import { throttle } from 'lodash/fp';
import smoothScroll from 'smooth-scroll';
import swiper from 'swiper';

////////////////////////////////////////////////////////////
//  Core funcations
////////////////////////////////////////////////////////////

// For-each loop
const forEach = function(array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

// Toggle class
const toggleClass = function(obj, className) {
  obj.classList.toggle(className);
}

////////////////////////////////////////////////////////////
//  New JS
////////////////////////////////////////////////////////////

// ** Variables **
// ****************************

var stateGlobal   = document.querySelector('.JS-state-global'),
    btnsGlobal    = document.querySelectorAll('.btn.JS-target-global'),
    btns          = document.querySelectorAll('.btn.JS-off, .btn.JS-on'),
    nav           = document.querySelector('.navbar');

// ** Toggle state - base **
// ****************************

const changeState = function(trigger) {
  var target               = trigger.getAttribute('aria-controls'),
      targetElem           = document.querySelector('#' + target),

      triggerStates        = [ 'JS-on', 'JS-off' ],
      targetElemStates     = [ 'JS-active', 'JS-inactive' ],

      targetSec            = trigger.getAttribute('data-secondary-target'),
      targetSecElem        = document.querySelector('#' + targetSec),
      targetSecInactive    = targetSec != undefined && targetSecElem.classList.toString().indexOf('JS-inactive') > -1,

      noScroll             = 'JS-no-scroll',
      triggerNoScroll      = trigger.classList.toString().indexOf(noScroll) > -1,
      checkNoScroll        = stateGlobal.classList.toString().indexOf(noScroll) > -1;

  // Toggle trigger
  forEach(triggerStates, function(index, state){
    toggleClass(trigger, state);
  });

  // Toggle target
  forEach(targetElemStates, function(index, state){
    toggleClass(targetElem, state);
  });

  // Activate no-scroll
  if (triggerNoScroll && !checkNoScroll) {
    toggleClass(stateGlobal, noScroll);

  } else {
    stateGlobal.classList.remove(noScroll);
  }

  // Secondary target
  if (targetSecInactive) { toggleClass(targetSecElem, 'JS-active'); }
}

// ** Exclusive state **
// ****************************

const exclState = function(trigger) {
  var exclusiveTriggers = document.querySelectorAll('.JS-exclusive');

  // If an exclusive event...
  if (trigger.classList.contains('JS-exclusive')) {

    // Loop through all exclusive triggers
    forEach(exclusiveTriggers, function(index, elem) {

      // document.querySelector('body').classList.remove('JS-no-scroll');

      // If (this) trigger element != other exclusive triggers...
      if ((elem != trigger) && (elem.classList.contains('JS-on'))) {

        // Toggle global or local state depending on elem...
        changeState(elem);
      }

    });
  }
}

// ** Close all HACK **
// ****************************

var CLOSEALL = document.querySelectorAll('.btn--CLOSEALL');

// Loop through all exclusive triggers
forEach(CLOSEALL, function(index, elem) {

  elem.onclick = function() {
    console.log('CLICK!');

    var JS_ON       = document.querySelectorAll('.JS-on');
    var JS_ACTIVE   = document.querySelectorAll('.JS-active');

    // Loop through all exclusive triggers
    forEach(JS_ON, function(index, elem) {
      elem.classList.remove('JS-on');
      elem.classList.add('JS-off');

    });
    forEach(JS_ACTIVE, function(index, elem) {
      if (elem.classList.toString().indexOf('navbar')) {
        elem.classList.remove('JS-active');
        elem.classList.add('JS-inactive');
      }

    });

    document.querySelector('body').classList.remove('JS-no-scroll');

  }
});

// ** Local state change **
// ****************************

forEach(btns, function(index, btn) {

  btn.onclick = function() {
    changeState(this);
    exclState(this);
  }
});

///////////////////////////////////////////////////////////
//  Navbar
////////////////////////////////////////////////////////////

window.addEventListener('scroll', _.throttle(function() {

  if (window.pageYOffset >= 1) {
    navbar.classList.add('JS-active');
    navbar.classList.remove('JS-inactive');

  } else {
    navbar.classList.add('JS-inactive');
    navbar.classList.remove('JS-active');
  }
}, 500));

////////////////////////////////////////////////////////////
//  Truncate text
////////////////////////////////////////////////////////////

const truncate = (container, content) => {

  var container       = container;

  // Get height of non-content container children
  var nonTextHeight   = 0;
  forEach(container.childNodes, (index, elem) => {

    if (!elem.classList.contains('side-card__title')) {
      nonTextHeight += elem.offsetHeight;
    }
  });

  var text            = container.querySelector(content);
  var textLines       = Math.round((text.offsetHeight / 1.5) / 18) + 2.5; // Add 2.5 lines for padding
  var textLength      = text.innerText.length;

  var containerLines  = Math.round(((container.offsetHeight - nonTextHeight) / 1.5) / 18);

  // Subtract container lines from text lines to get a
  // negative difference.
  var lineDifference  = (textLines - containerLines);

  // Divide line difference by text lines to get point value,
  // eg. 2 / 8 equals 0.25, and get opposite by subtracting from 1,
  // ie. 0.75. Then multiply this by the number of characters
  // in the text block, reducing the number of characters by
  // the percentage difference between the conatiner lines
  // and text lines.
  var characters      = Math.round(textLength * (1 - (lineDifference / textLines)));
  var truncate        = text.innerText.substr(0, characters).trim() + '…';

  // Only execute if text block is larger than its container
  if (containerLines < textLines) {
    text.innerText = truncate;
  }
};

forEach(document.querySelectorAll('.side-card__content'), function(index, elem) {
  truncate(elem, '.JS-truncate');
});

window.onresize = function() {
  forEach(document.querySelectorAll('.side-card__content'), function(index, elem) {
    truncate(elem, '.JS-truncate');
  });
};

////////////////////////////////////////////////////////////
//  Hero image
////////////////////////////////////////////////////////////

var screenHeight = window.innerHeight;
document.querySelector('.banner__image').style.height = `${ screenHeight }px`

////////////////////////////////////////////////////////////
//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
////////////////////////////////////////////////////////////

smoothScroll.init({ offset: 64 });

////////////////////////////////////////////////////////////
//  Swiper
//  http://idangero.us/swiper/
////////////////////////////////////////////////////////////

var screen = {
  xs: 480,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
}

var carousel = new Swiper ('.swiper-container', {

  nextButton: '.carousel__next',
  prevButton: '.carousel__prev',

  direction: 'horizontal',
  loop: false,
  keyboardControl: true,
  preloadImages: false,

  slidesPerView: 3,
  spaceBetween: 9,

  // Lazy-loading
  lazyLoading: true,
  lazyLoadingInPrevNext: true,

  breakpoints: {
    599: {
      slidesPerView: 1
    },
    959: {
      slidesPerView: 2
    }
  }
});

////////////////////////////////////////////////////////////
//  ActiveCampaign
////////////////////////////////////////////////////////////

// ** Home panel newsletter **
// ****************************

window.cfields = [];
window._show_thank_you = function(id, message, trackcmp_url) {
  var form = document.getElementById('_form_' + id + '_'), thank_you = form.querySelector('._form-thank-you');
  form.querySelector('._form-content').style.display = 'none';
  thank_you.innerHTML = message;
  thank_you.style.display = 'block';
  if (typeof(trackcmp_url) != 'undefined' && trackcmp_url) {
    // Site tracking URL to use after inline form submission.
    _load_script(trackcmp_url);
  }
  if (typeof window._form_callback !== 'undefined') window._form_callback(id);
};
window._show_error = function(id, message, html) {
  var form = document.getElementById('_form_' + id + '_'), err = document.createElement('div'), button = form.querySelector('button'), old_error = form.querySelector('._form_error');
  if (old_error) old_error.parentNode.removeChild(old_error);
  err.innerHTML = message;
  err.className = '_error-inner _form_error _no_arrow';
  var wrapper = document.createElement('div');
  wrapper.className = '_form-inner';
  wrapper.appendChild(err);
  button.parentNode.insertBefore(wrapper, button);
  document.querySelector('[id^="_form"][id$="_submit"]').disabled = false;
  if (html) {
    var div = document.createElement('div');
    div.className = '_error-html';
    div.innerHTML = html;
    err.appendChild(div);
  }
};
window._load_script = function(url, callback) {
    var head = document.querySelector('head'), script = document.createElement('script'), r = false;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = url;
    if (callback) {
      script.onload = script.onreadystatechange = function() {
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        callback();
        }
      };
    }
    head.appendChild(script);
};
(function() {
  if (window.location.search.search("excludeform") !== -1) return false;
  var getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  var setCookie = function(name, value) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 60 * 60 * 24 * 365;
    now.setTime(expireTime);
    document.cookie = name + '=' + value + '; expires=' + now + ';path=/';
  }
      var addEvent = function(element, event, func) {
    if (element.addEventListener) {
      element.addEventListener(event, func);
    } else {
      var oldFunc = element['on' + event];
      element['on' + event] = function() {
        oldFunc.apply(this, arguments);
        func.apply(this, arguments);
      };
    }
  }
  var _removed = false;
  var form_to_submit = document.getElementById('_form_1_');
  var allInputs = form_to_submit.querySelectorAll('input, select, textarea'), tooltips = [], submitted = false;

  var getUrlParam = function(name) {
    var regexStr = '[\?&]' + name + '=([^&#]*)';
    var results = new RegExp(regexStr, 'i').exec(window.location.href);
    return results != undefined ? decodeURIComponent(results[1]) : false;
  };

  for (var i = 0; i < allInputs.length; i++) {
    var regexStr = "field\\[(\\d+)\\]";
    var results = new RegExp(regexStr).exec(allInputs[i].name);
    if (results != undefined) {
      allInputs[i].dataset.name = window.cfields[results[1]];
    } else {
      allInputs[i].dataset.name = allInputs[i].name;
    }
    var fieldVal = getUrlParam(allInputs[i].dataset.name);

    if (fieldVal) {
      if (allInputs[i].type == "radio" || allInputs[i].type == "checkbox") {
        if (allInputs[i].value == fieldVal) {
          allInputs[i].checked = true;
        }
      } else {
        allInputs[i].value = fieldVal;
      }
    }
  }

  var remove_tooltips = function() {
    for (var i = 0; i < tooltips.length; i++) {
      tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
    }
      tooltips = [];
  };
  var remove_tooltip = function(elem) {
    for (var i = 0; i < tooltips.length; i++) {
      if (tooltips[i].elem === elem) {
        tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
        tooltips.splice(i, 1);
        return;
      }
    }
  };
  var create_tooltip = function(elem, text) {
    var tooltip = document.createElement('div'), arrow = document.createElement('div'), inner = document.createElement('div'), new_tooltip = {};
    if (elem.type != 'radio' && elem.type != 'checkbox') {
      tooltip.className = '_error';
      arrow.className = '_error-arrow';
      inner.className = '_error-inner';
      inner.innerHTML = text;
      tooltip.appendChild(arrow);
      tooltip.appendChild(inner);
      elem.parentNode.appendChild(tooltip);
    } else {
      tooltip.className = '_error-inner _no_arrow';
      tooltip.innerHTML = text;
      elem.parentNode.insertBefore(tooltip, elem);
      new_tooltip.no_arrow = true;
    }
    new_tooltip.tip = tooltip;
    new_tooltip.elem = elem;
    tooltips.push(new_tooltip);
    return new_tooltip;
  };
  var resize_tooltip = function(tooltip) {
    var rect = tooltip.elem.getBoundingClientRect();
    var doc = document.documentElement, scrollPosition = rect.top - ((window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0));
    if (scrollPosition < 40) {
      tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _below';
    } else {
      tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _above';
    }
  };
  var resize_tooltips = function() {
    if (_removed) return;
    for (var i = 0; i < tooltips.length; i++) {
      if (!tooltips[i].no_arrow) resize_tooltip(tooltips[i]);
    }
  };
  var validate_field = function(elem, remove) {
    var tooltip = null, value = elem.value, no_error = true;
    remove ? remove_tooltip(elem) : false;
    if (elem.type != 'checkbox') elem.className = elem.className.replace(/ ?_has_error ?/g, '');
    if (elem.getAttribute('required') !== null) {
      if (elem.type == 'radio' || (elem.type == 'checkbox' && /any/.test(elem.className))) {
        var elems = form_to_submit.elements[elem.name];
        if (!(elems instanceof NodeList || elems instanceof HTMLCollection) || elems.length <= 1) {
          no_error = elem.checked;
        }
        else {
          no_error = false;
          for (var i = 0; i < elems.length; i++) {
            if (elems[i].checked) no_error = true;
          }
        }
        if (!no_error) {
          tooltip = create_tooltip(elem, "Please select an option.");
        }
      } else if (elem.type =='checkbox') {
        var elems = form_to_submit.elements[elem.name], found = false, err = [];
        no_error = true;
        for (var i = 0; i < elems.length; i++) {
          if (elems[i].getAttribute('required') === null) continue;
          if (!found && elems[i] !== elem) return true;
          found = true;
          elems[i].className = elems[i].className.replace(/ ?_has_error ?/g, '');
          if (!elems[i].checked) {
            no_error = false;
            elems[i].className = elems[i].className + ' _has_error';
            err.push("Checking %s is required".replace("%s", elems[i].value));
          }
        }
        if (!no_error) {
          tooltip = create_tooltip(elem, err.join('<br/>'));
        }
      } else if (elem.tagName == 'SELECT') {
        var selected = true;
        if (elem.multiple) {
          selected = false;
          for (var i = 0; i < elem.options.length; i++) {
            if (elem.options[i].selected) {
              selected = true;
              break;
            }
          }
        } else {
          for (var i = 0; i < elem.options.length; i++) {
            if (elem.options[i].selected && !elem.options[i].value) {
              selected = false;
            }
          }
        }
        if (!selected) {
          no_error = false;
          tooltip = create_tooltip(elem, "Please select an option.");
        }
      } else if (value === undefined || value === null || value === '') {
        elem.className = elem.className + ' _has_error';
        no_error = false;
        tooltip = create_tooltip(elem, "This field is required.");
      }
    }
    if (no_error && elem.name == 'email') {
      if (!value.match(/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)) {
        elem.className = elem.className + ' _has_error';
        no_error = false;
        tooltip = create_tooltip(elem, "Enter a valid email address.");
      }
    }
    if (no_error && /date_field/.test(elem.className)) {
      if (!value.match(/^\d\d\d\d-\d\d-\d\d$/)) {
        elem.className = elem.className + ' _has_error';
        no_error = false;
        tooltip = create_tooltip(elem, "Enter a valid date.");
      }
    }
    tooltip ? resize_tooltip(tooltip) : false;
    return no_error;
  };
  var needs_validate = function(el) {
    return el.name == 'email' || el.getAttribute('required') !== null;
  };
  var validate_form = function(e) {
    var err = form_to_submit.querySelector('._form_error'), no_error = true;
    if (!submitted) {
      submitted = true;
      for (var i = 0, len = allInputs.length; i < len; i++) {
        var input = allInputs[i];
        if (needs_validate(input)) {
          if (input.type == 'text') {
            addEvent(input, 'blur', function() {
              this.value = this.value.trim();
              validate_field(this, true);
            });
            addEvent(input, 'input', function() {
              validate_field(this, true);
            });
          } else if (input.type == 'radio' || input.type == 'checkbox') {
            (function(el) {
              var radios = form_to_submit.elements[el.name];
              for (var i = 0; i < radios.length; i++) {
                addEvent(radios[i], 'click', function() {
                  validate_field(el, true);
                });
              }
            })(input);
          } else if (input.tagName == 'SELECT') {
            addEvent(input, 'change', function() {
              validate_field(input, true);
            });
          }
        }
      }
    }
    remove_tooltips();
    for (var i = 0, len = allInputs.length; i < len; i++) {
      var elem = allInputs[i];
      if (needs_validate(elem)) {
        if (elem.tagName.toLowerCase() !== "select") {
          elem.value = elem.value.trim();
        }
        validate_field(elem) ? true : no_error = false;
      }
    }
    if (!no_error && e) {
      e.preventDefault();
    }
    resize_tooltips();
    return no_error;
  };
  addEvent(window, 'resize', resize_tooltips);
  addEvent(window, 'scroll', resize_tooltips);
  window._old_serialize = null;
  if (typeof serialize !== 'undefined') window._old_serialize = window.serialize;
  _load_script("//d3rxaij56vjege.cloudfront.net/form-serialize/0.3/serialize.min.js", function() {
    window._form_serialize = window.serialize;
    if (window._old_serialize) window.serialize = window._old_serialize;
  });
  var form_submit = function(e) {
    e.preventDefault();
    if (validate_form()) {
      // use this trick to get the submit button & disable it using plain javascript
      document.querySelector('[id^="_form"][id$="_submit"]').disabled = true;
            var serialized = _form_serialize(document.getElementById('_form_1_'));
      var err = form_to_submit.querySelector('._form_error');
      err ? err.parentNode.removeChild(err) : false;
      _load_script('https://hansardsociety.activehosted.com/proc.php?' + serialized + '&jsonp=true');
    }
    return false;
  };
  addEvent(form_to_submit, 'submit', form_submit);
})();
