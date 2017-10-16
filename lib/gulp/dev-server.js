// Inspiration: https://github.com/NathanBowers/mm-template/

import gulp from "gulp"
import bs from "browser-sync"

import { PATH } from "./_config"

const browserSync = bs.create()

const devServer = cb => {

  // BrowserSync options
  browserSync.init({
    proxy: "http://localhost:4567", // Middleman server
    open: false,
    reloadDelay: 100, // Concurrency fix
    reloadDebounce: 500, // Concurrency fix
    reloadOnRestart: true,
    files: [
      PATH.tmp.css,
      PATH.tmp.snipcart,
      PATH.tmp.js,
      PATH.views.all
    ],
    port: 7000,
    ui: { port: 7001 }
  },

  // Server running callback...
  function callback() {

    // Inject CSS/ JS
    gulp.watch(PATH.css.all, ["css:custom", "css:vendor"])
    gulp.watch(PATH.js.all, ["js"])

    // Reload browserSync after html changes
    gulp.watch(PATH.views.all).on("change", browserSync.reload)
  })
}

export { devServer }