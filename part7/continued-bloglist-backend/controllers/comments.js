const commentRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

commentRouter.get('/:id/comments', async (request, response, next) => {
  try {
    const comments = await Blog.findById(request.params.id).populate(
      'comments'
    );
    if (comments) {
      response.json(comments.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

commentRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const body = request.body;
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' });
    }

    const blog = await Blog.findById(request.params.id);

    if (!body) {
      return response.status(400).send({ error: 'comment is empty' });
    }

    const comment = new Comment({
      content: body.content,
      date: new Date(),
    });

    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();

    response.status(201).json(savedComment.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentRouter;
