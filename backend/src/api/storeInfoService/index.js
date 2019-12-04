const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/drugstore', ctrl.getDefaultDrugstores)
router.get('/glassstore', ctrl.getDefaultGlassStores)
router.post('/', ctrl.getStores)

module.exports = router
