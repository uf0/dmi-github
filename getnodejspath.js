var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/output_orgs_repos_path.tsv', finalData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}

var dir = 'output/orgs_repos_trees/';

fs.readdir(dir,function(err,files){
    if (err) throw err;
    var count = 0;
    //return
    var total = files.length-1;
    //var total = 5;
    files.forEach(function(file,i){
        fs.readFile(dir+file,'utf-8',function(err,data){
          var repoData = JSON.parse(data);

          var filesData = repoData.filter(function(d){
            var filename = d.path.split('/'),
                filename = filename[filename.length-1];

            return d.type == 'blob' && filename == 'bower.json' || filename == 'package.json'
          })

          var user = file.split('_')[0],
              reponame = file.split('_');

          reponame.shift();
          reponame = reponame.join('_').replace('.json','');

          var filesDataTotal = filesData.length;
          var filesDataCount = 0;


          filesData.forEach(function(d){

                var elm = {
                  user:user,
                  repo: reponame,
                  path: d.path
                }
                output.push(elm)
//              console.log(user, reponame, d.path)
              // var repo = github.getRepo(user, reponame)
              // repo.read('master', d.path, function(err, data) {
              //
              //   if(!err){
              //     var content;
              //     try {
              //       content = JSON.parse(data);
              //     } catch (e) {
              //       content = {};
              //     }
              //     //var content = JSON.parse(data);
              //
              //     var dep = content.dependencies;
              //     if(dep){
              //       var filename = d.path.split('/'),
              //           filename = filename[filename.length-1];
              //       var depList = d3.entries(dep);
              //       depList.forEach(function(e){
              //         var elm = {
              //           user:user,
              //           repo: reponame,
              //           lib: e.key,
              //           ver: e.value,
              //           type: filename.replace('.json', '')
              //         }
              //         output.push(elm)
              //         filesDataCount++
              //         if(filesDataCount == filesDataTotal){
              //           count++
              //           console.log(count + '/' + total)
              //           if(count == total){
              //               writeFinalData(output);
              //               //break;
              //           }
              //         }
              //       })
              //     }else{
              //       filesDataCount++
              //       if(filesDataCount == filesDataTotal){
              //         count++
              //         console.log(count + '/' + total)
              //         if(count == total){
              //             writeFinalData(output);
              //         }
              //       }
              //     }
              //   }else{
              //     filesDataCount++
              //     if(filesDataCount == filesDataTotal){
              //       count++
              //       console.log(count + '/' + total)
              //       if(count == total){
              //           writeFinalData(output);
              //       }
              //     }
              //   }
              //
              // });


          });

          console.log(file, count++, total)
          if(count == total){
              writeFinalData(output);
          }
        });


});
});
