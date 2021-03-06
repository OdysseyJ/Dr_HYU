const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getAllPrescription)
router.post('/make', ctrl.makePrescription)
router.post('/update', ctrl.updatePrescription)

module.exports = router
