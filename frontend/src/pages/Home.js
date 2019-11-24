import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Patient, Hospital, Store, MapContainer } from 'pages'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from 'redux/modules/user'

class Home extends Component {
  render () {
    const { usertype } = this.props.loggedInfo.toJS()
    return (
      <div>
        {' '}{this.props.logged && usertype === 'patient'
          ? <Patient />
          : <div />}
        {this.props.logged && usertype === 'hospital' ? <Hospital /> : <div />}
        {this.props.logged && usertype === 'store' ? <Store /> : <div />}
        <Route exact path='/search/hospital' component={MapContainer} />
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
)(Home)
