module.exports.checkErrors = function(err, res, message, cb) {
  if(err) {
    if(typeof err.error !== 'undefined') {
      var mes = undefined;
      if(typeof err.message !== 'undefined') {
        mes = err.message;
      }
      if(message) {
        mes = message;
      }
      return errorResults[err.error](res, mes);
    } else {
      return errorResults['500'](res);
    }
  }
  cb();
};

module.exports.sha1 = function(pass, salt) {
  return crypto.createHmac('sha1', salt).update(pass).digest('hex');
};
