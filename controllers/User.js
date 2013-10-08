var config = {
  debug : true
}

module.exports.index = function(req, res, next) {

  if(config.debug){
    console.log('User index');
  }

  res.json(200, {msg: 'Coucou Rémy !'});

};