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
var util = require('gulp-util');

var config = {
  scriptsPath : 'app',
  viewsPath : 'app/views',
  stylesPath : 'assets/css',
  imagesPath : 'assets/img',
  libPath : 'assets/lib',
  outputPath : 'dist',
  production: !!util.env.production
};

var awsConfig = JSON.parse(fs.readFileSync('c:\\aws\\awsaccess.json'));
var s3 = require('gulp-s3-upload')(awsConfig);

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
    config.outputPath + '/**/*'
  ]);
});

gulp.task('index', ['clean'], function () {
  return gulp.src('./index.html')
    .pipe(gulp.dest(config.outputPath));
});

gulp.task('views', ['clean'], function () {
  return gulp.src(config.viewsPath + '/*.html')
    .pipe(gulp.dest(config.outputPath + '/views'));
});

gulp.task('scripts', ['clean'], function () {
  var folders = getFolders(config.scriptsPath);

  var tasks = folders.map(function (folder) {
    return gulp.src(path.join(config.scriptsPath, folder, '/**/*.js'))
      // concat into foldername.js
      .pipe(concat(folder + '.js'))
      // minify if required
      .pipe(config.production ? uglify() : util.noop())
      // write to output again
      .pipe(gulp.dest(config.outputPath));
  });

  // process all remaining files in config.scriptsPath root into main.min.js file
  var root = gulp.src(path.join(config.scriptsPath, '/*.js'))
       .pipe(concat('main.js'))
       .pipe(config.production ? uglify() : util.noop())
       .pipe(gulp.dest(config.outputPath));

  return merge(tasks, root);
});

gulp.task('styles', ['clean'], function () {
  return gulp.src(config.stylesPath + '/*.css')
    .pipe(concatCSS('styles.css'))
    .pipe(config.production ? cleanCSS() : util.noop())
    .pipe(gulp.dest(config.outputPath + '/css'));
});

gulp.task('images', ['clean'], function () {
  return gulp.src(config.imagesPath + '/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.outputPath + '/img'));
});

gulp.task('lib', ['clean'], function () {
  var folders = getFolders(config.libPath);

  var tasks = folders.map(function (folder) {
    return gulp.src(path.join(config.libPath, folder, '/**/*.js'))
      // concat into foldername.js
      .pipe(concat(folder + '.js'))
      .pipe(config.production ? uglify() : util.noop)
      // write to output again
      .pipe(gulp.dest(config.outputPath));
  });

  // process all remaining files in config.libPath root into lib.js and lib.min.js files
  var root = gulp.src(path.join(config.libPath, '/*.js'))
       .pipe(concat('lib.js'))
       .pipe(config.production ? uglify() : util.noop())
       .pipe(gulp.dest(config.outputPath));

  return merge(tasks, root);
});

gulp.task('favicon', ['clean'], function () {
  return gulp.src('./favicon.ico')
    .pipe(gulp.dest(config.outputPath));
});

/*
Ref: https://www.npmjs.com/package/gulp-s3-upload
     http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
*/
gulp.task('publish', function() {
  return gulp.src("./dist/**")
        .pipe(s3({
            Bucket: 'movies-angular1',  
            ACL:    'public-read'       
        }, {
            maxRetries: 5
        }))
    ;
});

gulp.task('applyConfig', function() {
  return gulp.src('./app/config.json')
    .pipe(gulpNgConfig('MoviesApp.config', {
      environment: config.production ? 'production' : 'local'
    }))
    .pipe(gulp.dest('./app/'));
});

gulp.task('default', ['applyConfig', 'index', 'views', 'scripts','styles', 'images', 'lib', 'favicon']);