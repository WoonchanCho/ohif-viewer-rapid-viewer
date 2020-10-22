import { connect } from 'react-redux';

import WorkListRoute from './WorkListRoute.js';

const isActive = a => a.active === true;

const mapStateToProps = state => {
  const activeServer = state.servers.servers.find(isActive);

  return {
    server: activeServer,
    user: state.authentication.user,
  };
};

const ConnectedWorkList = connect(
  mapStateToProps,
  null
)(WorkListRoute);

export default ConnectedWorkList;
