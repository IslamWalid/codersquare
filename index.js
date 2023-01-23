const express = require('express');
const models = require('./src/models');
const usersRouter = require('./src/routers/users.route');
const postsRouter = require('./src/routers/posts.route');
const likesRouter = require('./src/routers/likes.route');
const commentsRouter = require('./src/routers/comments.route');
const errorHandler = require('./src/models/middlewares/error-handler.middleware');

(async () => {
  await models.initDatabase();
  const app = express();

  app.use(express.json());
  app.use('/users', usersRouter);
  app.use('/posts', postsRouter);
  app.use('/likes', likesRouter);
  app.use('/comments', commentsRouter);
  app.use(errorHandler);

  app.listen(8080);
})();
