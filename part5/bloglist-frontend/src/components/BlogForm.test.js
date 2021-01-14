import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('create new blog', () => {
    const createBlog = jest.fn();
    const component = render(<BlogForm createBlog={createBlog} />);

    const title = component.container.querySelector('#title');
    const author = component.container.querySelector('#author');
    const url = component.container.querySelector('#url');
    const button = component.container.querySelector('.createBlogButton');

    fireEvent.change(title, {
      target: { value: 'ReactJS' },
    });

    fireEvent.change(author, {
      target: { value: 'Dan Abramov' },
    });

    fireEvent.change(url, {
      target: { value: 'https://reactjs.org/' },
    });

    fireEvent.click(button);

    expect(createBlog.mock.calls).toHaveLength(1);
    console.log(JSON.stringify(createBlog.mock.calls[0][0].title, null, 2));
    expect(createBlog.mock.calls[0][0].title).toBe('ReactJS');
    expect(createBlog.mock.calls[0][0].author).toBe('Dan Abramov');
    expect(createBlog.mock.calls[0][0].url).toBe('https://reactjs.org/');
  });
});

//CI=true npm test
