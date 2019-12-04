import React, { Component } from "react";
import * as favoriteAPI from "lib/api/favorite";
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

class FavoriteList extends Component {
  state = {
    favorites: [],
    isPopupShow: false,
    uemail: "",
    sname: "",
    hname: ""
  };

  getFavorites = async () => {
    const { email } = this.props.loggedInfo.toJS();
    const favorites = await favoriteAPI.getFavorites({
      uemail: email
    });
    this.setState({ favorites: favorites.data });
  };

  handleDeleteButton = (data, e) => {
    const { uemail, sname, hname } = data.p;
    this.setState({
      isPopupShow: true,
      uemail: uemail,
      sname: sname,
      hname: hname
    });
  };

  handleDeleteComplete = async () => {
    const { uemail, hname, sname } = this.state;
    await favoriteAPI.deleteFavorite({
      uemail: uemail,
      hname: hname,
      sname: sname
    });
    const favorites = await favoriteAPI.getFavorites({
      uemail: uemail,
      hname: hname,
      sname: sname
    });
    this.setState({
      isPopupShow: false,
      uemail: "",
      hname: "",
      sname: "",
      favorites: favorites.data
    });
  };

  handleExitButton = () => {
    this.setState({ isPopupShow: false, selectedId: "" });
  };

  componentDidMount() {
    this.getFavorites();
  }

  render() {
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          즐겨찾기
        </Typography>
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              {this.state.favorites &&
                this.state.favorites.map(p => {
                  let name;
                  if (p.sname === "") {
                    name = p.hname;
                  } else if (p.hname === "") {
                    name = p.sname;
                  }
                  return (
                    <ListItem key={name}>
                      <ListItemText primary={name} />
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
)(FavoriteList);
