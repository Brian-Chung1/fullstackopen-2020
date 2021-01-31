import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper } from '@material-ui/core';

const Toggle = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  return (
    <Paper>
      <Paper style={hideWhenVisible}>
        <Button id="toggle-button" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </Paper>
      <Paper style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </Paper>
    </Paper>
  );
});

Toggle.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Toggle.displayName = 'Toggle';

export default Toggle;
