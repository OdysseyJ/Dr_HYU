import React, { Component } from "react";
import {
  PatientReservationList,
  PrescriptionLog,
  PrescriptionPossibleButton
} from "../components/Store";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../redux/modules/user";
import * as storeActions from "../lib/api/store";

class Store extends Component {
  state = {
    store: null,
    checked: false
  };

  constructor(props) {
    super(props);
    this.getStoreInfo();
  }

  getStoreInfo = async () => {
    const { name } = this.props.loggedInfo.toJS();
    const store = await storeActions.getStoreByName({ sname: name });
    this.setState({ store: store });
  };

  handleCheckedChange = data => {
    this.setState({ checked: data });
  };

  render() {
    const { name } = this.props.loggedInfo.toJS();
    return (
      <div>
        <h1>store</h1>
        <PrescriptionPossibleButton
          name={name}
          checked={this.state.store}
          handleCheckedChange={this.handleCheckedChange}
        />
        <PatientReservationList checked={this.state.checked} />
        <PrescriptionLog />
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
)(Store);
