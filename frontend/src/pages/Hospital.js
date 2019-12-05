import React, { Component } from 'react'
import {
  PatientReservationList,
  PrescriptionButton,
  PrescriptionLog
} from 'components/Hospital'
import Grid from '@material-ui/core/Grid'

class Hospital extends Component {
  render () {
    return (
      <div>
        <h1>hospital</h1>
        <PrescriptionButton />
        <PatientReservationList />
        <PrescriptionLog />
      </div>
    )
  }
}

export default Hospital
