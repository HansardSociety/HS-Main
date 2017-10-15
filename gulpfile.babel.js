"use strict";

import gulp from "gulp"
import runSequence from "run-sequence"

// Streams
import { customCSS, vendorCSS } from "./lib/gulp/styles"
import { iconSprite } from "./lib/gulp/images"
import { js } from "./lib/gulp/scripts"
import { devServer } from "./lib/gulp/dev-server"

// Core tasks
gulp.task("css:custom", () => customCSS())
gulp.task("css:vendor", () => vendorCSS())
gulp.task("js", () => js())
gulp.task("sprite", () => iconSprite())

// Builds
gulp.task("default", () => runSequence(["watch"]))
gulp.task("watch", ["css:custom", "css:vendor", "js"], () => devServer())
gulp.task("prod", () => runSequence(["css:custom", "css:vendor", "js"]))
