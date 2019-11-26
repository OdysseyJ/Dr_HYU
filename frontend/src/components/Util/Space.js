import React from 'react'
import styled from 'styled-components'

const StyledSpace = height => {
  styled.div`
    padding-top: ${height}rem;
  `
}
const Space = function (props) {
  const { height } = props
  return <StyledSpace height={height} />
}

export default Space
