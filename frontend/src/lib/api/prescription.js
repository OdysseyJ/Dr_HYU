import axios from 'axios'

export const makePrescription = ({
  prescriptiontype,
  prescription,
  uemail,
  hname,
  sname
}) =>
  axios.post('http://54.180.31.234:4000/api/prescription/make', {
    prescriptiontype,
    prescription,
    uemail,
    hname,
    sname
  })

export const getPrescriptions = ({ uemail }) =>
  axios.get(`http://54.180.31.234:4000/api/prescription?uemail=${uemail}`)

export const updatePrescription = ({
  prescriptiontype,
  prescriptionId,
  prescription,
  uemail,
  sname
}) =>
  axios.post('http://54.180.31.234:4000/api/prescription/update', {
    prescriptiontype,
    prescriptionId,
    prescription,
    uemail,
    sname
  })
