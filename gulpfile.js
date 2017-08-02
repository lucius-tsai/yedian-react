var gulp = require("gulp");
var path = require("path");

function moveCopy () {
    return gulp.src('app_tmp/**/*')
        .pipe(gulp.dest('app'));
}

gulp.task("copy", moveCopy);