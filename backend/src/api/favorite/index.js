const Router = require('koa-router')
const router = new Router()

const ctrl = require('./index.ctrl')

router.post('/make', ctrl.makeFavorite)
router.post('/delete', ctrl.deleteFavorite)
router.get('/exists', ctrl.exists)
router.get('/', ctrl.getFavorites)

module.exports = router
