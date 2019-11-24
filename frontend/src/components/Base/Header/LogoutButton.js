import React, { Component } from 'react'
import styled from 'styled-components'
import oc from 'open-color'
import { shadow } from 'lib/styleUtils'

const BorderedButton = styled.button`
  font-weight: 600;
  color: ${oc.orange[6]};
  border: 1px solid ${oc.orange[6]};
  padding: 0.5rem;
  padding-bottom: 0.4rem;
  cursor: pointer;
  border-radius: 2px;
  text-decoration: none;
  transition: .2s all;

  &:hover {
    background: ${oc.orange[6]};
    color: white;
    ${shadow(1)};
  }

  &:active {
    /* 마우스 클릭시 아래로 미세하게 움직임 */
    transform: translateY(3px);
  }
`

const LogoutButton = ({ onClick }) => {
  return <BorderedButton onClick={onClick}>로그아웃</BorderedButton>
}

export default LogoutButton
