import anecdoteReducer from './anecdoteReducer';
import deepFreeze from 'deep-freeze';

describe('anecdoteReducer', () => {
  test('voting an anecdote', () => {
    const state = [
      {
        content: 'anecdote 1',
        id: 1,
        votes: 0,
      },
      {
        content: 'anecdote 2',
        id: 2,
        votes: 0,
      },
    ];

    const action = {
      type: 'VOTE',
      data: { id: 1 },
    };

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState.length).toBe(2);
    expect(newState).toContainEqual(state[1]);
    expect(newState).toContainEqual({
      content: 'anecdote 1',
      id: 1,
      votes: 1,
    });
  });

  test('adding a new anecdote', () => {
    //this test only works if the reducer allows manual data input of id
    const state = [];

    const action = {
      type: 'ADD',
      data: { content: 'added anecdote 1', id: 1 },
    };

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState.length).toBe(1);
    expect(newState).toContainEqual({
      content: 'added anecdote 1',
      id: 1,
      votes: 0,
    });
  });
});
