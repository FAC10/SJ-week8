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
  })


};

postData.insertGithubUser = (username, avatar_url, githubId, accessToken, cb) => {
  db_connection.query(`INSERT INTO users (username, avatar_url, githubId, access_token) VALUES ('${username}', '${avatar_url}', ${githubId}, '${accessToken}')`, (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  });
};



module.exports = postData;
