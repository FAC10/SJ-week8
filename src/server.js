const hapi = require('hapi');
const fs = require('fs');
const querystring = require('querystring');
const vision = require('vision');
const inert = require('inert');
const handlebars = require('handlebars');
const data = require('./database/getdata.js');
const CookieAuth = require('hapi-auth-cookie');
const jwt2 = require('hapi-auth-jwt2');
const credentials = require('hapi-context-credentials');
const postData = require('./database/postdata.js');
const validate = require('./helpers/validate.js');
require('env2')('./config.env');
const server = new hapi.Server();
// let cache;

const port = process.env.PORT || 3005;

server.connection({
  port,
  tls: {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
  },
});

server.register([inert, credentials, vision, CookieAuth, jwt2], (err) => {
  if (err) throw err;

  server.views({
    engines: { hbs: handlebars },
    path: 'views',
    layout: 'default',
    layoutPath: 'views/layout',
    partialsPath: 'views/partials',
    // helpersPath: 'views/helpers',
  });

  // Template routes
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      data.getBlogPosts((dbErr, res) => {
        if (dbErr) {
          reply.view('Lo sentimos, actualmente estamos experimentando dificultades con el servidor');
          return;
        }
        // cache = res;
        reply.view('index', { res });
      });
    },
  });


  server.route({
    method: 'GET',
    path: '/write-post',
    handler: {
      view: 'write-post',
    },
  });

  server.route({
    method: 'POST',
    path: '/logged-in',
    handler: (req, reply) => {

      const { username, password } = req.payload;
      data.getUsers(username, password, (err, res) => {

        if (err) {
          //TODO res: cache, can be passed in but makes the above function run since
          //its our only means of validation
          reply.view('index', { message: err.message });
        }
        else if (res.length) {
          data.getBlogPosts((dbError, allTheBlogsPosts) => {

            if (dbError) {
              reply.view('index', { message: 'Lo sentimos, actualmente estamos experimentando dificultades con el servidor'});
            }
            req.cookieAuth.set({ username });
            reply({ res: allTheBlogsPosts }).redirect('/');

          });
        }
      });
    },

  });

  server.route(require('./routes/welcome.js'));

  server.route({
    method: 'GET',
    path:'/my-posts',
    handler:(req, reply)=>{
      data.getBlogPostsByUser(req.auth.credentials.username, (dbErr, res) => {
        if (dbErr) {
          reply.view(index, { message: 'Lo sentimos, actualmente estamos experimentando dificultades con el servidor'});
          return;
        }
        reply.view('index', { res });
      });
    },
  });

  server.route({
    method: 'POST',
    path: '/logged-out',
    handler: (request, reply) => {
      request.cookieAuth.clear();
      reply.redirect('/');
    },
  });

  server.route({
    method: 'POST',
    path: '/submit-post',
    handler: (request, reply) => {
      postData.insertIntoDatabase(request.payload, request.auth.credentials, (dbError, res) => {
        if (dbError) {
          //  TODO Figure out how to send message with redirect
          // return reply({
          //   message: 'Ayúdame, oh Dios mío, ¿por qué?'
          // }).redirect('write-post');
          return reply.view('write-post', {
            message: 'Ayúdame, oh Dios mío, ¿por qué?',
          });
        }
        reply(res).redirect('/');
      });
    },
  });

  server.route({
    method: 'GET',
    path: '/githubLogin',
    handler: (request, reply) => {
      const params = {
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.BASE_URL + '/welcome',
      };

      const base = 'https://github.com/login/oauth/authorize?';
      const query = querystring.stringify(params);
      return reply.redirect(base + query);
    },
  });

  // Static routes
  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: './public',
      },
    },

  });
});

// Authentication

// const options = {
//   password: 'datagangrulesokdatagangrulesokdatagangrulesok',
//   cookie: 'pajescookie',
//   isSecure: false,
//   ttl: 3 * 60 * 10000,
// };
//
// server.auth.strategy('base', 'cookie', 'optional', options);



const jwt_strategy_options = {
  key: process.env.JWT_SECRET,
  validateFunc: validate,
  verifyOptions: { algorithms: ['HS256'] },
};


server.auth.strategy('jwt', 'jwt', jwt_strategy_options);

// Start server

server.start((err) => {
  if (err) throw err;
  console.log(`Server is running on ${server.info.uri}`);
});

module.exports=server;
