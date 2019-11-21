const Router = require('koa-router');
const storage = require('../storage');

const router = new Router({
  prefix: '/api/plugin',
});

router.get('/list/get', async (ctx) => {
  ctx.body = {
    code: 200,
    data: storage.get('plugins'),
  };
});

router.post('/list/set', async (ctx) => {
  const settings = ctx.request.body;
  const pluginSet = storage.get('pluginSet');

  try {
    await pluginSet(settings);
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
