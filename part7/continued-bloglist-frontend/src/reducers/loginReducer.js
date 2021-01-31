import loginService from '../services/login';
import blogService from '../services/blogs';

/* eslint-disable */
const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
let initialState = null;
if (loggedUserJSON) {
  const user = JSON.parse(loggedUserJSON);
  blogService.setToken(user.token);
  initialState = user;
}

const userReducer = (state = initialState, action) => {
  // console.log(`Login Reducer State: ${state}`);
  // console.log(`Login Reducer Action: ${action}`);

  switch (action.type) {
    case 'SET':
      return action.data;

    case 'LOGOUT':
      return null;

    default:
      return state;
  }
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    blogService.setToken(user.token);
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
    dispatch({
      type: 'SET',
      data: user,
    });
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser');
    dispatch({
      type: 'LOGOUT',
    });
  };
};

export default userReducer;
