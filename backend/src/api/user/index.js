const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.get('/find', ctrl.findUserInfo)

module.exports = router
