import React from 'react';
import { connect } from 'react-redux';

const Notification = (props) => {
  const message = props.notification.message;
  console.log(`message is ${message}`);
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };

  return <>{message && <div style={style}>{message}</div>}</>;
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  };
};

export default connect(mapStateToProps)(Notification);
