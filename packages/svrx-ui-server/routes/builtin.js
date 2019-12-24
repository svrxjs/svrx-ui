const Router = require('koa-router');
const storage = require('../storage');

const router = new Router({
  prefix: '/api/builtin',
});

router.get('/list/get', async (ctx) => {
  ctx.body = {
    code: 200,
    data: storage.get('builtins'),
  };
});

router.post('/list/set', async (ctx) => {
  const settings = ctx.request.body;
  const builtinSet = storage.get('builtinSet');

  try {
    await builtinSet(settings);
    ctx.body = {
      code: 200,
    };
  } catch (e) {
    ctx.body = {
      code: 500,
      message: e.message || 'Request error',
    };
  }
});

module.exports = router;
