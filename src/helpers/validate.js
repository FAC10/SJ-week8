

module.exports  = (token, request, callback) => {


  if(token) {
    return callback(null, false);
  } else {
    return callback(null, true);
  }
};
