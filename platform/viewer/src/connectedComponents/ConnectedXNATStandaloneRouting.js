import { connect } from 'react-redux';
import XNATStandaloneRouting from '../routes/XNATStandaloneRouting';

const mapStateToProps = state => {
  const { xnatUrl } = state.authentication.user;

  return {
    xnatUrl,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    activateServer: server => {
      const action = {
        type: 'ACTIVATE_SERVER',
        server,
      };
      dispatch(action);
    },
  };
};

const ConnectedXNATStandaloneRouting = connect(
  mapStateToProps,
  mapDispatchToProps
)(XNATStandaloneRouting);

export default ConnectedXNATStandaloneRouting;
