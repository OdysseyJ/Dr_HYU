const ctrl = {}
const request = require('request-promise-native')
const db = require(__dirname + '/../../models')
const cheerio = require('cheerio')
const iconvlite = require('iconv-lite')
const charset = require('charset') // 해당 사이트의 charset값을 알 수 있게 해준다.

function sleep (delay) {
  var start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

const { computeDistance } = require(__dirname + '/../../lib/computeDistance')

// 데이터 검증
const Joi = require('joi')

// 한양대 근처 5km내의 모든 병원 정보 DBMS에 저장.
ctrl.getDefaultDrugstores = async ctx => {
  ctx.body = 'test'
  const key = process.env.APIKEY
  const xpos = process.env.HYU_lng
  const ypos = process.env.HYU_lat
  const radius = 5000
  var pageNum = 1
  const numOfRows = 10
  for (var count = 0; count < 1; count++) {
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
    const store_arr = JSON.parse(response).response.body.items.item
    store_arr.map(async p => {
      await db.Store.create({
        name: p.yadmNm,
        numOfDoctors: p.sdrCnt,
        department: p.clCdNm,
        prescription: '확인중',
        lat: p.YPos,
        lng: p.XPos,
        address: p.addr,
        openTime: '00:00~24:00',
        openDay: '월,화,수,목,금'
      })
    })
  }
}

ctrl.getDefaultGlassStores = async ctx => {
  for (var sno = 2500; sno < 2900; sno += 10) {
    sleep(1000)
    const makeRequest = await request(
      {
        url:
          'http://nikon-lenswear.co.kr/assets/store-search-daum/com_list.php?sno=' +
          sno +
          '&location=default&tmptitle=&title_like=&isee=',
        encoding: null
      },
      async function (error, res, body) {
        const enc = charset(res.headers, body)
        const i_result = iconvlite.decode(body, enc)
        const $ = cheerio.load(i_result)
        let test = $('.list_row')

        for (var i = 0; i < 10; i++) {
          sleep(500)
          const title = test[i].children[1].children[0].data
          const address = test[i].children[3].children[0].data
          const splitAddress = address.split(' ')

          const keyword = `${splitAddress[0]} ${splitAddress[1]} ${splitAddress[2]} ${splitAddress[3]}`
          const APIKEY_KAKAORESTKEY = process.env.APIKEY_KAKAORESTKEY

          const GETGEOLOCATION_options = {
            uri: encodeURI(
              `https://dapi.kakao.com/v2/local/search/address.json?query=${keyword}`
            ),
            headers: {
              Authorization: `KakaoAK ${APIKEY_KAKAORESTKEY}`,
              'content-type': 'application/json'
            }
          }

          const response = await request(GETGEOLOCATION_options)
          const { documents, meta: { total_count } } = JSON.parse(response)
          if (total_count != 0) {
            const { address: { x, y } } = documents[0]
            await db.Store.create({
              name: title,
              department: '안경점',
              prescription: '확인중',
              lat: y,
              lng: x,
              address: address,
              openTime: '00:00~24:00',
              openDay: '월,화,수,목,금'
            })
          }
        }
      }
    )
  }
}

ctrl.getStores = async ctx => {
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
        'http://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList' +
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

    // Promise all인데 실패는 무시하는구문.
    await Promise.all(
      item
        .map(async p => {
          await db.Store.create({
            name: p.yadmNm,
            numOfDoctors: p.sdrCnt,
            department: p.clCdNm,
            prescription: '확인중',
            lat: p.YPos,
            lng: p.XPos,
            address: p.addr,
            openTime: '00:00~24:00',
            openDay: '월,화,수,목,금'
          })
        })
        .map(p => p.catch(e => e))
    )
  }

  const list = await db.Store.getAllStores()
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

ctrl.setPrescriptionPossible = async ctx => {
  const { sname, ispossible } = ctx.request.body
  await db.Store.setPrescriptionPossible({
    sname: sname,
    ispossible: ispossible
  })
  ctx.body = 'ok'
  ctx.status = 200
}

ctrl.getStoreByName = async ctx => {
  const { sname } = ctx.request.query
  console.log(sname)
  ctx.body = await db.Store.findByStoreName(sname)
  ctx.status = 200
}

module.exports = ctrl
