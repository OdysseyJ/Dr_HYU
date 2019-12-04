const Router = require('koa-router')
const router = new Router()

const storeInfoService = require('./storeInfoService')
const hospitalInfoService = require('./hospitalInfoService')
const prescription = require('./prescription')
const reservation = require('./reservation')
const favorite = require('./favorite')
const login = require('./login')

router.use('/storeInfoService', storeInfoService.routes())
router.use('/hospitalInfoService', hospitalInfoService.routes())
router.use('/prescription', prescription.routes())
router.use('/reservation', reservation.routes())
router.use('/favorite', favorite.routes())
router.use('/login', login.routes())

module.exports = router
