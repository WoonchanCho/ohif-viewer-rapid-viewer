import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@ohif/ui';
import { ScrollableArea } from '@ohif/ui/src/ScrollableArea/ScrollableArea';
import { TableList } from '@ohif/ui/src/components/tableList';
import dompurify from 'dompurify';
import './RapidRadReportPanel.styl';

function RapidRadReportPanel({
  radReportData,
  postRadReportForm,
  onSaveComplete,
  moveToNextWorkItem,
}) {
  const reportDiv = useRef();
  // const [radReportData, setRadReportData] = useState();

  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const radReportData = await fetchRadReportForm();
  //       setRadReportData(radReportData);
  //     } catch (error) {
  //       console.dir(error);
  //       setRadReportData(JSON.stringify(error));
  //     }
  //   };

  //   fetch();
  // }, [fetchRadReportForm]);

  function getCustomHeader(title) {
    return <div className="tableListHeaderTitle">{title}</div>;
  }

  function getRadReportTemplateForm() {
    if (!radReportData) {
      return (
        <div className="radReportLoading">
          <div className="image-thumbnail-loading-indicator"></div>
        </div>
      );
    }

    const radReportTemplateData = radReportData.templateData
      .split('<body>')[1]
      .split('</body>')[0];

    return (
      <TableList customHeader={getCustomHeader(radReportData.title)}>
        <div
          ref={reportDiv}
          className="radReportTableBody"
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(radReportTemplateData),
          }}
        />
      </TableList>
    );
  }

  async function saveFunction(event) {
    const fields = document.querySelectorAll(
      '.radReportTable input[type=text],input[type=number],select,textarea'
    );
    const formData = [].map.bind(fields, field => ({
      id: field.id,
      name: field.name,
      node: field.nodeName,
      value: field.value,
    }))();
    console.log(formData);
    onSaveComplete({
      title: 'Save RadReport',
      message: JSON.stringify(formData),
      type: 'success',
    });
    return;

    if (postRadReportForm) {
      try {
        console.log(reportDiv.current.innerHTML);
        const result = await postRadReportForm();
        if (onSaveComplete) {
          onSaveComplete({
            title: 'Save RadReport',
            message: result.message,
            type: 'success',
          });
        }
      } catch (error) {
        if (onSaveComplete) {
          onSaveComplete({
            title: 'Save RadReport',
            message: error.message,
            type: 'error',
          });
        }
      }
    }
  }

  function moveToNext() {
    moveToNextWorkItem();
  }

  return (
    <div className="radReportTable">
      <ScrollableArea>
        <div>{getRadReportTemplateForm()}</div>
      </ScrollableArea>
      <div className="radReportTableFooter">
        {postRadReportForm && (
          <button onClick={saveFunction} className="saveBtn">
            <Icon name="save" width="14px" height="14px" />
            Save & Next
          </button>
        )}

        <button onClick={moveToNext} className="nextBtn">
          <Icon name="rapid-next" width="14px" height="14px" />
          Next
        </button>
      </div>
    </div>
  );
}

RapidRadReportPanel.propTypes = {
  radReportData: PropTypes.object.isRequired,
  postRadReportForm: PropTypes.func.isRequired,
  onSaveComplete: PropTypes.func.isRequired,
  moveToNextWorkItem: PropTypes.func.isRequired,
};

export { RapidRadReportPanel };
export default RapidRadReportPanel;
