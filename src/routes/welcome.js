const request = require('request');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const bcrypt = require('./../helpers/bcrypt.js');
const postData = require('./../database/postdata.js');

module.exports = {
  method: 'GET',
  path: '/welcome',
  handler: (req, reply) => {
    const { code } = req.query;
    const url = 'https://github.com/login/oauth/access_token?';

    const params = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    };

    const options = {
      method: 'POST',
      url,
      form: params,
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
        return;
      }

      const { access_token } = querystring.parse(body);

      const getOptions = {
        method: 'GET',
        url: 'https://api.github.com/user',
        headers: {
          'User-Agent': 'oauth_github_jwt',
          Authorization: `token ${access_token}`
        }
      }

      request(getOptions, (error, response, body) => {
        if (error) {
          console.log(error);
          return;
        }

        const parsedBody = JSON.parse(body);

        let options = {
          expiresIn: Date.now() + 24 * 60 * 60 * 1000,
          subject: 'github-data'
        };

        let payload = {
          user: {
            username: parsedBody.login,
            avatar: parsedBody.avatar_url,
            id: parsedBody.id
          },
          access_token,
        };

        const config = {
          ttl: 24*60*60*1000,
          path: '/',
          isSecure: process.env.NODE_ENV === 'PRODUCTION'
        }

        const secret = process.env.JWT_SECRET;



        postData.insertGithubUser(parsedBody.login, parsedBody.avatar_url, parsedBody.id,  access_token, (err, res)=>{
              if (err) {
                console.log(err);
                return;
              };

              jwt.sign(payload, secret, options, (error, jwtToken) => {
                if (error) {
                  console.log(error);
                  return;
                }
                reply.redirect('/').state('token', jwtToken, config);
              });
          });
        });



    })
  },
};
