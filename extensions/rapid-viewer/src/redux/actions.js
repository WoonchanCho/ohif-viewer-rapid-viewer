/** Action Creators:
 *  https://redux.js.org/basics/actions#action-creators
 */

import {
  SET_USER,
  CLEAR_USER,
  SET_WORK_GROUP,
  SET_WORK_ITEM_IDX,
  MOVE_TO_PREV_WORK_ITEM,
  MOVE_TO_NEXT_WORK_ITEM,
  SET_REPORT_FORM,
  REMOVE_REPORT_FORM,
  REMOVE_ALL_REPORT_FORMS,
} from './constants/ActionTypes.js';

export const setUser = user => ({
  type: SET_USER,
  user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const setWorkList = workList => ({
  type: SET_WORK_GROUP,
  workList,
});
export const setWorkItemIdx = currentWorkItemIdx => ({
  type: SET_WORK_ITEM_IDX,
  currentWorkItemIdx,
});

export const moveToPrevWorkItem = () => ({
  type: MOVE_TO_PREV_WORK_ITEM,
});

export const moveToNextWorkItem = () => ({
  type: MOVE_TO_NEXT_WORK_ITEM,
});

export const setReportForm = (reportId, formData) => ({
  type: SET_REPORT_FORM,
  reportId,
  formData,
});

export const removeReportForm = () => ({
  type: REMOVE_REPORT_FORM,
});

export const removeAllReportForms = () => ({
  type: REMOVE_ALL_REPORT_FORMS,
});

const actions = {
  setUser,
  clearUser,
  setWorkList,
  setWorkItemIdx,
  moveToPrevWorkItem,
  moveToNextWorkItem,
  setReportForm,
  removeReportForm,
  removeAllReportForms,
};

export default actions;
