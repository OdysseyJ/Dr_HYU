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
  const {
    prescriptiontype,
    prescription,
    uemail,
    hname,
    sname
  } = ctx.request.body
  await db.Prescription.makePrescription({
    prescriptiontype: prescriptiontype,
    prescription: prescription,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  await db.Log.makeLog({
    logtype: 'prescription',
    prescriptiontype: prescriptiontype,
    prescription: prescription,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  ctx.body = 'ok'
  ctx.status = 200
}

ctrl.updatePrescription = async ctx => {
  const {
    prescriptiontype,
    prescriptionId,
    prescription,
    uemail,
    sname
  } = ctx.request.body
  await db.Prescription.updateById({
    prescriptionId: prescriptionId,
    prescription: prescription,
    sname: sname
  })
  await db.Log.makeLog({
    logtype: 'prescription',
    prescriptiontype: prescriptiontype,
    prescription: prescription,
    uemail: uemail,
    hname: null,
    sname: sname
  })
  ctx.body = 'ok'
  ctx.status = 200
}

module.exports = ctrl
