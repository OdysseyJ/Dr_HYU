import axios from 'axios'

export const makeFavorite = ({ uemail, hname, sname }) =>
  axios.post('/api/favorite/make', { uemail, hname, sname })

export const deleteFavorite = ({ uemail, hname, sname }) =>
  axios.post('/api/favorite/delete', { uemail, hname, sname })

export const getFavorites = ({ uemail }) =>
  axios.get(`/api/favorite?uemail=${uemail}`)
  
export const isExists = ({ uemail, hname, sname }) =>
  axios.get(
    `/api/favorite/exists?uemail=${uemail}&hname=${hname}&sname=${sname}`
  )
