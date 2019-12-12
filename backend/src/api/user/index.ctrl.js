const ctrl = {}
const db = require(__dirname + '/../../models')
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const csv = fs.readFileSync(__dirname + '/../../../csv/customers.csv')
const records = parse(csv.toString('utf-8'))

ctrl.findUserInfo = async ctx => {
  const { email } = ctx.request.query
  const user = await db.User.findByEmail(email)
  ctx.body = user
  ctx.status = 200
}

ctrl.getDefaultUserInfo = async ctx => {
  records.map(p => {
    const [name, phonenum, email, password, lat, lng] = [
      p[0],
      p[1],
      p[3],
      p[4],
      p[6],
      p[7]
    ]
    db.User.localRegister({
      usertype: 'patient',
      name: name,
      phonenum: phonenum,
      email: email,
      password: password,
      lat: lat,
      lng: lng
    })
  })

  ctx.status = 200
  ctx.body = 'test'
}

module.exports = ctrl
