const server = require('./server');
// Start server

server.start((err) => {
  if (err) throw err;
  console.log(`Server is running on ${server.info.uri}`);
});
