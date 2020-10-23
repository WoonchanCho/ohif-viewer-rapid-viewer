import { connect } from 'react-redux';
import actions from '@ohif/extension-rapid-viewer/src/redux/actions';
import RapidRadReportPanel from './RapidRadReportPanel';
import { postRadReportForm } from '../fetch/radReport';
import { WorkListStatus, WorkItemStatus } from '../constants';
const mapStateToProps = state => {
  const { rapidViewer, authentication } = state;
  const reportId = rapidViewer.workList.reportId;
  const {
    id: workListId,
    status: workListStatus,
    formDisabledWhenComplete,
  } = rapidViewer.workList;
  const items = rapidViewer.workList.items;
  const currentWorkItemIdx = rapidViewer.currentWorkItemIdx;
  const { id: workItemId, status: workItemStatus } = items[currentWorkItemIdx];
  const xnatUrl = authentication.user.xnatUrl;

  return {
    radReportData: rapidViewer.reports[reportId],
    formDisabled:
      workListStatus === WorkListStatus.Complete ||
      workListStatus === WorkListStatus.Cancelled ||
      (formDisabledWhenComplete &&
        (workItemStatus === WorkItemStatus.Complete ||
          workItemStatus === WorkItemStatus.Cancelled)),
    postRadReportForm: postRadReportForm.bind(
      this,
      xnatUrl,
      workListId,
      workItemId,
      reportId
    ),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    moveToNextWorkItem: () => {
      dispatch(actions.moveToNextWorkItem());
    },
  };
};

const ConnectedRapidRadReportPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RapidRadReportPanel);

export default ConnectedRapidRadReportPanel;
