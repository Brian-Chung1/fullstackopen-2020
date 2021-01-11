const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const api = supertest(app);

let token;
let postedBlog;

beforeAll(async () => {
  //Creating new user and logging in to retrieve token
  await User.deleteMany({});
  const user = { username: 'user', password: 'password' };
  await api.post('/api/users').send(user).expect(200);
  const response = await api.post('/api/login').send(user).expect(200);
  token = response.body.token;
  expect(token).toBeDefined();
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.blogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('GET: initial blogs saved', () => {
  test('blogs returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.blogs.length);
  });

  test('property of id and not _id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('GET: viewing specific blog', () => {
  test('success valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blog = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blog));
    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('fail invalid id : status 404', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails invalid id : status 400', async () => {
    const invalidId = '5a3d5da59070081a82b3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('POST: addition of a new blog', () => {
  test('create a new blog post with valid authorization', async () => {
    const newBlog = {
      title: 'pls work',
      author: 'google',
      url: 'www.test.com',
      likes: 1,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain('pls work');
  });

  test('create a new blog post with invalid authorization', async () => {
    const newBlog = {
      title: 'pls work',
      author: 'google',
      url: 'www.test.com',
      likes: 1,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token + 'invalid'}`)
      .send(newBlog)
      .expect(401);
    console.log(response.body);
    expect(response.body.error).toContain('invalid token');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });

  test('missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'missing likes',
      author: 'test',
      url: 'https://www.google.com/',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.likes).toBe(0);
  });

  test('missing title and url - status is 400', async () => {
    const newBlog = {
      author: 'no title and url',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('DELETE: deletion of a blog', () => {
  test('successful delete with valid id and valid token', async () => {
    const newBlog = {
      title: 'deleting this blog',
      author: 'user',
      url: 'www.google.com',
      likes: 2,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.find(
      (blog) => blog.title === 'deleting this blog'
    );

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length); //length doesn't change because a new blog is added initially then deleted after

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test('unsuccessful delete with invalid id', async () => {
    const response = await api
      .delete(`/api/blogs/${'invalid id'}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
    expect(response.body.error).toContain('malformatted id');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });

  test('unsuccessful delete with invalid token', async () => {
    const newBlog = {
      title: 'deleting this blog',
      author: 'user',
      url: 'www.google.com',
      likes: 2,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.find(
      (blog) => blog.title === 'deleting this blog'
    );

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token + 'invalid'}`)
      .expect(401);
    expect(response.body.error).toContain('invalid token');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1); //+ 1 because we add a new blog but don't delete it
  });
});

describe('UPDATE: updating of a blog', () => {
  test('successful update valid id and valid token', async () => {
    const newBlog = {
      title: 'updating this blog',
      author: 'user',
      url: 'www.google.com',
      likes: 2,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart.find(
      (blog) => blog.title === 'updating this blog'
    );
    const updatedTitle = 'this blog is updated';

    const updatedBlog = {
      title: updatedTitle,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes,
    };

    await api
      .post(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1); //+ 1 because we added an inital blog then updated it after

    const updatedContent = blogsAtEnd.map((blog) => blog.title);
    expect(updatedContent).toContain(updatedTitle);
  });

  test('unsuccessful update invalid id', async () => {
    const response = await api
      .post(`/api/blogs/${'invalid id'}`)
      .set('Authorization', `bearer ${token}`)
      .send({})
      .expect(400);

    expect(response.body.error).toContain('malformatted id');
  });

  test('unsuccessful update invalid token', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const response = await api
      .post(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token + 'invalid'}`)
      .send({})
      .expect(401);

    expect(response.body.error).toContain('invalid token');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

//npm test -- tests/blog_api.test.js
//npm test -- -t 'create a new blog post'
