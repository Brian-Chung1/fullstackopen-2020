import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';
import Toggle from '../components/Toggle';
import { TextField, Button, Paper } from '@material-ui/core';

export const BlogForm = () => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleBlogCreate = (e) => {
    e.preventDefault();
    const blog = {
      title: title,
      author: author,
      url: url,
      likes: 0,
    };
    dispatch(createBlog(blog));
    dispatch(
      showNotificationWithTimeout(
        'success',
        `New Blog: ${title} by ${author} added`,
        5
      )
    );
    resetBlogForm();
    blogFormRef.current.toggleVisibility();
  };

  const resetBlogForm = () => {
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <Toggle buttonLabel="New Blog" ref={blogFormRef}>
      <form onSubmit={handleBlogCreate} className="blogForm">
        <h2>Create New</h2>
        <Paper>
          Title:{' '}
          <TextField
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          ></TextField>
        </Paper>
        <Paper>
          Author:{' '}
          <TextField
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          ></TextField>
        </Paper>
        <Paper>
          Url:{' '}
          <TextField
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          ></TextField>
        </Paper>
        <Button className="createBlogButton" type="submit">
          Create
        </Button>
      </form>
    </Toggle>
  );
};

export default BlogForm;
