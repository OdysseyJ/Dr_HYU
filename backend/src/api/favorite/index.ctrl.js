const ctrl = {}
const db = require(__dirname + '/../../models')

ctrl.makeFavorite = async ctx => {
  const { uemail, sname, hname } = ctx.request.body
  console.log(ctx.request.body)
  await db.Favorite.makeFavorite({
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  ctx.status = 200
  ctx.body = 'ok'
}

ctrl.deleteFavorite = async ctx => {
  const { uemail, sname, hname } = ctx.request.body
  await db.Favorite.deleteFavorite({
    uemail: uemail,
    hname: hname,
    sname: sname
  })
  ctx.status = 200
  ctx.body = 'ok'
}

ctrl.getFavorites = async ctx => {
  const { uemail } = ctx.request.query

  const reservations = await db.Favorite.getPatientAllFavorite({
    uemail: uemail
  })

  const reservationsArr = reservations.map(p => {
    return p.dataValues
  })

  ctx.body = reservationsArr
  ctx.status = 200
}

ctrl.exists = async ctx => {
  const { uemail, hname, sname } = ctx.request.query

  const reservations = await db.Favorite.findFavorite({
    uemail: uemail,
    hname: hname,
    sname: sname
  })

  if (reservations === null) {
    ctx.body = false
    ctx.status = 404
  } else {
    ctx.body = true
    ctx.status = 200
  }
}

module.exports = ctrl
