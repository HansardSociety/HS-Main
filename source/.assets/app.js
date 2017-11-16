webpackJsonp([0],{

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// For-each loop
var forEach = function forEach(array, cb, scope) {
  for (var i = 0; i < array.length; i++) {
    cb.call(scope, i, array[i]);
  }
};

// Toggle class
var toggleClass = function toggleClass(obj, className) {
  obj.classList.toggle(className);
};

exports.forEach = forEach;
exports.toggleClass = toggleClass;

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(60);


/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _toggleState = __webpack_require__(61);

var _banner = __webpack_require__(62);

var _carousel = __webpack_require__(63);

var _feed = __webpack_require__(75);

var _lazy = __webpack_require__(82);

var _scroll = __webpack_require__(83);

var _nav = __webpack_require__(84);

var _truncate = __webpack_require__(94);

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleState = undefined;

var _core = __webpack_require__(21);

var toggleState = function () {

  var globalState = document.querySelector(".JS-state-global");
  var baseElem = document.querySelector(".site-container");

  var btnsGlobal = baseElem.querySelectorAll(".JS-target-global");
  var btns = baseElem.querySelectorAll(".JS-off, .JS-on");

  // Change state
  function changeState(activeTrigger) {

    // Core
    var on = "JS-on";
    var off = "JS-off";
    var active = "JS-active";
    var activeHold = "JS-active-hold";
    var inactive = "JS-inactive";
    var noScroll = "JS-no-scroll";

    // Global
    var globalNoScroll = globalState.classList.contains(noScroll);

    // Trigger
    var triggerStates = ["JS-on", "JS-off"];
    var trigger = activeTrigger;
    var triggerTargetID = trigger.getAttribute("aria-controls");
    var triggerSwitch = trigger.classList.contains("JS-switch");
    var triggerNoScroll = trigger.classList.contains(noScroll);
    var triggerExclusive = trigger.classList.contains("JS-exclusive");
    var triggerSecTargetAttr = "data-secondary-target";
    var triggerSecTargetID = trigger.getAttribute(triggerSecTargetAttr);
    var triggerSecTargetAll = Array.from(baseElem.querySelectorAll("[" + triggerSecTargetAttr + "]"));

    // Target
    var targetStates = ["JS-active", "JS-inactive"];
    var target = baseElem.querySelector("#" + triggerTargetID);
    var targetHold = target.classList.contains(activeHold);
    var targetSec = triggerSecTargetID && baseElem.querySelector("#" + triggerSecTargetID);
    var targetSecHold = triggerSecTargetID && targetSec.classList.contains(activeHold);

    function toggleEachState(states, triggerElem) {
      (0, _core.forEach)(states, function (index, state) {
        (0, _core.toggleClass)(triggerElem, state);
      });
    }

    // Core states...
    toggleEachState(triggerStates, trigger);
    toggleEachState(targetStates, target);

    // Determine trigger on/off classes states after state change...
    var triggerOn = trigger.classList.contains(on);
    var triggerOff = trigger.classList.contains(off);

    // Conditions for all triggers with secondary targets
    function triggersWithSecTargets() {

      // Remove active trigger from array of secondary triggers...
      var arrRemoveActiveTrigger = triggerSecTargetAll.filter(function (elem) {
        return elem != trigger;
      });

      function checkUniqueSecTarget(elem) {
        if (triggerSecTargetID != elem.getAttribute(triggerSecTargetAttr)) return elem.getAttribute(triggerSecTargetAttr);
      }

      function checkTriggerOff(elem) {
        return elem.classList.contains(off);
      }

      // If trigger secondary target doesn"t match ANY other scondary target...
      if (arrRemoveActiveTrigger.every(checkUniqueSecTarget)) {
        toggleEachState(targetStates, targetSec);
      } else if (triggerOn && !targetSecHold && arrRemoveActiveTrigger.every(checkTriggerOff)) {
        toggleEachState(targetStates, targetSec);
      } else if (triggerOff && !targetSecHold && arrRemoveActiveTrigger.every(checkTriggerOff)) {
        toggleEachState(targetStates, targetSec);
      }
    }

    // Exclusive triggers
    function triggersWithExclusiveStates() {

      // All triggers
      var allTriggersOn = Array.from(baseElem.querySelectorAll(".JS-on"));
      var arrRemoveActiveTrigger = allTriggersOn.filter(function (elem) {
        return elem != trigger;
      });

      for (var _iterator = arrRemoveActiveTrigger, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var elem = _ref;

        var altTargetID = elem.getAttribute("aria-controls");
        var altTarget = baseElem.querySelector("#" + altTargetID);
        var altTargetSecID = elem.getAttribute(triggerSecTargetAttr);
        var altTargetSec = baseElem.querySelector("#" + altTargetSecID);

        toggleEachState(triggerStates, elem);
        toggleEachState(targetStates, altTarget);

        if (altTargetSecID && altTargetSec != targetSec) toggleEachState(targetStates, altTargetSec);
      }
    }

    function changeGlobalState(elem) {

      if (triggerOn && !globalNoScroll) (0, _core.toggleClass)(globalState, noScroll);else if (triggerOff) globalState.classList.remove(noScroll);
    }

    function triggersWithSwitch() {
      var connectedSwitches = Array.from(baseElem.querySelectorAll("[aria-controls=\"" + triggerTargetID + "\"]"));
      var arrRemoveActiveTrigger = connectedSwitches.filter(function (elem) {
        return elem != trigger;
      });

      for (var _iterator2 = arrRemoveActiveTrigger, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var elem = _ref2;

        toggleEachState(triggerStates, elem);
      }
    }

    // [1]
    // Must activate triggers" secondary targets before
    // exclusive triggers shut everything down...
    // If trigger has secondary target...
    if (triggerSecTargetID) triggersWithSecTargets();

    // [2]
    // If trigger is exclusive...
    if (triggerExclusive && triggerOn) triggersWithExclusiveStates();

    // [3]
    // If trigger affects global state...
    if (triggerNoScroll) changeGlobalState(trigger);

    // [4]
    // If triggers part of "switch" with other triggers...
    if (triggerSwitch) triggersWithSwitch();
  }

  // Invoke
  (0, _core.forEach)(btns, function (index, btn) {
    btn.addEventListener("click", function () {
      changeState(this);
    });
  });
}();

exports.toggleState = toggleState;

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var bannerHeight = function () {
  var vhFull = Math.max(window.innerHeight);
  var vhSemi = Math.max(window.innerHeight * .6666);
  var bannerFull = document.querySelector('.banner--full');
  var bannerSemi = document.querySelector('.banner--semi');
  var bannerImg = document.querySelector('.banner__image');

  if (bannerFull) bannerFull.style.height = vhFull + 'px';
  if (bannerSemi) bannerSemi.style.height = vhSemi + 'px';

  bannerImg.style.height = vhFull + 'px';
}();

exports.bannerHeight = bannerHeight;

/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelCarousel = undefined;

var _flickity = __webpack_require__(38);

var _flickity2 = _interopRequireDefault(_flickity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*		=Options
  ========================================================================== */

var flktyOpts = {
  cellSelector: ".carousel__item",
  cellAlign: "left",
  contain: true,
  friction: .5,
  wrapAround: true,
  initialIndex: 0,
  lazyLoad: false,
  pageDots: true,
  prevNextButtons: false,
  selectedAttraction: .1,
  setGallerySize: false

  /*		=Panel carousel
    ========================================================================== */

};var panelCarousel = function () {
  var allCarouselContainers = document.querySelectorAll(".carousel");

  var _loop = function _loop(carouselContainer) {
    var carousel = carouselContainer.querySelector(".carousel__inner");
    var actions = carouselContainer.querySelector(".carousel__actions");
    var prevBtn = actions.querySelector(".carousel__prev");
    var nextBtn = actions.querySelector(".carousel__next");

    /**
     * Initiate Flickity on window load to prevent iOS
     * setting height of item too early.
     */
    window.addEventListener("load", function () {
      var flkty = new _flickity2.default(carousel, flktyOpts);
      var allItems = carousel.querySelectorAll(".carousel__item");

      var maxHeight = 0;

      for (var _iterator2 = allItems, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var item = _ref2;

        var thisHeight = item.clientHeight;

        if (thisHeight > maxHeight) maxHeight = thisHeight;
      }

      carousel.classList.add("JS-loaded");
      carousel.style.height = maxHeight + 4 + "px";

      prevBtn.addEventListener("click", function () {
        return flkty.previous();
      });
      nextBtn.addEventListener("click", function () {
        return flkty.next();
      });
    });
  };

  for (var _iterator = allCarouselContainers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var carouselContainer = _ref;

    _loop(carouselContainer);
  }
}();

exports.panelCarousel = panelCarousel;

/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infiniteFeed = undefined;

var _infiniteScroll = __webpack_require__(76);

var _infiniteScroll2 = _interopRequireDefault(_infiniteScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var infiniteFeed = function () {
  var feed = document.querySelector(".feed");

  if (feed) {
    var container = feed.querySelector(".feed__items");
    var feedStatus = feed.querySelector(".feed__status");
    var feedLoad = feed.querySelector(".feed__load");

    var feedCategory = feed.getAttribute("data-feed-category");
    var initialCount = feed.getAttribute("data-feed-count");
    var feedTotal = feed.getAttribute("data-feed-total");

    initialCount = Number(initialCount);
    feedTotal = Number(feedTotal);

    var dedupe = feed.getAttribute("data-feed-dedupe") == "true";

    if (initialCount >= feedTotal) {
      feedStatus.style.display = "none";
      feedLoad.style.display = "none";
    } else {
      var feedPagePath = function feedPagePath() {
        var slug = feedPages[this.loadCount];

        if (slug) return "/" + feedCategory.replace("::", "/") + "/feed/" + slug;
      };

      var initialPagesCount = initialCount / 3;
      if (dedupe) initialPagesCount = initialPagesCount + 2;

      feedTotal = feedTotal - 1;

      var feedPages = [];
      for (var i = initialPagesCount; i < feedTotal; i++) {
        var pageNo = i + 1;

        feedPages.push("page-" + pageNo + ".html");
      }

      var infScroll = new _infiniteScroll2.default(container, {
        path: feedPagePath,
        history: false,
        append: ".feed-item",
        button: feedLoad,
        scrollThreshold: false,
        status: feedStatus
      });
    }
  }
}();

exports.infiniteFeed = infiniteFeed;

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Infinite Scroll v3.0.2
 * Automatically add next page
 *
 * Licensed GPLv3 for open source use
 * or Infinite Scroll Commercial License for commercial use
 *
 * https://infinite-scroll.com
 * Copyright 2017 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
      __webpack_require__(77),
      __webpack_require__(78),
      __webpack_require__(79),
      __webpack_require__(80),
      __webpack_require__(81),
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('./core'),
      require('./page-load'),
      require('./scroll-watch'),
      require('./history'),
      require('./button'),
      require('./status')
    );
  }

})( window, function factory( InfiniteScroll ) {
  return InfiniteScroll;
});


