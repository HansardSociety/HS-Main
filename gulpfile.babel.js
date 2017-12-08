"use strict";

import gulp from "gulp"
import runSequence from "run-sequence"

// Streams
import { cssApp, cssVendor } from "./lib/gulp/styles"
import { iconSprite, minSVG, svgDataURI } from "./lib/gulp/images"
import { js } from "./lib/gulp/scripts"
import { devServer } from "./lib/gulp/dev-server"

// Core tasks
gulp.task("css:app", () => cssApp())
gulp.task("css:vendor", () => cssVendor())
gulp.task("js", () => js())
gulp.task("svg-sprite", () => iconSprite())
gulp.task("svg-min", () => minSVG())

// Combined
gulp.task("css", runSequence(["css:app", "css:vendor"]))
gulp.task("images", runSequence(["svg-sprite", "svg-min"]))

// Builds.
gulp.task("default", () => runSequence(["watch"]))
gulp.task("watch", ["css:app", "css:vendor", "js"], () => devServer())
gulp.task("prod", () => runSequence(["css:app", "css:vendor", "js"]))

