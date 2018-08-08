const truncateTextMQs = (elem, subStrLengths = {}) => {
  const breakpoints = {
    xs: 480,
    sm: 600,
    md: 960,
    lg: 1280
  }

  const truncateText = (subStr) => {
    const text = elem.innerText

    if (text.length > subStr) {
      const visible = `${ text.substr(0, subStr).replace(/[^a-zA-Z0-9]*$/, "") }<span aria-hidden="true">…</span>`
      const cut = `<span class="e-hidden"> ${ text.substr(subStr, text.length + 1) }</span>`

      elem.innerHTML = visible + cut
    }
  }

  if (matchMedia(`screen and (max-width: ${ breakpoints.sm - 1 }px)`).matches) {
    truncateText(subStrLengths.xs)

  } else if (matchMedia(`screen and (min-width: ${ breakpoints.sm }px) and (max-width: ${ breakpoints.md - 1 }px)`).matches) {
    truncateText(subStrLengths.sm)

  } else if (matchMedia(`screen and (min-width: ${ breakpoints.md }px) and (max-width: ${ breakpoints.lg - 1 }px)`).matches) {
    truncateText(subStrLengths.md)

  } else if (matchMedia(`screen and (min-width: ${ breakpoints.lg }px)`).matches) {
    truncateText(subStrLengths.lg)
  }
}

const truncate = (() => {
  var truncateElems = document.querySelectorAll(".JS-truncate")

  for (let elem of truncateElems) {
    var data = elem.getAttribute("data-truncate").replace(/'/g, '"')
    data = JSON.parse(data)

    truncateTextMQs(elem, {
      xs: data.xs,
      sm: data.sm,
      md: data.md,
      lg: data.lg
    })
  }
})()

export { truncate }
