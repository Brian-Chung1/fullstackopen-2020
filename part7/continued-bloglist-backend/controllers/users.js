const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });
    response.json(users.map((user) => user.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

userRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    if (body.password === undefined || body.username === undefined) {
      return response.status(400).json({
        error: 'Missing password or username',
      });
    }
    if (body.password.length < 3 || body.username.length < 3) {
      return response.status(400).json({
        error: 'Both username and password must be at least 3 characters long',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = userRouter;
