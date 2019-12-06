import axios from 'axios'

export const makePrescription = ({
  prescriptiontype,
  prescription,
  uemail,
  hname,
  sname
}) =>
  axios.post('/api/prescription/make', {
    prescriptiontype,
    prescription,
    uemail,
    hname,
    sname
  })

export const getPrescriptions = ({ uemail }) =>
  axios.get(`/api/prescription?uemail=${uemail}`)

export const updatePrescription = ({
  prescriptiontype,
  prescriptionId,
  prescription,
  uemail,
  sname
}) =>
  axios.post('/api/prescription/update', {
    prescriptiontype,
    prescriptionId,
    prescription,
    uemail,
    sname
  })
