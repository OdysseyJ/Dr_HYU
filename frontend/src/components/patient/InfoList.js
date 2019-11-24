import React from 'react'
import styled from 'styled-components'
import { fontFamily, fontSize, gray2, accent1, gray5, gray1 } from './styles'

const Container = styled.div`
  width: 400px;
  margin: 30px auto;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  color: ${gray2};

  @media (max-width: 400px) {
    width: 100%;
  }
`

const List = styled.ul`
  list-style: none;
  padding: 0px 20px;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: 3px solid ${accent1};
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
`

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  border-top: 1px solid ${gray5};
  :first-child {
    border-top: none;
  }
`

const Title = styled.span`
  font-size: 18px;
  color: ${gray1};
  margin-bottom: 5px;
`

const InfoList = posts =>
  <Container>
    <List>
      {/* {posts.map(({ id, title, body }) =>
        <ListItem key={id}>
          <Title>
            {title}
          </Title>
          <span>
            {body}
          </span>
        </ListItem>
      )} */}
    </List>
  </Container>

export default InfoList
