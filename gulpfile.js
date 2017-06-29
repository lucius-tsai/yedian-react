var gulp = require("gulp");
var path = require("path");

function moveCopy () {
    return gulp.src('app/**/*')
        .pipe(gulp.dest(path.resolve(__dirname, '../APAC_Yedian_Wechat/app')));
}

gulp.task("copy", moveCopy);