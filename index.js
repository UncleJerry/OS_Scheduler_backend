const gantt = require('./gantt');
var express = require('express');
var app = express();
//var cookieParser = require('cookie-parser'); temporary disable
var bodyParser = require('body-parser');
var session = require('express-session');
const https = require('https');
const fs = require('fs');
const hash = require('./account/hash');
const query = require('./account/query');
const create = require('./account/createUser');

app.use(express.static('public'));
//app.use(cookieParser()); temporary disable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set a month life to Session
app.use(session({secret: 'suggest to have a random secret', cookie: {maxAge: 43200000}, resave: true, saveUninitialized: true}));

/**
 * Login page.
 */
app.post('/login.html', function (req, res){

  // Get the username and passwd from request.
  const username = req.body['username'];
  const password = req.body['password'];

  query.queryInfo(username, function(err, result){

    if (!err) {

      if (result.rows[0] == undefined) {
        // if the user isn't exist return false
        res.sendStatus(401);
      }else{
        const hashpass = hash.hashWithSalt(password, result.rows[0].salt);
        if (hashpass.localeCompare(result.rows[0].hashpass) == 0) {
          req.session.user = result.rows[0].uid;// To mark the user id to further action.
          res.redirect(201, '/scheduler.html');
        }else{
          // if the hashed password not match, return false
          res.sendStatus(401);
        }
      }

    }else{
      res.send('Error in server.');
    }
  });


});

/**
 * Sign up page
 * If the device never login or the session is expired, redirect to the login page
 */
app.post('/signup.html', function(req, res){
  // Get the username and passwd from request.
  const username = req.body['username'];
  const password = req.body['password'];
  const identity = req.body['identity'];

  var identityNum = 0;

  if(identity == 'teacher'){
    identityNum = 2;
  }else if(identity == 'student'){
    identityNum = 3;
  }else if(identity == 'admin'){
    identityNum = 1;
  }


  create.newUser(username, password, identityNum, function(err, result){
    if (!err) {
      req.session.user = result.rows[0].uid;
      res.redirect(201, '/scheduler.html');
    }else{
      console.log(err);
      res.sendStatus(401);
    }
  });
  
  
});

app.post('/scheduler.html', function(req, res){
  /*
    if (req.session && req.session.user) {
      const filename = req.body['filename'];
      res.send(gantt.generateChart(filename));
    }else{
      res.redirect(401, '/login.html');
    }*/
    const filename = req.body['filename'];
    res.send(gantt.generateChart(filename));
});

/**
 * Verify the login session.
 * If the device never login or the session is expired, redirect to the login page
 */
app.get('/verify', function (req, res){
  if (req.session && req.session.user) {
    res.sendStatus(200);
  }else{
    res.redirect(401, '/login.html');
  }
});


var secureServer = https.createServer({
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app);

secureServer.listen(3223, function(){
  console.log('Established the https server at port 3223');
});



