import axios from 'axios'

export const checkEmailExists = email =>
  axios.get('http://54.180.31.234:4000/api/login/exists/email/' + email)
export const checkHospitalExists = hname =>
  axios.get('http://54.180.31.234:4000/api/login/exists/hname/' + hname)
export const checkStoreExists = sname =>
  axios.get('http://54.180.31.234:4000/api/login/exists/sname/' + sname)

export const localLogin = ({ email, password }) =>
  axios.post('http://54.180.31.234:4000/api/login/local', { email, password })

export const localRegister = ({
  usertype,
  email,
  name,
  phonenum,
  password,
  lat,
  lng
}) => {
  return axios.post('http://54.180.31.234:4000/api/login/register/local', {
    usertype,
    email,
    name,
    phonenum,
    password,
    lat,
    lng
  })
}

export const checkStatus = () => axios.get('/api/login/check')
export const logout = () => {
  console.log('logout')
  axios.post('/api/login/logout')
}
