var fs = require('fs');

module.exports = (gulp, callback) => {
  const fileWriteTask = function (callback) {
    return fs.writeFile(config.source.template + '/pages/template.pug', 'extends ../templates/' + myLayout, callback);
  };

  const fileSkWriteTask = function (callback) {
    return fs.writeFile(
      config.source.template + '/pages/starter-kit/template.pug',
      'extends ../../templates/starter-kit/' + myLayout,
      callback
    );
  };

  // ---------------------------------------------------------------------------
  // Exports

  return {
    file_write: fileWriteTask,
    sk_file_write: fileSkWriteTask
  };
};
