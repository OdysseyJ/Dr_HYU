import axios from 'axios'

export const makeReservation = ({ time, uemail, hname, sname }) =>
  axios.post('http://54.180.31.234:4000/api/reservation/make', {
    time,
    uemail,
    hname,
    sname
  })

export const deleteReservation = ({ id }) =>
  axios.post('http://54.180.31.234:4000/api/reservation/delete', { id })

export const getReservations = ({ usertype, name }) =>
  axios.get(
    `http://54.180.31.234:4000/api/reservation?usertype=${usertype}&name=${name}`
  )
