const ctrl = {}
const db = require(__dirname + '/../../models')

ctrl.getAllPrescription = async ctx => {
  const { uemail } = ctx.request.query
  const prescriptions = await db.Prescription.getAllPrescription({
    uemail: uemail
  })
  ctx.body = prescriptions
  ctx.status = 200
}

ctrl.makePrescription = async ctx => {
  const { prescription, uemail, hname, sname } = ctx.request.body
  await db.Prescription.makePrescription({
    prescription: prescription,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  ctx.body = 'ok'
  ctx.status = 200
}

module.exports = ctrl
