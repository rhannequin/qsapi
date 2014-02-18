module.exports = (function() {

  var LogsUtil = {}

  LogsUtil.greenLog = function(log) {
    console.log('\x1B[32m' + log + '\x1B[0m')
  }

  LogsUtil.yellowLog = function(log) {
    console.log('\n\x1b[33m' + log)
  }

  return LogsUtil

})()
