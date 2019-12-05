import React, { Component } from 'react'
import {
  Buttons,
  DrugstoreForm,
  GlassstoreForm,
  HospitalForm
} from 'components/Prescription'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from 'redux/modules/user'

class Prescription extends Component {
  render () {
    const { email } = this.props.loggedInfo.toJS()
    return (
      <div>
        <h1>space</h1>
        <Buttons />
      </div>
    )
  }
}

export default connect(
  state => ({
    loggedInfo: state.user.get('loggedInfo'),
    logged: state.user.get('logged')
  }),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(Prescription)
