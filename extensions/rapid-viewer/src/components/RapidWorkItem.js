import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './RapidWorkItem.styl';

function RapidWorkItem({ item, pos, isActive, onClick }) {
  return (
    <>
      <div
        onClick={onClick}
        className={classNames('rapid-work-item', {
          'rapid-active': isActive,
        })}
      >
        <div className="rapid-work-item-field-group">
          <div className="rapid-work-item-field">
            {pos + 1}. {item.experimentLabel}
          </div>
          <div className="rapid-work-item-field">{item.projectId}</div>
          <div className="rapid-work-item-field">
            <div className="rapid-badge">{item.status}</div>
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
