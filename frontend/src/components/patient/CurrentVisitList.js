import React, { Component } from "react";
import * as logAPI from "lib/api/log";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

class CurrentVisitList extends Component {
  state = {
    logs: []
  };

  getPatientLog = async () => {
    const { email } = this.props.loggedInfo.toJS();
    const logs = await logAPI.getPatientLog({
      uemail: email
    });
    this.setState({ logs: logs.data });
  };

  componentDidMount() {
    this.getPatientLog();
  }

  render() {
    return (
      <div>
        <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
          최근방문목록
        </Typography>
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          <div>
            <List>
              {this.state.logs &&
                this.state.logs.map(p => {
                  if (p.type === "reservation") {
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
                    const total = `예약시간 : ${year}년 ${month}월 ${day}일 ${time}시`;
                    return (
                      <ListItem key={p.id}>
                        <ListItemText primary={name} secondary={total} />
                      </ListItem>
                    );
                  } else return null;
                })}
            </List>
          </div>
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
