import lineClamp from "line-clamp"

const clamp = (() => {
  const clamp2 = document.querySelectorAll(".JS-clamp-2")
  const clamp3 = document.querySelectorAll(".JS-clamp-3")

  for (let i of clamp2) {

    lineClamp(i, { lineCount: 5 })
  }

  for (let i of clamp3) {

    lineClamp(i, { lineCount: 6 })
  }
})()

export { clamp }
