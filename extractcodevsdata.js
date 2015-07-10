var d3 = require('d3'),
    fs = require('fs');

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/output_codevsdata_users.tsv', finalData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}

var extensions = fs.readFileSync('data/extensions.tsv','utf8')

extensions = d3.tsv.parse(extensions)

var exList = extensions.map(function(d){
  return d.ex;
})

var dir = 'output/users_top_repos_trees/';

fs.readdir(dir,function(err,files){
    if (err) throw err;
    var count = 0;
    var total = files.length;
    //var total = 5;
    files.forEach(function(file,i){
        fs.readFile(dir+file,'utf-8',function(err,data){
          var repoData = JSON.parse(data);

          var filesData = repoData.filter(function(d){
            return d.type == 'blob'
          })

          var codeFile = 0,
              dataFile = 0;

          filesData.forEach(function(d){


            var ex = d.path.split('.')

            if(ex.length > 0){
              ex = ex[ex.length-1].toLowerCase();

              if(exList.indexOf(ex) > -1){
                dataFile++
                // var elm = {
                //   user:d.url.split('/')[4],
                //   repo:d.url.split('/')[5],
                //   path:d.path,
                //   extension:ex,
                //   size:d.size
                // }
                //output.push(elm);
                // count++
                // console.log(count + '/' + total + ' ' + file)
                // if(count == total){
                //     writeFinalData(output);
                // }
              }else{
                codeFile++
                // count++
                // console.log(count + '/' + total + ' ' + file)
                // if(count == total){
                //     writeFinalData(output);
                // }
              }
            }else{
              codeFile++
              // count++
              // console.log(count + '/' + total + ' ' + file)
              // if(count == total){
              //     writeFinalData(output);
              // }
            }



          })

          var user = file.split('_')[0],
              repo = file.split('_');

          repo.shift();
          repo = repo.join('_').replace('.json','');

          var elm = {
             user:user,
             repo:repo,
             codeFile: codeFile,
             dataFile: dataFile
          }
          output.push(elm);
          count++
          console.log(count + '/' + total + ' ' + file)
          if(count == total){
              writeFinalData(output);
              //break;
          }
        });
    });
});
