import axios from 'axios'

export const getNearStores = ({ lat, lng }) =>
  axios.post('http://54.180.31.234:4000/api/storeInfoService', { lat, lng })

export const setPrescriptionPossible = ({ sname, ispossible }) => {
  return axios.post(
    'http://54.180.31.234:4000/api/storeInfoService/prescription',
    {
      sname,
      ispossible
    }
  )
}

export const getStoreByName = ({ sname }) => {
  return axios.get(
    `http://54.180.31.234:4000/api/storeInfoService/get?sname=${sname}`
  )
}
