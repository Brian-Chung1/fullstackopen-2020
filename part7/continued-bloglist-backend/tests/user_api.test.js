const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is empty', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      password: '123123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Content Missing');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is empty', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'user',
      name: 'Superuser',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Content Missing');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username length is < 3', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ab',
      name: 'Superuser',
      password: 'aaaaa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'Both username and password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password length is < 3', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'aaaaa',
      name: 'Superuser',
      password: 'ab',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'Both username and password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe('user login', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });
  test('successful login with valid token retrieval', async () => {
    const user = { username: 'root', password: 'sekret' };

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { token } = response.body;
    expect(token).toBeDefined();

    const decodedToken = jwt.verify(token, process.env.SECRET);
    expect(decodedToken.username).toBe(user.username);
  });

  test('unsuccessful login with wrong username', async () => {
    const user = { username: 'rootInvalid', password: 'sekret' };

    const result = await api.post('/api/login').send(user).expect(401);

    expect(result.body.error).toContain('invalid username or password');

    const { token } = result.body;
    expect(token).not.toBeDefined();
  });

  test('unsuccessful login with wrong password', async () => {
    const user = { username: 'root', password: 'sekretInvalid' };

    const result = await api.post('/api/login').send(user).expect(401);

    expect(result.body.error).toContain('invalid username or password');

    const { token } = result.body;
    expect(token).not.toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});

//npm test -- tests/user_api.test.js
