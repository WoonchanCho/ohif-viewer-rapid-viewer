import { connect } from 'react-redux';
import {
  actions,
  fetchWorkList,
  fetchRadReportForm,
} from '@ohif/extension-rapid-viewer';

import ViewerRoute from './ViewerRoute.js';

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    workItems: state.rapidViewer.workList.items || [],
    currentWorkItemIdx: state.rapidViewer.currentWorkItemIdx,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearUser: () => {
      dispatch(actions.clearUser());
    },
    setWorkList: items => {
      dispatch(actions.setWorkList(items));
    },
    setWorkItemIdx: currentWorkItemIdx => {
      dispatch(actions.setWorkItemIdx(currentWorkItemIdx));
    },
    setReportForm: (reportId, formData) => {
      dispatch(actions.setReportForm(reportId, formData));
    },
    fetchWorkList,
    fetchRadReportForm,
  };
};

const ConnectedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewerRoute);

export default ConnectedViewer;
