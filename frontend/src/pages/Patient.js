import React, { Component } from 'react'
import {
  SearchButton,
  ReservationList,
  CurrentVisitList
} from 'components/patient'
import EyeIcon from '@material-ui/icons/Visibility'
import Grid from '@material-ui/core/Grid'

class Patient extends Component {
  render () {
    return (
      <div>
        <h1>blank</h1>
        <SearchButton />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CurrentVisitList />
          </Grid>
          <Grid item xs={6}>
            <ReservationList />
          </Grid>
          <Grid item xs={6}>
            <ReservationList />
          </Grid>
        </Grid>
      </div>
    )
  }
}

Patient.propTypes = {}

export default Patient
