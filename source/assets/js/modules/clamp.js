import shave from "shave"

const clamp = (() => {
  const clamp2 = document.querySelectorAll(".JS-clamp-2")
  const clamp3 = document.querySelectorAll(".JS-clamp-3")

  for (let i of clamp2) {

    shave(i, 54, { classname: "JS-clamp-2" })
  }

  for (let i of clamp3) {

    shave(i, 81, { classname: "JS-clamp-3" })
  }
})()

export { clamp }
