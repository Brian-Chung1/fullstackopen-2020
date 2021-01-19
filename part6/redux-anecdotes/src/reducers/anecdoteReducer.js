import anecdoteService from '../services/anecdotes';

const reducer = (state = [], action) => {
  // console.log('Anecdote state now: ', state);
  // console.log('Anecdote action', action);

  switch (action.type) {
    case 'VOTE':
      const updatedAnecdote = action.data;
      const id = updatedAnecdote.id;
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : updatedAnecdote
      );

    case 'ADD':
      return [...state, action.data];

    case 'INIT':
      return action.data;
    default:
      return state;
  }
};

export const voteAnecdote = (anecdoteToVote) => {
  return async (dispatch) => {
    const newAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1,
    };
    const updatedAnecdote = await anecdoteService.update(newAnecdote);
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote,
    });
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newNote = await anecdoteService.createNew(content);
    dispatch({
      type: 'ADD',
      data: newNote,
    });
  };
};

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT',
      data: anecdotes,
    });
  };
};

export default reducer;
