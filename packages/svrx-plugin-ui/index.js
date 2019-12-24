const SvrxUI = require('svrx-ui');

const schemaFilter = (config) => config.schema.type !== 'function' && config.schema.type !== 'compute'
  && config.schema.ui !== false;

const getBuiltins = (config) => {
  const schema = config.getSchema();
  const options = config.get();

  return Object.keys(schema)
    .map((key) => ({
      key,
      schema: schema[key],
      value: options[key],
    }))
    .filter(schemaFilter);
};
// const getPlugins = (config) => {
//   const pluginNames = config.getExternalPlugins().map(m => m.getInfo('name'));
//   return pluginNames
//     .filter(name => name !== 'ui')
//     .map((name) => {
//       const schema = config.getPlugin(name).getSchema();
//       const required = [];
//       Object.keys(schema).forEach((key) => {
//         if (schema[key].required) {
//           required.push(key);
//           delete schema[key].required;
//         }
//       });
//       const options = config.getPlugin(name).get();
//       return {
//         key: name,
//         schema: {
//           type: 'object',
//           group: 'Plugin',
//           required,
//           properties: schema,
//         },
//         value: options,
//       };
//     });
// };

module.exports = {
  hooks: {
    async onCreate({ logger, config, events }) {
      let ui = {};
      events.on('ready', () => {
        ui = SvrxUI({
          port: 8002,
          builtins: getBuiltins(config),
          // plugins: getPlugins(config), remove plugin for ui temporarily
          plugins: [],
          directory: config.get('root'),
          builtinSet: config.builtinsSet.bind(config),
          pluginSet: config.pluginsSet.bind(config),
        });
        ui.start().then((port) => {
          logger.notify(`svrx ui is started at http://localhost:${port}`);
        });
      });
      return ui.close;
    },
  },
};
