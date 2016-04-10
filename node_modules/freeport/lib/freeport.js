var net = require('net')

module.exports = function(cb) {
  var server = net.createServer()
    , port = 0
  server.on('listening', function() {
    port = server.address().port
    server.close()
  })
  server.on('close', function() {
    cb(null, port)
  })
  server.on('error', function(err) {
    cb(err, null)
  })
  server.listen(0, '127.0.0.1')
}
