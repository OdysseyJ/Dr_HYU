import React, { Component } from 'react'
import { StyledLink, StyledButton } from 'components/Util'

class Buttons extends Component {
  render () {
    return (
      <div>
        <StyledLink to='/'>돌아가기</StyledLink>
        <StyledButton onClick={this.props.handleComplete}>처방완료</StyledButton>
      </div>
    )
  }
}

export default Buttons