/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// page-load
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( InfiniteScroll ) {
      return factory( window, InfiniteScroll );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./core')
    );
  } else {
    // browser global
    factory(
      window,
      window.InfiniteScroll
    );
  }

}( window, function factory( window, InfiniteScroll ) {

var proto = InfiniteScroll.prototype;

// InfiniteScroll.defaults.append = false;
InfiniteScroll.defaults.loadOnScroll = true;
InfiniteScroll.defaults.checkLastPage = true;
InfiniteScroll.defaults.responseType = 'document';
// InfiniteScroll.defaults.prefill = false;
// InfiniteScroll.defaults.outlayer = null;

InfiniteScroll.create.pageLoad = function() {
  this.canLoad = true;
  this.on( 'scrollThreshold', this.onScrollThresholdLoad );
  this.on( 'append', this.checkLastPage );
  if ( this.options.outlayer ) {
    this.on( 'append', this.onAppendOutlayer );
  }
};

proto.onScrollThresholdLoad = function() {
  if ( this.options.loadOnScroll ) {
    this.loadNextPage();
  }
};

proto.loadNextPage = function() {
  if ( this.isLoading || !this.canLoad ) {
    return;
  }

  var path = this.getAbsolutePath();
  this.isLoading = true;

  var onLoad = function( response ) {
    this.onPageLoad( response, path );
  }.bind( this );

  var onError = function( error ) {
    this.onPageError( error, path );
  }.bind( this );

  request( path, this.options.responseType, onLoad, onError );
  this.dispatchEvent( 'request', null, [ path ] );
};

proto.onPageLoad = function( response, path ) {
  // done loading if not appending
  if ( !this.options.append ) {
    this.isLoading = false;
  }
  this.pageIndex++;
  this.loadCount++;
  this.dispatchEvent( 'load', null, [ response, path ] );
  this.appendNextPage( response, path );
  return response;
};

proto.appendNextPage = function( response, path ) {
  var optAppend = this.options.append;
  // do not append json
  var isDocument = this.options.responseType == 'document';
  if ( !isDocument || !optAppend ) {
    return;
  }

  var items = response.querySelectorAll( optAppend );
  var fragment = getItemsFragment( items );
  var appendReady = function () {
    this.appendItems( items, fragment );
    this.isLoading = false;
    this.dispatchEvent( 'append', null, [ response, path, items ] );
  }.bind( this );

  // TODO add hook for option to trigger appendReady
  if ( this.options.outlayer ) {
    this.appendOutlayerItems( fragment, appendReady );
  } else {
    appendReady();
  }
};

proto.appendItems = function( items, fragment ) {
  if ( !items || !items.length ) {
    return;
  }
  // get fragment if not provided
  fragment = fragment || getItemsFragment( items );
  refreshScripts( fragment );
  this.element.appendChild( fragment );
};

function getItemsFragment( items ) {
  // add items to fragment
  var fragment = document.createDocumentFragment();
  for ( var i=0; items && i < items.length; i++ ) {
    fragment.appendChild( items[i] );
  }
  return fragment;
}

// replace <script>s with copies so they load
// <script>s added by InfiniteScroll will not load
// similar to https://stackoverflow.com/questions/610995
function refreshScripts( fragment ) {
  var scripts = fragment.querySelectorAll('script');
  for ( var i=0; i < scripts.length; i++ ) {
    var script = scripts[i];
    var freshScript = document.createElement('script');
    copyAttributes( script, freshScript );
    script.parentNode.replaceChild( freshScript, script );
  }
}

function copyAttributes( fromNode, toNode ) {
  var attrs = fromNode.attributes;
  for ( var i=0; i < attrs.length; i++ ) {
    var attr = attrs[i];
    toNode.setAttribute( attr.name, attr.value );
  }
}

// ----- outlayer ----- //

proto.appendOutlayerItems = function( fragment, appendReady ) {
  var imagesLoaded = InfiniteScroll.imagesLoaded || window.imagesLoaded;
  if ( !imagesLoaded ) {
    console.error('[InfiniteScroll] imagesLoaded required for outlayer option');
    this.isLoading = false;
    return;
  }
  // append once images loaded
  imagesLoaded( fragment, appendReady );
};

proto.onAppendOutlayer = function( response, path, items ) {
  this.options.outlayer.appended( items );
};

// ----- checkLastPage ----- //

// check response for next element
proto.checkLastPage = function( response, path ) {
  var checkLastPage = this.options.checkLastPage;
  if ( !checkLastPage ) {
    return;
  }

  var pathOpt = this.options.path;
  // if path is function, check if next path is truthy
  if ( typeof pathOpt == 'function' ) {
    var nextPath = this.getPath();
    if ( !nextPath ) {
      this.lastPageReached( response, path );
      return;
    }
  }
  // get selector from checkLastPage or path option
  var selector;
  if ( typeof checkLastPage == 'string' ) {
    selector = checkLastPage;
  } else if ( this.isPathSelector ) {
    // path option is selector string
    selector = pathOpt;
  }
  // check last page for selector
  // bail if no selector or not document response
  if ( !selector || !response.querySelector ) {
    return;
  }
  // check if response has selector
  var nextElem = response.querySelector( selector );
  if ( !nextElem ) {
    this.lastPageReached( response, path );
  }
};

proto.lastPageReached = function( response, path ) {
  this.canLoad = false;
  this.dispatchEvent( 'last', null, [ response, path ] );
};

// ----- error ----- //

proto.onPageError = function( error, path ) {
  this.isLoading = false;
  this.canLoad = false;
  this.dispatchEvent( 'error', null, [ error, path ] );
  return error;
};

// -------------------------- prefill -------------------------- //

InfiniteScroll.create.prefill = function() {
  if ( !this.options.prefill ) {
    return;
  }
  var append = this.options.append;
  if ( !append ) {
    console.error( 'append option required for prefill. Set as :' + append );
    return;
  }
  this.updateMeasurements();
  this.updateScroller();
  this.isPrefilling = true;
  this.on( 'append', this.prefill );
  this.once( 'error', this.stopPrefill );
  this.once( 'last', this.stopPrefill );
  this.prefill();
};

proto.prefill = function() {
  var distance = this.getPrefillDistance();
  this.isPrefilling = distance >= 0;
  if ( this.isPrefilling ) {
    this.log('prefill');
    this.loadNextPage();
  } else {
    this.stopPrefill();
  }
};

proto.getPrefillDistance = function() {
  // element scroll
  if ( this.options.elementScroll ) {
    return this.scroller.clientHeight - this.scroller.scrollHeight;
  }
  // window
  return this.windowHeight - this.element.clientHeight;
};

proto.stopPrefill = function() {
  console.log('stopping prefill');
  this.off( 'append', this.prefill );
};

// -------------------------- request -------------------------- //

function request( url, responseType, onLoad, onError ) {
  var req = new XMLHttpRequest();
  req.open( 'GET', url, true );
  // set responseType document to return DOM
  req.responseType = responseType || '';

  // set X-Requested-With header to check that is ajax request
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  req.onload = function() {
    if ( req.status == 200 ) {
      onLoad( req.response );
    } else {
      // not 200 OK, error
      var error = new Error( req.statusText );
      onError( error );
    }
  };

  // Handle network errors
  req.onerror = function() {
    var error = new Error( 'Network error requesting ' + url );
    onError( error );
  };

  req.send();
}

// --------------------------  -------------------------- //

return InfiniteScroll;

}));


