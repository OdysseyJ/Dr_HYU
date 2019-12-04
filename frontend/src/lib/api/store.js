import axios from 'axios'

export const getNearStores = ({ lat, lng }) =>
  axios.post('/api/storeInfoService', { lat, lng })
