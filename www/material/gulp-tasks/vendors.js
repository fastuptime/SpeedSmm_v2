var concat = require('gulp-concat');
var uglify = require('gulp-terser');
var cssmin = require('gulp-cssmin');

module.exports = (gulp, callback) => {
  const vendorsJsTask = function () {
    return gulp
      .src(config.vendors.js, {
        cwd: config.vendors_path + 'js/'
      })
      .pipe(concat('vendors.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(config.vendors_path + 'js/'));
  };

  const vendorsCSSTask = function () {
    return gulp
      .src(config.vendors.css, {
        cwd: config.vendors_path + 'css/'
      })
      .pipe(concat('vendors.min.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(config.vendors_path + 'css/'));
  };

  // ---------------------------------------------------------------------------
  // Exports

  return {
    js: vendorsJsTask,
    css: vendorsCSSTask
  };
};
