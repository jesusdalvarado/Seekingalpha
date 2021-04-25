function importModuleExample() {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js').getContentText())
  var date = moment().format('MMM Do YY')
  Logger.log(date)
}

function importModuleExample2() {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js').getContentText())

  var xml = "<root>Hello xml2js!</root>"
  
  // xml.parseString(xml, function (err, result) {
  //     console.dir(result);
  //     Logger.log(result)
  // });


  var parser = xml2js();
  Logger.log(parser)
}

function xmlServiceExample() {
  var html = UrlFetchApp.fetch('http://en.wikipedia.org/wiki/Document_Object_Model').getContentText();
  var doc = XmlService.parse(html);
  var html = doc.getRootElement();
  var menu = getElementsByClassName(html, 'vertical-navbox nowraplinks')[0];
  var output = '';
  var linksInMenu = getElementsByTagName(menu, 'a');
  for(i in linksInMenu) output+= XmlService.getRawFormat().format(linksInMenu[i])+'<br>';
  return HtmlService.createHtmlOutput(output);
}



function getElementsByTagName(element, tagName) {  
  var data = [];
  var descendants = element.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();     
    if( elt !=null && elt.getName()== tagName) data.push(elt);      
  }
  return data;
}


function some() {
  eval(UrlFetchApp.fetch('https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/3.17.5/parser.min.js').getContentText())
  var url = 'https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r=21';
  var xmlData = UrlFetchApp.fetch(url).getContentText();

  var mySubString = xmlData.substring(
      xmlData.indexOf('<table width="100%" cellpadding="3" cellspacing="1"'), 
      xmlData.indexOf('</a></td></tr></table>')+26
  );



  var xmlData = "<table><p>Hello world</p><p>bye bye</p></table>"
  xmlData = "<table><img src='https://charts2.finviz.com/chart.ashx?s=m&ty=c&t=CLNE'></table>"
  xmlData = "<table><img ><td>hello</td></table>"
  var doc = XmlService.parse(xmlData);
  var root = doc.getRootElement();
  var linksInMenu = getElementsByTagName(root, 'td');

  Logger.log(linksInMenu[0].getValue())


  for (i in linksInMenu) {
    Logger.log(linksInMenu[i].getValue())
  }

  var output = '';
  for(i in linksInMenu) output+= XmlService.getRawFormat().format(linksInMenu[i])+'<br>';
  // return HtmlService.createHtmlOutput(output);

  var a  = HtmlService.createHtmlOutput(output)

  Logger.log(a.getContent())



  Logger.log(xmlData)

  var jsonObj = parser.parse(xmlData,options);
  var xmlData = "<table><p>Hello world</p><p>bye bye</p></table><table>second</table>"
  Logger.log(parsedData['table'][0]['p'])
  Logger.log(typeof(xmlData))
  var parsedData = parser.parse(xmlData);
  Logger.log(parsedData)
  



  var xmlData = "<table>Bob</table>, I'm <b>20</b> years old, I like <b>programming</b>.";
  var xmlData = '<td height="10" align="right" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">21</a></td><td height="10" align="left" class="screener-body-table-nw" title="cssbody=[tabchrtbdy] cssheader=[tabchrthdr] body=[<img src="https://charts2.finviz.com/chart.ashx?s=m&ty=c&t=CLIR"><br>&nbsp;<b>ClearSign Technologies Corporation</b><br>&nbsp;Pollution & Treatment Controls | USA | 119.61M] offsetx=[100] offsety=[0] delay=[0]"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link-primary">CLIR</a></td><td height="10" align="left" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">ClearSign Technologies Corporation</a></td><td height="10" align="left" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">Industrials</a></td><td height="10" align="left" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">Pollution & Treatment Controls</a></td><td height="10" align="left" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">USA</a></td><td height="10" align="right" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">119.61M</a></td><td height="10" align="right" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">-</a></td><td height="10" align="right" class="screener-body-table-nw" title="cssbody=[tabchrtbdy] cssheader=[tabchrthdr] body=[<img src="https://charts2.finviz.com/chart.ashx?s=m&ty=c&t=CLIR"><br>&nbsp;<b>ClearSign Technologies Corporation</b><br>&nbsp;Pollution & Treatment Controls | USA | 119.61M] offsetx=[-323] offsety=[0] delay=[0]"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link"><span class="is-green">4.53</span></a></td><td height="10" align="right" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link"><span class="is-green">14.74%</span></a></td><td height="10" align="right" class="screener-body-table-nw"><a href="quote.ashx?t=CLIR&ty=c&p=d&b=1" class="screener-link">669,998</a></td></tr><tr valign="top" class="table-light-row-cp"  onmouseover="this.className="table-light-row-cp-h";" onmouseout="this.className="table-light-row-cp";">'

  var result = xmlData.match(/<b>(.*?)<\/b>/g).map(function(val){
    return val.replace(/<\/?b>/g,'');
  });

  var result = xmlData.match(/<td height="10" align="right" class="screener-body-table-nw">(.*?)<\/td>/g).map(function(val){
    return val.replace(/<\/?td>/g,'');
  });
  Logger.log('PPPPPP')
  Logger.log(result[25])
}


function getProgrammeList() {
  txt = '<html> <body> <div> <div> <div id="here">hello world!!</div> </div> </div> </html>'

  // Put the receieved xml response into XMLdocument format
  var doc = Xml.parse(txt,true);

  Logger.log(doc.html.body.div.div.div.id +" = "
            +doc.html.body.div.div.div.Text );    /// here = hello world!!

  debugger;  // Pause in debugger - examine content of doc
}



function importFinviz() {
  var url = 'https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r=61';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  var entries = root.getChildren('entry', atom);
  for (var i = 0; i < entries.length; i++) {
    var title = entries[i].getChild('title', atom).getText();
    var categoryElements = entries[i].getChildren('category', atom);
    var labels = [];
    for (var j = 0; j < categoryElements.length; j++) {
      labels.push(categoryElements[j].getAttribute('term').getValue());
    }
    Logger.log('%s (%s)', title, labels.join(', '));
  }
  return 123
}


function myXML() {
  var cell = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet().getActiveCell();
  cell.setFormula('=importXml("https://finviz.com/screener.ashx?v=151&f=cap_largeunder,geo_usa,ind_stocksonly,sh_curvol_o100,sh_relvol_o2,sh_short_u20,ta_change_u3,ta_sma200_pa,ta_sma50_pa&ft=4&o=ticker&r=61", "//tr[@valign]")');
  // Logger.log(cell)
}

function parseXml() {
  var url = 'https://gsuite-developers.googleblog.com/atom.xml';
  var xml = UrlFetchApp.fetch(url).getContentText();
  Logger.log(xml)
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  // Logger.log(atom)
  var entries = root.getChildren('entry', atom);
  for (var i = 0; i < entries.length; i++) {
    var title = entries[i].getChild('title', atom).getText();
    var categoryElements = entries[i].getChildren('category', atom);
    var labels = [];
    for (var j = 0; j < categoryElements.length; j++) {
      labels.push(categoryElements[j].getAttribute('term').getValue());
    }
    // Logger.log('%s (%s)', title, labels.join(', '));
  }
  return 123
}

