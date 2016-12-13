var gulp = require('gulp');

var fs = require('fs');
var path = require('path');
var del = require('del');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');

var scriptsPath = 'app';
var viewsPath = 'app/views';
var stylesPath = 'assets/css';
var imagesPath = 'assets/img';
var outputPath = 'dist';

/*
Ref: https://github.com/gulpjs/gulp/tree/master/docs/recipes
*/

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('clean', function () {
  return del([
    outputPath + '/**/*'
  ]);
});

gulp.task('index', ['clean'], function () {
  return gulp.src('./index.html')
    .pipe(gulp.dest(outputPath));
});

gulp.task('views', ['clean'], function () {
  return gulp.src(viewsPath + '/*.html')
    .pipe(gulp.dest(outputPath + '/views'));
});

gulp.task('scripts', ['clean'], function () {
  var folders = getFolders(scriptsPath);

  var tasks = folders.map(function (folder) {
    return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
      // concat into foldername.js
      .pipe(concat(folder + '.js'))
      // write to output
     // .pipe(gulp.dest(outputPath))
      // minify
      .pipe(uglify())
      // rename to folder.min.js
      .pipe(rename(folder + '.min.js'))
      // write to output again
      .pipe(gulp.dest(outputPath));
  });

  // process all remaining files in scriptsPath root into main.js and main.min.js files
  var root = gulp.src(path.join(scriptsPath, '/*.js'))
       .pipe(concat('main.js'))
       //.pipe(gulp.dest(outputPath))
       .pipe(uglify())
       .pipe(rename('main.min.js'))
       .pipe(gulp.dest(outputPath));

  return merge(tasks, root);
});

gulp.task('styles', ['clean'], function () {
  return gulp.src(stylesPath + '/*.css')
    .pipe(concatCSS('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(outputPath + '/css'));
});

gulp.task('images', ['clean'], function () {
  return gulp.src(imagesPath + '/*')
        .pipe(imagemin())
        .pipe(gulp.dest(outputPath + '/img'));
});

gulp.task('favicon', ['clean'], function () {
  return gulp.src('./favicon.ico')
    .pipe(gulp.dest(outputPath));
});

gulp.task('default', ['index', 'views', 'scripts','styles', 'images', 'favicon']);