const postData = require('./../database/postdata');

module.exports = {
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
};
