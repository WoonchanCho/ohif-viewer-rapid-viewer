import { connect } from 'react-redux';
import actions from '@ohif/extension-rapid-viewer/src/redux/actions';
import RapidRadReportPanel from './RapidRadReportPanel';
import { postRadReportForm } from '../fetch/radReport';

const mapStateToProps = state => {
  const { rapidViewer, authentication } = state;
  const reportId = rapidViewer.workList.reportId;
  const workListId = rapidViewer.workList.id;
  const items = rapidViewer.workList.items;
  const currentWorkItemIdx = rapidViewer.currentWorkItemIdx;
  const workItemId = items[currentWorkItemIdx].id;
  const xnatUrl = authentication.user.xnatUrl;

  return {
    radReportData: rapidViewer.reports[reportId],
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
