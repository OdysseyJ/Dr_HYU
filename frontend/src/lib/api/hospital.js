import axios from 'axios'

export const getNearHospitals = ({ lat, lng }) =>
  axios.post('/api/hospitalInfoService', { lat, lng })
