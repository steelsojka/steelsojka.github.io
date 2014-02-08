var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var watch = require("gulp-watch");
var minifyHtml = require("gulp-minify-html");

var jsSource = ["src/js/app.js", "src/js/directives/*.js"];
var sassSource = ["src/sass/*.sass"];
var mainJs = "build/js";

gulp.task("scripts", function() {
  return gulp.src(jsSource)
    //.pipe(uglify())
    .pipe(concat("main.min.js"))
    //.pipe(rename("main.min.js"))
    .pipe(gulp.dest(mainJs));
});

gulp.task("styles", function() {
  return gulp.src(sassSource)
    .pipe(sass())
//    .pipe(minifyCss())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("minify-html", function() {
  return gulp.src("src/index.html")
    .pipe(minifyHtml())
    .pipe(gulp.dest(""));
});

gulp.task("watch", function() {
  gulp.watch(sassSource, ["styles"]);
  gulp.watch(jsSource, ["scripts"]);
  gulp.watch("src/index.html", ["minify-html"]);
});

gulp.task("default", ["scripts", "styles", "minify-html"]);
