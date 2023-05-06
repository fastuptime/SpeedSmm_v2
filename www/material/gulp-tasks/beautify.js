var htmlbeautify = require('gulp-html-beautify');

module.exports = (gulp, callback) => {
  const beautifyHtmlDemoTask = function () {
    return gulp
      .src('html-demo/**/*.html')
      .pipe(htmlbeautify({ indentSize: 2 }))
      .pipe(gulp.dest('./html-demo/'));
  };

  const beautifyHtmlTask = function () {
    return gulp
      .src('html/**/*.html')
      .pipe(htmlbeautify({ indentSize: 2 }))
      .pipe(gulp.dest('./html/'));
  };

  const beautifySkTask = function () {
    return gulp
      .src('starter-kit/**/*.html')
      .pipe(htmlbeautify({ indentSize: 2 }))
      .pipe(gulp.dest('./starter-kit/'));
  };

  // ---------------------------------------------------------------------------
  // Exports

  return {
    html_demo: beautifyHtmlDemoTask,
    html: beautifyHtmlTask,
    starter_kit: beautifySkTask
  };
};
