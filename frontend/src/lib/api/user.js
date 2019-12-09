import axios from 'axios'

export const getUserByEmail = ({ email }) =>
  axios.get(`http://54.180.31.234:4000/api/user/find?email=${email}`)
