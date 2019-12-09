import axios from 'axios'

export const getNearHospitals = ({ lat, lng }) =>
  axios.post('http://54.180.31.234:4000/api/hospitalInfoService', { lat, lng })

export const getHospitalByName = ({ hname }) =>
  axios.get(
    `http://54.180.31.234:4000/api/hospitalInfoService/get?hname=${hname}`
  )
