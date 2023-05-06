var autoprefixer = require('gulp-autoprefixer');

module.exports = function (gulp, callback) {
  const autoPrefixCssRtlTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css_rtl })
      .pipe(
        autoprefixer({
          browsers: config.autoprefixerBrowsers,
          cascade: false
        })
      )
      .pipe(gulp.dest(config.destination.css_rtl));
  };

  const autoPrefixCssTask = function () {
    return gulp
      .src(['**/*.css', '!**/*.min.css'], { cwd: config.destination.css })
      .pipe(
        autoprefixer({
          browsers: config.autoprefixerBrowsers,
          cascade: false
        })
      )
      .pipe(gulp.dest(config.destination.css));
  };

  return {
    css: autoPrefixCssTask,
    css_rtl: autoPrefixCssRtlTask
  };
};
