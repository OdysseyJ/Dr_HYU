import React, { Component } from "react";
import * as reservationAPI from "lib/api/reservation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

import { Button } from "components/Util";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";

class CurrentVisitList extends Component {
  state = {
    reservations: [],
    isPopupShow: false,
    selectedId: ""
  };

  getReservations = async () => {
    const { usertype, email } = this.props.loggedInfo.toJS();
    const reservations = await reservationAPI.getReservations({
      usertype: usertype,
      name: email
    });
    this.setState({ reservations: reservations.data });
  };

  handleDeleteButton = (data, e) => {
    const id = data.p.id;
    this.setState({ isPopupShow: true, selectedId: id });
  };

  handleDeleteComplete = async () => {
    await reservationAPI.deleteReservation({ id: this.state.selectedId });
    const { usertype, email } = this.props.loggedInfo.toJS();
    const reservations = await reservationAPI.getReservations({
      usertype: usertype,
      name: email
    });
    this.setState({
      isPopupShow: false,
      selectedId: "",
      reservations: reservations
    });
  };

  handleExitButton = () => {
    this.setState({ isPopupShow: false, selectedId: "" });
  };

  componentDidMount() {
    this.getReservations();
  }

  render() {
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          내예약목록
        </Typography>
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              {this.state.reservations.map(p => {
                let name;
                if (p.sname === null) {
                  name = p.hname;
                } else if (p.hname === null) {
                  name = p.sname;
                }
                const split = p.time.split(" ");
                const year = split[0];
                const month = split[1];
                const day = split[2];
                const time = split[3];
                const total = `${year}년 ${month}월 ${day}일 ${time}시`;
                return (
                  <ListItem key={p}>
                    <ListItemText primary={name} secondary={total} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={this.handleDeleteButton.bind(this, { p })}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
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
            <DialogTitle id="alert-dialog-title">정말로 삭제하시겠습니까?</DialogTitle>

            <DialogActions>
              <Button text="취소하기" handleButton={this.handleExitButton} />
              <Button text="삭제하기" handleButton={this.handleDeleteComplete} />
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
)(CurrentVisitList);
