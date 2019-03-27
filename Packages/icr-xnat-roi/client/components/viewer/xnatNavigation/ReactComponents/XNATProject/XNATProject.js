import React from "react";
import XNATProjectLabel from "./XNATProjectLabel.js";
import XNATSubjectList from "./XNATSubject/XNATSubjectList.js";
import fetchJSON from "../helpers/fetchJSON.js";
import onExpandIconClick from "../helpers/onExpandIconClick.js";
import getExpandIcon from "../helpers/getExpandIcon.js";
import compareOnProperty from "../helpers/compareOnProperty.js";
import { icrXnatRoiSession } from "meteor/icr:xnat-roi-namespace";

export default class XNATProject extends React.Component {
  constructor(props = {}) {
    super(props);

    const active = this.props.ID === icrXnatRoiSession.get("projectId");

    this.state = {
      subjects: [],
      active,
      expanded: false,
      fetched: false
    };

    this.getExpandIcon = getExpandIcon.bind(this);
    this.onExpandIconClick = onExpandIconClick.bind(this);
  }

  fetchData() {
    fetchJSON(`/data/archive/projects/${this.props.ID}/subjects?format=json`)
      .then(result => {
        const subjects = result.ResultSet.Result;
        console.log(subjects);

        subjects.sort((a, b) => compareOnProperty(a, b, "label"));

        this.setState({
          subjects,
          fetched: true
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { ID, name } = this.props;
    const { subjects, active, fetched } = this.state;

    return (
      <>
        <div className="xnat-nav-horizontal-box">
          <a
            className="btn btn-sm btn-secondary"
            onClick={this.onExpandIconClick}
          >
            <i className={this.getExpandIcon()} />
          </a>
          <XNATProjectLabel ID={ID} name={name} active={active} />
        </div>
        {this.state.expanded ? (
          <XNATSubjectList
            projectId={ID}
            subjects={subjects}
            fetched={fetched}
          />
        ) : null}
      </>
    );
  }
}