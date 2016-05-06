var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var publicApi = {

  encryptPassword: function(password) {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    // console.log('Produced a salt of', salt);
    var encryptedPassword = bcrypt.hashSync(password, salt);
    // console.log('Encrypted password', encryptedPassword);
    return encryptedPassword;
  },

  comparePassword: function(candidatePassword, storedPassword) {
    // console.log('Comparing', candidatePassword, storedPassword);
    var answer = bcrypt.compareSync(candidatePassword, storedPassword);
    // console.log('Answer', answer);
    return answer;
  }
}

module.exports = publicApi;
