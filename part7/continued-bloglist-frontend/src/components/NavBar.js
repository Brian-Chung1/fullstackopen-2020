import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/loginReducer';
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core';

const NavBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.login);

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/blogs">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <Button color="inherit">
          {user ? (
            <em>{`${user.username} logged in`}</em>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </Button>
        <Button
          color="inherit"
          onClick={() => {
            dispatch(logoutUser());
            history.push('/');
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
