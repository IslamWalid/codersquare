const cors = require('cors');
const express = require('express');
const usersRouter = require('./src/routers/users.route');
const postsRouter = require('./src/routers/posts.route');
const likesRouter = require('./src/routers/likes.route');
const commentsRouter = require('./src/routers/comments.route');
const errorHandler = require('./src/middlewares/error_handler.middleware');
const userAuthentication = require('./src/middlewares/user_auth.middleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use(userAuthentication);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);
app.use(errorHandler);

module.exports = app;
