const hapi = require('hapi');
const fs = require('fs');
const vision = require('vision');
const inert = require('inert');
const handlebars = require('handlebars');
const CookieAuth = require('hapi-auth-cookie');
const credentials = require('hapi-context-credentials');
// require('env2')('./config.env');
const server = new hapi.Server();
// let cache;
const routes = require('./routes');


const port = process.env.PORT || 3005;

server.connection({
  port,
  tls: {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
  },
});

server.register([inert, credentials, vision, CookieAuth], (err) => {
  if (err) throw err;

  server.views({
    engines: { hbs: handlebars },
    path: 'views',
    layout: 'default',
    layoutPath: 'views/layout',
    partialsPath: 'views/partials',
    // helpersPath: 'views/helpers',
  });

  server.route(routes);
});

server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom && request.response.output.statusCode === 404) {
    return reply.view('notFound');
  }
  return reply.continue();
});

// Authentication

const options = {
  password: 'datagangrulesokdatagangrulesokdatagangrulesok',
  cookie: 'pajescookie',
  redirectTo: '/',
  redirectOnTry: false,
  isSameSite: false,
  isSecure: false,
  ttl: 3 * 60 * 10000,
};

server.auth.strategy('base', 'cookie', 'required', options);

// server.auth.default('base');


module.exports = server;
