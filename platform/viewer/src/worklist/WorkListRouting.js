import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ConnectedWorkList from './ConnectedWorkList';
import useServer from '../customHooks/useServer';
import OHIF from '@ohif/core';

// Contexts
import AppContext from '../context/AppContext';
const { urlUtil: UrlUtil } = OHIF.utils;

function WorkListRouting({ match: routeMatch, location: routeLocation }) {
  const { appConfig = {} } = useContext(AppContext);

  const filters = UrlUtil.queryString.getQueryFilters(routeLocation);

  let studyListFunctionsEnabled = false;
  if (appConfig.studyListFunctionsEnabled) {
    studyListFunctionsEnabled = appConfig.studyListFunctionsEnabled;
  }
  return (
    <ConnectedWorkList
      filters={filters}
      studyListFunctionsEnabled={studyListFunctionsEnabled}
    />
  );
}

WorkListRouting.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default WorkListRouting;
