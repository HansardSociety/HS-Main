import { forEach } from './core';

////////////////////////////////////////////////////////////
//  Truncate text
////////////////////////////////////////////////////////////

const truncateText = () => {
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
}

export default truncateText();
