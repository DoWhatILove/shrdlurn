/* jshint node: true */

"use strict";

var gulp = require("gulp");
var purescript = require("gulp-purescript");
var less = require("gulp-less");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rimraf = require("rimraf");

var sources = [
    "src/**/*.purs",
    "bower_components/purescript-*/src/**/*.purs"
];

var foreigns = [
    "src/Foreign/*.js",
    "bower_components/purescript-*/src/**/*.js"
];

var sourcesCli = [
    "bower_components/purescript-*/src/**/*.purs",
    "src/Types.purs",
    "src/Transformer.purs",
    "src/Levels.purs",
    "src/Helper.purs",
    "src/Unsafe.purs",
    "src/Levels/*.purs",
    "cli/*.purs"
];

gulp.task("clean-docs", function(cb) {
    rimraf("docs", cb);
});

gulp.task("clean-dist", function(cb) {
    rimraf("dist", cb);
});

gulp.task("clean", ["clean-docs", "clean-dist"]);

gulp.task("psc", function() {
    return purescript.psc({
            src: sources,
            ffi: foreigns,
            output: "output/main"
        });
});

gulp.task("bundle", ["psc"], function() {
    return purescript.pscBundle({
            src: "output/main/**/*.js",
            output: "dist/mainps.js",
            module: "Main",
            main: "Main"
        });
});

gulp.task("psc:cli", function() {
    return purescript.psc({
            src: sourcesCli,
            ffi: foreigns,
            output: "output/cli"
        });
});

gulp.task("bundle:cli", ["psc:cli"], function() {
    return purescript.pscBundle({
            src: "output/cli/**/*.js",
            output: "dist/cli.js",
            module: "Main",
            main: "Main"
        });
});

gulp.task("psci", function () {
    return purescript.psci({
            src: sourcesCli,
            ffi: foreigns
        })
        .pipe(gulp.dest("."));
});

gulp.task("less", function() {
    return gulp.src("css/*.less")
        .pipe(less({}))
        .pipe(gulp.dest("dist"));
});

gulp.task("concat", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/Config.js",
	"js/Sempre.js",
	"js/GameLogic.js"
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("concatdebug", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/Config.js",
	"js/Debug.js",
	"js/Sempre.js",
	"js/GameLogic.js"
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("compress", ["concat"], function() {
    return gulp.src("dist/main.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task("docs", ["clean-docs"], function () {
    return purescript.pscDocs({
            src: sources,
            docgen: {
                "DOMHelper": "docs/DOMHelper.md",
                "Helper": "docs/Helper.md",
                "Isomer": "docs/Isomer.md",
                "Levels": "docs/Levels.md",
                "Types": "docs/Types.md",
		"Unsafe": "docs/Unsafe.md"
            }
        });
});

gulp.task("prod", ["clean", "less", "psci", "bundle:cli", "bundle", "concat", "compress", "docs"]);
gulp.task("dev", ["less", "psci", "bundle", "concat"]);
gulp.task("debug", ["less", "psci", "bundle", "concatdebug"]);
gulp.task("default", ["less", "psci", "bundle", "concat", "docs"]);
