const db_connection = require('../../database/db_connection.js');

const postData = {};

// TODO Change the last value from 4 to a variable that references username
postData.insertIntoDatabase = (reqPayload, credentials, callback) => {
  db_connection.query(`SELECT users.id FROM users WHERE users.username = '${credentials.username}'`, (err, dbResponse) => {
    if (err) {
      return callback(err);
    }
    const id = dbResponse.rows[0].id;
    const query = `INSERT INTO blogposts(title, body, username)
      VALUES ('${reqPayload.title}','${reqPayload.content}',${id})`;
    db_connection.query(query, (err, dbResponse) => {
      if (err) {
        return callback(err);
      }
      callback(null, dbResponse);
    });
  });
};

postData.insertGithubUser = (username, avatar_url, githubId, cb) => {
  db_connection.query(`SELECT * FROM users WHERE username = '${username}' AND avatar_url = '${avatar_url}' AND githubId = '${githubId}'`, (err, res) => {
    if (err) {
      return cb(err);
    } else if (res.rows.length === 0) {
        db_connection.query(`INSERT INTO users (username, avatar_url, githubId) VALUES ('${username}', '${avatar_url}', '${githubId}')`, (err, res) => {
          if (err) return cb(err);
          cb(null, res.rows);
        });
    } else if (res.rows.length === 1) {
      return cb(null, res.rows);
    }
  });
};

module.exports = postData;
