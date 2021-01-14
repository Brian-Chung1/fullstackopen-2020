import React from 'react';
import PropTypes from 'prop-types';

export const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin,
}) => {
  return (
    <div>
      <h1>Log in to application</h1>
      username
      <input
        id="username"
        type="text"
        value={username}
        onChange={handleUsernameChange}
      ></input>
      password
      <input
        id="password"
        type="text"
        value={password}
        onChange={handlePasswordChange}
      ></input>
      <button id="login-button" onClick={handleLogin}>
        login
      </button>
    </div>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
