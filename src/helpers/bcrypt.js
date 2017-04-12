const bcrypt = require('bcrypt');

module.exports = (plainText, callback) => {
  bcrypt.hash(plainText, 10, (err, hash) => {
    if (err) {
      return callback('Cannot hash text');
    }
    callback(null, hash);
  });
};
