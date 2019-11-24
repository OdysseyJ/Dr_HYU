import React from 'react'
import styled from 'styled-components'
import oc from 'open-color'

const Label = styled.div`
  font-size: 1rem;
  color: ${oc.gray[6]};
  margin-top: 1rem;
  margin-bottom: 0.25rem;
`

class Geoloc extends React.Component {
  render () {
    return !this.props.isGeolocationAvailable
      ? <Label>Your browser does not support Geolocation</Label>
      : !this.props.isGeolocationEnabled
        ? <Label>Geolocation is enabled</Label>
        : this.props.coords
          ? <div>
            <Label>현재위치</Label>
            <Label>
                longitude {this.props.coords.longitude}
            </Label>
            <Label>
                latitude {this.props.coords.latitude}
            </Label>
          </div>
          : <Label>Getting the location data</Label>
  }
}

export default Geoloc
