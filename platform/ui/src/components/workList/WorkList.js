import './WorkList.styl';

import React from 'react';
import classNames from 'classnames';
import TableSearchFilter from './TableSearchFilter.js';
import PropTypes from 'prop-types';
import { WorkListLoadingText } from './WorkListLoadingText.js';
import { useTranslation } from 'react-i18next';

const getContentFromUseMediaValue = (
  displaySize,
  contentArrayMap,
  defaultContent
) => {
  const content =
    displaySize in contentArrayMap
      ? contentArrayMap[displaySize]
      : defaultContent;

  return content;
};
/**
 *
 *
 * @param {*} props
 * @returns
 */
function WorkList(props) {
  const {
    isLoading,
    hasError,
    workLists,
    sort,
    onSort: handleSort,
    filterValues,
    onFilterChange: handleFilterChange,
    onSelectItem: handleSelectItem,
    studyListDateFilterNumDays,
    displaySize,
  } = props;
  const { t, ready: translationsAreReady } = useTranslation('WorkList');

  const largeTableMeta = [
    {
      displayText: t('WorkList Name'),
      fieldName: 'workListName',
      inputType: 'text',
      size: 330,
    },
    {
      displayText: t('Status'),
      fieldName: 'projectId',
      inputType: 'text',
      size: 178,
    },
    {
      displayText: t('Count'),
      fieldName: 'createdDate',
      inputType: 'text',
      size: 230,
    },
    {
      displayText: t('RadReport Template'),
      fieldName: 'reportId',
      inputType: 'text',
      size: 230,
    },
    {
      displayText: t('Due Date'),
      fieldName: 'dueDate',
      inputType: 'date-range',
      size: 350,
    },
    {
      displayText: t('description'),
      fieldName: 'description',
      inputType: 'text',
      size: 549,
    },
  ];

  const mediumTableMeta = [
    {
      displayText: `${t('WorkList Name')}`,
      fieldName: 'workName',
      inputType: 'text',
      size: 250,
    },
    {
      displayText: t('description'),
      fieldName: 'description',
      inputType: 'text',
      size: 350,
    },
    {
      displayText: t('Due Date'),
      fieldName: 'dueDate',
      inputType: 'date-range',
      size: 300,
    },
  ];

  const smallTableMeta = [
    {
      displayText: t('Search'),
      fieldName: 'allFields',
      inputType: 'text',
      size: 100,
    },
  ];

  const tableMeta = getContentFromUseMediaValue(
    displaySize,
    { large: largeTableMeta, medium: mediumTableMeta, small: smallTableMeta },
    smallTableMeta
  );

  const totalSize = tableMeta
    .map(field => field.size)
    .reduce((prev, next) => prev + next);

  return translationsAreReady ? (
    <table className="table table--striped table--hoverable">
      <colgroup>
        {tableMeta.map((field, i) => {
          const size = field.size;
          const percentWidth = (size / totalSize) * 100.0;

          return <col key={i} style={{ width: `${percentWidth}%` }} />;
        })}
      </colgroup>
      <thead className="table-head">
        <tr className="filters">
          <TableSearchFilter
            meta={tableMeta}
            values={filterValues}
            onSort={handleSort}
            onValueChange={handleFilterChange}
            sortFieldName={sort.fieldName}
            sortDirection={sort.direction}
            studyListDateFilterNumDays={studyListDateFilterNumDays}
          />
        </tr>
      </thead>
      <tbody className="table-body" data-cy="study-list-results">
        {/* I'm not in love with this approach, but it's the quickest way for now
         *
         * - Display different content based on loading, empty, results state
         *
         * This is not ideal because it create a jump in focus. For loading especially,
         * We should keep our current results visible while we load the new ones.
         */}
        {/* LOADING */}
        {isLoading && (
          <tr className="no-hover">
            <td colSpan={tableMeta.length}>
              <WorkListLoadingText />
            </td>
          </tr>
        )}
        {!isLoading && hasError && (
          <tr className="no-hover">
            <td colSpan={tableMeta.length}>
              <div className="notFound">
                {t('There was an error fetching works')}
              </div>
            </td>
          </tr>
        )}
        {/* EMPTY */}
        {!isLoading && !workLists.length && (
          <tr className="no-hover">
            <td colSpan={tableMeta.length}>
              <div className="notFound">{t('No matching results')}</div>
            </td>
          </tr>
        )}
        {!isLoading &&
          workLists.map(workList => (
            <TableRow
              key={workList.workListId}
              onClick={workListId => handleSelectItem(workListId)}
              workListId={workList.workListId}
              username={workList.username || ''}
              workListName={workList.workListName || ''}
              description={workList.description || ''}
              reportId={workList.reportId}
              status={workList.status || ''}
              dueDate={workList.dueDate || ''}
              totalCount={workList.totalCount || 0}
              finishedCount={workList.finishedCount || 0}
              createdDate={workList.createdDate || 0}
              displaySize={displaySize}
            />
          ))}
      </tbody>
    </table>
  ) : null;
}

