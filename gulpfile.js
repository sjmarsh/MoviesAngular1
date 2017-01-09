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
var gulpNgConfig = require('gulp-ng-config');

var scriptsPath = 'app';
var viewsPath = 'app/views';
var stylesPath = 'assets/css';
var imagesPath = 'assets/img';
var libPath = 'assets/lib';
var outputPath = 'dist';

var config = JSON.parse(fs.readFileSync('c:\\aws\\awsaccess.json'));
var s3 = require('gulp-s3-upload')(config);

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

gulp.task('lib', ['clean'], function () {
  var folders = getFolders(libPath);

  var tasks = folders.map(function (folder) {
    return gulp.src(path.join(libPath, folder, '/**/*.js'))
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

  // process all remaining files in libPath root into lib.js and lib.min.js files
  var root = gulp.src(path.join(libPath, '/*.js'))
       .pipe(concat('lib.js'))
       //.pipe(gulp.dest(outputPath))
       .pipe(uglify())
       .pipe(rename('lib.min.js'))
       .pipe(gulp.dest(outputPath));

  return merge(tasks, root);
});

gulp.task('favicon', ['clean'], function () {
  return gulp.src('./favicon.ico')
    .pipe(gulp.dest(outputPath));
});

/*
Ref: https://www.npmjs.com/package/gulp-s3-upload
     http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
*/
gulp.task('publish', ['prod'], function() {
  return gulp.src("./dist/**")
        .pipe(s3({
            Bucket: 'movies-angular1',  
            ACL:    'public-read'       
        }, {
            maxRetries: 5
        }))
    ;
});

gulp.task('applyLocalConfig', function() {
  return gulp.src('./app/config.json')
    .pipe(gulpNgConfig('MoviesApp.config', {
      environment: 'local'
    }))
    .pipe(gulp.dest('./app/'));
});

gulp.task('applyProdConfig', function() {
  return gulp.src('./app/config.json')
    .pipe(gulpNgConfig('MoviesApp.config', {
      environment: 'production'
    }))
    .pipe(gulp.dest('./app/'));
});


gulp.task('default', ['applyLocalConfig', 'index', 'views', 'scripts','styles', 'images', 'lib', 'favicon']);

gulp.task('prod', ['applyProdConfig', 'index', 'views', 'scripts','styles', 'images', 'lib', 'favicon']);