const Koa = require('koa')
const Router = require('koa-router')
const dotenv = require('dotenv')
const { jwtMiddleware } = require('./lib/token')
const db = require('./models')
const serve = require('koa-static')
const send = require('koa-send')

// request body 접근용.
const bodyParser = require('koa-bodyparser')

dotenv.config()
db.sequelize.sync()

const port = process.env.PORT

const app = new Koa()
const router = new Router()
const api = require('./api')

router.use('/api', api.routes()) // api 라우트를 /api 경로 하위 라우트로 설정

// request를 쉽게쓰기 위한 작업.
app.use(bodyParser())

// 정적 파일
app.use(serve(__dirname + '/../' + '/build'))
app.use(async ctx => {
  if (ctx.status === 404) {
    await send(ctx, 'index.html', { root: __dirname + '/../' + '/build' })
  }
})

// for jwt
app.use(jwtMiddleware)

// 라우터 라우팅
app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log('server is listening to port ' + port)
})
