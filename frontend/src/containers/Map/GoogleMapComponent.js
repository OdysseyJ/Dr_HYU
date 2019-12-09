import React from "react";
import PropTypes from "prop-types";
import * as hospitalAPI from "../../lib/api/hospital";
import * as storeAPI from "../../lib/api/store";
import * as reservationAPI from "../../lib/api/reservation";
import * as favoriteAPI from "../../lib/api/favorite";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../redux/modules/user";

// for google map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

// for css components
import { Button } from "../../components/Util";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { ClipLoader } from "react-spinners";

const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

// for currentTime
var moment = require("moment");
moment().format();

// 구글맵 출력하는 컴포넌트.
const GoogleMapContainer = withScriptjs(
  withGoogleMap(function(props) {
    // 현재시간 받아오기 (hour)
    const currentHour = Number(String(moment()._d).split(" ")[4].split(":")[0]);

    const {
      handleMapClick,
      handleMarkerClick,
      activeMarkerInfo,
      showingInfoWindow,
      handleReservationButton,
      handleFavoriteButton,
      handleFavoriteDeleteButton,
      isExistInFavorite,
      type,
      defaultLng,
      defaultLat
    } = props;
    let { isListSet } = props;
    const {
      ALL,
      all,
      hospital,
      clinic,
      eye,
      search,
      Pharmacy,
      GlassStore
    } = props.options;
    let availableList = null;
    let unavailableList = null;
    if (isListSet) {
      // option에 따라 보여줄 마커 결정하기.
      const infoList = props.list.filter(p => {
        if (type === "hospital") {
          if (!ALL && !all && !hospital && !clinic && !eye && search === "")
            return p;
          if (search === "") {
            if (ALL) {
              if (p.department === "상급종합") return p;
            }
            if (all) {
              if (p.department === "종합병원") return p;
            }
            if (hospital) {
              if (p.department === "병원") return p;
            }
            if (clinic) {
              if (p.department === "의원") return p;
            }
            if (eye) {
              if (p.department === "안과") return p;
            }
          } else if (p.name.match(search.value)) return p;
        } else if (type === "store") {
          if (!Pharmacy && !GlassStore && search === "") return p;
          if (search === "") {
            if (Pharmacy) {
              if (p.department === "약국") return p;
            }
            if (GlassStore) {
              if (p.department === "안경점") return p;
            }
          } else if (p.name.match(search.value)) return p;
        }
        return null;
      });
      // 현재 예약가능한 리스트
      availableList = infoList.filter(p => {
        const startHour = Number(p.openTime.split("~")[0].split(":")[0]);
        const closeHour = Number(p.openTime.split("~")[1].split(":")[0]);
        if (currentHour >= startHour && currentHour < closeHour) {
          return p;
        }
        return null;
      });
      // 현재 예약불가능한 리스트
      unavailableList = infoList.filter(p => {
        const startHour = Number(p.openTime.split("~")[0].split(":")[0]);
        const closeHour = Number(p.openTime.split("~")[1].split(":")[0]);
        if (currentHour < startHour || currentHour >= closeHour) {
          return p;
        }
        return null;
      });
      // 맵과 마커 출력.

      return (
        <GoogleMap
          defaultZoom={13}
          defaultCenter={{ lat: defaultLat, lng: defaultLng }}
          onClick={handleMapClick}
        >
          {availableList !== null &&
            availableList.map(function(info) {
              const { department } = info;
              return (
                <Marker
                  key={info.name}
                  position={{
                    lat: parseFloat(info.lat),
                    lng: parseFloat(info.lng)
                  }}
                  onClick={() => handleMarkerClick(info.name)}
                  icon={
                    props.type === "store" && department === "안경점"
                      ? {
                          url:
                            "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                        }
                      : {
                          url:
                            "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                  }
                >
                  {showingInfoWindow &&
                    activeMarkerInfo !== null &&
                    info.name === activeMarkerInfo &&
                    <InfoBox
                      options={{
                        closeBoxURL: ``,
                        enableEventPropagation: true
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          opacity: 1,
                          padding: `15px`
                        }}
                      >
                        {props.type === "hospital" &&
                          <div>
                            <div
                              style={{
                                fontSize: `15px`,
                                fontColor: `#08233B`
                              }}
                            >
                              {info.name}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              분류 : {info.department}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              주소 : {info.address}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              전문의 수 : {info.numOfDoctors}명
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              진료 요일 : {info.openDay}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              진료 시간 : {info.openTime}
                            </div>
                            <div style={{ paddingTop: 5 }} />
                          </div>}
                        {props.type === "store" &&
                          <div>
                            <div
                              style={{
                                fontSize: `15px`,
                                fontColor: `#08233B`
                              }}
                            >
                              {info.name}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              분류 : {info.department}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              처방가능 : {info.prescription}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              주소 : {info.address}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              영업 요일 : {info.openDay}
                            </div>
                            <div
                              style={{
                                fontSize: `12px`,
                                fontColor: `#08233B`
                              }}
                            >
                              영업 시간 : {info.openTime}
                            </div>
                            <div style={{ paddingTop: 5 }} />
                          </div>}
                        <div style={{ textAlign: "center" }}>
                          <Button
                            text="예약하기"
                            handleButton={() => handleReservationButton()}
                          />
                          {isExistInFavorite
                            ? <Button
                                text="즐겨찾기에서 삭제"
                                handleButton={() =>
                                  handleFavoriteDeleteButton()}
                              />
                            : <Button
                                text="즐겨찾기에 추가"
                                handleButton={() => handleFavoriteButton()}
                              />}
                        </div>
                      </div>
                    </InfoBox>}
                </Marker>
              );
            })}
          {unavailableList !== null &&
            unavailableList.map(function(info) {
              return (
                <Marker
                  key={info.name}
                  position={{
                    lat: parseFloat(info.lat),
                    lng: parseFloat(info.lng)
                  }}
                  onClick={() => handleMarkerClick(info.name)}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  }}
                >
                  {showingInfoWindow &&
                    activeMarkerInfo !== null &&
                    info.name === activeMarkerInfo &&
                    <InfoBox
                      options={{
                        closeBoxURL: ``,
                        enableEventPropagation: true
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          opacity: 1,
                          padding: `15px`
                        }}
                      >
                        {props.type === "hospital" &&
                          <div>
                            <div
                              style={{ fontSize: `15px`, fontColor: `#08233B` }}
                            >
                              {info.name}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              분류 : {info.department}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              주소 : {info.address}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              전문의 수 : {info.numOfDoctors}명
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              진료 요일 : {info.openDay}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              진료 시간 : {info.openTime}
                            </div>
                            <div style={{ paddingTop: 5 }} />
                            <div style={{ textAlign: "center" }}>
                              <Button text="지금은 예약 가능한 시간이 아닙니다" />
                            </div>
                          </div>}
                        {props.type === "store" &&
                          <div>
                            <div
                              style={{ fontSize: `15px`, fontColor: `#08233B` }}
                            >
                              {info.name}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              분류 : {info.department}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              주소 : {info.address}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              영업 요일 : {info.openDay}
                            </div>
                            <div
                              style={{ fontSize: `12px`, fontColor: `#08233B` }}
                            >
                              영업 시간 : {info.openTime}
                            </div>
                            <div style={{ paddingTop: 5 }} />
                            <div style={{ textAlign: "center" }}>
                              <Button text="지금은 예약 가능한 시간이 아닙니다" />
                            </div>
                          </div>}
                      </div>
                    </InfoBox>}
                </Marker>
              );
            })}
        </GoogleMap>
      );
    } else {
      return <div />;
    }
  })
);

GoogleMapContainer.propTypes = {
  isMarkerShown: PropTypes.bool.isRequired,
  googleMapURL: PropTypes.string.isRequired
};

class GoogleMapComponent extends React.PureComponent {
  state = {
    type: "",
    isMarkerShown: false,
    isListSet: false,
    isAllSelect: false,
    isExistInFavorite: false,
    list: {},
    activeMarkerInfo: {},
    showingInfoWindow: false,
    showPopup: false,
    showFavoritePopup: false,
    selectedYear: "",
    selectedMonth: "",
    selectedDay: "",
    selectedTime: "",
    options: {},
    defaultLat: "",
    defaultLng: ""
  };

  time = ["09~10", "10~11", "11~12", "13~14", "14~15", "15~16", "16~17"];
  year = () => {
    var arr = new Array(10);
    for (var i = 2019; i < 2030; i++) {
      arr[i - 2019] = i;
    }
    return arr;
  };

  month = () => {
    var arr = new Array(12);
    for (var i = 1; i <= 12; i++) {
      arr[i - 1] = i;
    }
    return arr;
  };

  day = () => {
    var arr = new Array(31);
    for (var i = 1; i <= 31; i++) {
      arr[i - 1] = i;
    }
    return arr;
  };

  getList = async () => {
    const { type, options } = this.props;
    const { lat, lng } = this.props.loggedInfo.toJS();
    if (type === "hospital") {
      const hospitalList = await hospitalAPI.getNearHospitals({
        lat: lat,
        lng: lng
      });
      await this.setState({
        type: type,
        options: options,
        isListSet: true,
        list: hospitalList.data,
        defaultLat: lat,
        defaultLng: lng
      });
    }
    if (type === "store") {
      const storeList = await storeAPI.getNearStores({
        lat: lat,
        lng: lng
      });
      await this.setState({
        type: type,
        options: options,
        isListSet: true,
        list: storeList.data,
        defaultLat: lat,
        defaultLng: lng
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    // it can help prevent an unneeded render
    if (nextProps.options !== this.state.options) {
      this.setState({ options: nextProps.options });
    }
  }

  componentDidMount() {
    this.getList();
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 1000);
  };

  // handleMapClick = () => {
  //   this.setState({ showingInfoWindow: !this.state.showingInfoWindow });
  // };

  handleMarkerClick = async name => {
    const { email } = this.props.loggedInfo.toJS();
    const type = this.state.type;
    let isExistInFavorite;
    if (type === "hospital") {
      isExistInFavorite = await favoriteAPI.isExists({
        uemail: email,
        hname: name,
        sname: ""
      });
    } else if (type === "store") {
      isExistInFavorite = await favoriteAPI.isExists({
        uemail: email,
        hname: "",
        sname: name
      });
    }
    this.setState({ isExistInFavorite: isExistInFavorite.data });
    if (!this.state.showingInfoWindow) {
      this.setState({
        activeMarkerInfo: name,
        showingInfoWindow: true
      });
    } else if (
      this.state.showingInfoWindow &&
      this.state.activeMarkerInfo === name
    ) {
      this.setState({
        activeMarkerInfo: name,
        showingInfoWindow: !this.state.showingInfoWindow
      });
    } else {
      this.setState({
        activeMarkerInfo: name
      });
    }
  };

  handleReservationButton = () => {
    this.setState({
      selectedYear: "",
      selectedMonth: "",
      selectedDay: "",
      selectedTime: "",
      isAllSelect: false,
      showPopup: !this.state.showPopup
    });
  };

  handleFavoriteButton = async () => {
    const { email } = this.props.loggedInfo.toJS();
    if (
      this.state.type === "hospital" &&
      this.state.showFavoritePopup === false
    ) {
      await favoriteAPI.makeFavorite({
        uemail: email,
        hname: this.state.activeMarkerInfo,
        sname: ""
      });
      this.setState({
        isExistInFavorite: true
      });
    } else if (
      this.state.type === "store" &&
      this.state.showFavoritePopup === false
    ) {
      await favoriteAPI.makeFavorite({
        uemail: email,
        hname: "",
        sname: this.state.activeMarkerInfo
      });
      this.setState({
        isExistInFavorite: true
      });
    }
    this.setState({
      showFavoritePopup: !this.state.showFavoritePopup
    });
  };

  handleFavoriteDeleteButton = async () => {
    const { email } = this.props.loggedInfo.toJS();
    if (
      this.state.type === "hospital" &&
      this.state.showFavoritePopup === false
    ) {
      await favoriteAPI.deleteFavorite({
        uemail: email,
        hname: this.state.activeMarkerInfo,
        sname: ""
      });
      this.setState({
        isExistInFavorite: false
      });
    } else if (
      this.state.type === "store" &&
      this.state.showFavoritePopup === false
    ) {
      await favoriteAPI.deleteFavorite({
        uemail: email,
        hname: "",
        sname: this.state.activeMarkerInfo
      });
      this.setState({
        isExistInFavorite: false
      });
    }
    this.setState({
      showFavoritePopup: !this.state.showFavoritePopup
    });
  };

  handleSelectChange = selectedOption => {
    const name = selectedOption.target.name;
    const value = selectedOption.target.value;
    const {
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedTime
    } = this.state;
    if (name === "year") {
      if (selectedMonth !== "" && selectedDay !== "" && selectedTime !== "") {
        this.setState({
          isAllSelect: true,
          selectedYear: value
        });
      } else {
        this.setState({
          selectedYear: value
        });
      }
    } else if (name === "month") {
      if (selectedYear !== "" && selectedDay !== "" && selectedTime !== "") {
        this.setState({
          isAllSelect: true,
          selectedMonth: value
        });
      } else {
        this.setState({
          selectedMonth: value
        });
      }
    } else if (name === "day") {
      if (selectedYear !== "" && selectedMonth !== "" && selectedTime !== "") {
        this.setState({
          isAllSelect: true,
          selectedDay: value
        });
      } else {
        this.setState({
          selectedDay: value
        });
      }
    } else if (name === "time") {
      if (selectedYear !== "" && selectedMonth !== "" && selectedDay !== "") {
        this.setState({
          isAllSelect: true,
          selectedTime: value
        });
      } else {
        this.setState({
          selectedTime: value
        });
      }
    }
  };

  handleCompleteButton = async () => {
    // props에서 useremail과 sname, hname을 받아오기.
    const {
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedTime
    } = this.state;
    if (this.state.isAllSelect === false) {
      return;
    }
    const totalTime = `${selectedYear} ${selectedMonth} ${selectedDay} ${selectedTime}`;
    const { email } = this.props.loggedInfo.toJS();
    let hname = null;
    let sname = null;

    if (this.state.type === "store") {
      sname = this.state.activeMarkerInfo;
    } else if (this.state.type === "hospital") {
      hname = this.state.activeMarkerInfo;
    }

    await reservationAPI.makeReservation({
      time: totalTime,
      uemail: email,
      sname: sname,
      hname: hname
    });
    this.setState({
      selectedYear: "",
      selectedMonth: "",
      selectedDay: "",
      selectedTime: "",
      isAllSelect: false,
      showPopup: !this.state.showPopup
    });
  };

  render() {
    return (
      <div>
        {this.state.isListSet
          ? <GoogleMapContainer
              isMarkerShown={this.state.isMarkerShown}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process
                .env.REACT_APP_MAP_API_KEY}`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              list={this.state.list}
              handleMapClick={this.handleMapClick}
              handleMarkerClick={this.handleMarkerClick}
              showingInfoWindow={this.state.showingInfoWindow}
              activeMarkerInfo={this.state.activeMarkerInfo}
              handleReservationButton={this.handleReservationButton}
              handleFavoriteButton={this.handleFavoriteButton}
              handleFavoriteDeleteButton={this.handleFavoriteDeleteButton}
              isListSet={this.state.isListSet}
              isExistInFavorite={this.state.isExistInFavorite}
              options={this.state.options}
              type={this.state.type}
              defaultLat={this.state.defaultLat}
              defaultLng={this.state.defaultLng}
            />
          : <div>
              <ClipLoader color={"#123abc"} />
            </div>}
        <Dialog
          open={this.state.showPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.state.activeMarkerInfo}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              예약할 날짜를 선택
            </DialogContentText>
            {this.state.isAllSelect ? <div /> : <div>모든 박스를 선택해주세요!</div>}
          </DialogContent>
          <DialogActions>
            <Select
              labelId="select_year"
              id="year"
              name="year"
              autoFocus
              value={this.state.selectedYear}
              onChange={this.handleSelectChange}
            >
              {this.year().map(p => {
                return (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel id="select_year">년</InputLabel>

            <Select
              labelId="select_month"
              id="month"
              name="month"
              autoFocus
              value={this.state.selectedMonth}
              onChange={this.handleSelectChange}
            >
              {this.month().map(p => {
                return (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel id="select_month">월</InputLabel>
            <Select
              labelId="select_day"
              id="day"
              name="day"
              autoFocus
              value={this.state.selectedDay}
              onChange={this.handleSelectChange}
            >
              {this.day().map(p => {
                return (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel id="select_day">일</InputLabel>
            <Select
              labelId="select_time"
              id="time"
              name="time"
              autoFocus
              value={this.state.selectedTime}
              onChange={this.handleSelectChange}
            >
              {this.time.map(p => {
                return (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel id="select_time">시</InputLabel>
            <Button text="취소하기" handleButton={this.handleReservationButton} />
            <Button text="완료하기" handleButton={this.handleCompleteButton} />
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.showFavoritePopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.state.activeMarkerInfo}
          </DialogTitle>
          <DialogContent>
            {this.state.isExistInFavorite
              ? <DialogContentText id="alert-dialog-description">
                  즐겨찾기에 추가되었습니다.
                </DialogContentText>
              : <DialogContentText id="alert-dialog-description">
                  즐겨찾기에 삭제되었습니다.
                </DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button text="완료하기" handleButton={this.handleFavoriteButton} />
          </DialogActions>
        </Dialog>
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
)(GoogleMapComponent);
