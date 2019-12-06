import React, { Component } from "react";
import * as prescriptionAPI from "lib/api/prescription";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import EyeIcon from "@material-ui/icons/Visibility";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

import { Button } from "components/Util";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";

class PrescriptionList extends Component {
  state = {
    prescriptions: [],
    isPopupShow: false,
    selectedId: ""
  };

  getPrescriptions = async () => {
    const { email } = this.props.loggedInfo.toJS();
    const prescriptions = await prescriptionAPI.getPrescriptions({
      uemail: email
    });
    this.setState({ prescriptions: prescriptions.data });
  };

  handleEyeButton = (data, e) => {
    const id = data.p.id;
    this.setState({ isPopupShow: true, selectedId: id });
  };

  handleCloseButton = () => {
    this.setState({ isPopupShow: false, selectedId: "" });
  };

  componentDidMount() {
    this.getPrescriptions();
  }

  render() {
    console.log(this.state.prescriptions);
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          나의처방전
        </Typography>
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              {this.state.prescriptions &&
                this.state.prescriptions.map(p => {
                  let name = p.hname;
                  return (
                    <ListItem key={p.id}>
                      <ListItemText primary={name} />
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
                })}
            </List>
          </div>
          <Dialog
            open={this.state.isPopupShow}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">처방전</DialogTitle>
            {this.state.prescriptions &&
              this.state.prescriptions.map(p => {
                if (p.id === this.state.selectedId) {
                  const {
                    name,
                    date,
                    number,

                    medicineName,
                    amount,
                    count,
                    totalDay,

                    nakedlefteye,
                    nakedrighteye,
                    lefteye,
                    righteye,

                    storename,
                    storedate,
                    storedetail
                  } = JSON.parse(p.prescription);
                  if (p.prescriptiontype === "medicine") {
                    return (
                      <div
                        key={p.id}
                        style={{
                          paddingLeft: 10,
                          paddingTop: 10,
                          paddingRight: 10,
                          paddingBottom: 10
                        }}
                      >
                        <div>
                          병원이름 : {name}
                        </div>
                        <div>
                          병원처방날짜 : {date}
                        </div>
                        <div>
                          호 : {number}
                        </div>
                        <div>
                          약이름 : {medicineName}
                        </div>
                        <div>
                          1회복용량 : {amount}
                        </div>
                        <div>
                          1일복용량 : {count}
                        </div>
                        <div>
                          총복용일 : {totalDay}
                        </div>
                        <div>
                          약국이름 : {storename}
                        </div>
                        <div>
                          약국처방날짜 : {storedate}
                        </div>
                        <div>
                          상세내용 : {storedetail}
                        </div>
                      </div>
                    );
                  } else if (p.prescriptiontype === "glasses") {
                    return (
                      <div
                        key={p.id}
                        style={{
                          paddingLeft: 10,
                          paddingTop: 10,
                          paddingRight: 10,
                          paddingBottom: 10
                        }}
                      >
                        <div>
                          병원이름 : {name}
                        </div>
                        <div>
                          병원처방날짜 : {date}
                        </div>
                        <div>
                          호 : {number}
                        </div>
                        <div>
                          나안시력(L) : {nakedlefteye}
                        </div>
                        <div>
                          나안시력(R) : {nakedrighteye}
                        </div>
                        <div>
                          교정시력(L) : {lefteye}
                        </div>
                        <div>
                          교정시력(R) : {righteye}
                        </div>
                      </div>
                    );
                  }
                }
                return <div key={p.id} />;
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
)(PrescriptionList);
