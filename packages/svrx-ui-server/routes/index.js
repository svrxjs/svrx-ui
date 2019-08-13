const combineRouters = require('koa-combine-routers');
const builtin = require('./builtin');
const plugin = require('./plugin');
const internal = require('./internal');

const router = combineRouters(
  builtin,
  plugin,
  internal,
);

module.exports = router;
