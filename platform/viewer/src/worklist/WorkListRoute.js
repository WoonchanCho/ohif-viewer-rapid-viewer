import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { WorkList, TablePagination, useDebounce, useMedia } from '@ohif/ui';
import ConnectedHeader from '../connectedComponents/ConnectedHeader.js';
import moment from 'moment';

// Contexts
import UserManagerContext from '../context/UserManagerContext';
import WhiteLabelingContext from '../context/WhiteLabelingContext';
import AppContext from '../context/AppContext';
import { fetchWorkLists } from '@ohif/extension-rapid-viewer/src/fetch';
import actions from '@ohif/extension-rapid-viewer/src/redux/actions';
import {
  PageNotFoundException,
  UserExpiredException,
} from '@ohif/extension-rapid-viewer/src/exception';

function WorkListRoute(props) {
  const dispatch = useDispatch();
  const { history, user } = props;
  const [t] = useTranslation('Common');
  // ~~ STATE
  const [sort, setSort] = useState({
    fieldName: 'dueDate',
    direction: 'desc',
  });
  const [filterValues, setFilterValues] = useState({
    workListId: '',
    workListName: '',
    description: '',
    dueDateTo: null,
    dueDateFrom: null,
    //
    nameOrDesc: '',
    //
    allFields: '',
  });
  const [workLists, setWorkLists] = useState([]);
  const [searchStatus, setSearchStatus] = useState({
    isSearchingForWorks: false,
    error: null,
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pageNumber, setPageNumber] = useState(0);
  const appContext = useContext(AppContext);
  // ~~ RESPONSIVE
  const displaySize = useMedia(
    [
      '(min-width: 1750px)',
      '(min-width: 1000px) and (max-width: 1749px)',
      '(max-width: 999px)',
    ],
    ['large', 'medium', 'small'],
    'small'
  );
  // ~~ DEBOUNCED INPUT
  const debouncedSort = useDebounce(sort, 200);
  const debouncedFilters = useDebounce(filterValues, 250);

  const { appConfig = {} } = appContext;

  useEffect(
    () => {
      const refreshWorkLists = async () => {
        try {
          setSearchStatus({ error: null, isSearchingForWorks: true });

          const response = await getWorkLists(
            debouncedFilters,
            debouncedSort,
            rowsPerPage,
            pageNumber,
            displaySize,
            user
          );
          setWorkLists(response);

          setSearchStatus({ error: null, isSearchingForWorks: false });
        } catch (error) {
          setSearchStatus({ error: true, isFetching: false });
          if (error instanceof PageNotFoundException) {
            dispatch(actions.clearUser());
          } else if (error instanceof UserExpiredException) {
            dispatch(actions.clearUser());
          } else {
            console.warn(error);
          }
        }
      };

      refreshWorkLists();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilters, debouncedSort, rowsPerPage, pageNumber, displaySize]
  );

  if (searchStatus.error) {
    return <div>Error: {JSON.stringify(searchStatus.error)}</div>;
  } else if (workLists === []) {
    return <div>Loading...</div>;
  }

  function handleSort(fieldName) {
    let sortFieldName = fieldName;
    let sortDirection = 'asc';

    if (fieldName === sort.fieldName) {
      if (sort.direction === 'asc') {
        sortDirection = 'desc';
      } else {
        sortFieldName = null;
        sortDirection = null;
      }
    }

    setSort({
      fieldName: sortFieldName,
      direction: sortDirection,
    });
  }

  function handleFilterChange(fieldName, value) {
    setFilterValues(state => {
      return {
        ...state,
        [fieldName]: value,
      };
    });
  }

  return (
    <>
      <WhiteLabelingContext.Consumer>
        {whiteLabeling => (
          <UserManagerContext.Consumer>
            {userManager => (
              <ConnectedHeader
                useLargeLogo={true}
                user={user}
                userManager={userManager}
              >
                {whiteLabeling &&
                  whiteLabeling.createLogoComponentFn &&
                  whiteLabeling.createLogoComponentFn(React)}
              </ConnectedHeader>
            )}
          </UserManagerContext.Consumer>
        )}
      </WhiteLabelingContext.Consumer>
      <div className="study-list-header">
        <div className="header">
          <h1 style={{ fontWeight: 300, fontSize: '22px' }}>{t('WorkList')}</h1>
        </div>
        <div className="actions">
          <span className="study-count">{workLists.length}</span>
        </div>
      </div>

      <div className="table-head-background" />
      <div className="study-list-container">
        <WorkList
          isLoading={searchStatus.isSearchingForWorks}
          hasError={searchStatus.error === true}
          // Rows
          workLists={workLists}
          onSelectItem={async workListId => {
            history.push(`/rapid-viewer/${workListId}`);
          }}
          // Table Header
          sort={sort}
          onSort={handleSort}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          studyListDateFilterNumDays={appConfig.studyListDateFilterNumDays}
          displaySize={displaySize}
        />
        {/* PAGINATION FOOTER */}
        <TablePagination
          currentPage={pageNumber}
          nextPageFunc={() => setPageNumber(pageNumber + 1)}
          prevPageFunc={() => setPageNumber(pageNumber - 1)}
          onRowsPerPageChange={Rows => setRowsPerPage(Rows)}
          rowsPerPage={rowsPerPage}
          recordCount={workLists.length}
        />
      </div>
    </>
  );
}

WorkListRoute.propTypes = {
  filters: PropTypes.object,
  user: PropTypes.object,
  history: PropTypes.object,
};

/**
 * Not ideal, but we use displaySize to determine how the filters should be used
 * to build the collection of promises we need to fetch a result set.
 *
 * @param {*} filters
 * @param {object} sort
 * @param {string} sort.fieldName - field to sort by
 * @param {string} sort.direction - direction to sort
 * @param {number} rowsPerPage - Number of results to return
 * @param {number} pageNumber - Used to determine results offset
 * @param {string} displaySize - small, medium, large
 * @returns
 */
async function getWorkLists(
  filters,
  sort,
  rowsPerPage,
  pageNumber,
  displaySize,
  user
) {
  const { allFields, nameOrDesc } = filters;
  const sortFieldName = sort.fieldName || 'workListId';
  const sortDirection = sort.direction || 'desc';
  const dueDateFrom =
    filters.dueDateFrom ||
    moment()
      .subtract(25000, 'days')
      .toDate();
  const dueDateTo = filters.dueDateTo || new Date();

  const mappedFilters = {
    workListId: filters.workListId,
    workListName: filters.Name,
    description: filters.Description,
    // NEVER CHANGE
    dueDateFrom,
    dueDateTo,
    limit: rowsPerPage,
    offset: pageNumber * rowsPerPage,
  };

  const workLists = await _fetchWorkLists(
    mappedFilters,
    displaySize,
    {
      allFields,
      nameOrDesc,
    },
    user.xnatUrl
  );

  // Only the fields we use
  const mappedWorkLists = workLists.map(workList => ({
    workListId: workList.id,
    username: user.username,
    workListName: workList.name,
    description: workList.description,
    reportId: workList.reportId,
    status: workList.status,
    totalCount: workList.items ? workList.items.length : 0,
    finishedCount: 0,
    createdDate: new Date(workList.created),
    dueDate: new Date(workList.dueDate),
    items: workList.items,
  }));

  // For our smaller displays, map our field name to a single
  // field we can actually sort by.
  const sortFieldNameMapping = {
    allFields: 'Name',
    patientNameOrId: 'PatientName',
    accessionOrModalityOrDescription: 'modalities',
  };
  const mappedSortFieldName =
    sortFieldNameMapping[sortFieldName] || sortFieldName;

  const sortedWorkLists = _sortWorkLists(
    mappedWorkLists,
    mappedSortFieldName,
    sortDirection
  );

  return sortedWorkLists;
}

/**
 *
 *
 * @param {object[]} studies - Array of studies to sort
 * @param {string} studies.StudyDate - Date in 'MMM DD, YYYY' format
 * @param {string} field - name of properties on study to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns
 */
function _sortWorkLists(workLists, field, order) {
  // Make sure our StudyDate is in a valid format and create copy of studies array
  const sortedWorks = workLists.map(workList => {
    workList.createdDate = workList.createdDate.toLocaleDateString();
    workList.dueDate = workList.dueDate.toLocaleDateString();
    return workList;
  });

  // Sort by field
  sortedWorks.sort(function(a, b) {
    let fieldA = a[field];
    let fieldB = b[field];
    if (field === 'dueDate') {
      fieldA = moment(fieldA).toISOString();
      fieldB = moment(fieldB).toISOString();
    }

    // Order
    if (order === 'desc') {
      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    } else {
      if (fieldA > fieldB) {
        return -1;
      }
      if (fieldA < fieldB) {
        return 1;
      }
      return 0;
    }
  });

  return sortedWorks;
}

/**
 * We're forced to do this because DICOMWeb does not support "AND|OR" searches
 * across multiple fields. This allows us to make multiple requests, remove
 * duplicates, and return the result set as if it were supported
 *
 * @param {object} server
 * @param {Object} filters
 * @param {string} displaySize - small, medium, or large
 * @param {string} multi.allFields
 * @param {string} multi.patientNameOrId
 * @param {string} multi.accessionOrModalityOrDescription
 */
async function _fetchWorkLists(
  filters,
  displaySize,
  { allFields, nameOrDesc },
  xnatUrl
) {
  let queryFiltersArray = [filters];

  if (displaySize === 'small') {
    const firstSet = _getQueryFiltersForValue(
      filters,
      ['workListName', 'description', 'workListId'],
      allFields
    );

    if (firstSet.length) {
      queryFiltersArray = firstSet;
    }
  } else if (displaySize === 'medium') {
    const firstSet = _getQueryFiltersForValue(
      filters,
      ['workListName', 'description'],
      nameOrDesc
    );

    const secondSet = _getQueryFiltersForValue(
      filters,
      ['AccessionNumber', 'StudyDescription', 'ModalitiesInStudy'],
      nameOrDesc
    );

    if (firstSet.length || secondSet.length) {
      queryFiltersArray = firstSet.concat(secondSet);
    }
  }

  return fetchWorkLists(xnatUrl, filters);
}

/**
 *
 *
 * @param {*} filters
 * @param {*} fields - Array of string fields
 * @param {*} value
 */
function _getQueryFiltersForValue(filters, fields, value) {
  const queryFilters = [];

  if (value === '' || !value) {
    return queryFilters;
  }

  fields.forEach(field => {
    const filter = Object.assign(
      {
        workListName: '',
        description: '',
        workListId: '',
      },
      filters
    );

    filter[field] = value;
    queryFilters.push(filter);
  });

  return queryFilters;
}

export default withRouter(WorkListRoute);
