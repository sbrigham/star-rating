var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var connect = require('gulp-connect');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

gulp.task('styles', function() {
    return gulp.src(['public/css/star-rating.css'])
        .pipe(concat('star-rating.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('star-rating.min.css'))
        .pipe(minifyCSS({ keepBreaks: true }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('templates', function() {
    return gulp.src(['public/partials/*.html'])
        .pipe(templateCache('templates.js', { root:'partials', standalone: true }))
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', ['templates'], function() {
    return gulp.src([
        'public/app.js',
        './build/templates.js'
        ])
        .pipe(concat('star-rating.js'))
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist'))
        .pipe(rename('star-rating.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('connect', function() {
    connect.server({
        port: 5000,
        root: 'public',
        livereload: false
    });
});

gulp.task('watch', function() {
    gulp.watch(['public/*.js', 'public/partials/*.html'], ['scripts']);
    gulp.watch(['public/css/*.css'], ['styles']);
});

gulp.task('clean', function(cb) {
    del(['./build'], cb);
});

gulp.task('build', ['styles', 'scripts']);
gulp.task('default', ['build', 'connect', 'watch']);