import axios from 'axios';

async function getNewsList(ticker='aapl', numNews = 5) {
  const options = {
    method: 'GET',
    url: 'https://seeking-alpha.p.rapidapi.com/news/list',
    params: {id: ticker, size: `${numNews}`},
    headers: {
      'x-rapidapi-key': '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051',
      'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
    }
  };

  let titlesDates = []
  await axios.request(options).then(function (response) {
    const data = response.data.data
    data.forEach(news => {
      titlesDates.push({publishOn: news.attributes['publishOn'], title: news.attributes['title']})
    })
  }).catch(function (error) {
    console.error(error);
  });

  return titlesDates
}

function getNewsDetails(id) {
  const options = {
    method: 'GET',
    url: 'https://seeking-alpha.p.rapidapi.com/news/get-details',
    params: {id: `${id}`},
    headers: {
      'x-rapidapi-key': '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051',
      'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}

function getAllDataForTicker(ticker, numNews = 20) {
  const options = {
    method: 'GET',
    url: 'https://seeking-alpha.p.rapidapi.com/news/list',
    params: {id: ticker, size: `${numNews}`, until: '0'},
    headers: {
      'x-rapidapi-key': '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051',
      'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
    const data = response.data.data
    console.log('---General data---')
    console.log(data)
    console.log('---News, titles and dates---')
    data.forEach(news => {
      console.log(news.attributes)
    })
    console.log('---Relationships---')
    data.forEach(news => {
      console.log(news.relationships)
    })
  }).catch(function (error) {
    console.error(error);
  });
}

async function getFormattedNews(tickers=['aapl', 'den', 'glt'], numNews=5, lastDateOfInteres='2021-03-12', prevDateOfInteres='2021-03-11') {
  // const numNews = 5                        // Limit number of news per ticker
  // const tickers = ['aapl', 'den', 'glt']   // Tickers obtained from Finviz
  // const lastDateOfInteres = '2021-03-12'
  // const prevDateOfInteres = '2021-03-11'

  tickers.forEach(async (ticker) => {
    let titlesDates = await getNewsList(ticker, numNews)

    // Applying filters
    let filteredTitlesDates = filterNewsByDates(titlesDates, lastDateOfInteres, prevDateOfInteres)
    filteredTitlesDates = filterNewsByKeywords(filteredTitlesDates)

    console.log(`--- ${ticker.toUpperCase()} ---`)

    filteredTitlesDates.forEach((el) => {
      console.log('publishOn:', el['publishOn'])
      console.log('title:', el['title'], '\n')
    })
  })

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
  const keywords = ['EPS','preliminary','prelim','pre','revenue','beats','miss','misses','earning','preview','prerelease','report','results','Q1','Q2','Q3','Q4','FQ1','FQ2','FQ3','FQ4']
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

export {getNewsList, getNewsDetails, getAllDataForTicker, getFormattedNews, filterNewsByDates}
