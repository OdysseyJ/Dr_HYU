const ctrl = {}
const db = require(__dirname + '/../../models')

ctrl.postreservation = async ctx => {
  const { time, uemail, sname, hname } = ctx.request.body
  console.log(ctx.request.body)
  await db.Reservation.makeReservation({
    time: time,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  await db.Log.makeLog({
    type: 'reservation',
    time: time,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  ctx.status = 200
  ctx.body = 'ok'
}

ctrl.deletereservation = async ctx => {
  const { id } = ctx.request.body
  await db.Reservation.deleteReservation({
    id: id
  })
  ctx.status = 200
  ctx.body = 'ok'
}

ctrl.getreservations = async ctx => {
  const { usertype, name } = ctx.request.query
  let reservations
  if (usertype === 'patient') {
    reservations = await db.Reservation.getPatientAllReservation({
      uemail: name
    })
  } else if (usertype === 'hospital') {
    reservations = await db.Reservation.getHospitalAllReservation({
      hname: name
    })
  } else if (usertype === 'store') {
    reservations = await db.Reservation.getStoreAllReservation({ sname: name })
  }
  const reservationsArr = reservations.map(p => {
    return p.dataValues
  })

  ctx.body = reservationsArr
  console.log(ctx.body)
  ctx.status = 200
}

module.exports = ctrl
