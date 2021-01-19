import React from 'react';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';
import { connect } from 'react-redux';

const AnecdotesForm = (props) => {
  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = '';
    props.createAnecdote(content);
    props.showNotificationWithTimeout(`You added ${content}`, 5);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default connect(null, {
  createAnecdote,
  showNotificationWithTimeout,
})(AnecdotesForm);
