const req = require('supertest');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');

const app = require('../../app');
const User = require('../../src/models/user.model');
const Post = require('../../src/models/post.model');
const Like = require('../../src/models/like.model');
const Comment = require('../../src/models/comment.model');
const { initDatabase, connectDatabase } = require('../../src/models');

const createUser = async (username, email) => {
  const id = crypto.randomUUID();
  const firstName = 'Islam';
  const lastName = 'Walid';
  const password = 'StrongPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.create({ id, email, username, firstName, lastName, password: hash, loggedIn: true });

  return id;
};

const genJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const createPost = async (userId) => {
  const id = crypto.randomUUID();
  await Post.create({
    id,
    userId,
    title: 'post title',
    body: 'this is a pretty good post'
  });

  return id;
};

const createComment = async (userId, postId) => {
  const id = crypto.randomUUID();
  await Comment.create({
    id,
    userId,
    postId,
    body: 'this is a comment'
  });

  return id;
};

const createLike = async (userId, postId) => {
  await Like.create({ userId, postId });
};

beforeAll(async () => {
  const connection = connectDatabase('./DB_FILE.db');
  await initDatabase(connection);
  process.env.JWT_SECRET = 'json web token secret';
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await Post.destroy({ truncate: true });
  await Like.destroy({ truncate: true });
  await Comment.destroy({ truncate: true });
});

describe('user endpoints', () => {
  it('signup user with valid input', async () => {
    const reqBody = {
      email: 'islam@example.com',
      username: 'islam',
      firstName: 'Islam',
      lastName: 'Walid',
      password: 'StrongPassword123!'
    };
    const res = await req(app).post('/users/signup').send(reqBody);
    expect(res.statusCode).toBe(200);
  });

  it('signup user with invalid input', async () => {
    const reqBody = {
      email: 'not email format',
      username: 'islam',
      firstName: 'Islam',
      lastName: 'Walid',
      password: 'StrongPassword123!'
    };
    const res = await req(app).post('/users/signup').send(reqBody);
    expect(res.statusCode).toBe(400);
  });

  it('login with valid credentials', async () => {
    const reqBody = {
      emailOrUsername: 'islam',
      password: 'StrongPassword123!'
    };

    await createUser('islam', 'islam@example.com');
    const res = await req(app).post('/users/login').send(reqBody);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeUndefined();
    expect(res.body.user).toStrictEqual({
      username: 'islam',
      firstName: 'Islam',
      lastName: 'Walid'
    });
  });

  it('login with invalid credentials', async () => {
    const reqBody = {
      emailOrUsername: 'islam',
      password: 'wrong password'
    };

    await createUser('islam', 'islam@example.com');
    const res = await req(app).post('/users/login').send(reqBody);
    expect(res.statusCode).toBe(404);
  });

  it('logout user', async () => {
    const id = await createUser('islam', 'islam@example.com');
    const token = genJwt(id);
    let res = await req(app).get('/users/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    res = await req(app).get('/posts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });
});

describe('post endpoints', () => {
  it('get all posts with authorized user', async () => {
    const id = await createUser('islam', 'islam@example.com');
    const token = genJwt(id);
    const res = await req(app).get('/posts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.posts).not.toBeUndefined();
  });

  it('get all posts with unauthorized user', async () => {
    const res = await req(app).get('/posts');
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('user not authorized');
  });

  it('create new post with authorized user', async () => {
    const id = await createUser('islam', 'islam@example.com');
    const token = genJwt(id);
    const reqBody = {
      title: 'post title',
      body: 'this is a pretty good post'
    };
    const res = await req(app).post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(reqBody);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).not.toBeUndefined();
  });

  it('delete post with authorized user', async () => {
    const id = await createUser('islam', 'islam@example.com');
    const token = genJwt(id);
    const postId = await createPost(id);
    const res = await req(app).delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('delete post with unauthorized user', async () => {
    const userOneId = await createUser('islam', 'islam@example.com');
    const userTwoId = await createUser('walid', 'walid@example.com');
    const token = genJwt(userTwoId);
    const postId = await createPost(userOneId);
    const res = await req(app).delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });
});

describe('comment endpoints', () => {
  it('create comment with authorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    const res = await req(app).post('/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId, body: 'this is a comment' });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).not.toBeUndefined();
  });

  it('create comment with unauthorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const postId = await createPost(userId);
    const res = await req(app).post('/comments')
      .send({ postId, body: 'this is a comment' });
    expect(res.statusCode).toBe(401);
  });

  it('delete comment with authorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    const commentId = await createComment(userId, postId);
    const res = await req(app).delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('delete comment with unauthorized user', async () => {
    const userOneId = await createUser('islam', 'islam@example.com');
    const userTwoId = await createUser('walid', 'walid@example.com');
    const token = genJwt(userTwoId);
    const postId = await createPost(userOneId);
    const commentId = await createComment(userOneId, postId);
    const res = await req(app).delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });

  it('get all post comments', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    await createComment(userId, postId);
    const res = await req(app).get(`/comments/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.comments).not.toBeUndefined();
  });
});

describe('like endpoint', () => {
  it('create like with authorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    const res = await req(app).post('/likes')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId });
    expect(res.statusCode).toBe(200);
  });

  it('create like with unauthorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const postId = await createPost(userId);
    const res = await req(app).post('/likes')
      .send({ postId });
    expect(res.statusCode).toBe(401);
  });

  it('delete like with authorized user', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    await createLike(userId, postId);
    const res = await req(app).delete(`/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('delete like with unauthorized user', async () => {
    const userOneId = await createUser('islam', 'islam@example.com');
    const userTwoId = await createUser('walid', 'walid@example.com');
    const token = genJwt(userTwoId);
    const postId = await createPost(userOneId);
    await createLike(userOneId, postId);
    const res = await req(app).delete(`/comments/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });

  it('get all post likes', async () => {
    const userId = await createUser('islam', 'islam@example.com');
    const token = genJwt(userId);
    const postId = await createPost(userId);
    await createLike(userId, postId);
    const res = await req(app).get(`/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({
      count: 1,
      isLiked: true
    });
  });
});

afterAll(async () => {
  await fs.unlink('./DB_FILE.db');
});