/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// scroll-watch
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
      __webpack_require__(0),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( InfiniteScroll, utils ) {
      return factory( window, InfiniteScroll, utils );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./core'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.InfiniteScroll,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, InfiniteScroll, utils ) {

var proto = InfiniteScroll.prototype;

// default options
InfiniteScroll.defaults.scrollThreshold = 400;
// InfiniteScroll.defaults.elementScroll = null;

InfiniteScroll.create.scrollWatch = function() {
  // events
  this.pageScrollHandler = this.onPageScroll.bind( this );
  this.resizeHandler = this.onResize.bind( this );

  var scrollThreshold = this.options.scrollThreshold;
  var isEnable = scrollThreshold || scrollThreshold === 0;
  if ( isEnable ) {
    this.enableScrollWatch();
  }
};

InfiniteScroll.destroy.scrollWatch = function() {
  this.disableScrollWatch();
};

proto.enableScrollWatch = function() {
  if ( this.isScrollWatching ) {
    return;
  }
  this.isScrollWatching = true;
  this.updateMeasurements();
  this.updateScroller();
  // TODO disable after error?
  this.on( 'last', this.disableScrollWatch );
  this.bindScrollWatchEvents( true );
};

proto.disableScrollWatch = function() {
  if ( !this.isScrollWatching ) {
    return;
  }
  this.bindScrollWatchEvents( false );
  delete this.isScrollWatching;
};

proto.bindScrollWatchEvents = function( isBind ) {
  var addRemove = isBind ? 'addEventListener' : 'removeEventListener';
  this.scroller[ addRemove ]( 'scroll', this.pageScrollHandler );
  window[ addRemove ]( 'resize', this.resizeHandler );
};

proto.onPageScroll = InfiniteScroll.throttle( function() {
  var distance = this.getBottomDistance();
  if ( distance <= this.options.scrollThreshold ) {
    this.dispatchEvent('scrollThreshold');
  }
});

proto.getBottomDistance = function() {
  if ( this.options.elementScroll ) {
    return this.getElementBottomDistance();
  } else {
    return this.getWindowBottomDistance();
  }
};

proto.getWindowBottomDistance = function() {
  var bottom = this.top + this.element.clientHeight;
  var scrollY = window.pageYOffset + this.windowHeight;
  return bottom - scrollY;
};

proto.getElementBottomDistance = function() {
  var bottom = this.scroller.scrollHeight;
  var scrollY = this.scroller.scrollTop + this.scroller.clientHeight;
  return bottom - scrollY;
};

proto.onResize = function() {
  this.updateMeasurements();
};

utils.debounceMethod( InfiniteScroll, 'onResize', 150 );

// --------------------------  -------------------------- //

return InfiniteScroll;

}));


