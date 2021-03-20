const axios = require('axios');

///// news_list
const options = {
  method: 'GET',
  url: 'https://seeking-alpha.p.rapidapi.com/news/list',
  params: {id: 'aapl', size: '20', until: '0'},
  headers: {
    'x-rapidapi-key': '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051',
    'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	// console.log(response.data);

  const data = response.data.data
  console.log(data, '---Raw data---')

  console.log('---NOTICIAS, TITULOS Y FECHAS DE PUBLICACION---')
  data.forEach(noticia => {
    console.log(noticia.attributes) // con esto podemos ver ya los titulos de las noticias
  })

  console.log('---RELATIONSHIPS---')
  data.forEach(noticia => {
    console.log(noticia.relationships) // con esto podemos ver ya los titulos de las noticias
  })


}).catch(function (error) {
	console.error(error);
});


///// news_get_details
const options = {
  method: 'GET',
  url: 'https://seeking-alpha.p.rapidapi.com/news/get-details',
  params: {id: '3670877'},
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


///// articles_list
const options = {
  method: 'GET',
  url: 'https://seeking-alpha.p.rapidapi.com/articles/list',
  params: {category: 'latest-articles', until: '0', size: '20'},
  headers: {
    'x-rapidapi-key': '30c000177fmshdea0df88a20a59ep1640c4jsna41d72b81051',
    'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	// console.log(response.data);
  const data = response.data.data
  console.log('---Attributes---')
  data.forEach(article => {
    console.log(article.attributes)
  })
  console.log('---Relationships---')
  data.forEach(article => {
    console.log(article.relationships)
  })
  console.log('---Links---')
  data.forEach(article => {
    console.log(article.links)
  })
}).catch(function (error) {
	console.error(error);
});


// PRIMER EJEMPLO QUE USASTE
const options = {
  method: 'GET',
  url: 'https://seeking-alpha.p.rapidapi.com/auto-complete',
  params: {term: 'apple'},
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


