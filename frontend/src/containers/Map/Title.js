import React, { Component } from 'react'

class Title extends Component {
  render () {
    const { title } = this.props
    return (
      <div>
        <h1>Space</h1>
        <h1>
          {title}
        </h1>
      </div>
    )
  }
}

export default Title
