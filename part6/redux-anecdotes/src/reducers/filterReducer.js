const initialState = '';

const reducer = (state = initialState, action) => {
  // console.log('Filter state now: ', state);
  // console.log('Filter action', action);

  switch (action.type) {
    case 'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
};

export const setFilter = (filter) => {
  return {
    type: 'SET_FILTER',
    filter,
  };
};

export default reducer;
