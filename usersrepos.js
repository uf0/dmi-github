var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});


var data = fs.readFileSync('data/extra_users_list.tsv','utf8')

data = d3.tsv.parse(data)


var reposNumber = data.length-1,
//var reposNumber = 5,
    reposCount = 0;

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/new_users_repos/output.tsv', finalData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

}

var getOrgsRepos = function(org){

  var myorg = github.getUser();

  myorg.userRepos(org, function(err, repos) {
    if(err){
      console.log(reposCount + '/' + reposNumber + ' ' + err)
      reposCount = reposCount + 1;
      if(reposCount < reposNumber){
        getOrgsRepos(data[reposCount].user)
      }else{
        writeFinalData(output)
      }
    }else {
        if(repos.length){
          repos.forEach(function(d){
            fs.writeFileSync('output/new_users_repos/' + org + '_' + d.name + '.json', JSON.stringify(d), 'utf8');
            var elm = {
              user: org,
              name: d.name,
              owner: d.owner.login,
              description: d.description,
              fork: d.fork,
              language: d.language,
              forks_count: d.forks_count,
              stargazers_count: d.stargazers_count,
              watchers_count: d.watchers_count,
              size: d.size,
              default_branch: d.default_branch,
              open_issues_count: d.open_issues_count,
              created_at: d.created_at,
              updated_at: d.updated_at
              }

              output.push(elm);
              console.log('---- ' + d.name)
          })
        }
        console.log(reposCount + '/' + reposNumber + ' ' + org)
        reposCount = reposCount + 1
        if(reposCount < reposNumber){
          getOrgsRepos(data[reposCount].user)
        }else{
          writeFinalData(output)
        }
    }

  });

}

getOrgsRepos(data[reposCount].user)
