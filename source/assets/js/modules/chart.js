import Chartist from "chartist"

const data = {
  labels: [
    "Mon", "Tue", "Wed", "Thu", "Fri"
  ],
  series: [
    [5, 2, 4, 2, 0],
    [4, 1, 3, 1, 2],
    [3, 6, 3, 8, 2]
  ]
}

const opts = {
  fullWidth: true,
  horizontalBars: true
}

const chart01 = new Chartist.Bar("#chart-01", data, opts)
const chart02 = new Chartist.Line("#chart-02", data, Object.assign({}, opts, {
  width: 300,
  height: 200
}))

const chart = (() => {
  document.addEventListener("DOMContentLoaded", function () {
    chart01
    chart02
  })
})()

export { chart }
