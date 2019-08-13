const Router = require('koa-router');
const storage = require('../storage');

const router = new Router({
  prefix: '/api/internal',
});

router.get('/directory/get', async (ctx) => {
  ctx.body = {
    code: 200,
    data: storage.get('directory'),
  };
});

module.exports = router;
