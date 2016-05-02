var pg = require('pg');

var connectionString = '';

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;

} else {
  connectionString = 'postgress://localhost:5432/childcare';
}

function initializeDB() {
  var coopTable = 'CREATE TABLE IF NOT EXISTS coops (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);';
  var userTable = 'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, phone VARCHAR(14), email VARCHAR(30) NOT NULL, coop_id INTEGER REFERENCES coops (id));';
  // var allTables = [coopTable];

  // for (var i = 0; i < allTables.length; i++) {
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        console.log('Error connecting to database.', err);

      } else {
        // var sql = allTables[i];
        var query = client.query(coopTable + userTable);

        query.on('end', function() {
          console.log('Successfully ensured schema exists');
          done();
        });

        query.on('error', function(err) {
          console.log('Error creating schema', err);
          process.exit(1);
        });
      }
    });
  // }
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;
