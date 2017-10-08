import throttle from "lodash/throttle"
import { forEach, toggleClass } from "./core"

const shrinkNav = (() => {

  const navbar = document.querySelector(".navbar")
  const navStates = ["JS-active", "JS-active-hold", "JS-inactive"]

  const addNavStates = () => {
    if (navbar.classList.contains("JS-inactive"))
      forEach(navStates, (index, state) => toggleClass(navbar, state))
  }

  const removeNavStates = () => {
    if (navbar.classList.contains("JS-active"))
      forEach(navStates, (index, state) => toggleClass(navbar, state))
  }

  const windowPosition = () => {
    window.pageYOffset >= 1
      ? addNavStates()
      : removeNavStates()
  }

  window.onload = windowPosition()

  window.addEventListener("scroll", throttle(() => {

    windowPosition()
  }, 200))
})()


export { shrinkNav }
