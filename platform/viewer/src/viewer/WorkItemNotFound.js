import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './WorkItemNotFound.css';

function WorkItemNotFound(props) {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="workitem-not-found">
        <div>There is no work item..</div>
        <Button
          onClick={() => {
            setClicked(true);
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }
}

function Button(props) {
  const { children, ...remProps } = props;
  return <button {...remProps}>{children}</button>;
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default WorkItemNotFound;
