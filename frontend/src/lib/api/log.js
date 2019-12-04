import axios from 'axios'

export const getPatientLog = ({ uemail }) =>
  axios.get(`/api/log/patient?uemail=${uemail}`)

export const getHospitalLog = ({ hname }) =>
  axios.get(`/api/log/hospital?hname=${hname}`)

export const getReservations = ({ sname }) =>
  axios.get(`/api/log/store?sname=${sname}`)
