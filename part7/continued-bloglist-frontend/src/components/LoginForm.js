import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/loginReducer';
import Notification from '../components/Notification';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';
import { useHistory } from 'react-router-dom';
import { Container, TextField, Button, Paper } from '@material-ui/core';

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      resetLoginForm();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      return;
    }

    try {
      await dispatch(loginUser({ username, password }));
      dispatch(
        showNotificationWithTimeout('success', `${username} logged in`, 5)
      );
      history.push('/');
    } catch (err) {
      dispatch(
        showNotificationWithTimeout('error', `Wrong username or password`, 5)
      );
    }
  };

  const resetLoginForm = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <Container>
      <Notification />
      <form onSubmit={handleLogin}>
        <h1>Log in to application</h1>
        <Paper>
          username
          <TextField
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
        </Paper>
        <Paper>
          password
          <TextField
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
        </Paper>
        <Button id="login-button" type="submit">
          login
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;
