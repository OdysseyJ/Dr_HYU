import React from "react";
import PropTypes from "prop-types";
import * as mapAPI from "lib/api/map";

//for redux.
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

// for google map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

// for css components
import { Button } from "components/Util";
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
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

var moment = require("moment");
moment().format();

// for T

// 구글맵 출력하는 컴포넌트.
const GoogleMapContainer = withScriptjs(
  withGoogleMap(function(props) {
    const currentHour = Number(String(moment()._d).split(" ")[4].split(":")[0]);

    const defaultlat = parseFloat(process.env.REACT_APP_HYU_LAT);
    const defaultlng = parseFloat(process.env.REACT_APP_HYU_LNG);
    const {
      handleMarkerClick,
      activeMarkerInfo,
      showingInfoWindow,
      handleReservationButton,
      type
    } = props;
    let { isListSet } = props;
    const { ALL, all, search, Pharmacy, GlassStore } = props.options;
    console.log("googlemapContainer", props.list, props.options);
    if (isListSet) {
      // option에 따라 보여줄 마커 결정하기.
      const infoList = props.list.filter(p => {
        if (type === "hospital") {
          if (!ALL && !all && search === "") return p;
          if (search === "") {
            if (ALL) {
              if (p.department === "상급종합") return p;
            }
            if (all) {
              if (p.department === "종합병원") return p;
            }
          } else if (search.value === p.name) return p;
        }
        if (type === "store") {
          if (!Pharmacy && !GlassStore && search === "") return p;
          if (search === "") {
            if (Pharmacy) {
              if (p.department === "약국") return p;
            }
            if (GlassStore) {
              if (p.department === "안경점") return p;
            }
          } else if (search.value === p.name) return p;
        }
      });

      const availableList = infoList.filter(p => {
        const startHour = Number(p.openTime.split("~")[0].split(":")[0]);
        const closeHour = Number(p.openTime.split("~")[1].split(":")[0]);
        if (currentHour >= startHour && currentHour < closeHour) {
          return p;
        }
      });

      const unavailableList = infoList.filter(p => {
        const startHour = Number(p.openTime.split("~")[0].split(":")[0]);
        const closeHour = Number(p.openTime.split("~")[1].split(":")[0]);
        if (currentHour < startHour && currentHour >= closeHour) {
          return p;
        }
      });

      console.log(infoList);
      return (
        <GoogleMap
          defaultZoom={13}
          defaultCenter={{ lat: defaultlat, lng: defaultlng }}
        >
          {infoList !== null &&
            infoList.map(function(info) {
              return (
                <Marker
                  key={info.name}
                  position={{
                    lat: parseFloat(info.lat),
                    lng: parseFloat(info.lng)
                  }}
                  onClick={() => handleMarkerClick(info.name)}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
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
                        {props.type === "patient" &&
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
                              <Button
                                text="예약하기"
                                handleButton={() =>
                                  handleReservationButton(info.name)}
                              />
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
                              <Button
                                text="예약하기"
                                handleButton={() =>
                                  handleReservationButton(info.name)}
                              />
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
  constructor(props) {
    super(props);
    console.log("constructor");
  }

  state = {
    type: "",
    isMarkerShown: false,
    isListSet: false,
    list: {},
    activeMarkerInfo: {},
    showingInfoWindow: false,
    showPopup: false,
    selectedTime: {},
    options: {}
  };

  getList = async () => {
    const { type, options } = this.props;
    await this.setState({ type: type, options: options });
    const { lat, lng } = this.props.loggedInfo.toJS();
    console.log(lat, lng);
    if (this.state.type === "hospital") {
      const hospitalList = await mapAPI.getNearHospitals({
        lat: lat,
        lng: lng
      });
      console.log(hospitalList);
      await this.setState({ isListSet: true, list: hospitalList.data });
    }
    if (this.state.type === "store") {
      const hospitalList = await mapAPI.getNearDrugstores({
        lat: lat,
        lng: lng
      });
      console.log(hospitalList);
      await this.setState({ isListSet: true, list: hospitalList.data });
    }
  };

  componentWillReceiveProps(nextProps) {
    // it can help prevent an unneeded render
    if (nextProps.options !== this.state.options) {
      this.setState({ options: nextProps.options });
    }
  }

  componentDidMount() {
    console.log("componentdidmount");
    this.getList();
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 1000);
  };

  handleMarkerClick = name => {
    console.log(name);
    if (!this.state.showingInfoWindow) {
      this.setState({
        activeMarkerInfo: name,
        showingInfoWindow: !this.state.showingInfoWindow
      });
    } else {
      this.setState({
        activeMarkerInfo: null,
        showingInfoWindow: !this.state.showingInfoWindow
      });
    }
  };

  handleReservationButton = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  handleSelectChange = selectedOption => {
    const value = selectedOption.target.value;
    console.log(value);
    this.setState({ selectedTime: value });
  };

  handleCompleteButton = () => {
    console.log("complete");
    this.setState({ showPopup: !this.state.showPopup });
  };

  render() {
    console.log("render", this.state.list);
    return (
      <div>
        <GoogleMapContainer
          isMarkerShown={this.state.isMarkerShown}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process
            .env.REACT_APP_MAP_API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          list={this.state.list}
          handleMarkerClick={this.handleMarkerClick}
          showingInfoWindow={this.state.showingInfoWindow}
          activeMarkerInfo={this.state.activeMarkerInfo}
          handleReservationButton={this.handleReservationButton}
          isListSet={this.state.isListSet}
          options={this.state.options}
          type={this.state.type}
        />
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
              예약하실 시간을 선택하세요
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <InputLabel htmlFor="selected">selected</InputLabel>
            <Select
              autoFocus
              value={this.state.selectedTime}
              onChange={this.handleSelectChange}
              inputProps={{
                name: "selected",
                id: "selected"
              }}
            >
              <MenuItem value={false}>false</MenuItem>
              <MenuItem value="09~10">09~10</MenuItem>
              <MenuItem value="10~11">10~11</MenuItem>
              <MenuItem value="11~12">11~12</MenuItem>
              <MenuItem value="13~14">13~14</MenuItem>
              <MenuItem value="14~15">14~15</MenuItem>
              <MenuItem value="15~16">15~16</MenuItem>
              <MenuItem value="16~17">16~17</MenuItem>
            </Select>
            <Button text="취소하기" handleButton={this.handleReservationButton} />
            <Button text="완료하기" handleButton={this.handleCompleteButton} />
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
