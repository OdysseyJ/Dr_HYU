const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getDefaultDrugstores)
router.post('/', ctrl.getDrugstores)

module.exports = router