/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// history
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
      __webpack_require__(0),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( InfiniteScroll, utils ) {
      return factory( window, InfiniteScroll, utils );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./core'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.InfiniteScroll,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, InfiniteScroll, utils ) {

var proto = InfiniteScroll.prototype;

InfiniteScroll.defaults.history = 'replace';
// InfiniteScroll.defaults.historyTitle = false;

var link = document.createElement('a');

// ----- create/destroy ----- //

InfiniteScroll.create.history = function() {
  if ( !this.options.history ) {
    return;
  }
  // check for same origin
  link.href = this.getAbsolutePath();
  // MS Edge does not have origin on link https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12236493/
  var linkOrigin = link.origin || link.protocol + '//' + link.host;
  var isSameOrigin = linkOrigin == location.origin;
  if ( !isSameOrigin ) {
    console.error( '[InfiniteScroll] cannot set history with different origin: ' +
      link.origin + ' on ' + location.origin +
      ' . History behavior disabled.' );
    return;
  }

  // two ways to handle changing history
  if ( this.options.append ) {
    this.createHistoryAppend();
  } else {
    this.createHistoryPageLoad();
  }
};

proto.createHistoryAppend = function() {
  this.updateMeasurements();
  this.updateScroller();
  // array of scroll positions of appended pages
  this.scrollPages = [
    {
      // first page
      top: 0,
      path: location.href,
      title: document.title,
    }
  ];
  this.scrollPageIndex = 0;
  // events
  this.scrollHistoryHandler = this.onScrollHistory.bind( this );
  this.unloadHandler = this.onUnload.bind( this );
  this.scroller.addEventListener( 'scroll', this.scrollHistoryHandler );
  this.on( 'append', this.onAppendHistory );
  this.bindHistoryAppendEvents( true );
};

proto.bindHistoryAppendEvents = function( isBind ) {
  var addRemove = isBind ? 'addEventListener' : 'removeEventListener';
  this.scroller[ addRemove ]( 'scroll', this.scrollHistoryHandler );
  window[ addRemove ]( 'unload', this.unloadHandler );
};

proto.createHistoryPageLoad = function() {
  this.on( 'load', this.onPageLoadHistory );
};

InfiniteScroll.destroy.history =
proto.destroyHistory = function() {
  var isHistoryAppend = this.options.history && this.options.append;
  if ( isHistoryAppend ) {
    this.bindHistoryAppendEvents( false );
  }
};

// ----- append history ----- //

proto.onAppendHistory = function( response, path, items ) {
  var firstItem = items[0];
  var elemScrollY = this.getElementScrollY( firstItem );
  // resolve path
  link.href = path;
  // add page data to hash
  this.scrollPages.push({
    top: elemScrollY,
    path: link.href,
    title: response.title,
  });
};

proto.getElementScrollY = function( elem ) {
  if ( this.options.elementScroll ) {
    return this.getElementElementScrollY( elem );
  } else {
    return this.getElementWindowScrollY( elem );
  }
};

proto.getElementWindowScrollY = function( elem ) {
  var rect = elem.getBoundingClientRect();
  return rect.top + window.pageYOffset;
};

// wow, stupid name
proto.getElementElementScrollY = function( elem ) {
  return elem.offsetTop - this.top;
};

proto.onScrollHistory = function() {
  // cycle through positions, find biggest without going over
  var scrollViewY = this.getScrollViewY();
  var pageIndex, page;
  for ( var i=0; i < this.scrollPages.length; i++ ) {
    var scrollPage = this.scrollPages[i];
    if ( scrollPage.top >= scrollViewY ) {
      break;
    }
    pageIndex = i;
    page = scrollPage;
  }
  // set history if changed
  if ( pageIndex != this.scrollPageIndex ) {
    this.scrollPageIndex = pageIndex;
    this.setHistory( page.title, page.path );
  }
};

utils.debounceMethod( InfiniteScroll, 'onScrollHistory', 150 );

proto.getScrollViewY = function() {
  if ( this.options.elementScroll ) {
    return this.scroller.scrollTop + this.scroller.clientHeight/2;
  } else {
    return window.pageYOffset + this.windowHeight/2;
  }
};

proto.setHistory = function( title, path ) {
  var optHistory = this.options.history;
  var historyMethod = optHistory && history[ optHistory + 'State' ];
  if ( !historyMethod ) {
    return;
  }

  history[ optHistory + 'State' ]( null, title, path );

  if ( this.options.historyTitle ) {
    document.title = title;
  }

  this.dispatchEvent( 'history', null, [ title, path ] );
};

// scroll to top to prevent initial scroll-reset after page refresh
// http://stackoverflow.com/a/18633915/182183
proto.onUnload = function() {
  var pageIndex = this.scrollPageIndex;
  if ( pageIndex === 0 ) {
    return;
  }
  // calculate where scroll position would be on refresh
  var scrollPage = this.scrollPages[ pageIndex ];
  var scrollY = window.pageYOffset - scrollPage.top + this.top;
  // disable scroll event before setting scroll #679
  this.destroyHistory();
  scrollTo( 0, scrollY );
};

// ----- load history ----- //

// update URL
proto.onPageLoadHistory = function( response, path ) {
  this.setHistory( response.title, path );
};

// --------------------------  -------------------------- //

return InfiniteScroll;

}));


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// core
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(17),
      __webpack_require__(0),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( EvEmitter, utils) {
      return factory( window, EvEmitter, utils );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.InfiniteScroll = factory(
      window,
      window.EvEmitter,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, EvEmitter, utils ) {

var jQuery = window.jQuery;
// internal store of all InfiniteScroll intances
var instances = {};

function InfiniteScroll( element, options ) {
  var queryElem = utils.getQueryElement( element );

  if ( !queryElem ) {
    console.error( 'Bad element for InfiniteScroll: ' + ( queryElem || element ) );
    return;
  }
  element = queryElem;
  // do not initialize twice on same element
  if ( element.infiniteScrollGUID ) {
    var instance = instances[ element.infiniteScrollGUID ];
    instance.option( options );
    return instance;
  }

  this.element = element;
  // options
  this.options = utils.extend( {}, InfiniteScroll.defaults );
  this.option( options );
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  this.create();
}

// defaults
InfiniteScroll.defaults = {
  // path: null,
  // hideNav: null,
  // debug: false,
};

// create & destroy methods
InfiniteScroll.create = {};
InfiniteScroll.destroy = {};

var proto = InfiniteScroll.prototype;
// inherit EvEmitter
utils.extend( proto, EvEmitter.prototype );

// --------------------------  -------------------------- //

// globally unique identifiers
var GUID = 0;

proto.create = function() {
  // create core
  // add id for InfiniteScroll.data
  var id = this.guid = ++GUID;
  this.element.infiniteScrollGUID = id; // expando
  instances[ id ] = this; // associate via id
  // properties
  this.pageIndex = 1; // default to first page
  this.loadCount = 0;
  this.updateGetPath();
  // bail if getPath not set
  if ( !this.getPath ) {
    console.error('Disabling InfiniteScroll');
    return;
  }
  this.updateGetAbsolutePath();
  this.log( 'initialized', [ this.element.className ] );
  this.callOnInit();
  // create features
  for ( var method in InfiniteScroll.create ) {
    InfiniteScroll.create[ method ].call( this );
  }
};

proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

// call onInit option, used for binding events on init
proto.callOnInit = function() {
  var onInit = this.options.onInit;
  if ( onInit ) {
    onInit.call( this, this );
  }
};

// ----- events ----- //

proto.dispatchEvent = function( type, event, args ) {
  this.log( type, args );
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );
  // trigger jQuery event
  if ( !jQuery || !this.$element ) {
    return;
  }
  // namespace jQuery event
  type += '.infiniteScroll';
  var $event = type;
  if ( event ) {
    // create jQuery event
    var jQEvent = jQuery.Event( event );
    jQEvent.type = type;
    $event = jQEvent;
  }
  this.$element.trigger( $event, args );
};

var loggers = {
  initialized: function( className ) {
    return 'on ' + className;
  },
  request: function( path ) {
    return 'URL: ' + path;
  },
  load: function( response, path ) {
    return ( response.title || '' ) + '. URL: ' + path;
  },
  error: function( error, path ) {
    return error + '. URL: ' + path;
  },
  append: function( response, path, items ) {
    return items.length + ' items. URL: ' + path;
  },
  last: function( response, path ) {
    return 'URL: ' + path;
  },
  history: function( title, path ) {
    return 'URL: ' + path;
  },
  pageIndex: function( index, origin ) {
    return 'current page determined to be: ' + index + ' from ' + origin;
  },
};

// log events
proto.log = function( type, args ) {
  if ( !this.options.debug ) {
    return;
  }
  var message = '[InfiniteScroll] ' + type;
  var logger = loggers[ type ];
  if ( logger ) {
    message += '. ' + logger.apply( this, args );
  }
  console.log( message );
};

// -------------------------- methods used amoung features -------------------------- //

proto.updateMeasurements = function() {
  this.windowHeight = window.innerHeight;
  var rect = this.element.getBoundingClientRect();
  this.top = rect.top + window.pageYOffset;
};

proto.updateScroller = function() {
  var elementScroll = this.options.elementScroll;
  if ( !elementScroll ) {
    // default, use window
    this.scroller = window;
    return;
  }
  // if true, set to element, otherwise use option
  this.scroller = elementScroll === true ? this.element :
    utils.getQueryElement( elementScroll );
  if ( !this.scroller ) {
    throw 'Unable to find elementScroll: ' + elementScroll;
  }
};

// -------------------------- page path -------------------------- //

proto.updateGetPath = function() {
  var optPath = this.options.path;
  if ( !optPath ) {
    console.error( 'InfiniteScroll path option required. Set as: ' + optPath );
    return;
  }
  // function
  var type = typeof optPath;
  if ( type == 'function' ) {
    this.getPath = optPath;
    return;
  }
  // template string: '/pages/{{#}}.html'
  var templateMatch = type == 'string' && optPath.match('{{#}}');
  if ( templateMatch ) {
    this.updateGetPathTemplate( optPath );
    return;
  }
  // selector: '.next-page-selector'
  this.updateGetPathSelector( optPath );
};

proto.updateGetPathTemplate = function( optPath ) {
  // set getPath with template string
  this.getPath = function() {
    var nextIndex = this.pageIndex + 1;
    return optPath.replace( '{{#}}', nextIndex );
  }.bind( this );
  // get pageIndex from location
  // convert path option into regex to look for pattern in location
  var regexString = optPath.replace( '{{#}}', '(\\d\\d?\\d?)' );
  var templateRe = new RegExp( regexString );
  var match = location.href.match( templateRe );
  if ( match ) {
    this.pageIndex = parseInt( match[1], 10 );
    this.log( 'pageIndex', this.pageIndex, 'template string' );
  }
};

var pathRegexes = [
  // WordPress & Tumblr - example.com/page/2
  // Jekyll - example.com/page2
  /^(.*?\/?page\/?)(\d\d?\d?)(.*?$)/,
  // Drupal - example.com/?page=1
  /^(.*?\/?\?page=)(\d\d?\d?)(.*?$)/,
  // catch all, last occurence of a number
  /(.*?)(\d\d?\d?)(?!.*\d)(.*?$)/,
];

proto.updateGetPathSelector = function( optPath ) {
  // parse href of link: '.next-page-link'
  var hrefElem = document.querySelector( optPath );
  if ( !hrefElem ) {
    console.error( 'Bad InfiniteScroll path option. Next link not found: ' +
      optPath );
    return;
  }
  var href = hrefElem.getAttribute('href');
  // try matching href to pathRegexes patterns
  var pathParts, regex;
  for ( var i=0; href && i < pathRegexes.length; i++ ) {
    regex = pathRegexes[i];
    var match = href.match( regex );
    if ( match ) {
      pathParts = match.slice(1); // remove first part
      break;
    }
  }
  if ( !pathParts ) {
    console.error( 'InfiniteScroll unable to parse next link href: ' + href );
    return;
  }
  this.isPathSelector = true; // flag for checkLastPage()
  this.getPath = function() {
    var nextIndex = this.pageIndex + 1;
    return pathParts[0] + nextIndex + pathParts[2];
  }.bind( this );
  // get pageIndex from href
  this.pageIndex = parseInt( pathParts[1], 10 ) - 1;
  this.log( 'pageIndex', [ this.pageIndex, 'next link' ] );
};

proto.updateGetAbsolutePath = function() {
  var path = this.getPath();
  // path doesn't start with http or /
  var isAbsolute = path.match( /^http/ ) || path.match( /^\// );
  if ( isAbsolute ) {
    this.getAbsolutePath = this.getPath;
    return;
  }

  var pathname = location.pathname;
  // /foo/bar/index.html => /foo/bar
  var directory = pathname.substring( 0, pathname.lastIndexOf('/') );

  this.getAbsolutePath = function() {
    return directory + '/' + this.getPath();
  };
};

// -------------------------- nav -------------------------- //

// hide navigation
InfiniteScroll.create.hideNav = function() {
  var nav = utils.getQueryElement( this.options.hideNav );
  if ( !nav ) {
    return;
  }
  nav.style.display = 'none';
  this.nav = nav;
};

InfiniteScroll.destroy.hideNav = function() {
  if ( this.nav ) {
    this.nav.style.display = '';
  }
};

// -------------------------- destroy -------------------------- //

proto.destroy = function() {
  this.allOff(); // remove all event listeners
  // call destroy methods
  for ( var method in InfiniteScroll.destroy ) {
    InfiniteScroll.destroy[ method ].call( this );
  }

  delete this.element.infiniteScrollGUID;
  delete instances[ this.guid ];
};

// -------------------------- utilities -------------------------- //

// https://remysharp.com/2010/07/21/throttling-function-calls
InfiniteScroll.throttle = function( fn, threshold ) {
  threshold = threshold || 200;
  var last, timeout;

  return function() {
    var now = +new Date();
    var args = arguments;
    var trigger = function() {
      last = now;
      fn.apply( this, args );
    }.bind( this );
    if ( last && now < last + threshold ) {
      // hold on to it
      clearTimeout( timeout );
      timeout = setTimeout( trigger, threshold );
    } else {
      trigger();
    }
  };
};

InfiniteScroll.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.infiniteScrollGUID;
  return id && instances[ id ];
};

// set internal jQuery, for Webpack + jQuery v3
InfiniteScroll.setJQuery = function( $ ) {
  jQuery = $;
};

// -------------------------- setup -------------------------- //

utils.htmlInit( InfiniteScroll, 'infinite-scroll' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'infiniteScroll', InfiniteScroll );
}

