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
  var userTable = 'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, phone VARCHAR(14), email VARCHAR(30) UNIQUE NOT NULL, coop_id INTEGER REFERENCES coops (id), password VARCHAR(30));';
  var requestTable = 'CREATE TABLE IF NOT EXISTS requests (id SERIAL PRIMARY KEY, start_time TIMESTAMP NOT NULL, end_time TIMESTAMP NOT NULL, requestor_id INTEGER NOT NULL REFERENCES users (id), caregiver_id INTEGER REFERENCES users (id), comments VARCHAR(300), completed BOOLEAN DEFAULT false);';
  var inviteTable = 'CREATE TABLE IF NOT EXISTS invitations (id SERIAL PRIMARY KEY, email VARCHAR(50) NOT NULL, coop_id INTEGER NOT NULL REFERENCES coops (id), date DATE);';
  var sessionTable = 'CREATE TABLE IF NOT EXISTS session (sid VARCHAR NOT NULL PRIMARY KEY, sess JSON NOT NULL, expire TIMESTAMP(6) NOT NULL) WITH (OIDS=FALSE);';

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('Error connecting to database.', err);

    } else {
      var query = client.query(coopTable + userTable + requestTable + inviteTable + sessionTable);

      query.on('end', function() {
        done();
      });

      query.on('error', function(err) {
        console.log('Error creating schema', err);
        process.exit(1);
      });
    }
  });
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;
