import React from "react";
import { cornerstone, cornerstoneTools } from "meteor/ohif:cornerstone";
import { OHIF } from "meteor/ohif:core";
import { SeriesInfoProvider } from "meteor/icr:series-info-provider";
import {
  newSegmentInput,
  editSegmentInput
} from "../../../../lib/util/brushMetadataIO.js";
import getBrushSegmentColor from "../../../../lib/util/getBrushSegmentColor.js";

const brushModule = cornerstoneTools.store.modules.brush;

export default class BrushManagementListItem extends React.Component {
  constructor(props = {}) {
    super(props);
  }

  _getTypeWithModifier() {
    const { metadata } = this.props;

    let typeWithModifier =
      metadata.SegmentedPropertyTypeCodeSequence.CodeMeaning;

    const modifier =
      metadata.SegmentedPropertyTypeCodeSequence
        .SegmentedPropertyTypeModifierCodeSequence;

    if (modifier) {
      typeWithModifier += ` (${modifier.CodeMeaning})`;
    }

    return typeWithModifier;
  }

  render() {
    const {
      metadata,
      segmentIndex,
      visible,
      onSegmentChange,
      onShowHideClick,
      onEditClick,
      onDeleteClick
    } = this.props;

    const segmentLabel = metadata.SegmentLabel;
    const segmentColor = getBrushSegmentColor(segmentIndex);
    const segmentCategory =
      metadata.SegmentedPropertyCategoryCodeSequence.CodeMeaning;
    const typeWithModifier = this._getTypeWithModifier();
    const checked =
      brushModule.state.drawColorId === segmentIndex ? "checked" : null;
    const showHideIcon = visible ? "fa fa-eye" : "fa fa-eye-slash";

    return (
      <tr>
        <td className="left-aligned-cell">
          <i className="fa fa-square" style={{ color: segmentColor }} />{" "}
          {segmentLabel}
        </td>
        <td>{segmentCategory}</td>
        <td>{typeWithModifier}</td>
        <td className="centered-cell">
          <input
            type="radio"
            checked={checked}
            name="sync"
            value=""
            onChange={() => {
              onSegmentChange(segmentIndex);
            }}
          />
        </td>
        <td className="centered-cell">
          <a
            className="btn btn-sm btn-secondary"
            onClick={() => {
              onShowHideClick(segmentIndex);
            }}
          >
            <i className={showHideIcon} />
          </a>
        </td>
        <td className="centered-cell">
          <a
            className="btn btn-sm btn-secondary"
            onClick={() => {
              onEditClick(segmentIndex, metadata);
            }}
          >
            <i className="fa fa-wrench" />
          </a>
        </td>
        <td className="centered-cell">
          <a
            className="btn btn-sm btn-secondary"
            onClick={() => {
              onDeleteClick(segmentIndex);
            }}
          >
            <i className="fa fa-times" />
          </a>
        </td>
      </tr>
    );
  }
}
