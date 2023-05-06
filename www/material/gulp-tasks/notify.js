var notifier = require('node-notifier');

module.exports = (gulp, callback) => {
  const notifyCssTask = function (done) {
    return notifier.notify({ title: 'CSS Build Successfull', message: 'Done' }, done);
  };
  const notifyHtmlTask = function (done) {
    return notifier.notify({ title: 'HTML Build Successfull', message: 'Done' }, done);
  };
  const notifyJsTask = function (done) {
    return notifier.notify({ title: 'JS Build Successfull', message: 'Done' }, done);
  };

  // ---------------------------------------------------------------------------
  // Exports

  return {
    css: notifyCssTask,
    html: notifyHtmlTask,
    js: notifyJsTask
  };
};
