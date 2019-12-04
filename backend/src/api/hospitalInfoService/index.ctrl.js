const ctrl = {}
const request = require('request-promise-native')
const db = require(__dirname + '/../../models')
const { computeDistance } = require(__dirname + '/../../lib/computeDistance')

// 데이터 검증
const Joi = require('joi')

// 한양대 근처 5km내의 모든 병원 정보 DBMS에 저장.
ctrl.getDefaultHospitals = async ctx => {
  const key = process.env.APIKEY
  const xpos = process.env.HYU_lng
  const ypos = process.env.HYU_lat
  const radius = 5000
  var pageNum = 1
  const numOfRows = 10
  for (var count = 0; count < 1; count++) {
    const options = {
      uri:
        'http://apis.data.go.kr/B551182/hospInfoService/getHospBasisList' +
        '?ServiceKey=' +
        key +
        '&pageNo=' +
        pageNum +
        '&numOfRows' +
        numOfRows +
        '&xPos=' +
        xpos +
        '&yPos=' +
        ypos +
        '&radius=' +
        radius +
        '&_type=json'
    }

    pageNum++
    const response = await request(options)
    const hospital_arr = JSON.parse(response).response.body.items.item
    hospital_arr.map(async p => {
      await db.Hospital.create({
        name: p.yadmNm,
        numOfDoctors: p.sdrCnt,
        department: p.clCdNm,
        lat: p.YPos,
        lng: p.XPos,
        address: p.addr,
        openTime: '09:00~18:00',
        openDay: '월,화,수,목,금'
      })
    })
  }
}

// body로 위도와 경도를 받아서
// 한양대로부터 3km이상 떨어진 곳에서 요청이 들어오면 해당 요청지를 기준으로
// 3km 반경의 병원 리스트를 얻어서 db에 중복검사후 추가
//
ctrl.getHospitals = async ctx => {
  // 스키마 만들기
  const schema = Joi.object().keys({
    lat: Joi.required(),
    lng: Joi.required()
  })

  // 스키마 검증
  const result = Joi.validate(ctx.request.body, schema)

  // 스키마 검증 실패
  if (result.error) {
    ctx.status = 400
    return
  }

  const { lat, lng } = ctx.request.body
  const key = process.env.APIKEY
  const HYU_lng = process.env.HYU_lng
  const HYU_lat = process.env.HYU_lat
  const MAX_DISTANCE = process.env.MAX_DISTANCE

  const distance = computeDistance(
    { latitude: lat, longitude: lng },
    { latitude: HYU_lat, longitude: HYU_lng }
  )

  if (distance > MAX_DISTANCE) {
    // 해당 위치를 기반으로 API 요청하기. await사용.
    var pageNum = 1
    const numOfRows = 10
    const options = {
      uri:
        'http://apis.data.go.kr/B551182/hospInfoService/getHospBasisList' +
        '?ServiceKey=' +
        key +
        '&pageNo=' +
        pageNum +
        '&numOfRows' +
        numOfRows +
        '&xPos=' +
        lng +
        '&yPos=' +
        lat +
        '&radius=' +
        MAX_DISTANCE * 1000 +
        '&_type=json'
    }
    const response = await request(options)
    const totalCount = JSON.parse(response).response.body.totalCount

    if (totalCount === 0) {
      ctx.status = 200
      ctx.body = {}
      return
    }

    const { items: { item } } = JSON.parse(response).response.body
    item.map(async p => {
      await db.Hospital.create({
        name: p.yadmNm,
        numOfDoctors: p.sdrCnt,
        department: p.clCdNm,
        lat: p.YPos,
        lng: p.XPos,
        address: p.addr,
        openTime: '09:00~18:00',
        openDay: '월,화,수,목,금'
      })
    })
  }

  const list = await db.Hospital.getAllHospitals()
  const validlist = list
    .filter(p => {
      const distance = computeDistance(
        { latitude: lat, longitude: lng },
        { latitude: p.lat, longitude: p.lng }
      )
      if (distance < MAX_DISTANCE) return p
    })
    .map(p => {
      return p.dataValues
    })

  if (validlist === null) {
    ctx.status = 200
    ctx.body = {}
  } else {
    ctx.status = 200
    ctx.body = validlist
  }
}

module.exports = ctrl
