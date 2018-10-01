import Chart from "chart.js"
import siteConfig from "./shared-config.json"

const colors = siteConfig.color_groups
const purple = colors["purple"]["2"]

const black01 = colors.black["1"]
const black02 = colors.black["2"]
const black03 = colors.black["3"]

const white01 = colors["white"]["1"]
const white02 = colors["white"]["2"]
const white03 = colors["white"]["3"]

const grey01 = colors["grey"]["1"]
const grey02 = colors["grey"]["2"]
const grey03 = colors["grey"]["3"]

const transparent = "rgba(0, 0, 0, 0)"

/* =Global config
 ***************************************************************************/

const config = Chart.defaults.global
config.defaultFontFamily = "'Avenir-Roman', 'Arial', 'sans-serif'";
config.defaultFontSize = 13.5;
config.defaultFontColor = black01;

/* =Defaults
 ***************************************************************************/

Chart.scaleService.updateScaleDefaults("linear", {
  scaleLabel: {
    fontColor: grey03
  }
});


/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartConfig = JSON.parse(ctx.querySelector(".chart__template").innerHTML)

    // Tooltips
    chartConfig.options.tooltips = {
      cornerRadius: 8,
      caretSize: 0,
      xPadding: 9.5,
      yPadding: 9.5,
      titleMarginBottom: 9.5,
      backgroundColor: black01,
      multiKeyBackground: transparent
    }

    // Legend
    chartConfig.options.legend = {
      position: "bottom",
      labels: {
        boxWidth: 18
      }
    }

    console.log(chartConfig)

    return new Chart(chartCanvas, chartConfig)
  }
}

document.addEventListener("DOMContentLoaded", () => renderCharts())
