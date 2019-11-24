import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class Loginpage extends Component {
  state = {
    type: "",
    login: ""
  };

  emailbox = null;
  passwordbox = null;

  constructor(props) {
    super(props);
    this.state = {
      type: props.match.params.type
    };
    this.emailbox = React.createRef();
    this.passwordbox = React.createRef();
  }

  loginPressed = async () => {
    const email = this.emailbox.current.value;
    const password = this.passwordbox.current.value;
    // const login = await axios.get(
    //   `https://localhost:4000/login/${email}/${password}/${this.state.type}`
    // );
    const login = "success";
    this.setState({ login: login });
  };

  render() {
    if (this.state.login === "success") {
      const url = `/${this.state.type}`;
      return <Redirect push to={url} />;
    }
    return (
      <div>
        <h2>
          {this.state.type} 로그인
        </h2>
        <input ref={this.emailbox} />
        <input ref={this.passwordbox} />
        <div>
          <button onClick={this.loginPressed}>로그인</button>
          <Link to="/">
            <button>돌아가기</button>
          </Link>
          {this.state.login === "failed" ? <div>사용자정보없음</div> : <div />}
        </div>
      </div>
    );
  }
}

Loginpage.propTypes = {
  type: PropTypes.string.isRequired
};

export default Loginpage;
