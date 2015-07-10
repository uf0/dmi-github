var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/output_orgs_repos_lib.tsv', finalData, function(err) {
    if(err) {
        return console.log(err);
        process.exit(1)
    }
    console.log("The file was saved!");
    process.exit()
});

}

var data = fs.readFileSync('output/output_orgs_repos_path.tsv','utf8')

data = d3.tsv.parse(data)

//console.log(data);

var output = [];
var pathNumber = data.length,
//var pathNumber = 12,
    pathCount = 0;
    var getLibs = function(user, reponame, path){

      var repo = github.getRepo(user, reponame)
      repo.read('master', path, function(err, datacontent) {

        if(!err){
          var content;
          try {
            content = JSON.parse(datacontent);
          } catch (e) {
            content = {};
          }
          //var content = JSON.parse(data);
          var dep = content.dependencies;
          if(dep){
            var filename = path.split('/'),
                filename = filename[filename.length-1];
            var depList = d3.entries(dep);

            var firstlevel = path.split('/').length-1 ? false : true;

            depList.forEach(function(e){
              var elm = {
                user:user,
                repo: reponame,
                lib: e.key,
                ver: e.value,
                type: filename.replace('.json', ''),
                firstlevel:firstlevel
              }
              output.push(elm)
            })
            pathCount++
            console.log(pathCount + '/' + pathNumber , 'dep find')
            if(pathCount < pathNumber){
              getLibs(data[pathCount].user,data[pathCount].repo, data[pathCount].path)
            }else{
              writeFinalData(output);
            }

          }else{
              pathCount++
              console.log(pathCount + '/' + pathNumber , 'dep not find')
              if(pathCount < pathNumber){
                getLibs(data[pathCount].user,data[pathCount].repo, data[pathCount].path)
              }else{
                writeFinalData(output);
              }

          }
        }else{
            pathCount++
            console.log(pathCount + '/' + pathNumber, 'error')
            if(pathCount < pathNumber){
              getLibs(data[pathCount].user,data[pathCount].repo, data[pathCount].path)
            }else{
              writeFinalData(output);
            }

        }

      });

    }

  getLibs(data[pathCount].user,data[pathCount].repo, data[pathCount].path)
