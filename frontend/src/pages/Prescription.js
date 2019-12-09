import React, { Component } from "react";
import {
  DrugstoreForm,
  GlassstoreForm,
  HospitalForm
} from "../components/Prescription";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../redux/modules/user";
import * as storeAPI from "../lib/api/store";
import * as hospitalAPI from "../lib/api/hospital";
import { GlassHospitalForm } from "../components/Prescription";

class Prescription extends Component {
  state = {
    usertype: "",
    name: "",
    data: ""
  };

  constructor(props) {
    super(props);
    this.getData();
  }

  getData = async () => {
    const { usertype, name } = this.props.loggedInfo.toJS();
    if (usertype === "store") {
      const data = await storeAPI.getStoreByName({ sname: name });
      this.setState({ usertype: usertype, name: name, data: data });
    } else if (usertype === "hospital") {
      const data = await hospitalAPI.getHospitalByName({ hname: name });
      this.setState({ usertype: usertype, name: name, data: data });
    }
  };

  render() {
    const { uemail } = this.props.location;
    const { usertype, name, data } = this.state;
    let department = "";
    if (data !== "") {
      department = data.data.department;
    }
    return (
      <div>
        <h1>space</h1>
        {usertype === "hospital" && department === "안과"
          ? <GlassHospitalForm hname={name} />
          : <div />}
        {usertype === "hospital" && department !== "안과" && department !== ""
          ? <HospitalForm hname={name} />
          : <div />}
        {usertype === "store" && department === "안경점"
          ? <GlassstoreForm sname={name} uemail={uemail} />
          : <div />}
        {usertype === "store" && department === "약국"
          ? <DrugstoreForm sname={name} uemail={uemail} />
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
