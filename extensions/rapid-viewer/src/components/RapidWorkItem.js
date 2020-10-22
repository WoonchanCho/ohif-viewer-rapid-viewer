import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './RapidWorkItem.css';

function RapidWorkItem({ item, pos, isActive, onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        className={classNames('rapid-work-item', {
          'rapid-active': isActive,
        })}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>{pos + 1}. </div>
          <div>
            <div>{item.experimentLabel}</div>
            <div>{item.status}</div>
          </div>
        </div>
      </div>
    </>
  );
}

RapidWorkItem.propTypes = {
  item: PropTypes.object.isRequired,
  pos: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RapidWorkItem;
