import axios from 'axios'

export const makePrescription = ({ prescription, uemail, hname, sname }) =>
  axios.post('/api/prescription/make', { prescription, uemail, hname, sname })

export const getPrescriptions = ({ uemail }) =>
  axios.get(`/api/prescription?uemail=${uemail}`)
