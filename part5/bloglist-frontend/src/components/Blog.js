import React, { useState } from 'react';

const Blog = ({ blog, handleBlogLike, handleBlogRemove }) => {
  const [details, setDetails] = useState(false);

  const incrementBlogLike = () => {
    const newLikes = blog.likes + 1;
    const id = blog.id;
    const newBlog = {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    handleBlogLike(id, newBlog);
  };

  const removeBlog = () => {
    handleBlogRemove(blog);
  };

  const blogDetails = () => {
    return (
      <div className="blogDetails">
        <p>{blog.url}</p>
        <p>{blog.likes}</p>
        <button className="likeButton" onClick={incrementBlogLike}>
          like
        </button>
        <p>{blog.user.username}</p>
        <button className="removeButton" onClick={removeBlog}>
          remove
        </button>
      </div>
    );
  };
  return (
    <div className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setDetails(!details)}>
        {details ? 'Hide' : 'Show'}
      </button>
      {details && blogDetails()}
    </div>
  );
};

export default Blog;
