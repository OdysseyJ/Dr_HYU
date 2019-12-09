import axios from 'axios'

export const makeFavorite = ({ uemail, hname, sname }) =>
  axios.post('http://54.180.31.234:4000/api/favorite/make', {
    uemail,
    hname,
    sname
  })

export const deleteFavorite = ({ uemail, hname, sname }) =>
  axios.post('http://54.180.31.234:4000/api/favorite/delete', {
    uemail,
    hname,
    sname
  })

export const getFavorites = ({ uemail }) =>
  axios.get(`http://54.180.31.234:4000/api/favorite?uemail=${uemail}`)

export const isExists = ({ uemail, hname, sname }) =>
  axios.get(
    `http://54.180.31.234:4000/api/favorite/exists?uemail=${uemail}&hname=${hname}&sname=${sname}`
  )
