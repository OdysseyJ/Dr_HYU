const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.post('/make', ctrl.postreservation)
router.post('/delete', ctrl.deletereservation)
router.get('/', ctrl.getreservations)

module.exports = router
