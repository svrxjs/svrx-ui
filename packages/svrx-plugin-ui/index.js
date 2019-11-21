const SvrxUI = require('svrx-ui');

const schemaFilter = config => config.schema.type !== 'function' && config.schema.type !== 'compute'
  && config.schema.ui !== false;

const getBuiltins = (config) => {
  const schema = config.getSchema();
  const options = config.get();

  return Object.keys(schema)
    .map(key => ({
      key,
      schema: schema[key],
      value: options[key],
    }))
    .filter(schemaFilter);
};
const getPlugins = (config) => {
  const pluginNames = config.getExternalPlugins().map(m => m.getInfo('name'));
  return pluginNames
    .filter(name => name !== 'ui')
    .map((name) => {
      const schema = config.getPlugin(name).getSchema();
      const options = config.getPlugin(name).get();
      return {
        name,
        config: Object.keys(schema)
          .map(key => ({
            key,
            schema: schema[key],
            value: options[key],
          }))
          .filter(schemaFilter),
      };
    });
};

module.exports = {
  hooks: {
    async onCreate({ logger, config, events }) {
      let ui = {};
      events.on('ready', () => {
        ui = SvrxUI({
          port: 8002,
          builtins: getBuiltins(config),
          plugins: getPlugins(config),
          directory: config.get('root'),
          set: config.set,
        });
        ui.start().then((port) => {
          logger.notify(`svrx ui is started at http://localhost:${port}`);
        });
      });
      return ui.close;
    },
  },
};
