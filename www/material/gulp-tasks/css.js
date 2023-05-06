var csscomb = require('gulp-csscomb');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var rtlcss = require('gulp-rtlcss');

module.exports = (gulp, callback) => {
  const cssCombTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css })
      .pipe(csscomb())
      .pipe(gulp.dest(config.destination.css));
  };

  const cssCombRtlTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css_rtl })
      .pipe(csscomb())
      .pipe(gulp.dest(config.destination.css_rtl));
  };

  const cssMinTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css })
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(config.destination.css));
  };

  const cssMinRtlTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css_rtl })
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(config.destination.css_rtl));
  };

  const cssRtlTask = function () {
    return gulp
      .src([config.destination.css + '/**/*.css', config.destination.css + '!/**/*.min.css'])
      .pipe(rtlcss())
      .pipe(gulp.dest(config.destination.css_rtl));
  };

  const cssRtlVendorTask = function(){
    return gulp.src([config.vendors_path + 'css/vendors.min.css'])
    .pipe(rtlcss())
    .pipe(rename('vendors-rtl.min.css'))
    .pipe(gulp.dest(config.vendors_path + 'css'));
  }

  // ---------------------------------------------------------------------------
  // Exports

  return {
    css_comb: cssCombTask,
    css_rtl_comb: cssCombRtlTask,
    css_min: cssMinTask,
    css_rtl_min: cssMinRtlTask,
    css_rtl: cssRtlTask,
    css_rtl_vendor: cssRtlVendorTask
  };
};
