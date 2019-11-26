import React, { Component } from 'react'
import { InfoList, SearchButton } from 'components/patient'

class Patient extends Component {
  render () {
    return (
      <div>
        <h1>test</h1>
        <h1>test</h1>

        <h1>test</h1>

        <h1>test</h1>

        <SearchButton />
        <InfoList List={this.props.myHospitals} />
        <InfoList List={this.props.recentHospitals} />
        <InfoList List={this.props.prescriptions} />
      </div>
    )
  }
}

Patient.propTypes = {}

export default Patient
