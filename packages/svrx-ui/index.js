const UIServer = require('svrx-ui-server');

module.exports = (options) => {
  const ui = new UIServer(options);
  return {
    start: () => new Promise(resolve => ui.start(resolve)),
    close: () => new Promise(resolve => ui.close(resolve)),
  };
};
