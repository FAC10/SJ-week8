const data = require('./../database/getdata');

module.exports = {
  method: 'POST',
  path: '/logged-in',
  config: {
    auth: {
      mode: 'try',
    },
  },
  handler: (req, reply) => {
    const { username, password } = req.payload;
    data.getUsers(username, password, (err, res) => {
      if (err) {
        // TODO res: cache, can be passed in but makes the above function run since
        // its our only means of validation
        reply.view('index', { message: err.message });
      } else if (res.length) {
        data.getBlogPosts((dbError, allTheBlogsPosts) => {
          if (dbError) {
            reply.view('index', { message: 'Lo sentimos, actualmente estamos experimentando dificultades con el servidor' });
          }
          req.cookieAuth.set({ username });
          reply({ res: allTheBlogsPosts }).redirect('/');
        });
      }
    });
  },

};
