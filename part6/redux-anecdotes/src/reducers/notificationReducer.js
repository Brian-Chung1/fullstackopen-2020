const initialState = '';

const reducer = (state = initialState, action) => {
  console.log('Notification state now: ', state);
  console.log('Notification action', action);

  switch (action.type) {
    case 'SET':
      return action.data;
    case 'REMOVE':
      return initialState;
    default:
      return state;
  }
};

let delay;
export const showNotificationWithTimeout = (message, duration) => {
  return async (dispatch) => {
    dispatch(setNotification(message));
    clearTimeout(delay);
    delay = setTimeout(() => {
      dispatch(removeNotification());
    }, duration * 1000);
  };
};

export const setNotification = (message) => {
  return (dispatch) => {
    dispatch({
      type: 'SET',
      data: {
        message,
      },
    });
  };
};

export const removeNotification = () => {
  return (dispatch) => {
    dispatch({
      type: 'REMOVE',
    });
  };
};

export default reducer;
