var d3 = require('d3'),
    fs = require('fs');

    var writeFinalData = function(data){
      var finalData = d3.tsv.format(data);
      fs.writeFile('output/viz/calendar.tsv', finalData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    }

  var data = fs.readFileSync('output/user_top_repos/output.tsv','utf8')

  data = d3.tsv.parse(data)

  var outdata = d3.nest()
    //.key(function(d){return d.language})
    .key(function(d){return d3.time.day(new Date(d.pushed_at))})
    .entries(data)

var tsvoutput = [];
var format = d3.time.format('%x');

  outdata.forEach(function(d){
    var date = d.key.toLowerCase(),
        value = d.values.length;

      var elm = {
        date: format(new Date(date)),
        value: value
      }
      tsvoutput.push(elm)

  })

// var keeplang = ['c','c++','coffescript','css','html','java','javascript','php','python','r','ruby','shell','viml'];
//
// tsvoutput = tsvoutput.filter(function(d){
//   if(keeplang.indexOf(d.lang)>-1){
//     return true
//   }
// })

writeFinalData(tsvoutput)
