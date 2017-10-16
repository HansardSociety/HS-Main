import { forEach } from "./core"

// HTML to DOM
const html2dom = (parent, html, elem) => {
  const container = document.createElement("div")

  container.innerHTML = html

  const getTargetElem = container.querySelector(elem)

  const scriptElem = container.querySelector("script")
  const scriptURL = scriptElem.getAttribute("src")

  const parentElem = document.querySelector(parent)

  const newScript = document.createElement("script")
  newScript.src = scriptURL
  newScript.async = false

  parentElem.appendChild(newScript)
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
