import axios from 'axios'

export const getNearHospitals = ({ lat, lng }) =>
  axios.post('/api/hospitalInfoService', { lat, lng })

// export const checkUsernameExists = username =>
//   axios.get('/api/login/exists/name/' + username)
