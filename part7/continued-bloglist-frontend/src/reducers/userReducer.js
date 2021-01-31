import userService from '../services/user';

/* eslint-disable */

const userReducer = (state = [], action) => {
  // console.log(`User Reducer State: ${state}`);
  // console.log(`User Reducer Action: ${action}`);

  switch (action.type) {
    case 'SET_USERS':
      return action.data;

    default:
      return state;
  }
};

export const setUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch({
      type: 'SET_USERS',
      data: users,
    });
  };
};

export default userReducer;
