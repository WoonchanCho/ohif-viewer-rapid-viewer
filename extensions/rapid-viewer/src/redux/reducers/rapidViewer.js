import cloneDeep from 'lodash.clonedeep';
import {
  SET_WORK_GROUP,
  SET_WORK_ITEM_IDX,
  MOVE_TO_PREV_WORK_ITEM,
  MOVE_TO_NEXT_WORK_ITEM,
  SET_REPORT_FORM,
  REMOVE_REPORT_FORM,
  REMOVE_ALL_REPORT_FORMS,
} from '../constants/ActionTypes';

export const defaultState = {
  workList: {},
  currentWorkItemIdx: -1,
  reports: {},
};

function isFirstWorkItem(state) {
  return state.currentWorkItemIdx <= 0;
}

function isLastWorkItem(state) {
  const items = state.workList.items;
  return items && state.currentWorkItemIdx >= items.length - 1;
}

const rapidViewer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_WORK_GROUP:
      if (!action.workList) {
        return state;
      } else {
        const workList = cloneDeep(action.workList);
        return Object.assign({}, state, {
          workList,
          currentWorkItemIdx: workList.items.length > 0 ? 0 : -1,
        });
      }

    case SET_WORK_ITEM_IDX:
      if (
        !Number.isInteger(action.currentWorkItemIdx) ||
        action.currentWorkItemIdx < 0 ||
        action.currentWorkItemIdx >= state.workList.items.length
      ) {
        return state;
      } else {
        const workList = cloneDeep(state.workList);
        return Object.assign({}, state, {
          workList,
          currentWorkItemIdx: action.currentWorkItemIdx,
        });
      }

    case MOVE_TO_PREV_WORK_ITEM:
      if (isFirstWorkItem(state)) {
        return state;
      } else {
        // const workList = cloneDeep(state.workList);
        // return Object.assign({}, state, {
        //   currentWorkItemIdx: state.currentWorkItemIdx - 1,
        // });
        return {
          ...state,
          currentWorkItemIdx: state.currentWorkItemIdx - 1,
        };
      }

    case MOVE_TO_NEXT_WORK_ITEM:
      if (isLastWorkItem(state)) {
        return state;
      } else {
        // const workList = cloneDeep(state.workList);
        // return Object.assign({}, state, {
        //   currentWorkItemIdx: state.currentWorkItemIdx + 1,
        // });
        return {
          ...state,
          currentWorkItemIdx: state.currentWorkItemIdx + 1,
        };
      }

    case SET_REPORT_FORM:
      if (!action.reportId || !action.formData) {
        return state;
      } else {
        const formData = cloneDeep(action.formData);
        const reports = {
          ...cloneDeep(state.reports),
          [action.reportId]: formData,
        };

        return {
          ...state,
          reports,
        };
      }

    case REMOVE_REPORT_FORM:
      if (!action.reportId) {
        return state;
      } else {
        const reports = cloneDeep(state.reports);
        delete reports[action.reportId];

        return {
          ...state,
          reports,
        };
      }

    case REMOVE_ALL_REPORT_FORMS: {
      const reports = {};
      return {
        ...state,
        reports,
      };
    }

    default:
      return state;
  }
};

export default rapidViewer;
