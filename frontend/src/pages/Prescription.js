import React, { Component } from "react";
import {
  DrugstoreForm,
  GlassstoreForm,
  HospitalForm
} from "components/Prescription";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

class Prescription extends Component {
  state = {};

  render() {
    const { usertype } = this.props.loggedInfo.toJS();
    return (
      <div>
        <h1>space</h1>
        {usertype === "hospital"
          ? <HospitalForm hname={this.props.loggedInfo.toJS().name} />
          : <div />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loggedInfo: state.user.get("loggedInfo"),
    logged: state.user.get("logged")
  }),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(Prescription);
