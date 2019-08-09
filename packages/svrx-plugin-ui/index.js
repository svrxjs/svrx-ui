const SvrxUI = require('svrx-ui');

module.exports = {
  // define props
  configSchema: {},
  services: {},
  hooks: {
    async onCreate({
      logger, config,
    }) {
      const ui = SvrxUI({
        port: 8002,
        builtinSchema: config.getSchema(),
        builtinOptions: config.get('$'),
      });
      ui.start().then((port) => {
        logger.notify(`svrx ui is started at http://localhost:${port}`);
      });

      return ui.close;
    },
  },
};
