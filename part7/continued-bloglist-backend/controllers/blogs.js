const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
      .populate('user', {
        username: 1,
        name: 1,
      })
      .populate('comments', { content: 1, date: 1 });
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' });
    }
    const user = await User.findById(decodedToken.id);

    if (!body.title || !body.url) {
      return response.status(400).send({ error: 'title or url is missing' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() === user._id.toString()) {
      await blog.remove();
      user.blogs = user.blogs.filter(
        (blog) => blog.id.toString() !== request.params.id.toString()
      );
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  } catch (exception) {
    next(exception);
  }
});

// blogsRouter.put('/:id', async (request, response, next) => {
//   try {
//     const decodedToken = jwt.verify(request.token, process.env.SECRET);
//     if (!request.token || !decodedToken.id) {
//       return response.status(401).json({ error: 'token missing or invalid' });
//     }

//     const user = await User.findById(decodedToken.id);
//     const blog = await Blog.findById(request.params.id);

//     const body = request.body;

//     const newBlog = {
//       title: body.title,
//       author: body.author,
//       url: body.url,
//       likes: body.likes === undefined ? 0 : body.likes,
//       user: user._id,
//     };

//     if (blog.user.toString() === user._id.toString()) {
//       const updatedBlog = await Blog.findByIdAndUpdate(
//         request.params.id,
//         newBlog,
//         { new: true }
//       );
//       response.json(updatedBlog.toJSON());
//     }
//   } catch (exception) {
//     next(exception);
//   }
// });

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
