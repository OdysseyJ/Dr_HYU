const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/patient', ctrl.getAllPatientLogs)
router.get('/hospital', ctrl.getAllHospitalLogs)
router.get('/store', ctrl.getAllStoreLogs)

module.exports = router