// --------------------------  -------------------------- //

return InfiniteScroll;

}));


/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// button
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
      __webpack_require__(0),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( InfiniteScroll, utils ) {
      return factory( window, InfiniteScroll, utils );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./core'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.InfiniteScroll,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, InfiniteScroll, utils ) {

// InfiniteScroll.defaults.button = null;

InfiniteScroll.create.button = function() {
  var buttonElem = utils.getQueryElement( this.options.button );
  if ( buttonElem ) {
    this.button = new InfiniteScrollButton( buttonElem, this );
    return;
  }
};

InfiniteScroll.destroy.button = function() {
  if ( this.button ) {
    this.button.destroy();
  }
};

// -------------------------- InfiniteScrollButton -------------------------- //

function InfiniteScrollButton( element, infScroll ) {
  this.element = element;
  this.infScroll = infScroll;
  // events
  this.clickHandler = this.onClick.bind( this );
  this.element.addEventListener( 'click', this.clickHandler );
  infScroll.on( 'request', this.disable.bind( this ) );
  infScroll.on( 'load', this.enable.bind( this ) );
  infScroll.on( 'error', this.hide.bind( this ) );
  infScroll.on( 'last', this.hide.bind( this ) );
}

InfiniteScrollButton.prototype.onClick = function( event ) {
  event.preventDefault();
  this.infScroll.loadNextPage();
};

InfiniteScrollButton.prototype.enable = function() {
  this.element.removeAttribute('disabled');
};

InfiniteScrollButton.prototype.disable = function() {
  this.element.disabled = 'disabled';
};

InfiniteScrollButton.prototype.hide = function() {
  this.element.style.display = 'none';
};

InfiniteScrollButton.prototype.destroy = function() {
  this.element.removeEventListener( 'click', this.clickHandler );
};

// --------------------------  -------------------------- //

InfiniteScroll.Button = InfiniteScrollButton;

return InfiniteScroll;

}));


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// status
( function( window, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(8),
      __webpack_require__(0),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = function( InfiniteScroll, utils ) {
      return factory( window, InfiniteScroll, utils );
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./core'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.InfiniteScroll,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, InfiniteScroll, utils ) { 

var proto = InfiniteScroll.prototype;

// InfiniteScroll.defaults.status = null;

InfiniteScroll.create.status = function() {
  var statusElem = utils.getQueryElement( this.options.status );
  if ( !statusElem ) {
    return;
  }
  // elements
  this.statusElement = statusElem;
  this.statusEventElements = {
    request: statusElem.querySelector('.infinite-scroll-request'),
    error: statusElem.querySelector('.infinite-scroll-error'),
    last: statusElem.querySelector('.infinite-scroll-last'),
  };
  // events
  this.on( 'request', this.showRequestStatus );
  this.on( 'error', this.showErrorStatus );
  this.on( 'last', this.showLastStatus );
  this.bindHideStatus('on');
};

proto.bindHideStatus = function( bindMethod ) {
  var hideEvent = this.options.append ? 'append' : 'load';
  this[ bindMethod ]( hideEvent, this.hideAllStatus );
};

proto.showRequestStatus = function() {
  this.showStatus('request');
};

proto.showErrorStatus = function() {
  this.showStatus('error');
};

proto.showLastStatus = function() {
  this.showStatus('last');
  // prevent last then append event race condition from showing last status #706
  this.bindHideStatus('off');
};

proto.showStatus = function( eventName ) {
  show( this.statusElement );
  this.hideStatusEventElements();
  var eventElem = this.statusEventElements[ eventName ];
  show( eventElem );
};

proto.hideAllStatus = function() {
  hide( this.statusElement );
  this.hideStatusEventElements();
};

proto.hideStatusEventElements = function() {
  for ( var type in this.statusEventElements ) {
    var eventElem = this.statusEventElements[ type ];
    hide( eventElem );
  }
};

// --------------------------  -------------------------- //

function hide( elem ) {
  setDisplay( elem, 'none' );
}

function show( elem ) {
  setDisplay( elem, 'block' );
}

function setDisplay( elem, value ) {
  if ( elem ) {
    elem.style.display = value;
  }
}

// --------------------------  -------------------------- //

return InfiniteScroll;

}));


