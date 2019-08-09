const combineRouters = require('koa-combine-routers');
const builtin = require('./builtin');

const router = combineRouters(
  builtin,
);

module.exports = router;
