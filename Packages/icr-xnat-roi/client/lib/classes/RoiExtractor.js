import { OHIF } from 'meteor/ohif:core';
import { cornerstone, cornerstoneTools } from 'meteor/ohif:cornerstone';
import { Polygon } from '../classes/Polygon.js';

const globalToolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;

const modules = cornerstoneTools.import('store/modules');
const getToolState = cornerstoneTools.import('stateManagement/getToolState');

export class RoiExtractor {

  constructor (seriesInstanceUid) {
    this._seriesInstanceUid = seriesInstanceUid;
    this._volumes = [];
    this._freehand3DStore = modules.freehand3D;
  };

  hasVolumesToExtract () {
    const workingStructureSet = this._freehand3DStore.getters.structureSet(this._seriesInstanceUid);
    const ROIContourCollection = workingStructureSet.ROIContourCollection;

    let hasVolumes = false;

    for (let i = 0; i < ROIContourCollection.length; i++) {
      if (ROIContourCollection[i] && ROIContourCollection[i].polygonCount > 0) {
        this._volumes[i] = [];
        hasVolumes = true;
      }
    }

    return hasVolumes;
  }

  extractVolumes (exportMask) {
    const toolStateManager = globalToolStateManager.saveToolState();

    Object.keys(toolStateManager).forEach( elementId => {
      // Only get polygons from this series
      if ( this._getSeriesInstanceUidFromImageId(elementId) === this._seriesInstanceUid ) {
        // grab the freehand tool for this DICOM instance
        const freehandToolState = getToolState(elementId, 'FreehandMouse');

        if (freehandToolState) {
          // Append new ROIs to polygon list
          this._getNewPolygonsInInstance(freehandToolState, elementId, exportMask);
        }
      }
    });

    return this._volumes;
  }

  _getNewPolygonsInInstance (toolState, elementId, exportMask) {
    for ( let i = 0; i < tool.length; i++ ) {
      const data = toolState[i];
      const ROIContourIndex = this._freehand3DStore.getters.ROIContourIndex(
        data.seriesInstanceUid,
        data.structureSetUid,
        data.ROIContourUid
      );
      const referencedStructureSet = data.referencedStructureSet;

      // Check to see if the ROIContour referencing this polygon is eligble for export.
      if (referencedStructureSet === 'DEFAULT' && exportMask[ROIContourIndex]) {
        this._appendPolygon(data, elementId, ROIContourIndex);
      }
    }
  }

  _appendPolygon (data, imageId, ROIContourIndex) {
    const ROIContourName = data.referencedROIContour.name;
    const sopInstanceUid = this._getSOPInstanceUidFromImageId(imageId);
    const frameNumber = this._getFrameNumber(imageId);

    const polygon = new Polygon(
      data.handles,
      sopInstanceUid,
      this._seriesInstanceUid,
      'DEFAULT',
      data.ROIContourUid,
      data.uid,
      frameNumber,
    );

    this._volumes[ROIContourIndex].push(polygon);
    console.log('appended ROI');
  }

  _getSOPInstanceUidFromImageId (imageId) {
    const metaData = OHIF.viewer.metadataProvider.getMetadata(imageId);
    return metaData.instance.sopInstanceUid;
  }

  _getSeriesInstanceUidFromImageId (imageId) {
    const metaData = OHIF.viewer.metadataProvider.getMetadata(imageId);
    return metaData.series.seriesInstanceUid;
  }

  _getFrameNumber(imageId) {
    console.log('RoiExtractor._getFrameNumber');
    console.log('imageId:');
    console.log(imageId)

    if (imageId.includes("frame=")) {
      const frameArray = imageId.split("frame=");

      console.log(`multi, returning ${String( Number(frameArray[1]) + 1 )}`);
      return String( Number(frameArray[1]) + 1 );
    }

    console.log('single, returning 1');

    return "1";
  }

}
