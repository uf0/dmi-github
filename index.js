var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});

var data = fs.readFileSync('data/people_user_collaborated.tsv','utf8')

data = d3.tsv.parse(data)

//var reposNumber = data.length-1,
//var reposNumber = 4000,
    reposCount = 0;

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/repos/output.tsv', finalData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

}

var getRepos = function(user, repo){

  var myrepo = github.getRepo(user, repo);

  myrepo.show(function(err, repoData) {
    if(err){
      console.log(reposCount + '/' + reposNumber + ' ' + err)
      reposCount = reposCount + 1;
      if(reposCount < reposNumber){
        getRepos(data[reposCount].user, data[reposCount].repo)
      }else{
        writeFinalData(output)
      }
    }else {
      fs.writeFileSync('output/repos/' + user + '_' + repo + '.json', JSON.stringify(repoData), 'utf8');
      var elm = {
        user:user,
        name: repo,
        owner: repoData.owner.login,
        description: repoData.description,
        fork: repoData.fork,
        language: repoData.language,
        forks_count: repoData.forks_count,
        stargazers_count: repoData.stargazers_count,
        watchers_count: repoData.watchers_count,
        size: repoData.size,
        default_branch: repoData.default_branch,
        open_issues_count: repoData.open_issues_count,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at
        }

        output.push(elm);
        console.log(reposCount + '/' + reposNumber + ' ' + repoData.name)
        reposCount = reposCount + 1
        if(reposCount < reposNumber){
          getRepos(data[reposCount].user, data[reposCount].repo)
        }else{
          writeFinalData(output)
        }
    }

  });

}

getRepos(data[reposCount].user, data[reposCount].repo)
