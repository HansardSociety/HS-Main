// HTML to DOM
function html2dom(parent, html, elem) {
  const container = document.createElement("div");

  container.innerHTML = html;

  const getElem = container.querySelector(elem);
  const parentElem = document.querySelector(parent);

  parentElem.innerHTML = getElem;

  console.log(getElem);
}

// Get AJAx element
function getElem(parentElem, triggerElem, targetElem) {
  const triggerAll = document.querySelectorAll(triggerElem);

  forEach(triggerAll, function(index, trigger) {

    trigger.addEventListener("click", function() {
      const on = "JS-on";

      // Only if trigger is on...
      if (trigger.classList.contains(on)) {

        fetch("/ajax")
          .then(function(response) {
            return response.text();

          }).then(function(data) {

            html2dom(parentElem, data, targetElem);
          });
      }
    });
  });
}

// Export forms
const getForms = (() => {
  const newsletterFormTriggers = "button[aria-controls='modal-monthly-newsletter-subscription']";
  const newsletterForm = "#AJAX-form-newsletter";

  getElem(newsletterFormTriggers, newsletterForm);

})();
