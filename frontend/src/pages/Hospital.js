import React, { Component } from 'react'
import {
  PatientReservationList,
  PrescriptionButton,
  PrescriptionLog
} from '../components/Hospital/index'

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
