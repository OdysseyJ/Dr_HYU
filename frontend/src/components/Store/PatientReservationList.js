import React, { Component } from "react";
import * as reservationAPI from "lib/api/reservation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { StyledNavLink } from "components/Util";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

import { Button } from "components/Util";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";

class PatientReservationList extends Component {
  state = {
    reservations: [],
    isPopupShow: false,
    selectedId: "",
    checked: false
  };

  getReservations = async () => {
    const { usertype, name } = this.props.loggedInfo.toJS();
    const reservations = await reservationAPI.getReservations({
      usertype: usertype,
      name: name
    });
    this.setState({ reservations: reservations.data });
  };

  handleDeleteButton = (data, e) => {
    const id = data.p.id;
    this.setState({ isPopupShow: true, selectedId: id });
  };

  handleDeleteComplete = async () => {
    await reservationAPI.deleteReservation({ id: this.state.selectedId });
    const { usertype, name } = this.props.loggedInfo.toJS();
    const reservations = await reservationAPI.getReservations({
      usertype: usertype,
      name: name
    });
    this.setState({
      isPopupShow: false,
      selectedId: "",
      reservations: reservations.data
    });
  };

  handleExitButton = () => {
    this.setState({ isPopupShow: false, selectedId: "" });
  };

  componentDidMount() {
    this.getReservations();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.checked !== prevProps.checked) {
      this.setState({ ...this.state, checked: this.props.checked });
    }
  }

  render() {
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          예약한 환자 리스트
        </Typography>
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              {this.state.reservations &&
                this.state.reservations.map(p => {
                  let name = p.uemail;
                  const split = p.time.split(" ");
                  const year = split[0];
                  const month = split[1];
                  const day = split[2];
                  const time = split[3];
                  const total = `예약시간 : ${year}년 ${month}월 ${day}일 ${time}시`;
                  return (
                    <ListItem key={p.id}>
                      <ListItemText primary={name} secondary={total} />
                      <ListItemSecondaryAction>
                        {this.state.checked
                          ? <StyledNavLink
                              to={{ pathname: "/prescription", uemail: name }}
                            >
                              처방하기
                            </StyledNavLink>
                          : <div />}
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
)(PatientReservationList);
