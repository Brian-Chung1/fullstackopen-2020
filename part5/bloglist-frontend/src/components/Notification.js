import React from 'react';

export const Notification = ({ className, message }) => {
  return <div className={className}>{message}</div>;
};

export default Notification;
