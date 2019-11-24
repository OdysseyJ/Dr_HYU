const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getDefaultDrugstore)

// router.post('/', ctrl.getDrugstores)

module.exports = router
