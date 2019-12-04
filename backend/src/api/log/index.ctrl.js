const ctrl = {}
const db = require(__dirname + '/../../models')

ctrl.getAllPatientLogs = async ctx => {
  const { uemail } = ctx.request.query
  const patientLogs = await db.Log.getAllPatientLogs({ uemail: uemail })
  ctx.status = 200
  ctx.body = patientLogs
}

ctrl.getAllHospitalLogs = async ctx => {
  const { hname } = ctx.request.query
  const hospitalLogs = await db.Log.getAllHospitalLogs({ hname: hname })
  ctx.status = 200
  ctx.body = hospitalLogs
}

ctrl.getAllStoreLogs = async ctx => {
  const { sname } = ctx.request.query
  const storeLogs = await db.Log.getAllStoreLogs({ sname: sname })
  ctx.status = 200
  ctx.body = storeLogs
}

module.exports = ctrl
