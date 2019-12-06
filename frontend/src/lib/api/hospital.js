import axios from 'axios'

export const getNearHospitals = ({ lat, lng }) =>
  axios.post('/api/hospitalInfoService', { lat, lng })

export const getHospitalByName = ({ hname }) =>
  axios.get(`/api/hospitalInfoService/get?hname=${hname}`)
