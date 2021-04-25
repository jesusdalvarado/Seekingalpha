
const xRapidApiKey = '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051'
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
  console.log('---REQUEST---')
  wait(210) // delay to avoid rate limits
  let response = UrlFetchApp.fetch(`https://seeking-alpha.p.rapidapi.com/news/list?id=${ticker}&size=${numNews}`, options)
  let json = response.getContentText()
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

async function getFormattedNews(tickers=['aapl', 'den', 'glt'], numNews=5, lastDateOfInteres='2021-04-23', prevDateOfInteres='2021-03-11') {
  // const numNews = 5                        // Limit number of news per ticker
  // const tickers = ['aapl', 'den', 'glt']   // Tickers obtained from Finviz
  // const lastDateOfInteres = '2021-03-12'
  // const prevDateOfInteres = '2021-03-11'
  let filteredTitlesDates = null
  let filteredTitlesDatesArr = []
  await tickers.forEach(async (ticker) => {
    let titlesDates = await getNewsList(ticker, numNews)
    console.log(titlesDates, '---Before filtering---')
    // Applying filters
    filteredTitlesDates = filterNewsByDates(titlesDates, lastDateOfInteres, prevDateOfInteres)
    console.log(filteredTitlesDates, '---Filtered by Dates---')
    filteredTitlesDates = filterNewsByKeywords(filteredTitlesDates)
    console.log(filteredTitlesDates, '---Filtered by Keywords---')
    filteredTitlesDates.forEach((el) => {
      filteredTitlesDatesArr.push( { 'ticker': ticker.toUpperCase(),'title':el['title'],'publishOn': el['publishOn'] } )
    })
  })

  return filteredTitlesDatesArr
}

function filterNewsByDates(titlesDates, lastDateOfInteres, prevDateOfInteres) {
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

    if (formattedDate===lastDateOfInteres || formattedDate===prevDateOfInteres) {
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

// function getNewsDetails(id='aapl') {
//   const options = {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': xRapidApiKey,
//       'x-rapidapi-host': xRapidApiHost
//     },
//     muteHttpExceptions: true
//   };

//   let response = UrlFetchApp.fetch(`https://seeking-alpha.p.rapidapi.com/news/get-details?id=${id}`, options)
//   let json = response.getContentText()
//   let data = JSON.parse(json).data
//   console.log(data)
// }

// function getAllDataForTicker(ticker='aapl', numNews = 20) {
//   const options = {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': xRapidApiKey,
//       'x-rapidapi-host': xRapidApiHost
//     },
//     muteHttpExceptions: true
//   };

//   let response = UrlFetchApp.fetch(`https://seeking-alpha.p.rapidapi.com/news/list?id=${ticker}&size=${numNews}&until=0`, options)
//   let json = response.getContentText()
//   let data = JSON.parse(json).data

//   console.log('---General data---')
//   console.log(data)
//   console.log('---News, titles and dates---')
//   data.forEach(news => {
//     console.log(news.attributes)
//   })
//   console.log('---Relationships---')
//   data.forEach(news => {
//     console.log(news.relationships)
//   })
// }

// function importModuleExample() {
//   eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js').getContentText())
//   var date = moment().format('MMM Do YY')
//   Logger.log(date)
// }




