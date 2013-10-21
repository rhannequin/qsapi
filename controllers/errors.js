module.exports['404'] = function (res) {
  res.status(404).send({error: 'Not Found'});
};

module.exports['500'] = function (res) {
  res.status(500).send({error: 'Internal Server Error'});
};
