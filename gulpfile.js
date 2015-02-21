var gulp = require('gulp')
var concat = require('gulp-concat')

gulp.task('js', function () {
    gulp.src(['src/**/module.js', 'src/**/*.js'])
        .pipe(concat('tothcommon.js'))
        .pipe(gulp.dest('.'))
})