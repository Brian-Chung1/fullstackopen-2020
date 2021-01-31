import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

const UserInfo = () => {
  const id = useRouteMatch('/users/:id').params.id;
  const user = useSelector((state) => state.users.find((u) => u.id === id));
  if (!user) return null;
  const { username, blogs } = user;
  return (
    <div>
      <h1>{username}</h1>
      <p>Added Blogs</p>
      <ul>
        {blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default UserInfo;
