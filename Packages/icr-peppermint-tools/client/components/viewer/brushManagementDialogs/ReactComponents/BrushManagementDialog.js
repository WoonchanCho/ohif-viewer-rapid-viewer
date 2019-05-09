import React from "react";
import BrushManagementListItem from "./BrushManagementListItem.js";
import { cornerstone, cornerstoneTools } from "meteor/ohif:cornerstone";
import { OHIF } from "meteor/ohif:core";
import { SeriesInfoProvider } from "meteor/icr:series-info-provider";
import {
  newSegmentInput,
  editSegmentInput
} from "../../../../lib/util/brushMetadataIO.js";
import deleteSegment from "../../../../lib/util/deleteSegment.js";
import getBrushSegmentColor from "../../../../lib/util/getBrushSegmentColor.js";

const brushModule = cornerstoneTools.store.modules.brush;

export default class BrushManagementDialog extends React.Component {
  constructor(props = {}) {
    super(props);

    this.onNewSegmentButtonClick = this.onNewSegmentButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    this.onSegmentChange = this.onSegmentChange.bind(this);
    this.onShowHideClick = this.onShowHideClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onDeleteCancelClick = this.onDeleteCancelClick.bind(this);
    this.onDeleteConfirmClick = this.onDeleteConfirmClick.bind(this);
    this._roiCollectionInfo = this._roiCollectionInfo.bind(this);
    this._visableSegmentsForElement = this._visableSegmentsForElement.bind(
      this
    );
    this._segments = this._segments.bind(this);

    this.state = {
      roiCollectionInfo: { name: "", label: "" },
      segments: [],
      visibleSegments: [],
      deleteConfirmationOpen: false,
      segmentToDelete: 0
    };

    console.log(`TEST:`);
    console.log(this.state);
  }

  componentDidMount() {
    this._seriesInstanceUid = SeriesInfoProvider.getActiveSeriesInstanceUid();

    if (!this._seriesInstanceUid) {
      return;
    }

    console.log(`BRUSH MANAGEMENT DIALOG COMPONENT DID MOUNT`);
    console.log(this._seriesInstanceUid);

    const roiCollectionInfo = this._roiCollectionInfo();
    const segments = this._segments();
    const visibleSegments = this._visableSegmentsForElement();

    console.log(segments);

    this.setState({
      roiCollectionInfo,
      segments,
      visibleSegments
    });
  }

  onNewSegmentButtonClick() {
    const seriesInstanceUid = SeriesInfoProvider.getActiveSeriesInstanceUid();

    let segmentMetadata =
      brushModule.state.segmentationMetadata[seriesInstanceUid];

    if (!segmentMetadata) {
      brushModule.state.segmentationMetadata[seriesInstanceUid] = [];
      segmentMetadata =
        brushModule.state.segmentationMetadata[seriesInstanceUid];
    }

    const colormap = cornerstone.colors.getColormap(
      brushModule.state.colorMapId
    );
    const numberOfColors = colormap.getNumberOfColors();

    for (let i = 0; i < numberOfColors; i++) {
      if (!segmentMetadata[i]) {
        brushModule.state.drawColorId = i;
        this._closeDialog();
        newSegmentInput(i);
        break;
      }
    }
  }

  onCancelButtonClick() {
    this._closeDialog();
  }

  onSegmentChange(segmentIndex) {
    brushModule.state.drawColorId = segmentIndex;
    this._closeDialog();
  }

  onShowHideClick(segmentIndex) {
    const { visibleSegments } = this.state;

    visibleSegments[segmentIndex] = !visibleSegments[segmentIndex];

    const activeEnabledElement = OHIF.viewerbase.viewportUtils.getEnabledElementForActiveElement();
    const enabledElementUID = activeEnabledElement.uuid;

    brushModule.setters.brushVisibilityForElement(
      enabledElementUID,
      segmentIndex,
      visibleSegments[segmentIndex]
    );

    cornerstone.updateImage(activeEnabledElement.element);

    this.setState({ visibleSegments });
  }

  onEditClick(segmentIndex, metadata) {
    this._closeDialog();
    editSegmentInput(segmentIndex, metadata);
  }

  onDeleteClick(segmentIndex) {
    //TODO !
    console.log("TODO: Delete");
    this.setState({
      deleteConfirmationOpen: true,
      segmentToDelete: segmentIndex
    });
  }

  onDeleteConfirmClick() {
    const { segmentToDelete } = this.state;

    deleteSegment(this._seriesInstanceUid, segmentToDelete);

    const segments = this._segments();
    const visibleSegments = this._visableSegmentsForElement();

    this.setState({
      deleteConfirmationOpen: false,
      segments,
      visibleSegments
    });
  }

  onDeleteCancelClick() {
    this.setState({
      deleteConfirmationOpen: false
    });
  }

  _closeDialog() {
    const dialog = document.getElementById("brushManagementDialog");

    dialog.close();
  }