/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blazyModalFrame = exports.blazyCarousel = undefined;

var _blazy = __webpack_require__(42);

var _blazy2 = _interopRequireDefault(_blazy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*    Blazy core
  ========================================================================== */

var blazy = new _blazy2.default();

/*		=Blazy 'clicktivate'
  ========================================================================== */

// Initiates blazy loading on click/ touch
var blazyClicktivate = function blazyClicktivate(_ref) {
  var trigger = _ref.trigger,
      nestedTargets = _ref.nestedTargets,
      nestedElem = _ref.nestedElem;

  var allTriggerElems = document.querySelectorAll(trigger);
  var allEvents = ["click", "touchstart"];

  var _loop = function _loop(triggerElem) {
    for (var _iterator2 = allEvents, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var event = _ref3;


      triggerElem.addEventListener(event, function () {

        if (nestedTargets) {
          var allTargetElems = triggerElem.querySelectorAll(nestedElem);

          for (var _iterator3 = allTargetElems, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref4 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref4 = _i3.value;
            }

            var targetElem = _ref4;


            if (targetElem.classList.contains("b-loaded")) {
              // do nothing
            } else {
              blazy.load(targetElem);
            }
          }
        } else {
          var idTarget = triggerElem.getAttribute("aria-controls");
          var idTargetElem = document.querySelector("#" + idTarget);
          var lazyElem = document.querySelector("#" + idTarget + " .b-lazy");

          if (lazyElem.classList.contains("b-loaded")) {
            // do nothing
          } else {
            blazy.load(lazyElem);
          }
        }
      });
    }
  };

  for (var _iterator = allTriggerElems, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var triggerElem = _ref2;

    _loop(triggerElem);
  }
};

