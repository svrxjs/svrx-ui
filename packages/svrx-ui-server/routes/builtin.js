const Router = require('koa-router');
const storage = require('../storage');

const router = new Router({
  prefix: '/api/builtin',
});

router.get('/schema/get', async (ctx) => {
  ctx.body = {
    code: 200,
    data: storage.get('builtinSchema'),
  };
});

router.get('/options/get', async (ctx) => {
  ctx.body = {
    code: 200,
    data: storage.get('builtinSchema'),
  };
});

module.exports = router;
