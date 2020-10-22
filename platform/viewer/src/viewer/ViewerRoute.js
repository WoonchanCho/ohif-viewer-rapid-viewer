import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ConnectedXNATStandaloneRouting from '../connectedComponents/ConnectedXNATStandaloneRouting';
import { UserExpiredException } from '@ohif/extension-rapid-viewer';
import WorkItemNotFound from './WorkItemNotFound';

function ViewerRoute({
  workListId,
  user,
  workItems,
  currentWorkItemIdx,
  clearUser,
  setWorkList,
  setWorkItemIdx,
  setReportForm,
  fetchWorkList,
  fetchRadReportForm,
}) {
  const [loading, setLoading] = useState({ isLoading: false, error: false });

  useEffect(() => {
    const refreshWorkList = async () => {
      try {
        setLoading({ isLoading: true, error: false });

        const workList = await fetchWorkList(user.xnatUrl, workListId);
        const items = workList.items;
        setWorkList(workList);
        if (!items.length) {
          setLoading({ isLoading: false, error: false });
          return;
        }
        setWorkItemIdx(0);

        // retrieve report form and save
        const { reportId } = workList;
        const radReportData = await fetchRadReportForm(reportId);
        setReportForm(reportId, radReportData);

        setLoading({ isLoading: false, error: false });
      } catch (error) {
        setLoading({ isLoading: false, error: true });
        if (error instanceof UserExpiredException) {
          clearUser();
        } else {
          throw error;
        }
      }
    };

    refreshWorkList();
  }, [
    workListId,
    user,
    setWorkList,
    clearUser,
    setWorkItemIdx,
    fetchWorkList,
    fetchRadReportForm,
    setReportForm,
  ]);

  //   refreshWorkItem();
  // }, [clearUser, currentWorkItemIdx, user.xnatUrl, workItems]);

  // useEffect(() => {
  //   const refreshWorkItem = async () => {
  //     let currentWorkItem;
  //     try {
  //       if (currentWorkItemIdx < 0) {
  //         return;
  //       }
  //       setLoading({ isLoading: true, error: false });
  //       currentWorkItem = workItems[currentWorkItemIdx];
  //       const { projectId, experimentId } = currentWorkItem;
  //       const json = await fetchMetadata(user.xnatUrl, projectId, experimentId);
  //       currentWorkItem.json = json;
  //       setLoading({ isLoading: false, error: false });
  //     } catch (error) {
  //       setLoading({ isLoading: false, error: true });
  //       if (error instanceof UserExpiredException) {
  //         clearUser();
  //       } else if (error instanceof HttpException) {
  //         currentWorkItem.json = {};
  //       } else {
  //         throw error;
  //       }
  //     }
  //   };

  //   refreshWorkItem();
  // }, [clearUser, currentWorkItemIdx, user.xnatUrl, workItems]);

  if (loading.error) {
    return <div>Error: {JSON.stringify(loading.error)}</div>;
  } else if (loading.isLoading) {
    return <div>Loading...</div>;
  }

  // function initializeUIDs() {
  //   setStudyUIDs([]);
  //   setSeriesUIDs([]);
  // }

  // function isFirstWorkItem() {
  //   return currentWorkItemIdx <= 0;
  // }

  // function isLastWorkItem() {
  //   return workItems && currentWorkItemIdx >= workItems.length - 1;
  // }

  // function handleUpdateJson(idx, json) {
  //   if (idx >= workItems.length) {
  //     return;
  //   }
  //   const newWorkListItems = Object.assign({}, workItems);
  //   newWorkListItems[idx].json = json;
  //   // setWorkListItems(newWorkListItems);
  // }

  // function moveNextItem() {
  //   if (!isLastWorkItem()) {
  //     setWorkItemIdx(currentWorkItemIdx + 1);
  //   }
  // }

  // function movePrevItem() {
  //   if (!isFirstWorkItem()) {
  //     setWorkItemIdx(currentWorkItemIdx - 1);
  //   }
  // }

  if (workItems.length === 0 || currentWorkItemIdx < 0) {
    return <WorkItemNotFound />;
  }
  const currentWorkItem = workItems[currentWorkItemIdx];
  const {
    projectId,
    subjectId,
    experimentId,
    experimentLabel,
  } = currentWorkItem;
  return (
    <ConnectedXNATStandaloneRouting
      key={`${workListId}_${currentWorkItemIdx}`}
      workListId={workListId}
      projectId={projectId}
      subjectId={subjectId}
      experimentId={experimentId}
      experimentLabel={experimentLabel}
    ></ConnectedXNATStandaloneRouting>
  );

  // return (
  //   <>
  //     <input
  //       type="button"
  //       value="Work List"
  //       onClick={() => {
  //         history.push('/');
  //       }}
  //     ></input>

  //     <div style={{ color: 'red' }}>
  //       {currentWorkItem.experimentId}
  //       <div>
  //         studyUIDs
  //         {studyUIDs.map(studyUID => (
  //           <div>{studyUID}</div>
  //         ))}
  //       </div>
  //       <div>
  //         seriesUIDs
  //         {seriesUIDs.map(seriesUID => (
  //           <div>{seriesUID}</div>
  //         ))}
  //       </div>
  //     </div>
  //     <input
  //       type="button"
  //       value="prev"
  //       disabled={isFirstWorkItem()}
  //       onClick={movePrevItem}
  //     ></input>
  //     <input
  //       type="button"
  //       value="next"
  //       disabled={isLastWorkItem()}
  //       onClick={moveNextItem}
  //     ></input>

  //     {workItems.map(workItem => (
  //       <div style={{ color: 'white' }}>{workItem.experimentId}</div>
  //     ))}
  //   </>
  // );
  // return (
  //   <ConnectedViewerRetrieveStudyData
  //     handleUpdateJson={handleUpdateJson}
  //     workListItems={workItems}
  //     studyInstanceUIDs={studyUIDs}
  //     seriesInstanceUIDs={seriesUIDs}
  //   />
  // );
}

ViewerRoute.propTypes = {
  history: PropTypes.object.isRequired,
  workListId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    xnatUrl: PropTypes.string.isRequired,
  }).isRequired,
  workItems: PropTypes.array,
  currentWorkItemIdx: PropTypes.number.isRequired,
  clearUser: PropTypes.func.isRequired,
  setWorkList: PropTypes.func.isRequired,
  setWorkItemIdx: PropTypes.func.isRequired,
  setReportForm: PropTypes.func.isRequired,
  fetchWorkList: PropTypes.func.isRequired,
  fetchRadReportForm: PropTypes.func.isRequired,
};

export default withRouter(ViewerRoute);
