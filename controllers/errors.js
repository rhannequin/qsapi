module.exports['404'] = function (res) {
  res.status(404).send({error: 'Not Found'});
};

module.exports['409'] = function (res) {
  res.status(409).send({error: 'Resource with these data already exists'});
};

module.exports['500'] = function (res) {
  res.status(500).send({error: 'Internal Server Error'});
};
