import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Blog from './components/Blog';
import Toggle from './components/Toggle';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const blogFormRef = useRef();
  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    }
    getBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      resetLoginForm();
      successNotification('Successfully Logged In');
    } catch (err) {
      errorNotification('Wrong Credentials');
    }
  };

  const createBlog = async (blogObject) => {
    try {
      const addedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(addedBlog));
      blogFormRef.current.toggleVisibility();
      successNotification(
        `New Blog: ${addedBlog.title} by ${addedBlog.author} added`
      );
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleBlogLike = async (id, newBlog) => {
    try {
      const updatedBlog = await blogService.updateLikes(id, newBlog);

      const newBlogList = blogs.map((blog) =>
        blog.title === updatedBlog.title ? updatedBlog : blog
      );

      setBlogs(newBlogList);
      successNotification(
        `❤️ Liked ${updatedBlog.title} by ${updatedBlog.author} ❤️`
      );
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleBlogRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        successNotification(`Deleted ${blog.title} by ${blog.author}`);
      } catch (err) {
        errorNotification(`${err.message}: ${err.response.statusText}`);
        console.log({ err });
      }
    }
  };

  const resetLoginForm = () => {
    setUsername('');
    setPassword('');
  };

  const errorNotification = (err) => {
    setErrorMessage(err);
    setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  };

  const successNotification = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const blogForm = () => {
    return (
      <Toggle buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Toggle>
    );
  };

  const loginForm = () => {
    return (
      <>
        {errorMessage && (
          <Notification className="error" message={errorMessage} />
        )}
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </>
    );
  };
  if (user === null) return loginForm();
  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && (
        <Notification className="error" message={errorMessage} />
      )}
      {successMessage && (
        <Notification className="success" message={successMessage} />
      )}

      <div>
        <p>{`${user.username} logged in`}</p>
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
        {blogForm()}
      </div>

      <div className="blogList">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleBlogLike={handleBlogLike}
              handleBlogRemove={handleBlogRemove}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
