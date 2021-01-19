import React, { useEffect } from 'react';
import AnecdotesForm from './components/AnecdotesForm';
import Anecdotes from './components/AnecdoteList';
import Notification from './components/Notification';
import Filter from './components/Filter';
import { useDispatch } from 'react-redux';
import { initializeAnecdotes } from './reducers/anecdoteReducer';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <AnecdotesForm />
    </div>
  );
};

export default App;
