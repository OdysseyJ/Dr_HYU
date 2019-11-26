import React, { Component } from 'react'
import { GoogleMapComponent, Title, SelectOptions } from '../containers/Map'

class Map extends Component {
  render () {
    return (
      <div>
        <Title title='병원 검색하기' />
        <GoogleMapComponent type='hospital' />
        <SelectOptions type='hospital' />
      </div>
    )
  }
}

export default Map
