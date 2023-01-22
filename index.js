const express = require('express');
const models = require('./src/models');
const usersRouter = require('./src/routers/users.route');
const postsRouter = require('./src/routers/posts.route');

(async () => {
  await models.initDatabase();
  const app = express();

  app.use(express.json());
  app.use('/users', usersRouter);
  app.use('/posts', postsRouter);

  app.listen(8080);
})();
