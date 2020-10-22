import { connect } from 'react-redux';
import RapidWorkItemsPanel from './RapidWorkItemsPanel';
import { setWorkItemIdx } from '@ohif/extension-rapid-viewer/src/redux/actions';

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    workList: state.rapidViewer.workList,
    currentWorkItemIdx: state.rapidViewer.currentWorkItemIdx,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    moveWorkItem: idx => {
      dispatch(setWorkItemIdx(idx));
    },
  };
};

const ConnectedRapidWorkItemsPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RapidWorkItemsPanel);

export default ConnectedRapidWorkItemsPanel;