  _roiCollectionInfo() {
    const importInfo = brushModule.state.import;
    const seriesInstanceUid = this._seriesInstanceUid;

    if (importInfo && importInfo[seriesInstanceUid]) {
      const roiCollection = importInfo[seriesInstanceUid];
      return {
        label: roiCollection.label,
        type: roiCollection.type,
        name: roiCollection.name,
        modified: roiCollection.modified ? "true" : " false"
      };
    }

    return {
      name: "New SEG ROI Collection",
      label: ""
    };
  }

  _visableSegmentsForElement() {
    const seriesInstanceUid = this._seriesInstanceUid;

    if (!seriesInstanceUid) {
      return;
    }

    const segmentMetadata =
      brushModule.state.segmentationMetadata[seriesInstanceUid];

    const activeEnabledElement = OHIF.viewerbase.viewportUtils.getEnabledElementForActiveElement();
    const enabledElementUID = activeEnabledElement.uuid;
    const visible = brushModule.getters.visibleSegmentationsForElement(
      enabledElementUID
    );

    const visableSegmentsForElement = [];

    for (let i = 0; i < visible.length; i++) {
      visableSegmentsForElement.push(visible[i]);
    }

    return visableSegmentsForElement;
  }

  _segments() {
    const seriesInstanceUid = this._seriesInstanceUid;

    console.log(`_segments seriesInstanceUid:`);
    console.log(seriesInstanceUid);

    if (!seriesInstanceUid) {
      return;
    }

    const segmentMetadata =
      brushModule.state.segmentationMetadata[seriesInstanceUid];

    const segments = [];

    if (!segmentMetadata) {
      return segments;
    }

    for (let i = 0; i < segmentMetadata.length; i++) {
      if (segmentMetadata[i]) {
        segments.push({
          index: i,
          metadata: segmentMetadata[i]
        });
      }
    }

    return segments;
  }

  render() {
    const {
      roiCollectionInfo,
      segments,
      visibleSegments,
      deleteConfirmationOpen,
      segmentToDelete
    } = this.state;

    console.log("BurshManagementDialog render:");
    console.log(segments);

    const segmentRows = segments.map(segment => (
      <BrushManagementListItem
        key={`${segment.metadata.SegmentLabel}_${segment.index}`}
        segmentIndex={segment.index}
        metadata={segment.metadata}
        visible={visibleSegments[segment.index]}
        onSegmentChange={this.onSegmentChange}
        onShowHideClick={this.onShowHideClick}
        onEditClick={this.onEditClick}
        onDeleteClick={this.onDeleteClick}
      />
    ));

    let brushManagementDialogBody;

    if (deleteConfirmationOpen) {
      const segmentColor = getBrushSegmentColor(segmentToDelete);
      const segmentLabel = segments.find(
        segment => segment.index === segmentToDelete
      ).metadata.SegmentLabel;

      return (
        <>
          <div>
            <h5>Warning!</h5>
            <p>
              Are you sure you want to delete {segmentLabel}? This cannot be
              undone.
            </p>
          </div>
          <div className="seg-delete-horizontal-box">
            <a
              className="btn btn-sm btn-primary"
              onClick={this.onDeleteConfirmClick}
            >
              <i className="fa fa fa-check-circle fa-2x" />
            </a>
            <a
              className="btn btn-sm btn-primary"
              onClick={this.onDeleteCancelClick}
            >
              <i className="fa fa fa-times-circle fa-2x" />
            </a>
          </div>
        </>
      );
    }

    return (
      <div>
        {" "}
        <div className="brush-management-header">
          <h3>Segments</h3>
          <a
            className="brush-management-cancel btn btn-sm btn-secondary"
            onClick={this.onCancelButtonClick}
          >
            <i className="fa fa-times-circle fa-2x" />
          </a>
        </div>
        <hr />
        <div className="brush-management-list">
          <table className="peppermint-table">
            <tbody>
              <tr className="brush-management-list-collection-info">
                <th colSpan="3" className="left-aligned-cell">
                  {roiCollectionInfo.name}
                </th>
                <th colSpan="4" className="right-aligned-cell">
                  {roiCollectionInfo.label}
                </th>
              </tr>
              {roiCollectionInfo.type && (
                <tr className="brush-management-list-collection-info">
                  <th colSpan="3" className="left-aligned-cell">
                    Type: {roiCollectionInfo.type}
                  </th>
                  <th colSpan="4" className="right-aligned-cell">
                    Modified: {roiCollectionInfo.modified}
                  </th>
                </tr>
              )}

              <tr className="brush-management-list-bordered">
                <th>Label</th>
                <th>Category</th>
                <th>Type</th>
                <th>Paint</th>
                <th>Hide</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>

              {segmentRows}
            </tbody>
          </table>
        </div>
        <hr />
        <div>
          <a
            className="brush-management-new-button btn btn-sm btn-primary"
            onClick={this.onNewSegmentButtonClick}
          >
            <i className="fa fa-plus-circle" /> Segment
          </a>
        </div>
      </div>
    );
  }
}
