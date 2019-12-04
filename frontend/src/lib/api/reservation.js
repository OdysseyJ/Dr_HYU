import axios from 'axios'

export const makeReservation = ({ time, uemail, hname, sname }) =>
  axios.post('/api/reservation/make', { time, uemail, hname, sname })

export const deleteReservation = ({ id }) =>
  axios.post('/api/reservation/delete', { id })

export const getReservations = ({ usertype, name }) =>
  axios.get(`/api/reservation?usertype=${usertype}&name=${name}`)

export const isExists = ({ uemail, hname, sname }) =>
  axios.get(`/api/reservation?uemail=${uemail}&hname=${hname}&sname=${sname}`)
