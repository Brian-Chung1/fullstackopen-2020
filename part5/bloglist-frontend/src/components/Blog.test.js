import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

// Make a test which checks that the component displaying a blog renders the blog's
// title and author, but does not render its url or number of likes by default
// Add CSS-classes to the component to help the testing as necessary.

describe('<Blog />', () => {
  let component;
  let mockLikeHandler;
  let mockRemoveHandler;

  beforeEach(() => {
    mockLikeHandler = jest.fn();
    mockRemoveHandler = jest.fn();

    const blog = {
      title: 'test blog',
      author: 'user',
      url: 'www.google.com',
      likes: 1,
      user: { username: 'testUser', id: 123456 },
    };

    component = render(
      <Blog
        blog={blog}
        handleBlogLike={mockLikeHandler}
        handleBlogRemove={mockRemoveHandler}
      />
    );
  });

  test('default render has title and author only', () => {
    const blogComponent = component.container.querySelector('.blog');
    console.log(prettyDOM(blogComponent));
    expect(component.container).toHaveTextContent('test blog user');
  });

  test('render blog details on button press', () => {
    const showDetailsButton = component.getByText('Show');
    fireEvent.click(showDetailsButton);
    const blogDetails = component.container.querySelector('.blogDetails');
    expect(blogDetails).toBeDefined();
    expect(blogDetails).toHaveTextContent('www.google.com1liketestUserremove');
    console.log(prettyDOM(blogDetails));
  });

  test('like button clicked twice', () => {
    const showDetailsButton = component.getByText('Show');
    fireEvent.click(showDetailsButton);
    const likeButton = component.container.querySelector('.likeButton');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);
    expect(mockLikeHandler.mock.calls.length).toBe(2);
  });
});

//CI=true npm test
