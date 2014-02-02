var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

var jsSource = ["src/js/app.js", "src/js/directives/*.js"];
var mainJs = "build/js";

gulp.task("scripts", function() {
  return gulp.src(jsSource)
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(mainJs));
});
