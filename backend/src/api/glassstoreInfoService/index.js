const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/', ctrl.getDefaultGlassStores)

module.exports = router
