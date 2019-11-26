import React, { Component } from "react";
import { GoogleMapComponent, Title, SelectOptions } from "../containers/Map";

class StoreSearch extends Component {
  state = {
    options: {
      Pharmacy: false,
      GlassStore: false,
      ALL: false,
      all: false,
      search: ""
    }
  };

  handleSearchButton = options => {
    this.setState({ options: options });
  };

  render() {
    return (
      <div>
        <Title title="상점 검색하기" />
        <GoogleMapComponent type="store" options={this.state.options} />
        <SelectOptions type="store" onCreate={this.handleSearchButton} />
      </div>
    );
  }
}

export default StoreSearch;
