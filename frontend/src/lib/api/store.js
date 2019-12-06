import axios from 'axios'

export const getNearStores = ({ lat, lng }) =>
  axios.post('/api/storeInfoService', { lat, lng })

export const setPrescriptionPossible = ({ sname, ispossible }) => {
  return axios.post('/api/storeInfoService/prescription', {
    sname,
    ispossible
  })
}

export const getStoreByName = ({ sname }) => {
  return axios.get(`/api/storeInfoService/get?sname=${sname}`)
}
