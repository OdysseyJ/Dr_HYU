import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Map from './Map'
import {
  Homepage,
  Loginpage,
  Patientpage,
  Hospitalpage,
  Storepage
} from '../pages'

const Root = ({ store }) =>
  <Provider store={store}>
    <Router>
      <Route exact path='/' component={Homepage} />
      <Route path='/login/:type' component={Loginpage} />
      <Route path='/map' component={Map} />
      <Route path='/patient' component={Patientpage} />
      <Route path='/store' component={Storepage} />
      <Route path='/hospital' component={Hospitalpage} />
    </Router>
  </Provider>

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
