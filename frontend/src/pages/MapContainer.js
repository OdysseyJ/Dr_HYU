import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

const mapStyles = {
  width: "50%",
  height: "50%"
};

class MapContainer extends Component {
  state = {
    activeMarker: {},
    selectedPlace: {},
    selectedText: {},
    selectedId: {},
    showingInfoWindow: false
  };

  send = () => {
    console.log("fzf");
  };

  onMarkerClick = (props, marker) => {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      selectedText: props,
      selectedId: props,
      showingInfoWindow: true
    });
    console.log(this.showingInfoWindow);
  };

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
  };

  render() {
    return (
      <Map
        google={this.props.google}
        onClick={this.onMapClicked}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: 47.444, lng: -122.176 }}
      >
        <Marker
          name="한양대학교병원"
          onClick={this.onMarkerClick}
          position={{ lat: 48.0, lng: -122.0 }}
        />

        <InfoWindow
          marker={this.state.activeMarker}
          onClose={this.onInfoWindowClose}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h2>
              {this.state.selectedPlace.name}
            </h2>
            <p>
              {this.state.selectedPlace.description}
            </p>
            <button type="button" onClick={this.send}>
              예약하기
            </button>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.MAP_API_KEY
})(MapContainer);
