import blogReducer from '../blogReducer';
import deepFreeze from 'deep-freeze';

describe('blogReducer', () => {
  test('returns new state with action NEW_BLOG', () => {
    const state = [];
    const action = {
      type: 'NEW_BLOG',
      data: {
        title: 'new blog',
        author: 'user',
        url: 'www.test.com',
        likes: 0,
      },
    };

    deepFreeze(state);
    const newState = blogReducer(state, action);

    expect(newState).toHaveLength(1);
    expect(newState).toContainEqual(action.data);
  });

  test('returns new state with action LIKE', () => {
    const state = [
      {
        title: 'new blog 1',
        author: 'user',
        url: 'www.test.com',
        likes: 0,
      },
      {
        title: 'new blog 2',
        author: 'user',
        url: 'www.test.com',
        likes: 0,
      },
    ];

    const likedBlog = { ...state[0], likes: 1 };

    const action = {
      type: 'LIKE',
      data: likedBlog,
    };

    deepFreeze(state);
    const newState = blogReducer(state, action);

    expect(newState.length).toBe(2);

    expect(newState).toContainEqual({
      title: 'new blog 1',
      author: 'user',
      url: 'www.test.com',
      likes: 1,
    });
  });

  test('returns new state with action DELETE', () => {
    const state = [
      {
        title: 'new blog 1',
        author: 'user',
        url: 'www.test.com',
        likes: 0,
        id: 1,
      },
      {
        title: 'new blog 2',
        author: 'user',
        url: 'www.test.com',
        likes: 0,
        id: 2,
      },
    ];

    const action = {
      type: 'DELETE',
      id: 1,
    };

    deepFreeze(state);
    const newState = blogReducer(state, action);

    expect(newState.length).toBe(1);

    expect(newState).not.toContain({
      title: 'new blog 1',
      author: 'user',
      url: 'www.test.com',
      likes: 0,
    });
  });
});

//npm test -- blogReducer.test.js
