import axios from 'axios'

export const getUserByEmail = ({ email }) =>
  axios.get(`/api/user/find?email=${email}`)
