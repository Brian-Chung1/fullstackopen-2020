import React from 'react';
import BlogForm from './BlogForm';
import BlogList from './BlogList';
import Notification from './Notification';

const Main = () => {
  return (
    <>
      <h2>blog app</h2>
      <Notification />
      <BlogForm />
      <BlogList />
    </>
  );
};

export default Main;
