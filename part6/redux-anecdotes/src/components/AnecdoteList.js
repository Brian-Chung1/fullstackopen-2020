import React from 'react';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';
import { connect } from 'react-redux';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div className="anecdote">
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const Anecdotes = (props) => {
  //Using useSelector hook to retrieve state
  // const anecdotes = useSelector((state) => {
  //   const sortedAnecdotes = state.anecdotes.sort((a, b) => b.votes > a.votes);
  //   if (state.filter !== '') {
  //     return sortedAnecdotes.filter((anecdote) =>
  //       anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
  //     );
  //   } else {
  //     return sortedAnecdotes;
  //   }
  // });

  //Using useDispatch hook to dispatch redux action functions
  // const dispatch = useDispatch();
  // const voteHandler = (anecdote) => {
  //   dispatch(voteAnecdote(anecdote));
  //   dispatch(setNotification(`You Voted ${anecdote.content}`, 5));
  // };

  const voteHandler = (anecdote) => {
    props.voteAnecdote(anecdote);
    props.showNotificationWithTimeout(`You Voted ${anecdote.content}`, 5);
  };

  return (
    <ul>
      {props.anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => voteHandler(anecdote)}
        />
      ))}
    </ul>
  );
};

const mapStateToProps = (state) => {
  let anecdotes = state.anecdotes;
  if (state.filter !== '') {
    anecdotes = anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    );
  }
  anecdotes = anecdotes.sort((a, b) => b.votes > a.votes);
  return {
    anecdotes: anecdotes,
  };
};

export default connect(mapStateToProps, {
  voteAnecdote,
  showNotificationWithTimeout,
})(Anecdotes);
