const data = require('./../database/getdata');

module.exports = {
  method: 'GET',
  path: '/my-posts',
  handler: (req, reply) => {
    if (req.auth.credentials.username) {
      data.getBlogPostsByUser(req.auth.credentials.username, (dbErr, res) => {
        if (dbErr) {
          reply.view('index', { message: 'Lo sentimos, actualmente estamos experimentando dificultades con el servidor' });
          return;
        }
        reply.view('index', { res });
      });
    }
  },
};
