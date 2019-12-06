import React, { Component } from 'react'
import {
  SearchButton,
  ReservationList,
  CurrentVisitList,
  FavoriteList,
  PrescriptionList
} from 'components/Patient'
import Grid from '@material-ui/core/Grid'

class Patient extends Component {
  render () {
    return (
      <div>
        <h1>blank</h1>
        <SearchButton />
        <div style={{ paddingTop: 30 }} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ReservationList />
          </Grid>
          <Grid item xs={6}>
            <FavoriteList />
          </Grid>
          <Grid item xs={6}>
            <CurrentVisitList />
          </Grid>
          <Grid item xs={6}>
            <PrescriptionList />
          </Grid>
        </Grid>
      </div>
    )
  }
}

Patient.propTypes = {}

export default Patient
