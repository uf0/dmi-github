var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});


var data = fs.readFileSync('output/orgs_repos/output.tsv','utf8')

data = d3.tsv.parse(data)

var reposNumber = data.length-1,
//var reposNumber = 5,
    reposCount = 0;

    var getReposTree = function(user, name, default_branch){

      var repo = github.getRepo(user, name);

      repo.getTree(default_branch + '?recursive=true', function(err, tree) {

        if(err){
          console.log(reposCount + '/' + reposNumber + ' ' + err)
          reposCount = reposCount + 1;
          if(reposCount < reposNumber){
            getReposTree(data[reposCount].user, data[reposCount].name, data[reposCount].default_branch)
          }else{
            //writeFinalData(output)
            console.log("finished!")
          }
        }else {

            fs.writeFileSync('output/orgs_repos_trees/' + user + '_' + name + '.json', JSON.stringify(tree), 'utf8');

            console.log(reposCount + '/' + reposNumber + ' ' + name)
            reposCount = reposCount + 1
            if(reposCount < reposNumber){
              getReposTree(data[reposCount].user, data[reposCount].name, data[reposCount].default_branch)
            }else{
              //writeFinalData(output)
              console.log("finished!")
            }
        }

      });

    }

  getReposTree(data[reposCount].user, data[reposCount].name, data[reposCount].default_branch)
