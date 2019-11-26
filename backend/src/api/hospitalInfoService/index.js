const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getDefaultHospitals)
router.post('/', ctrl.getHospitals)
router.post('/option', ctrl.getHospitals)

module.exports = router
