import axios from 'axios'

export const getNearHospitals = ({ lat, lng }) =>
  axios.post('/api/hospitalInfoService', { lat, lng })

export const getNearDrugstores = ({ lat, lng }) =>
  axios.post('/api/drugstoreInfoService', { lat, lng })
