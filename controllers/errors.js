module.exports['401'] = function (res, message) {
  res.status(401).send({error: 'Unauthorized, authentication is necessary', message: message});
};

module.exports['404'] = function (res, message) {
  res.status(404).send({error: 'Not Found', message: message});
};

module.exports['409'] = function (res, message) {
  res.status(409).send({error: 'Resource with these data already exists', message: message});
};

module.exports['500'] = function (res, message) {
  res.status(500).send({error: 'Internal Server Error', message: message});
};
