import React, { Component } from "react";
import * as logAPI from "../../lib/api/log";
import * as userAPI from "../../lib/api/user";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import EyeIcon from "@material-ui/icons/Visibility";
import TextField from "@material-ui/core/TextField";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../redux/modules/user";

import { Button } from "../../components/Util";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";

class PrescriptionLog extends Component {
  state = {
    lists: [],
    search: "",
    isPopupShow: false,
    selectedId: ""
  };

  getLogs = async () => {
    const { name } = this.props.loggedInfo.toJS();
    const logs = await logAPI.getStoreLog({
      sname: name
    });
    const prescriptions = logs.data.filter(p => {
      if (p.logtype === "prescription") {
        return p;
      }
    });
    const patients = await Promise.all(
      prescriptions.map(p => {
        const email = p.uemail;
        return userAPI.getUserByEmail({ email: email });
      })
    );
    const lists = prescriptions.map(p => {
      let email = p.uemail;
      const user = patients.find(p => {
        if (p.data.email === email) {
          return p;
        }
      });
      return { userinfo: user.data, prescription: p };
    });
    this.setState({ lists: lists });
  };

  handleEyeButton = (data, e) => {
    const { id } = data.p.prescription;
    this.setState({ isPopupShow: true, selectedId: id });
  };

  handleCloseButton = () => {
    this.setState({ isPopupShow: false, selectedId: "" });
  };

  handleChangeSearchBar = e => {
    const { value } = e.target;
    this.setState({ search: value });
  };

  constructor(props) {
    super(props);
    this.getLogs();
  }

  render() {
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          환자정보와 처방기록
        </Typography>
        <div style={{ paddingLeft: 40 }}>
          <TextField
            id="outlined-search"
            label="이메일, 이름, 전화번호"
            type="search"
            className="search"
            margin="normal"
            variant="outlined"
            inputRef={el => (this.fv = el)}
            onChange={this.handleChangeSearchBar}
          />
        </div>

        <div />
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              <ListItem key="title">
                <ListItemText primary="이메일" />
                <ListItemText primary="이름" />
                <ListItemText primary="전화번호" />
              </ListItem>
              {this.state.lists &&
                this.state.lists.map(p => {
                  if (
                    this.state.search === "" ||
                    p.userinfo.email.match(this.state.search) ||
                    p.userinfo.name.match(this.state.search) ||
                    p.userinfo.phonenum.match(this.state.search)
                  ) {
                    return (
                      <ListItem key={p.prescription.id}>
                        <ListItemText primary={p.userinfo.email} />
                        <ListItemText primary={p.userinfo.name} />
                        <ListItemText primary={p.userinfo.phonenum} />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={this.handleEyeButton.bind(this, { p })}
                            edge="end"
                            aria-label="show"
                          >
                            <EyeIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  }
                })}
            </List>
          </div>
          <Dialog
            open={this.state.isPopupShow}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">처방전</DialogTitle>
            {this.state.lists &&
              this.state.lists.map(p => {
                if (p.prescription.id === this.state.selectedId) {
                  if (
                    p.prescription.prescriptiontype === "drugstore" ||
                    p.prescription.prescriptiontype === "glassstore"
                  ) {
                    const { storename, storedate, storedetail } = JSON.parse(
                      p.prescription.prescription
                    );
                    return (
                      <div
                        key={p.prescription.id}
                        style={{
                          paddingLeft: 10,
                          paddingTop: 10,
                          paddingRight: 10,
                          paddingBottom: 10
                        }}
                      >
                        <div>
                          처방한곳 : {storename}
                        </div>
                        <div>
                          날짜 : {storedate}
                        </div>
                        <div>
                          처방의수정, 변경, 및 대체 : {storedetail}
                        </div>
                      </div>
                    );
                  }
                }
                return <div key={p.prescription.id} />;
              })}

            <DialogActions>
              <Button text="돌아가기" handleButton={this.handleCloseButton} />
            </DialogActions>
          </Dialog>
        </div>
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
)(PrescriptionLog);
