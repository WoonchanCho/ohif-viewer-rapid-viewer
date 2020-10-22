import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RapidWorkItem from './RapidWorkItem';
import { WorkItemStatus } from '../constants';

import './RapidWorkItemsPanel.css';

function RapidWorkItemsPanel({ workList, currentWorkItemIdx, moveWorkItem }) {
  const items = workList.items || [];
  const [filteredItems, setFilteredItems] = useState(items);

  function onStatusChange(e) {
    const status = e.target.value;
    if (WorkItemStatus[status]) {
      setFilteredItems(items.filter(item => item.status === status));
    } else {
      setFilteredItems(items);
    }
  }

  return (
    <div className="rapid-navigation-tree">
      <ul>
        <h4>Work Item List</h4>
        <div className="rapid-filter-row">
          <div className="rapid-filter-name">Filter</div>
          <div className="rapid-filter-value">
            <select onChange={onStatusChange}>
              <option>All</option>
              {Object.keys(WorkItemStatus).map(status => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems &&
          filteredItems.map((item, idx) => (
            <li key={item.id}>
              <RapidWorkItem
                item={item}
                pos={idx}
                isActive={currentWorkItemIdx === idx}
                onClick={moveWorkItem.bind(undefined, idx)}
              />
            </li>
          ))}
        {!!filteredItems.length || <div>Not Found</div>}
      </ul>
    </div>
  );
}

RapidWorkItemsPanel.propTypes = {
  workList: PropTypes.object.isRequired,
  currentWorkItemIdx: PropTypes.number.isRequired,
  moveWorkItem: PropTypes.func.isRequired,
};

export default RapidWorkItemsPanel;
