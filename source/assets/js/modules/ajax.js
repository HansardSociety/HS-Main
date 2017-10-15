import { forEach } from "./core"

// HTML to DOM
const html2dom = (parent, html, elem) => {
  const container = document.createElement("div")

  container.innerHTML = html

  const getElem = container.querySelector(elem)
  const parentElem = document.querySelector(parent)

  parentElem.appendChild(getElem)
}

// Get AJAX element
const getElem = (parentElem, triggerElem, targetElem) => {
  const triggerAll = document.querySelectorAll(triggerElem)

  for (let trigger of triggerAll) {

    trigger.addEventListener("click", () => {
      const isOn = trigger.classList.contains("JS-on")
      const isLoaded = trigger.classList.add("AJAX-loaded")

      // Only if trigger is on...
      if (!isOn && isLoaded) {
        // ...do nothing

      } else {

        fetch("/ajax")
          .then(response => response.text())
          .then(data => html2dom(parentElem, data, targetElem))
      }
    })
  }
}

// Export forms
const getForm = (() => {
  const parentElem = "#modal-monthly-newsletter-subscription .AJAX-host"
  const newsletterFormTriggers = "button[aria-controls='modal-monthly-newsletter-subscription']"
  const newsletterForm = "#AJAX-form-newsletter script"

  getElem(parentElem, newsletterFormTriggers, newsletterForm)
})()

export { getForm }
