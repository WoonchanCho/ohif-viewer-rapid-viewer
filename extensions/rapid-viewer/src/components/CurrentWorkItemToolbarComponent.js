import React, { useEffect, useState, useRef } from 'react';
import { setWorkItemIdx } from '@ohif/extension-rapid-viewer/src/redux/actions';
import './CurrentWorkItemToolbarComponent.css';

function CurrentWorkItemToolbarComponent() {
  const elCurrentWorkItem = useRef(null);
  const rapidViewer = window.store.getState().rapidViewer;
  const items = rapidViewer.workList.items || [];
  const currentWorkItemIdx = rapidViewer.currentWorkItemIdx;
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(items.length);
    setCurrentPosition(currentWorkItemIdx + 1);
  }, [currentWorkItemIdx, items.length]);

  function handleChange(e) {
    try {
      const val = parseInt(e.target.value);
      if (isNaN(val) || val <= 0) {
        setCurrentPosition('');
      } else {
        setCurrentPosition(val);
      }
    } catch (err) {
      setCurrentPosition('');
    }
  }

  function handleKeyDown(e) {
    const key = e.keyCode || e.which;
    if (key === 13) {
      // when 'enter' pressed, apply change.
      moveWorkItem();
    } else if (key === 27) {
      // when 'esc' pressed, cancel change.
      cancelPositionChange();
    }
  }

  function handleBlur(e) {
    cancelPositionChange();
  }

  function cancelPositionChange() {
    setCurrentPosition(
      window.store.getState().rapidViewer.currentWorkItemIdx + 1
    );
  }

  function moveWorkItem() {
    let originalPosition =
      window.store.getState().rapidViewer.currentWorkItemIdx + 1;
    let adjustedPosition = currentPosition;
    if (!currentPosition || isNaN(currentPosition)) {
      adjustedPosition = originalPosition;
    } else if (currentPosition <= 0) {
      adjustedPosition = 1;
    } else if (currentPosition > totalCount) {
      adjustedPosition = totalCount;
    }
    setCurrentPosition(adjustedPosition);
    if (adjustedPosition === originalPosition) {
      return;
    }
    window.store.dispatch(setWorkItemIdx(adjustedPosition - 1));
  }

  return (
    <div className="CurrentWorkItemBox">
      <input
        ref={elCurrentWorkItem}
        type="text"
        className="CurrentWorkItem"
        value={currentPosition}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <div> / </div>
      <div className="TotalWorkItem">{totalCount}</div>
    </div>
  );
}

CurrentWorkItemToolbarComponent.propTypes = {};

export default CurrentWorkItemToolbarComponent;
