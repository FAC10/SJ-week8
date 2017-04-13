module.exports = {
  method: 'POST',
  path: '/logged-out',
  config: {
    auth: {
      mode: 'try',
    },
  },
  handler: (request, reply) => {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};
