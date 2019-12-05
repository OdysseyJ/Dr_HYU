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
    console.log(prescriptions);
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
                  let name;
                  if (p.sname === null) {
                    name = p.hname;
                  } else if (p.hname === null) {
                    name = p.sname;
                  }
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
                  return (
                    <div
                      key={p}
                      style={{
                        paddingLeft: 10,
                        paddingTop: 10,
                        paddingRight: 10,
                        paddingBottom: 10
                      }}
                    >
                      ${p.prescription}
                    </div>
                  );
                }
                return <div key={p} />;
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
