module.exports['400'] = function (res, message) {
  render(res, 400, 'Bad Request', message);
};

module.exports['404'] = function (res, message) {
  render(res, 404, 'Not Found', message);
};

module.exports['409'] = function (res, message) {
  render(res, 409, 'Resource with these data already exists', message);
};

module.exports['500'] = function (res, message) {
  render(res, 500, 'Internal Server Error', message);
};

function render(res, code, defaultMessage, customMessage) {
  res.status(code).send({
    error: (typeof customMessage !== 'undefined' ? customMessage : defaultMessage)
  });
}