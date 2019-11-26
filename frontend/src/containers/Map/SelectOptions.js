import React, { Component } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { StyledLink } from "components/Util";

class SelectOptions extends Component {
  state = {
    Pharmacy: false,
    GlassStore: false,
    ALL: false,
    all: false,
    search: ""
  };

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.checked
    });
  };

  handleChangeSearchBar = e => {
    const { value } = e.target;
    this.setState({ search: { value } });
  };

  handleSearchButton = async e => {
    //e.preventDefault(); 페이지 리로딩 방지하고시프면
    console.log(this.state);
    this.props.onCreate(this.state);
    this.fv.value = "";
    await this.setState({
      Pharmacy: false,
      GlassStore: false,
      ALL: false,
      all: false,
      search: ""
    });
  };

  render() {
    const type = this.props.type;
    return (
      <div>
        <h4>[옵션 선택]</h4>
        {type === "hospital" &&
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.ALL}
                  onChange={this.handleChange("ALL")}
                  value="ALL"
                  color="primary"
                />
              }
              label="상급종합"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.all}
                  onChange={this.handleChange("all")}
                  value="all"
                  color="primary"
                />
              }
              label="종합병원"
            />
          </FormGroup>}
        {type === "store" &&
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Pharmacy}
                  onChange={this.handleChange("Pharmacy")}
                  value="Pharmacy"
                  color="primary"
                />
              }
              label="약국"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.GlassStore}
                  onChange={this.handleChange("GlassStore")}
                  value="GlassStore"
                  color="primary"
                />
              }
              label="안경점"
            />
          </FormGroup>}
        <TextField
          id="outlined-search"
          label="이름 검색"
          type="search"
          className="search"
          margin="normal"
          variant="outlined"
          inputRef={el => (this.fv = el)}
          onChange={this.handleChangeSearchBar}
        />
        <div />
        <StyledLink to="/">돌아가기</StyledLink>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSearchButton}
        >
          검색하기
        </Button>
      </div>
    );
  }
}

SelectOptions.propTypes = {};

export default SelectOptions;
