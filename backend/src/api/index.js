const Router = require('koa-router')
const router = new Router()

const drugstoreInfoService = require('./drugstoreInfoService')
const hospitalInfoService = require('./hospitalInfoService')
const hospital = require('./hospital')
const patient = require('./patient')
const store = require('./store')
const login = require('./login')

router.use('/drugstoreInfoService', drugstoreInfoService.routes())
router.use('/hospitalInfoService', hospitalInfoService.routes())
router.use('/hospital', hospital.routes())
router.use('/patient', patient.routes())
router.use('/store', store.routes())
router.use('/login', login.routes())

module.exports = router
