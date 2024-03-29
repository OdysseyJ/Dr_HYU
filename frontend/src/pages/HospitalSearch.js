import React, { Component } from "react";
import {
  GoogleMapComponent,
  Title,
  SelectOptions
} from "../containers/Map/index";

class HospitalSearch extends Component {
  state = {
    options: {
      Pharmacy: false,
      GlassStore: false,
      ALL: false,
      all: false,
      hospital: false,
      clinic: false,
      eye: false,
      search: ""
    }
  };

  handleSearchButton = options => {
    this.setState({ options: options });
  };

  render() {
    return (
      <div>
        <Title title="병원 검색하기" />
        <GoogleMapComponent type="hospital" options={this.state.options} />
        <SelectOptions type="hospital" onCreate={this.handleSearchButton} />
      </div>
    );
  }
}

export default HospitalSearch;
