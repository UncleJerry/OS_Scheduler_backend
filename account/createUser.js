var pg = require('pg');
var hash = require('./hash');


function newUser(username, password, identityNum, callback) {
  const hashedData = hash.hashItAll(password);


  const config = {
    //user: '',
    //database: '',
    //password: '',
    //host: 'localhost',
    //port: 5432,
    //max: 10,
    //idleTimeoutMillis: 1000,
  };

  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO account (uname, identity, hashpass, salt) VALUES ($1, $2, $3, $4) RETURNING uid;', [username, Number(identityNum), hashedData.hashpass, hashedData.salt], function(err, result){
      done(err);
      
      if(err) {
        return callback(err, null);
      }
      return callback(null, result);
      client.end(function (err) {
        if (err) throw err;
      });
    });
  })
}




exports.newUser = newUser;
