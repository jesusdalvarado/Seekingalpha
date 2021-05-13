const xRapidApiKey = PropertiesService.getScriptProperties().getProperty('apiKey')
const xRapidApiHost = 'seeking-alpha.p.rapidapi.com'

function getNewsList(ticker='aapl', numNews = 5) {
  const options = {
    method: 'GET',
    params: {id: ticker, size: `${numNews}`},
    headers: {
      'x-rapidapi-key': xRapidApiKey,
      'x-rapidapi-host': xRapidApiHost
    },
    muteHttpExceptions: true
  }
  let titlesDates = []
  console.log('---REQUEST to API---')
  wait(210)
  let response = UrlFetchApp.fetch(`https://seeking-alpha.p.rapidapi.com/news/list?id=${ticker}&size=${numNews}`, options)
  let json = response.getContentText()

  if (json.includes("You have exceeded")) {
    console.log('ERROR quota limit reached', json)
    return 'ERROR quota limit reached'
  }

  let data = JSON.parse(json).data
  data.forEach(news => {
    titlesDates.push({publishOn: news.attributes['publishOn'], title: news.attributes['title']})
  })
  return titlesDates
}

function wait(ms) {
  const end = Date.now() + ms
  while (Date.now() < end) continue
}

async function getFormattedNews(tickers=['aapl', 'den', 'glt'], numNews=5, day1='2021-04-23', day2='2021-03-11') {
  let filteredTitlesDates = null
  let filteredTitlesDatesArr = []

  for(let i=0; i<tickers.length; i++) {
    let titlesDates = await getNewsList(tickers[i], numNews)
    if (titlesDates === 'ERROR quota limit reached') {
      return 'ERROR quota limit reached.'
    }
    if (titlesDates === 'ERROR quota limit reached') { rateLimitReached = true }
    console.log(titlesDates, '---Before filtering---')
    filteredTitlesDates = filterNewsByDates(titlesDates, day1, day2)
    console.log(filteredTitlesDates, '---Filtered by Dates---')
    filteredTitlesDates = filterNewsByKeywords(filteredTitlesDates)
    console.log(filteredTitlesDates, '---Filtered by Keywords---')
    filteredTitlesDates.forEach((el) => {
      filteredTitlesDatesArr.push( { 'ticker': tickers[i].toUpperCase(),'title':el['title'],'publishOn': el['publishOn'] } )
    })
  }

  return filteredTitlesDatesArr
}

function filterNewsByDates(titlesDates, day1, day2) {
  let date = null
  let filteredNewsByDate = []

  titlesDates.forEach((news) => {
    date = new Date(news['publishOn'])

    let year = date.getFullYear().toString()
    let month = (date.getMonth()+1).toString()
    let day = date.getDate().toString()
    if (month.length===1) {
      month = '0' + month
    }
    if (day.length===1) {
      day = '0' + day
    }

    let formattedDate = year + '-' + month + '-' + day

    if (formattedDate===day1 || formattedDate===day2) {
      filteredNewsByDate.push(news)
    }

  })

  return filteredNewsByDate
}

function filterNewsByKeywords(titlesDates) {
  const keywords = ['EPS', 'preliminary','prelim','pre','revenue','beats','miss','misses','earning','preview','prerelease','report','results','Q1','Q2','Q3','Q4','FQ1','FQ2','FQ3','FQ4']
  let filteredByKeywords = []
  let re = null

  titlesDates.forEach((news) => {
    for (let i=0; i<keywords.length; i++) {

      re = new RegExp(keywords[i], 'i');
      if ( news['title'].match(re) ) {
        filteredByKeywords.push(news)
        break
      }
    }

  })

  return filteredByKeywords
}

function properties() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('apiKey')
  PropertiesService.getScriptProperties().setProperty('apiKey', 'value')
  PropertiesService.getScriptProperties().deleteAllProperties()
}

function formatDate(dateTime) {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js').getContentText())
  var dateString = moment(dateTime).format('YYYY-MM-DD')
  return dateString
}

function importModuleExample() {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js').getContentText())
  var date = moment().format('MMM Do YY')
  Logger.log(date)
}



