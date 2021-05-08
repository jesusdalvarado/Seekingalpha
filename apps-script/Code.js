async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1_I9cACu6pPk4vEQhf6KeOWbpHA0MYkK7IGqNiuaJKfQ/edit?ts=5fff735d#gid=1061429138'
  let spreadSheet = SpreadsheetApp.openByUrl(url);
  const sheet = spreadSheet.getSheetByName('Mock')
  const tickers = getTickersFinviz() //['AAPL', 'DEN']
  const numNews = 5
  const dateTime1 = sheet.getRange('A2:A2').getValue()
  const dateTime2 = sheet.getRange('B2:B2').getValue()
  const day1 = Utilities.formatDate(dateTime1, "GMT", "yyyy-MM-dd");
  const day2 = Utilities.formatDate(dateTime2, "GMT", "yyyy-MM-dd");

  const filteredTitlesDates = await getFormattedNews(tickers, numNews, day1, day2)

  if (filteredTitlesDates === 'ERROR quota limit reached.') { popup() }

  //aqui solo insertaremos en el mock los tikers seleccionados con el formato adecuado (incluir la x para luego colocar los no filtrados)

  const formattedData = filteredTitlesDates.map(x => ['x', x.ticker, x.publishOn, x.title]);

  await insertResultsInSheet(formattedData, sheet)
}

function insertResultsInSheet(formattedData, sheet) {
  let tickersChecked = []
  let ticker = null
  formattedData.forEach((row) => {
    ticker = row[1]
    if (tickersChecked.includes(ticker)) {
      insertIntheSameRow(row, tickersChecked, sheet)
    } else {
      insertInNewRow(row, sheet)
    }
    tickersChecked.push(ticker)
  })
}

function insertInNewRow(row, sheet) {
  const START_ROW = sheet.getLastRow()+1
  const START_COLUMN = 1
  const NUM_ROWS = 1
  const NUM_COLUMNS = row.length
  range = sheet.getRange(START_ROW, START_COLUMN, NUM_ROWS, NUM_COLUMNS)
  range.setValues([row])
}

function insertIntheSameRow(row, tickersChecked, sheet) {
  const countTickerNews = getCountTickerNews(row, tickersChecked)
  const sliceRow = row.slice(2, 4)
  const START_ROW = sheet.getLastRow()
  const START_COLUMN = (countTickerNews<=1) ? (row.length+1) : (2*countTickerNews)+3
  const NUM_ROWS = 1
  const NUM_COLUMNS = sliceRow.length
  range = sheet.getRange(START_ROW, START_COLUMN, NUM_ROWS, NUM_COLUMNS)
  range.setValues([sliceRow])
}

function getCountTickerNews(row, tickersChecked) {
  let count = 0
  const ticker = row[1]
  tickersChecked.forEach((tick) => {
    if (tick === ticker) count+=1
  })

  return count
}

function popup(message="Error: Rate limit reached.") {
  var ui = SpreadsheetApp.getUi()
  ui.alert(message)
}

function getTickersFinviz() {
  let arrOffsets = getOffsets()
  let tickers = []
  let tickersFromPage = []
  arrOffsets.forEach(function(offset) {
    tickersFromPage = getTickersFromPage(offset)
    tickers = tickers.concat(tickersFromPage)
  })

  return tickers
}

function getOffsets() {
  const totalTickers = getTotalTickers()
  const maxTickersPerPage = 20

  const numIterations = Math.ceil( (totalTickers / maxTickersPerPage) )

  let arrOffsets = []
  let offset = 1
  for (let i=0; i<numIterations; i++) {

    if (i === 0) {
      arrOffsets.push(offset)
      offset += maxTickersPerPage
      continue
    }

    arrOffsets.push(offset)
    offset += maxTickersPerPage
  }

  return arrOffsets
}

function getTickersFromPage(offset) {
  var url = "https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r="+ offset;
  var content = UrlFetchApp.fetch(url).getContentText();
  var scraped = data(content).from('class=\"screener-body-table-nw\"').to('</td>').iterate();
  var oticker = ""
  let tickers = []

  scraped.forEach(function(e) {
    var ticker = data(e).from("<a href=\"quote.ashx?t=").to("&").build();

    if (oticker == "" || ticker!=oticker) {
      oticker = ticker
      tickers.push(oticker)
    }
  })

  return tickers
}

function getTotalTickers() {
  var url = "https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r="+ 1;
  var content = UrlFetchApp.fetch(url).getContentText();
  const countText = data(content).from('class=\"count-text\"').to('</td>').iterate()[0]
  const totalTickers = parseInt(countText.replace('><b>Total: </b>', '').split(' ')[0])

  return totalTickers
}



var Parser = function(content) {
    this.content = content;
    this.direction = "from";
    this._from = {};
    this._to = {};
    this.index = 0;
    this.log = false;
    this.position = 0;
}  


Parser.prototype.from = function(pattern,offset) {
        if (this.log) Logger.log("Parser.from: "+ pattern)
        this._from.text = pattern;
        this._from.offset= offset || 0
        return this;
}

Parser.prototype.to = function(pattern,offset) {
         if (this.log) Logger.log("Parser.to: "+ pattern);
         this._to.text = pattern;
         this._to.offset= offset || 0;
         return this;
}

Parser.prototype.offset = function(index) {
         this.index =index
         return this;
}

Parser.prototype.setDirection = function(way) {
          this.direction = way;
          return this;
} 
      
Parser.prototype.setLog = function() {
        this.log = true;
        return this;
}

Parser.prototype.build = function() {
    
           var txt = this.content;
           var temp = 0;
           
           var obj = {}
           obj.from = this._from;
           obj.to = this._to
           obj.index = this.index; 
           if (this.log) Logger.log("Index offset %s", this.index);
        
           var keyword = {};
           
           if (this.direction == "from") {
              if (this.log) Logger.log("from_mode");
              this.position = txt.indexOf(obj.from.text,obj.index);
              if (this.log) Logger.log("Iterate offset: %s", this.position);
              keyword.from = this.position + parseInt(obj.from.offset,10) + obj.from.text.length;
              keyword.to = txt.indexOf(obj.to.text,keyword.from+1) + parseInt(obj.to.offset,10);
              if (this.log) Logger.log("to:"+txt.indexOf(obj.to.text,keyword.from+1))
            } else {
              if (this.log) Logger.log("to_mode");
              keyword.to = txt.indexOf(obj.to.text)+ parseInt(obj.to.offset,10);
              keyword.from = txt.lastIndexOf(obj.from.text, keyword.to) + parseInt(obj.from.offset,10) + obj.from.text.length;
            }
           if (this.log) Logger.log(keyword);
           
           this.end = keyword.to;
           this.last = txt.lastIndexOf(obj.from.text);
           return txt.substring(keyword.from,keyword.to);
}

Parser.prototype.iterate = function() {
    
        var keywords = [];
        var start = true;
        
        while(start || this.last != this.position) {
          var keyword = this.build();
          if (this.log) {
            Logger.log("LastIndexOf: %s", this.last);
            Logger.log("Now indexOf: %s", this.position);
            Logger.log(keyword);
            Logger.log("End at %s", this.end)
            Logger.log("------------------------");
          }
          this.index = this.end;
          keywords.push(keyword);
          start = false;
        } 
        return keywords;
}

/*
* Extract parts from long content
*
* @param {String} content Text to parse
* @return {object} the result of the exponential calculation
*/
function data(content) {
    return new Parser(content);
}
