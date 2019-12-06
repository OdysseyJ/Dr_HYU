const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/drugstore', ctrl.getDefaultDrugstores)
router.get('/glassstore', ctrl.getDefaultGlassStores)
router.get('/get', ctrl.getStoreByName)
router.post('/prescription', ctrl.setPrescriptionPossible)
router.post('/', ctrl.getStores)

module.exports = router