// Carousel
var blazyCarousel = function () {
  return blazyClicktivate({
    trigger: ".carousel",
    nestedTargets: true,
    nestedElem: "img"
  });
}();

// Modal iframes
var blazyModalFrame = function () {
  return blazyClicktivate({
    trigger: ".JS-lazy",
    nestedTargets: false
  });
}();

exports.blazyCarousel = blazyCarousel;
exports.blazyModalFrame = blazyModalFrame;

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anchorScroll = undefined;

var _smoothScroll = __webpack_require__(43);

var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*    Smooth Scroll: https://github.com/cferdinandi/smooth-scroll
  ========================================================================== */

var anchorScroll = function () {
  var scroll = new _smoothScroll2.default('a[href^="#"]', {
    offset: 64,
    speed: 600
  });
}();

exports.anchorScroll = anchorScroll;

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shrinkNav = undefined;

var _throttle = __webpack_require__(44);

var _throttle2 = _interopRequireDefault(_throttle);

var _core = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shrinkNav = function () {

  var navbar = document.querySelector(".navbar");
  var navStates = ["JS-active", "JS-active-hold", "JS-inactive"];

  var addNavStates = function addNavStates() {
    if (navbar.classList.contains("JS-inactive")) (0, _core.forEach)(navStates, function (index, state) {
      return (0, _core.toggleClass)(navbar, state);
    });
  };

  var removeNavStates = function removeNavStates() {
    if (navbar.classList.contains("JS-active")) (0, _core.forEach)(navStates, function (index, state) {
      return (0, _core.toggleClass)(navbar, state);
    });
  };

  var windowPosition = function windowPosition() {
    window.pageYOffset >= 1 ? addNavStates() : removeNavStates();
  };

  window.onload = windowPosition();

  window.addEventListener("scroll", (0, _throttle2.default)(function () {

    windowPosition();
  }, 400));
}();

