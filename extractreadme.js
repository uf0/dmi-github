var d3 = require('d3'),
    fs = require('fs'),
    request = require('request');

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/readme/top_readmemarkdown.tsv', finalData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}


fs.readFile('output/top_repos/output.tsv','utf-8',function(err,data){
  data = d3.tsv.parse(data)
  var total = data.length;
  var count = 0;
  data.forEach(function(d){
    request('https://raw.githubusercontent.com/' + d.user + '/' + d.name +'/' + d.default_branch + '/README.markdown', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var elm ={
              user: d.user,
              name: d.name,
              readme: body
            }
            output.push(elm);
            count++;
            console.log(count + '/' + total + ' ' +d.name)
            if(count == total){
              writeFinalData(output)
            }
        }else{
          // var elm ={
          //   user: d.user,
          //   name: d.name,
          //   readme: ''
          // }
          // output.push(elm);
          count++;
          console.log(count + '/' + total + ' ' +d.name)
          if(count == total){
            writeFinalData(output)
          }
        }
    });
  })
})
