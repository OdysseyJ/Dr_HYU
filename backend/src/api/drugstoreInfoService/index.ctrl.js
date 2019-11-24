const ctrl = {}
const request = require('request-promise-native')
const db = require(__dirname + '/../../models')

// 한양대 근처 5km내의 모든 병원 정보 DBMS에 저장.
ctrl.getDefaultDrugstore = async ctx => {
  ctx.body = 'test'
  const key = process.env.APIKEY
  const xpos = process.env.HYU_lng
  const ypos = process.env.HYU_lat
  const radius = 5000
  const options = {
    uri:
      'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList' +
      '?ServiceKey=' +
      key +
      '&xPos=' +
      xpos +
      '&yPos=' +
      ypos +
      '&radius=' +
      radius +
      '&_type=json'
  }
  const response = await request(options)
  const totalCount = JSON.parse(response).response.body.totalCount
  console.log(totalCount)
  var pageNum = 1
  const numOfRows = 10
  for (var count = 0; count < totalCount; count += numOfRows) {
    const options = {
      uri:
        'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList' +
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
    const drugstore_arr = JSON.parse(response).response.body.items.item
    drugstore_arr.map(async p => {
      console.log(p.yadmNm)
      await db.Drugstore.create({
        name: p.yadmNm,
        department: p.clCdNm,
        lat: p.XPos,
        lng: p.YPos,
        address: p.addr,
        openTime: '09:00~18:00',
        openDay: '월,화,수,목,금'
      })
    })
  }
}

ctrl.getDrugstores = async ctx => {
  const key = process.env.APIKEY
  const xpos = ctx.xpos
  const ypos = ctx.ypos
  const radius = 5000
  const options = {
    uri:
      'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList' +
      '?ServiceKey=' +
      key +
      '&xPos=' +
      xpos +
      '&yPos=' +
      ypos +
      '&radius=' +
      radius +
      '&_type=json'
  }
  const response = await request(options)
  const totalCount = JSON.parse(response).response.body.totalCount
  console.log(totalCount)
  var pageNum = 1
  const numOfRows = 10
  for (var count = 0; count < totalCount; count += numOfRows) {
    const options = {
      uri:
        'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList' +
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
    const drugstore_arr = JSON.parse(response).response.body.items.item
    drugstore_arr.map(async p => {
      console.log(p.yadmNm)
      await db.Drugstore.create({
        name: p.yadmNm,
        department: p.clCdNm,
        lat: p.XPos,
        lng: p.YPos,
        address: p.addr,
        openTime: '09:00~18:00',
        openDay: '월,화,수,목,금'
      })
    })
  }
}

module.exports = ctrl
