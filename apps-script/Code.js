function myFunction() {
  var start = 1
  var url = "https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r="+ start;
  var content = UrlFetchApp.fetch(url).getContentText();

  var scraped = data(content).from('class=\"screener-body-table-nw\"').to('</td>').iterate();
  var res = [];

  // If you don't want column titles, remove this part.
  // var temp = [];
  // var titles = data(content).from("style=\"cursor:pointer;\">").to("</td>").iterate();
  // titles.forEach(function(e){
  //   if (!~e.indexOf('\">')) {
  //     temp.push(e);
  //   } else if (~e.indexOf('img')) {
  //     temp.push(e.replace(/<img.+>/g, ''));
  //   }
  // }
  // res.push(temp);
  // -----

  var temp = [];
  var oticker = "";
  scraped.forEach(function(e){
    var ticker = data(e).from("<a href=\"quote.ashx?t=").to("&").build();
    var data1 = data(e).from("screener-link\">").to("</a>").build();
    var data2 = data(data1).from(">").to("<").build();
    if (oticker == "") oticker = ticker;
    console.log(oticker, ticker, '---111')
    if (ticker != oticker) {
      temp.splice(1, 0, oticker);
      res.push(temp);
      temp = [];
      oticker = ticker;
      temp.push(data1);
    } else {
      if (!~(data2 || data1).indexOf('<')) temp.push(data2 || data1);
    }
  });

  
  let tickers = res.map(x => x[1])
  console.log(tickers, '---222')


  var ss = SpreadsheetApp.getActiveSheet();


var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1_I9cACu6pPk4vEQhf6KeOWbpHA0MYkK7IGqNiuaJKfQ/edit?ts=5fff735d#gid=1061429138');
Logger.log(ss.getName());

  // ss.getRange(ss.getLastRow() + 1, 1, res.length, res[0].length).setValues(res);
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




