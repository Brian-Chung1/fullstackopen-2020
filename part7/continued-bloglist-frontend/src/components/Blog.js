import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateLikes,
  deleteBlog,
  addBlogComment,
} from '../reducers/blogReducer';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';
import { useRouteMatch, Link } from 'react-router-dom';
import {
  makeStyles,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Blog = () => {
  const classes = useStyles();
  const [comment, setComment] = useState('');
  const id = useRouteMatch('/blogs/:id').params.id;
  const dispatch = useDispatch();

  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );
  if (!blog) return null;

  const { title, url, likes, author, comments } = blog;

  const handleBlogLike = () => {
    try {
      const likedBlog = {
        likes: likes + 1,
      };
      dispatch(updateLikes(blog.id, likedBlog));
      dispatch(
        showNotificationWithTimeout(
          'success',
          `❤️ Liked ${blog.title} by ${blog.author} ❤️`,
          5
        )
      );
    } catch (err) {
      dispatch(
        showNotificationWithTimeout('error', 'Error: Blog does not exist', 5)
      );
    }
  };

  // const handleBlogRemove = () => {
  //   if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
  //     dispatch(deleteBlog(blog.id));
  //     dispatch(
  //       showNotificationWithTimeout(
  //         'success',
  //         `Deleted ${blog.title} by ${blog.author}`,
  //         5
  //       )
  //     );
  //   }
  // };

  const handleAddComment = () => {
    if (comment.trim() === '') {
      return;
    }
    try {
      dispatch(addBlogComment(blog, comment));
      setComment('');
    } catch (err) {
      dispatch(showNotificationWithTimeout('error', 'Blog does not exist', 5));
    }
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography className={classes.pos}>{`added by ${author}`}</Typography>
        <Typography variant="body2" component="p">
          <a href={url}>{url}</a>
        </Typography>
        <CardActions>
          <Typography>{`${likes} likes`}</Typography>
          <Button onClick={handleBlogLike}>like</Button>
        </CardActions>
        <Typography>Comments</Typography>
        <CardActions>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></TextField>
          <Button onClick={handleAddComment}>add comment</Button>
          {comment}
        </CardActions>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <p>{`Created on ${comment.date}`}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Blog;
