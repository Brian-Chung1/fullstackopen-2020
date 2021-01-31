const reducer = (state = null, action) => {
  // console.log('Notification state: ', state);
  // console.log('Notification action: ', action);

  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'REMOVE':
      return null;
    default:
      return state;
  }
};

let delay;
export const showNotificationWithTimeout = (style, message, duration) => {
  return async (dispatch) => {
    dispatch(setNotification(style, message));
    clearTimeout(delay);
    delay = setTimeout(() => {
      dispatch(removeNotification());
    }, duration * 1000);
  };
};

export const setNotification = (style, message) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        style,
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
