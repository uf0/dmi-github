var d3 = require('d3'),
    fs = require('fs');

var output = [];

var writeFinalData = function(data){
  var finalData = d3.tsv.format(data);
  fs.writeFile('output/orgs/output.tsv', finalData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}

var dir = 'output/orgs/';

fs.readdir(dir,function(err,files){
    if (err) throw err;
    var count = 0;
    var total = files.length;
    files.forEach(function(file,i){
        fs.readFile(dir+file,'utf-8',function(err,data){
          var repoData = JSON.parse(data)
          var elm = {
            user:repoData.owner.login,
            name: repoData.name,
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
            pushed_at: repoData.pushed_at,
            updated_at: repoData.updated_at
            }
            output.push(elm);
            count++
            console.log(count + '/' + total + ' ' +repoData.name)
            if(count == total){
                writeFinalData(output);
            }
        });
    });
});
