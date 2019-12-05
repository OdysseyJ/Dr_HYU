import React, { Component } from "react";

// 만들어둔 컴포넌트 사용을 위해.
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  RightAlignedLink,
  AuthError,
  AuthGeoloc
} from "components/Auth";

// 셀렉트 컴포넌트 사용을 위해
import Select from "react-select";

// redux 사용을 위해
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";

// debounce = 특정 함수가 반복적으로 일어나면, 바로 실행하지 않고 주어진만큼 쉬어준다.
// 로그인인풋을 맞게 넣었을경우 계속해서 서버로 요청이 들어가는것 해결.
import debounce from "lodash/debounce";

// 위치값 받아오는 미들웨어 사용을 위해.
// this.props.coords.longitude / latitude 로 사용.
import { geolocated } from "react-geolocated";

// local storage를 위해.
import storage from "lib/storage";

// 문자열 검증을 위해
import { isEmail, isLength, isAlphanumeric, isNumeric } from "validator";

class Register extends Component {
  //문자열 검증.
  setError = message => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      form: "register",
      message
    });
  };

  validate = {
    usertype: value => {
      if (!isAlphanumeric(value)) {
        this.setError("회원 타입을 선택하세요.");
        return false;
      }
      return true;
    },
    email: value => {
      if (!isEmail(value)) {
        this.setError("잘못된 이메일 형식 입니다.");
        return false;
      }
      return true;
    },
    name: value => {
      if (!isLength(value, { min: 3, max: 20 })) {
        this.setError("이름은 3~20 글자 사이로 입력해주세요.");
        return false;
      }
      return true;
    },
    phonenum: value => {
      if (
        !isNumeric(value, { no_symbols: true }) ||
        !isLength(value, { min: 11, max: 11 })
      ) {
        this.setError("전화번호는 11자리의 숫자로 입력해주세요. ex)01012345678");
        return false;
      }
      return true;
    },
    password: value => {
      if (!isLength(value, { min: 6 })) {
        this.setError("비밀번호를 6자 이상 입력하세요.");
        return false;
      }
      this.setError(null); // 이메일과 아이디는 에러 null 처리를 중복확인 부분에서 하게 됩니다
      return true;
    },
    passwordConfirm: value => {
      if (this.props.form.get("password") !== value) {
        this.setError("비밀번호확인이 일치하지 않습니다.");
        return false;
      }
      this.setError(null);
      return true;
    }
  };

  // debounce = 특정 함수가 반복적으로 일어나면, 바로 실행하지 않고 주어진만큼 쉬어준다.
  // 로그인인풋을 맞게 넣었을경우 계속해서 서버로 요청이 들어가는것 해결.
  checkEmailExists = debounce(async email => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.checkEmailExists(email);
      if (this.props.exists.get("email")) {
        this.setError("이미 존재하는 이메일입니다.");
      } else {
        this.setError(null);
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  checkHospitalExists = debounce(async name => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.checkHospitalExists(name);
      console.log(this.props.exists.get("hospital"));
      if (!this.props.exists.get("hospital")) {
        this.setError("등록되지 않은 병원입니다.");
      } else {
        this.setError(null);
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  checkStoreExists = debounce(async name => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.checkStoreExists(name);
      if (!this.props.exists.get("store")) {
        this.setError("등록되지 않은 상점입니다.");
      } else {
        this.setError(null);
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  handleSelectChange = selectedOption => {
    const { AuthActions } = this.props;
    const value = { selectedOption }.selectedOption.value;
    const name = "usertype";

    console.log("select change");
    AuthActions.changeInput({
      name,
      value,
      form: "register"
    });

    // 검증작업 진행
    const validation = this.validate[name](value);
    if (name.indexOf("password") > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침

    this.setError(null);
  };

  handleChange = e => {
    const { AuthActions } = this.props;
    const { name, value } = e.target;
    const { usertype, email } = this.props.form.toJS();

    console.log(usertype, email);
    AuthActions.changeInput({
      name,
      value,
      form: "register"
    });

    // 검증작업 진행
    const validation = this.validate[name](value);
    if (name.indexOf("password") > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침

    if (name === "email") {
      this.checkEmailExists(value);
    } else if (name === "name") {
      if (
        usertype !== "patient" &&
        usertype !== "hospital" &&
        usertype !== "store"
      ) {
        this.setError("회원타입을 먼저 선택하세요.");
      } else if (usertype === "hospital") {
        this.checkHospitalExists(value);
      } else if (usertype === "store") {
        this.checkStoreExists(value);
      }
    }
  };

  componentWillUnmount() {
    const { AuthActions } = this.props;
    AuthActions.initializeForm("register");
  }

  handleLocalRegister = async () => {
    const { form, AuthActions, UserActions, error, history } = this.props;
    const {
      usertype,
      email,
      name,
      phonenum,
      password,
      passwordConfirm
    } = form.toJS();
    const lng = this.props.coords.longitude;
    const lat = this.props.coords.latitude;
    const { validate } = this;

    if (error) return; // 현재 에러가 있는 상태라면 진행하지 않음
    if (
      !validate["usertype"](usertype) ||
      !validate["email"](email) ||
      !validate["name"](name) ||
      !validate["phonenum"](phonenum) ||
      !validate["password"](password) ||
      !validate["passwordConfirm"](passwordConfirm)
    ) {
      // 하나라도 실패하면 진행하지 않음
      return;
    }

    try {
      await AuthActions.localRegister({
        usertype,
        name,
        phonenum,
        email,
        password,
        lat,
        lng
      });
      const loggedInfo = this.props.result.toJS();
      console.log(loggedInfo);
      // 로그인 정보 저장 (로컬스토리지/스토어)
      storage.set("loggedInfo", loggedInfo);
      UserActions.setLoggedInfo(loggedInfo);
      UserActions.setValidated(true);

      history.push("/"); // 회원가입 성공시 홈페이지로 이동
    } catch (e) {
      // 에러 처리하기
      if (e.response.status === 409) {
        const { key } = e.response.data;
        const message = key === "email" ? "이미 존재하는 이메일입니다." : "이미 존재하는 아이디입니다.";
        return this.setError(message);
      }
      this.setError("알 수 없는 에러가 발생했습니다.");
    }
  };

  render() {
    const { error } = this.props;
    const {
      email,
      name,
      phonenum,
      password,
      passwordConfirm
    } = this.props.form.toJS();
    const { handleSelectChange, handleChange, handleLocalRegister } = this;
    const options = [
      { value: "patient", label: "환자" },
      { value: "hospital", label: "병원" },
      { value: "store", label: "가게" }
    ];
    return (
      <AuthContent title="회원가입">
        <Select options={options} onChange={handleSelectChange} />
        <p />
        <InputWithLabel
          label="이메일"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={handleChange}
        />
        <InputWithLabel
          label="이름"
          name="name"
          placeholder="이름"
          value={name}
          onChange={handleChange}
        />
        <InputWithLabel
          label="전화번호"
          name="phonenum"
          placeholder="전화번호"
          type="phonenum"
          value={phonenum}
          onChange={handleChange}
        />
        <InputWithLabel
          label="비밀번호"
          name="password"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <InputWithLabel
          label="비밀번호 확인"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={handleChange}
        />
        <AuthGeoloc {...this.props} />
        {error &&
          <AuthError>
            {error}
          </AuthError>}
        <AuthButton onClick={handleLocalRegister}>회원가입</AuthButton>
        <RightAlignedLink to="/auth/login">로그인</RightAlignedLink>
      </AuthContent>
    );
  }
}

const RootWithGeoloc = geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Register);

export default connect(
  state => ({
    form: state.auth.getIn(["register", "form"]),
    error: state.auth.getIn(["register", "error"]),
    exists: state.auth.getIn(["register", "exists"]),
    result: state.auth.get("result")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(RootWithGeoloc);
