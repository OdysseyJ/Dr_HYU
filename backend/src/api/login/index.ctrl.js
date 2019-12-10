const ctrl = {}
const db = require(__dirname + '/../../models')

// 데이터 형식 검증을 위해
const Joi = require('joi')

ctrl.localRegister = async ctx => {
  // 스키마 만들기
  const schema = Joi.object().keys({
    usertype: Joi.string().required(),
    name: Joi.string().min(3).max(20).required(),
    phonenum: Joi.string().min(11).required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
    lat: Joi.number().required(),
    lng: Joi.number().required()
  })
  // 스키마 검증
  const result = Joi.validate(ctx.request.body, schema)

  // 스키마 검증 실패
  if (result.error) {
    ctx.status = 400
    return
  }

  // 중복 검사.
  let existing = null
  try {
    existing = await db.User.findByEmail(ctx.request.body.email)
  } catch (e) {
    ctx.throw(500, e)
  }

  // Conflict처리
  if (existing) {
    // 이메일이 중복되는 경우
    ctx.status = 409
    // 중복되는 이메일 알려주기
    ctx.body = {
      key: existing.email
    }
    return
  }

  // 계정 생성
  let account = null
  try {
    account = await db.User.localRegister(ctx.request.body)
  } catch (e) {
    ctx.throw(500, e)
  }

  // JWT 생성
  let token = null
  try {
    token = await account.generateToken()
  } catch (e) {
    console.log('dhodkseo')
    console.log(process.env.JWT_SECRET)
    console.log('토큰발급실패')
    ctx.throw(500, e)
  }

  // 쿠키에 JWT싣기
  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
  // 프로필 정보로 응답.
  ctx.body = account
}

// 로그인 콜백
ctrl.localLogin = async ctx => {
  // 인풋 유효한지 처리.
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  const result = Joi.validate(ctx.request.body, schema)

  if (result.error) {
    ctx.status = 400
  }

  const { email, password } = ctx.request.body

  let account = null

  try {
    account = await db.User.findByEmail(email)
  } catch (e) {
    ctx.throw(500, e)
  }

  if (!account || !account.validatePassword(password)) {
    // Forbidden
    ctx.status = 403
  }

  // JWT 생성
  let token = null
  try {
    token = await account.generateToken()
  } catch (e) {
    ctx.throw(500, e)
  }

  // JWT 쿠키에 싣기
  ctx.cookies.set('access_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  })

  ctx.body = account
}

ctrl.logout = async ctx => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true
  })
  ctx.status = 204
}

ctrl.exists = async ctx => {
  const { key, value } = ctx.params
  let account = null

  try {
    if (key === 'email') {
      account = await db.User.findByEmail(value)
    } else if (key === 'hname') {
      account = await db.Hospital.findByHospitalName(value)
    } else if (key === 'sname') {
      account = await db.Store.findByStoreName(value)
    }
  } catch (e) {
    ctx.throw(500, e)
  }

  ctx.body = {
    exists: account !== null
  }
}

ctrl.check = ctx => {
  const { user } = ctx.request

  if (!user) {
    ctx.status = 403
    return
  }

  ctx.body = user
}

module.exports = ctrl
