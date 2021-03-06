const Koa = require('koa');
const path = require('path');
const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const koaBody = require('koa-body');
const ffp = require('find-free-port');
const { logger } = require('@svrx/util');
const http = require('http');
const router = require('./routes');
const storage = require('./storage');

const PORT = 3000;
const NOOP = () => {};

const CLIENT_PATH = require.resolve('svrx-ui-client');
const BUILD_PATH = path.join(CLIENT_PATH, '../build');

class UI {
  constructor(options = {}) {
    this.app = new Koa();
    this.port = options.port || PORT;

    storage.set('builtins', options.builtins);
    storage.set('plugins', options.plugins);
    storage.set('directory', options.directory.split(path.sep));
    storage.set('builtinSet', options.builtinSet);
    storage.set('pluginSet', options.pluginSet);

    this.app.use(koaBody());
    this.app.use(router());
    this.app.use(koaStatic(BUILD_PATH));
    this.app.use(koaMount('/docs', koaStatic(BUILD_PATH)));
    this.server = http.createServer(this.app.callback());
  }

  start(callback = NOOP) {
    ffp(this.port, '127.0.0.1', (err, p1) => {
      if (err) throw Error('NO PORT FREE');
      if (this.port !== p1) {
        logger.warn(`port ${this.port} is in use, using port ${p1} instead`);
      }

      this.server.listen(p1, () => {
        callback(p1);
      });
    });
  }

  close(callback = NOOP) {
    this.server.close(callback);
  }
}

module.exports = UI;
