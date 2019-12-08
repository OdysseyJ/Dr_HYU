import React, { Component } from "react";
import * as prescriptionAPI from "lib/api/prescription";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import EyeIcon from "@material-ui/icons/Visibility";
import { Buttons } from "components/Prescription";
import MaskedInput from "react-text-mask";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

function TextMaskDate(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "년",
        " ",
        /\d/,
        /\d/,
        "월",
        " ",
        /\d/,
        /\d/,
        "일",
        /\d/,
        /\d/,
        "시",
        /\d/,
        /\d/,
        "분"
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

class GlassstoreForm extends Component {
  state = {
    sname: "",
    uemail: "",
    prescriptions: [],
    isPopupShow: false,
    selectedPrescription: null,
    date: "   년  월  일  시  분",
    detail: "",
    showError: false
  };

  getPrescriptions = async () => {
    const { sname, uemail } = this.props;
    const prescriptions = await prescriptionAPI.getPrescriptions({
      uemail: uemail
    });
    this.setState({
      sname: sname,
      uemail: uemail,
      prescriptions: prescriptions.data
    });
  };

  handleEyeButton = (data, e) => {
    const { p } = data;
    this.setState({
      isPopupShow: true,
      selectedPrescription: p
    });
  };

  componentDidMount() {
    this.getPrescriptions();
  }

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };

  handleComplete = async () => {
    if (
      this.state.sname !== this.props.sname ||
      this.state.date === "   년  월  일  시  분" ||
      this.state.detail === ""
    ) {
      this.setState({ ...this.state, showError: true });
    } else {
      this.setState({ ...this.state, showError: true });

      await prescriptionAPI.updatePrescription({
        prescriptiontype: "glassstore",
        prescriptionId: this.state.selectedPrescription.id,
        prescription: JSON.stringify(
          Object.assign(
            JSON.parse(this.state.selectedPrescription.prescription),
            {
              storename: this.state.sname,
              storedate: this.state.date,
              storedetail: this.state.detail
            }
          )
        ),
        uemail: this.state.uemail,
        sname: this.state.sname
      });
      this.setState({ ...this.state, showError: false, showComplete: true });
    }
  };

  render() {
    let prescription = null;
    let prescriptiontype = null;
    let prescriptionObject = null;
    if (this.state.selectedPrescription !== null) {
      prescription = this.state.selectedPrescription.prescription;
      prescriptiontype = this.state.selectedPrescription.prescriptiontype;
      prescriptionObject = JSON.parse(prescription);
    }

    return (
      <div>
        <Buttons handleComplete={this.handleComplete} />
        {this.state.showError ? <div>처방전을 올바르게 작성하세요</div> : <div />}
        <h1>
          {this.state.sname}
        </h1>
        <div>
          <Typography style={{ paddingLeft: 30, paddingTop: 50 }} variant="h5">
            {this.state.uemail}의 처방전 목록
          </Typography>
          <div
            style={{
              paddingLeft: 30,
              paddingRight: 30
            }}
          >
            <div>
              <List>
                {this.state.prescriptions &&
                  this.state.prescriptions.map(p => {
                    let name = p.hname;
                    return (
                      <ListItem key={p.id}>
                        <ListItemText primary={name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={this.handleEyeButton.bind(this, { p })}
                            edge="end"
                            aria-label="show"
                          >
                            <EyeIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
              </List>
              {this.state.isPopupShow
                ? <div>
                    {this.state.selectedPrescription !== null &&
                    prescriptiontype === "medicine"
                      ? <div>
                          <h1>병원의처방</h1>
                          <div>
                            처방한곳: {prescriptionObject.name}
                          </div>
                          <div>
                            날짜: {prescriptionObject.date}
                          </div>
                          <div>
                            호: {prescriptionObject.numebr}
                          </div>
                          <div>
                            처방한약: {prescriptionObject.medicineName}
                          </div>
                          <div>
                            1회투약량: {prescriptionObject.amount}
                          </div>
                          <div>
                            1일투약횟수: {prescriptionObject.count}
                          </div>
                          <div>
                            총투약일: {prescriptionObject.totalDay}
                          </div>
                        </div>
                      : <div />}
                    {this.state.selectedPrescription !== null &&
                    prescriptiontype === "glasses"
                      ? <div>
                          <h1>안과의처방</h1>
                          <div>
                            처방한곳: {prescriptionObject.name}
                          </div>
                          <div>
                            날짜: {prescriptionObject.date}
                          </div>
                          <div>
                            호: {prescriptionObject.numebr}
                          </div>
                          <div>
                            나안시력(L): {prescriptionObject.nakedlefteye}
                          </div>
                          <div>
                            나안시력(R)): {prescriptionObject.nakedrighteye}
                          </div>
                          <div>
                            교정시력(L): {prescriptionObject.lefteye}
                          </div>
                          <div>
                            교정시력(R): {prescriptionObject.righteye}
                          </div>
                        </div>
                      : <div />}

                    <h1>나의 처방</h1>
                    <Grid container spacing={1}>
                      <Input
                        value={this.state.sname}
                        onChange={this.handleChange("sname")}
                        id="sname"
                      />
                      <div style={{ paddingLeft: 20 }} />
                      <Input
                        value={this.state.date}
                        onChange={this.handleChange("date")}
                        id="date"
                        inputComponent={TextMaskDate}
                      />
                      <div style={{ paddingLeft: 20 }} />
                      <Input
                        value={this.state.detail}
                        placeholder="처방의 변경, 수정, 대체시 내용"
                        onChange={this.handleChange("detail")}
                        id="detail"
                      />
                    </Grid>
                  </div>
                : <div />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GlassstoreForm;
