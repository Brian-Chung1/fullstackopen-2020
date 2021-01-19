import deepFreeze from 'deep-freeze';
import notificationReducer from './notificationReducer';

const initialState = '';

describe('notificationReducer', () => {
  test('initial state', () => {
    const newState = notificationReducer(undefined, { type: 'default' });
    expect(newState).toEqual(initialState);
  });

  test('set notification', () => {
    const state = initialState;
    const action = {
      type: 'SET',
      data: { message: 'Notification Shown' },
    };

    deepFreeze(state);
    const newState = notificationReducer(state, action);
    expect(newState).toEqual(action.data);
  });

  test('removed notification after 5 seconds', () => {
    const state = initialState;
    const action = {
      type: 'REMOVE',
    };

    deepFreeze(state);
    const newState = notificationReducer(state, action);
    expect(newState).toEqual(initialState);
  });
});
