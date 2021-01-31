import React, { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import { useSelector, useDispatch } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import UsersInfo from './components/UsersInfo';
import UserInfo from './components/UserInfo';
import { setUsers } from './reducers/userReducer';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Main from './components/Main';
import NavBar from './components/NavBar';
import BlogList from './components/BlogList';
import { Container } from '@material-ui/core';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUsers());
    dispatch(initializeBlogs());
  }, []);

  const user = useSelector((state) => state.login);
  console.log(user);

  return (
    <Container style={{ height: '100vh' }}>
      <NavBar />
      <Switch>
        <Route path="/blogs/:id">
          <Blog />
        </Route>
        <Route path="/blogs">
          <BlogList />
        </Route>
        <Route path="/users/:id">
          <UserInfo />
        </Route>
        <Route path="/users">
          <UsersInfo />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/">{user ? <Main /> : <Redirect to="/login" />}</Route>
      </Switch>
    </Container>
  );
};

export default App;
