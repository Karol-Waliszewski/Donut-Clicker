const gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  browserify = require('gulp-browserify'),
  browserSync = require('browser-sync').create();

const distDir = 'docs',
  srcDir = 'src';

gulp.task('css', () => {
  return gulp.src(`${srcDir}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write(`./maps`))
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(`${srcDir}/js/clicker.js`)
  .pipe(sourcemaps.init())
  .pipe(browserify())
  .pipe(babel({
    presets: ['env']
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write(`./maps`))
  .pipe(gulp.dest(`${distDir}/js`));
});

gulp.task('html', () => {
  return gulp.src(`${srcDir}/*.html`)
  .pipe(gulp.dest(distDir));
});

gulp.task('fonts', () => {
  return gulp.src(`${srcDir}/fonts/**/*.*`)
  .pipe(gulp.dest(`${distDir}/fonts`));
});

gulp.task('img', () => {
  return gulp.src(`${srcDir}/icons/**/*.+(jpg|jpeg|png|svg|gif)`)
  .pipe(imagemin())
  .pipe(gulp.dest(`${distDir}/assets`));
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: distDir
    }
  });
});

gulp.task('copy', [
  'html', 'fonts', 'img'
], () => {
  return gulp.src(`${srcDir}/*.*`).pipe(gulp.dest(distDir));
});

gulp.task('watch', () => {
  gulp.watch(`${srcDir}/sass/**/*.scss`, ['css']);
  gulp.watch(`${srcDir}/js/**/*.js`, ['js']);
  gulp.watch(`${srcDir}/**/*.html`, ['html']);
  gulp.watch(`${srcDir}/**/*.*`, ['copy']);
  gulp.watch(`${srcDir}/img/**/*.+(jpg|jpeg|png|svg|gif)`, ['img']);
  gulp.watch(`${srcDir}/**/*.+(html|js|json)`).on('change', browserSync.reload);
});

gulp.task('default', ['css', 'js', 'copy', 'watch', 'server']);
