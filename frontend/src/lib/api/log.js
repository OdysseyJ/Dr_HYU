import axios from 'axios'

export const getPatientLog = ({ uemail }) =>
  axios.get(`http://54.180.31.234:4000/api/log/patient?uemail=${uemail}`)

export const getHospitalLog = ({ hname }) =>
  axios.get(`http://54.180.31.234:4000/api/log/hospital?hname=${hname}`)

export const getStoreLog = ({ sname }) =>
  axios.get(`http://54.180.31.234:4000/api/log/store?sname=${sname}`)
