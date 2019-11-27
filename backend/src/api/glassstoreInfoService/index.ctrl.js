const ctrl = {}
const cheerio = require('cheerio')
const request = require('request')
const iconvlite = require('iconv-lite')
const charset = require('charset') // 해당 사이트의 charset값을 알 수 있게 해준다.

ctrl.getDefaultGlassStores = async ctx => {
  // for (var sno = 2500; sno < 2700; sno += 10) {
  //   const makeRequest = await request(
  //     {
  //       url:
  //         'http://nikon-lenswear.co.kr/assets/store-search-daum/com_list.php?sno=' +
  //         sno +
  //         '&location=default&tmptitle=&title_like=&isee=',
  //       encoding: null
  //     },
  //     function (error, res, body) {
  //       const enc = charset(res.headers, body)
  //       const i_result = iconvlite.decode(body, enc)
  //       const $ = cheerio.load(i_result)
  //       let test = $('.list_row')
  //       let dataArr = []
  //       for (var i = 0; i < 10; i++) {
  //         const title = test[i].children[1].children[0].data
  //         const address = test[i].children[3].children[0].data
  //         dataArr.push({ title: title, address: address })
  //         console.log(title)
  //         console.log(address)
  //       }
  //     }
  //   )
  //   console.log(makeRequest)
  // }

  const makeRequest = await request(
    {
      url:
        'http://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=10&keyword=' +
        iconvlite.encode('강서로7길', 'utf-8') +
        '&confmKey=TESTJUSOGOKR&resultType=json',
      encoding: 'utf-8'
    },
    function (error, res, body) {
      console.log(res)
    }
  )
}

module.exports = ctrl
