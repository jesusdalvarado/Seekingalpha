const axios = require('axios');




function getNewsList(ticker, numNews = 20) {
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
    // console.log(response.data);
    const data = response.data.data
    console.log('---General data---')
    console.log(data)
    console.log('---News, titles and dates---')
    data.forEach(noticia => {
      console.log(noticia.attributes) // con esto podemos ver ya los titulos de las noticias
    })
    console.log('---Relationships---')
    data.forEach(noticia => {
      console.log(noticia.relationships) // con esto podemos ver ya los titulos de las noticias
    })
  }).catch(function (error) {
    console.error(error);
  });
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



getNewsList('aapl', 5)

