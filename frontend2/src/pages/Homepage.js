import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Homepage extends Component {
  render () {
    return (
      <div>
        <h1>Dr.HYU</h1>

        <Link to='/login/patient'>
          <button>환자 로그인</button>
        </Link>

        <Link to='/login/hospital'>
          <button>병원 로그인</button>
        </Link>

        <Link to='/login/store'>
          <button>상점 로그인</button>
        </Link>
      </div>
    )
  }
}

Homepage.propTypes = {}

export default Homepage
