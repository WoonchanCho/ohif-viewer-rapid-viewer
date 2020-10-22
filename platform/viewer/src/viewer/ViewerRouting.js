import React from 'react';
import PropTypes from 'prop-types';
import ConnectedViewer from './ConnectedViewer';

function ViewerRouting({
  match: {
    params: { workListId },
  },
}) {
  return <ConnectedViewer workListId={workListId} />;
}

ViewerRouting.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      workListId: PropTypes.string.isRequired,
    }),
  }),
};

export default ViewerRouting;
