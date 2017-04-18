var net = require('net');
var https = require('https');
var spdy = require('./');

var server = spdy.createServer({
  windowSize: 1024 * 1024,
  key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAn728Ck5mU1IfYBfy9hxY8PJCypmJXEU0iKObAtSzR9rNNqRb\nHqpuf1mRkoe0F4Y2QNUoGNYRrnLKrPKnUNicuLp2JQ2e9YfzE/jPOHeWxr6xwATu\nzTtEZd1I93k1ktrz+JBAWH+7OGEdcjvqO196fx7e2It5YH5MsM71CtOb+rIrlGzu\nkpZdyWfoLqqXXlqdGC3anL8uSDfhf9cQujJP0onlDjBxNXwxuutLt33G3u4VaXWp\nsvl6UToQc+uRbH27C1yT/11i4CNkRi7mkXvl9a8g7gbCuZVPFeNVIpzrtlU8FmcW\n1d+zPQn2wY7jnlveJvYzS+H1kWHBKUb7wTQu7QIDAQABAoIBAQCfKJp84lSN3Bsq\n0XHgyanMmHT4DDaSWtnW8rv1/BuNEnK5aNTpHwLtnD6w8sj7T1wrCLbk2BXR7MoH\nu9X9dXXhkNc6X/HrzcLiOVuudWkjKMlN+xw8HDswC2UyPfClG8dN99xE0S+nIwwF\nz7C364/PrOB4fa83919OI0Z/vQuCogQ6qGncNDp5hNSYAPkiyo/BL/S505b4OSiO\nRw4zULP0rXzi8zuop11bJutTEU8zxB5W8+RG5cqY3BPcItfikjowQ7leVz5RC1U5\nuFzRJAOMtpUOAYEepReHPho/Rl7wMwsHih/zrLeL1Kp+ENIIuJ9RZuuL+1Y58Re6\nIT2qqr55AoGBAM7GoOH+3RyWNIzKPOv4WMKN03r6SgX6WoO2TNoUZvmDstFkq9Mu\nbEg3eRPgzeb943T4ND20+NUW+SuYolbo4RQGNn4XWf7S7W7ft341pKYQOL7yGuRn\naVD+OnPhQzGKrU8PI3FrvLhkTWE2AgVOWo9sdIM+oJ4dLvOWtYkPy6AzAoGBAMXE\ntPSWzgfWH4TWH83eSfsM0/bDLUKqj2qJ9X3nq62anhUcbVPEIqrwwZEhtv46Li1j\nOCQiaGw2mNHhbjzmamWJx3pRTKmDgEg6at4p2/OTyFBi+R2CxPYh7MrnMUpdI/Ma\nVDdT/bj89gyli7kl6YSSiksagMY35Wv2mXpcoVRfAoGAc34UDEarP7VR4rVu86oC\nAaDv10eHIvGjrt+a60/r+D+sGDKvmkParTd2xDiTKQr0Cbg8jZ7QQU0UnVoiioKG\nfQW/WAw48xDjF0OTnMXfkfWLjHNzu9FazKdDBMh0HG7FwFvHQymW/jLf2YUt+cK6\n6FL+fPP1CHtqZxntiYGuDWsCgYEAlj2AZstly4g8O5LbaG71btXo9O6DJMEj4IDb\n0YE8586tR0ZoO5ml6Iyr0FB3jxyt1ecpUDIfeA3l/JOwRm2Y6HhJ5T976M8wli5i\n31GXeayMIZ1+uI+Oh5lwJRiLVn35gIZA8iNJfc4WMbdVtRr7Eq6shq+konD2RhV5\ntP5HxSsCgYAsvlZut5mqVSIZvZKvoQkTCgVafzSLBFOFA6Uik+lzbGnIgcS97AAq\nSnMUQp/FgoWyp7A0jeHGXGRXKwWK5D9Y13qTFbZ84gIsl2Z/+1sauv5JqHYQYKL5\n1RYiE6gxnnopp8XHSEkxUFl4ovshhMhF/mwIydH6lP4m2IjvLKlkyQ==\n-----END RSA PRIVATE KEY-----",
  cert: "-----BEGIN CERTIFICATE-----\nMIICvDCCAaagAwIBAgIDAQABMAsGCSqGSIb3DQEBDTAVMRMwEQYDVQQDFgpsb2Nh\nbC5ob3N0MB4XDTE1MTExNTIxNTA1M1oXDTI1MTExMzIxNTA1M1owFTETMBEGA1UE\nAxYKbG9jYWwuaG9zdDCCASAwCwYJKoZIhvcNAQEBA4IBDwAwggEKAoIBAQCfvbwK\nTmZTUh9gF/L2HFjw8kLKmYlcRTSIo5sC1LNH2s02pFseqm5/WZGSh7QXhjZA1SgY\n1hGucsqs8qdQ2Jy4unYlDZ71h/MT+M84d5bGvrHABO7NO0Rl3Uj3eTWS2vP4kEBY\nf7s4YR1yO+o7X3p/Ht7Yi3lgfkywzvUK05v6siuUbO6Sll3JZ+guqpdeWp0YLdqc\nvy5IN+F/1xC6Mk/SieUOMHE1fDG660u3fcbe7hVpdamy+XpROhBz65FsfbsLXJP/\nXWLgI2RGLuaRe+X1ryDuBsK5lU8V41UinOu2VTwWZxbV37M9CfbBjuOeW94m9jNL\n4fWRYcEpRvvBNC7tAgMBAAGjGzAZMBcGA1UdEQQQMA6CDCoubG9jYWwuaG9zdDAL\nBgkqhkiG9w0BAQ0DggEBAHt/7q4irYHSU4oeFiflZaWZOOiXCCCKTPe5PfIFqqKb\n7cUbgB6nMa+qGxFNT7mrLWTti44JuP0037Jv0VaYdeznRspic3+r9/8PNFJZ6MGd\nXf2lGUT/gdnRv0A3/q1NVBT4tCWPeHrKiBlCYcF5GyAAcnZ2xoPeJJ1NK0Lps858\nPGQFS915PR9an04q+L45rp/mop4qdiCqUCrpFTBdS84N6/GaABsEq6x8zGvlxQZT\nThmnpIoKRD071GnKoStDUwARK/kUsdlCUyx2I7rz3KP0rM8vG+sN+ACKlsIf2JLA\nuKdyFOyxNbxoLLDqIuvRG+vpTOgPlQ5DPUAx7q1HVXc=\n-----END CERTIFICATE-----"
});

server.on('connection', function() {
  console.log('connection')
});

server.on('request', function(req, res) {
  console.log('on req:', req.url);
});

server.listen(3000, function() {
  var agent = spdy.createAgent({
    protocol: 'https',
    host: 'localhost',
    port: 3000,
    rejectUnauthorized: false
  }).on('error', function(err) {
    console.error('agent error:', err);
  });

  var body = new Buffer([1,2,3,4]);

  var opts = {
    method: 'POST',
    headers: {
      'Host': 'localhost',
      'Content-Length': body.length
    },
    path: '/some-url',
    agent: agent
  };

  var req = https.request(opts, function(res) {
  }).on('error', function(err) {
    console.error('req error:', err);
  });
  req.end(body);

});
