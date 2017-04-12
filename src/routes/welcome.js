const request = require('request');
const querystring = require('querystring');
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

      postData.insertGithubUser(parsedBody.login, parsedBody.avatar_url, parsedBody.id, (err, res)=>{
            if (err) {
              console.log(err);
              return;
            };
            req.cookieAuth.set({
              access_token,
              username: parsedBody.login,
              avatar_url: parsedBody.avatar_url,
             });
            reply({ credentials: req.auth.credentials }).redirect('/');
      });
      });
    })
  },
};
