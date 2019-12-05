const ctrl = {}
const db = require(__dirname + '/../../models')

ctrl.findUserInfo = async ctx => {
  const { email } = ctx.request.query
  const user = await db.User.findByEmail(email)
  ctx.body = user
  ctx.status = 200
}

module.exports = ctrl
