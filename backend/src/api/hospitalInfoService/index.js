const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getDefaultHospitals)
router.get('/get', ctrl.getHospitalByName)
router.post('/', ctrl.getHospitals)

module.exports = router
