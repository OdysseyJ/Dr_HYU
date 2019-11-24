const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.post('/register/local', ctrl.localRegister)
router.post('/local', ctrl.localLogin)
router.get('/exists/:key(email|name)/:value', ctrl.exists)
router.post('/logout', ctrl.logout)
router.get('/check', ctrl.check)

module.exports = router