exports.shrinkNav = shrinkNav;

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateText = undefined;

var _core = __webpack_require__(21);

var truncateText = function () {
  var truncate = function truncate(container, content) {

    var container = container;

    // Get height of non-content container children
    var nonTextHeight = 0;
    (0, _core.forEach)(container.childNodes, function (index, elem) {

      if (elem.classList !== undefined && !elem.classList.contains('side-card__title')) {
        nonTextHeight + elem.offsetHeight;
      }
    });

    var text = container.querySelector(content);
    var textLines = Math.round(text.offsetHeight / 1.5 / 18) + 4;
    var textLength = text.innerText.length;

    var containerLines = Math.round((container.offsetHeight - nonTextHeight) / 1.5 / 18);

    // Subtract container lines from text lines to get a
    // negative difference.
    var lineDifference = textLines - containerLines;

    // Divide line difference by text lines to get point value,
    // eg. 2 / 8 equals 0.25, and get opposite by subtracting from 1,
    // ie. 0.75. Then multiply this by the number of characters
    // in the text block, reducing the number of characters by
    // the percentage difference between the conatiner lines
    // and text lines.
    var characters = Math.round(textLength * (1 - lineDifference / textLines));
    var truncate = text.innerText.substr(0, characters).trim() + '…';

    // Only execute if text block is larger than its container
    if (containerLines < textLines) {
      text.innerText = truncate;
    }
  };

  (0, _core.forEach)(document.querySelectorAll('.side-card__content'), function (index, elem) {
    truncate(elem, '.JS-truncate');
  });

  window.onresize = function () {
    (0, _core.forEach)(document.querySelectorAll('.side-card__content'), function (index, elem) {
      truncate(elem, '.JS-truncate');
    });
  };
}();

exports.truncateText = truncateText;

/***/ })

},[59]);