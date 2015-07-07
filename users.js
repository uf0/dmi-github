var Github = require('github-api'),
    Config = require('./config.js'),
    d3 = require('d3'),
    fs = require('fs');

var github = new Github({
  username: Config.username,
  password: Config.password,
  auth: Config.basic
});

var data = fs.readFileSync('data/users_list.tsv','utf8')

data = d3.tsv.parse(data)

//var usersNumber = data.length-1,
var usersNumber = 5,
    usersCount = 0;

//var output = [];

// var writeFinalData = function(data){
//   var finalData = d3.tsv.format(data);
//   fs.writeFile('output/output.tsv', finalData, function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
// });
//
// }

var getUser = function(user){

  var myuser = github.getUser();

  myuser.show(function(err, userData) {
    if(err){
      console.log(usersCount + '/' + usersNumber + ' ' + err)
      usersCount = usersCount + 1;
      if(usersCount < usersNumber){
        getUser(data[usersCount].user)
      }else{
        console.log('finished');
      }
    }else {
      fs.writeFileSync('output/' + user + '.json', JSON.stringify(userData), 'utf8');
        console.log(usersCount + '/' + usersNumber + ' ' + userData.login)
        usersCount = usersCount + 1
        if(usersCount < usersNumber){
          getUser(data[usersCount].user)
        }else{
          console.log('finished');
        }
    }

  });

}

getUser(data[usersCount].user)