WorkList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  workLists: PropTypes.array.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  // ~~ SORT
  sort: PropTypes.shape({
    fieldName: PropTypes.string,
    direction: PropTypes.oneOf(['desc', 'asc', null]),
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  // ~~ FILTERS
  filterValues: PropTypes.shape({
    workListId: PropTypes.string.isRequired,
    workListName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    nameOrDesc: PropTypes.string.isRequired,
    allFields: PropTypes.string.isRequired,
    dueDateTo: PropTypes.any,
    dueDateFrom: PropTypes.any,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  studyListDateFilterNumDays: PropTypes.number,
  displaySize: PropTypes.string,
};

WorkList.defaultProps = {};

function TableRow(props) {
  const {
    workListId,
    username,
    workListName,
    description,
    reportId,
    status,
    totalCount,
    finishedCount,
    dueDate,
    isHighlighted,
    onClick: handleClick,
    displaySize,
  } = props;

  const { t } = useTranslation('WorkList');

  const largeRowTemplate = (
    <tr
      onClick={() => handleClick(workListId)}
      className={classNames({ active: isHighlighted })}
    >
      <td className={classNames({ 'empty-value': !workListName })}>
        {workListName || `(${t('Empty')})`}
      </td>
      <td>{status}</td>
      <td>
        {finishedCount} / {totalCount}
      </td>
      <td>{reportId}</td>
      <td>{dueDate}</td>
      <td>{description}</td>
    </tr>
  );

  const mediumRowTemplate = (
    <tr
      onClick={() => handleClick(workListId)}
      className={classNames({ active: isHighlighted })}
    >
      <td className={classNames({ 'empty-value': !workListName })}>
        {workListName || `(${t('Empty')})`}
        <div style={{ color: '#60656f' }}>{description}</div>
      </td>
      <td>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* DESCRIPTION */}
          <div
            className="hide-xs"
            style={{
              whiteSpace: 'pre-wrap',
              flexGrow: 1,
            }}
          >
            {dueDate}
          </div>

          {/* MODALITY & ACCESSION */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '80px',
              width: '80px',
            }}
          >
            <div aria-label={status} title={status}>
              {status}
            </div>
            <div
              className={classNames({
                modalities: finishedCount,
                'empty-value': !finishedCount,
              })}
              aria-label={finishedCount}
              title={finishedCount}
            >
              {finishedCount}
            </div>
          </div>
        </div>
      </td>
      {/* DATE */}
      <td style={{ textAlign: 'center' }}>{dueDate}</td>
    </tr>
  );

  const smallRowTemplate = (
    <tr
      onClick={() => handleClick(workListId)}
      className={classNames({ active: isHighlighted })}
    >
      <td style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* NAME AND ID */}
          <div
            className={classNames({ 'empty-value': !workListName })}
            style={{ width: '150px', minWidth: '150px' }}
          >
            <div style={{ fontWeight: 500, paddingTop: '3px' }}>
              {workListName || `(${t('Empty')})`}
            </div>
            <div style={{ color: '#60656f' }}>{username}</div>
          </div>

          {/* DESCRIPTION */}
          <div
            className="hide-xs"
            style={{
              whiteSpace: 'pre-wrap',
              flexGrow: 1,
              paddingLeft: '35px',
            }}
          >
            {description}
          </div>

          {/* MODALITY & DATE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '80px',
              width: '80px',
            }}
          >
            <div
              className={classNames({
                finishedCount: finishedCount,
                'empty-value': !finishedCount,
              })}
              aria-label={finishedCount}
              title={finishedCount}
            >
              {finishedCount || `(${t('Empty')})`}
            </div>
            <div>{dueDate}</div>
          </div>
        </div>
      </td>
    </tr>
  );

  const rowTemplate = getContentFromUseMediaValue(
    displaySize,
    {
      large: largeRowTemplate,
      medium: mediumRowTemplate,
      small: smallRowTemplate,
    },
    smallRowTemplate
  );

  return rowTemplate;
}

TableRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  workListId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  workListName: PropTypes.string,
  description: PropTypes.string,
  reportId: PropTypes.string,
  Status: PropTypes.string,
  totalCount: PropTypes.number,
  finishedCount: PropTypes.number,
  createdDate: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  displaySize: PropTypes.string,
  isHighlighted: PropTypes.bool,
};

TableRow.defaultProps = {
  isHighlighted: false,
};

export { WorkList };
