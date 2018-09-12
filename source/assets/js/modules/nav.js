import debounce from "lodash/debounce"
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

  window.addEventListener("scroll", debounce(() => {

    windowPosition()
  }, 100))
})()

// const feedMenu = (() => {

//   const fakeContainer = (content) => `
//     <div class="panel JS-fake-container" style="width: 100vw;">
//       <div class="panel__content panel__content--medium">
//         <div class="grid grid--lg">
//           <div class="grid__cell grid__cell--lg-above-sm-2">${ content }</div>
//           <div class="grid__cell grid__cell--lg-above-sm-10"></div>
//         </div>
//       </div>
//     </div>`

//   const watchElem = document.querySelector(".feed")
//   const sticky = document.querySelector(".sticky")

//   window.addEventListener("scroll", throttle(() => {
//     const watchElemCoords = watchElem.getBoundingClientRect()

//     if (watchElemCoords.top < 0) {
//       if (!sticky.querySelector(".JS-fake-container")) {
//         sticky.classList.add("JS-active")

//         const newElem = document.createElement("div")
//         newElem.innerHTML = fakeContainer("STICKY!! YAY!!")
//         sticky.appendChild(newElem)
//       }

//     } else {
//       sticky.classList.remove("JS-active")
//       // document.querySelector(".JS-fake-container").innerHTML = ""
//     }

//     console.log(watchElemCoords.top)
//   }, 0))
// })()


export { shrinkNav }
