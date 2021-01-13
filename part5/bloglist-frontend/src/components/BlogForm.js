import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (e) => {
    e.preventDefault();
    const blog = {
      title: title,
      author: author,
      url: url,
    };
    createBlog(blog);
    resetBlogForm();
  };

  const resetBlogForm = () => {
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div className="blogForm">
      <h2>Create New</h2>
      <p>
        Title:{' '}
        <input
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></input>
      </p>
      <p>
        Author:{' '}
        <input
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        ></input>
      </p>
      <p>
        Url:{' '}
        <input
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        ></input>
      </p>
      <button className="createBlogButton" onClick={addBlog}>
        Create
      </button>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
