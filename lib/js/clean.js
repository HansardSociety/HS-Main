const fs = require("fs-extra");

const dirPath = "./source/assets/images/ionicons/";


fs.readdir(dirPath, (err, files) => {

  let icons = [
    "android-download",
    "android-search",
    "android-star-outline",
    "arrow-down-c",
    "arrow-graph-up-right",
    "bookmark",
    "checkmark",
    "chevron-down",
    "chevron-right",
    "chevron-left",
    "close-round",
    "calendar",
    "cube",
    "email",
    "headphone",
    "images",
    "ios-arrow-down",
    "ios-arrow-thin-down",
    "ios-book",
    "ios-cart",
    "ios-paper",
    "ios-videocam",
    "load-c",
    "map",
    "minus-round",
    "plus-round",
    "quote",
    "social-twitter",
    "social-facebook",
    "social-linkedin"
  ]
  let icons2 = []
  icons.map(i => icons2.push(i + ".svg"))

  let diff = files.filter((file) => {
    return !icons2.includes(file)
  })

  diff.map((file) => {
    fs.remove(`${dirPath}/${file}`, err => console.error(err))
  })


})
