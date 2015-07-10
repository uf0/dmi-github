var d3 = require('d3'),
    fs = require('fs');

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/output_ex.tsv', finalData, function(err) {
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

          filesData.forEach(function(d){
            var ex = d.path.split('.')

            if(ex.length > 0){
              ex = ex[ex.length-1].toLowerCase();

              if(exList.indexOf(ex) > -1){
                //console.log(ex)
                var elm = {
                  user:d.url.split('/')[4],
                  repo:d.url.split('/')[5],
                  path:d.path,
                  extension:ex,
                  size:d.size
                }
                output.push(elm);
                // count++
                // console.log(count + '/' + total + ' ' + file)
                // if(count == total){
                //     writeFinalData(output);
                // }
              }else{
                // count++
                // console.log(count + '/' + total + ' ' + file)
                // if(count == total){
                //     writeFinalData(output);
                // }
              }
            }else{
              // count++
              // console.log(count + '/' + total + ' ' + file)
              // if(count == total){
              //     writeFinalData(output);
              // }
            }
          })

          count++
          console.log(count + '/' + total + ' ' + file)
          if(count == total){
              writeFinalData(output);
              //break;
          }
          // var elm = {
          //   user:repoData.owner.login,
          //   name: repoData.name,
          //   owner: repoData.owner.login,
          //   description: repoData.description,
          //   fork: repoData.fork,
          //   language: repoData.language,
          //   forks_count: repoData.forks_count,
          //   stargazers_count: repoData.stargazers_count,
          //   watchers_count: repoData.watchers_count,
          //   size: repoData.size,
          //   default_branch: repoData.default_branch,
          //   open_issues_count: repoData.open_issues_count,
          //   pushed_at: repoData.pushed_at,
          //   updated_at: repoData.updated_at
          //   }
          //   output.push(elm);
          //   count++
          //   console.log(count + '/' + total + ' ' +repoData.name)
          //   if(count == total){
          //       writeFinalData(output);
          //   }
        });
    });
});
