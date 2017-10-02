"use strict";

// Gulp plugins
import gulp from "gulp"
import runSequence from "run-sequence"

// Tasks
import { css } from "./lib/gulp/styles"
import { iconSprite } from "./lib/gulp/images"
import { js } from "./lib/gulp/scripts"
import { devServer } from "./lib/gulp/dev-server"

// Core tasks
gulp.task("css", () => { return css() })
gulp.task("js", () => { return js() })
gulp.task("sprite", () => { return iconSprite() })
gulp.task("watch", ["css", "js"], () => { return devServer() })

// Run sequence
gulp.task("default", () => { runSequence(["watch"]) })
gulp.task("build", () => { runSequence(["css", "js"]) })
