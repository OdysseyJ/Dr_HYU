const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../../config/config.json')[env]
const crypto = require('crypto')

const { generateToken } = require(__dirname + '/../lib/token')

const db = {}

// 비밀번호 암호화 함수
function hash (password) {
  return crypto
    .createHmac('sha256', process.env.CRYPTO_KEY)
    .update(password)
    .digest('hex')
}

// db config 매칭.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

// db사용을 위한 라우팅.

db.Hospital = require('./hospital')(sequelize, Sequelize)
db.Store = require('./store')(sequelize, Sequelize)
db.User = require('./user')(sequelize, Sequelize)
db.Prescription = require('./prescription')(sequelize, Sequelize)
db.Reservation = require('./reservation')(sequelize, Sequelize)
db.Favorite = require('./favorite')(sequelize, Sequelize)
db.Log = require('./log')(sequelize, Sequelize)

// ************* class / instance methods = [User]

// 유저 등록해주는 class method
db.User.localRegister = ({
  usertype,
  name,
  phonenum,
  email,
  password,
  lat,
  lng
}) => {
  return db.User.create({
    id: null,
    usertype: usertype,
    name: name,
    phonenum: phonenum,
    email: email,
    password: hash(password),
    lat: lat,
    lng: lng
  })
}

// 이메일로 유저찾는 class method
db.User.findByEmail = function (email) {
  return db.User.findOne({
    where: { email: email }
  })
}

db.User.findByUsername = function (username) {
  // 객체에 내장되어있는 값을 사용 할 때는 객체명.키 이런식으로 쿼리하면 됩니다
  return db.User.findOne({ where: { name: username } })
}

db.User.prototype.validatePassword = function (password) {
  const hashed = hash(password)
  return this.password === hashed
}

db.User.prototype.validateUsertype = function (usertype) {
  return this.usertype === usertype
}

// 토큰 발급하는 instance method
db.User.prototype.generateToken = function () {
  // JWT에 담을 내용
  const payload = {
    _id: this._id,
    profile: this.profile
  }
  console.log('prototype', payload)
  return generateToken(payload, 'account')
}

// ************* static method = [User] 종료

// ************* class / instance methods = [Hospital]
db.Hospital.getAllHospitals = function () {
  return db.Hospital.findAll()
}
// ************* static method = [Hospital] 종료

// ************* class / instance methods = [Store]
db.Store.getAllStores = function () {
  return db.Store.findAll()
}
// ************* static method = [Store] 종료

// ************* class / instance methods = [Log]
db.Log.makeLog = function ({ type, time, prescription, uemail, hname, sname }) {
  return db.Log.create({
    type: type,
    time: time,
    prescription: prescription,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
}
// ************* static method = [Log] 종료

// ************* class / instance methods = [Reservation]
db.Reservation.makeReservation = ({ time, uemail, hname, sname }) => {
  return db.Reservation.create({
    time: time,
    uemail: uemail,
    hname: hname,
    sname: sname
  })
}

db.Reservation.deleteReservation = ({ id }) => {
  return db.Reservation.destroy({
    where: { id: id }
  })
}

db.Reservation.getPatientAllReservation = ({ uemail }) => {
  return db.Reservation.findAll({
    where: {
      uemail: uemail
    }
  })
}

db.Reservation.getHospitalAllReservation = ({ hname }) => {
  return db.Reservation.findAll({
    where: {
      hname: hname
    }
  })
}

db.Reservation.getStoreAllReservation = ({ sname }) => {
  return db.Reservation.findAll({
    where: {
      sname: sname
    }
  })
}
// ************* static method = [Reservation] 종료

// foreignkey 설정.
db.Prescription.belongsTo(db.User, {
  foreignKey: 'uemail',
  targetKey: 'email'
})

db.Reservation.belongsTo(db.User, { foreignKey: 'uemail', targetKey: 'email' })

db.Favorite.belongsTo(db.User, { foreignKey: 'uemail', targetKey: 'email' })

db.Log.belongsTo(db.User, { foreignKey: 'uemail', targetKey: 'email' })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
