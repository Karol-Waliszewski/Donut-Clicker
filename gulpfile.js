const gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglifyCSS = require('gulp-uglifycss'),
    uglifyJS = require('gulp-uglify'),
    imageMin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel');

gulp.task('css', () => {
    return gulp.src('dev/sass/*.scss')
        .pipe(sass())
        .pipe(uglifyCSS())
        .pipe(gulp.dest('build/css'));
})

gulp.task('js', () => {
    return gulp.src('dev/js/*.js')
        .pipe(concat('clicker.js'))
        .pipe(babel({
            presets: ['es2015']
        }).on('error', console.log))
        .pipe(uglifyJS().on('error', console.log))
        .pipe(gulp.dest('build/js'));
})

gulp.task('fonts', () => {
    return gulp.src('dev/fonts/*.*')
        .pipe(gulp.dest('build/fonts'));
})

gulp.task('html', () => {
    return gulp.src('dev/*.html')
        .pipe(gulp.dest('build'));
})

gulp.task('img', () => {
    return gulp.src('dev/img/*.*')
        .pipe(imageMin())
        .pipe(gulp.dest('build/img'));
})

gulp.task('watchers', () => {
    gulp.watch('dev/sass/*.scss', ['css']);
    gulp.watch('dev/js/*.js', ['js']);
    gulp.watch('dev/*.html', ['html']);
})

gulp.task('default', ['css', 'html', 'js', 'img', 'fonts', "watchers"])
