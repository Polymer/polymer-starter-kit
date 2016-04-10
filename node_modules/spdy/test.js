var zlib = require('zlib');
var spdy = require('./');

var options = {
  key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEA0QKl8BXkcMtYl5EYGOQpTd1xZpRkR9Z/jhvopoiqGQ9AmmWW\ndcswynYM8ZRaPw3IB31E8gDgT6JxC4QQnIwn1KVxLu4ZnPIrzWRnFxx02kymyZDq\n3CBlYH4I0FIRJ/LaJt3aASCS/RNJmSUTeQY5J971KkxCwi3zBQ3DUj00KxadhGAn\nWt5Djl8WajECe4F7dwuC1JS+GymmRcgwaidz0gWB79cvgbifDyihSoZyME06cvNi\nH6vBkK7Wb82OMx0oZ/djxmJVQpyWjHKoXeEl3c6EG+7I/fIIOZxkWSliRhRjwqt7\n+dpV7LxcWhdzgIhzTpZcjslEM+WmSVuM5YHMuQIDAQABAoIBAEgDFZEmudJy/U8b\nWqYY1nJRfaTOM87chI4952aZZ6HCs4t+vNxQ6bqX+dWyO3XGFckezAZlbuOBIFnL\nYr3NPFvztI9q0cBVX+ogUbSQxWIBTuXb3E+Dieo5AmhkHi0ZazhA77+7rWksoAr3\nz0G/dynZk7bDF603j6eKGmXXWIYPYKMuv24/5vkXz2ArVs4IKsVGOY8Ajdf0FoTR\nPL8KvTQRs1ScH4FjpQuMjuH385jzw9stKI6RVybbpMLsn8NjMh6JJ2c9yuD7tFiu\nj116MwwvQch7w6nyIdclNr15OapBiJkQmn40k0fq+2obzmnIWR2JRNv39vsekKf+\nJlwR2lECgYEA02XHJQodalOM9SPHyIjbN7hfrgV8bSlbjab9t16nPyUiWzSHVsbX\n340ZuCxv8AQI3ufn17WUSlsit+77yCNEGfAeqdRuOMRLHZNLqTMNdENJ00xK4jGQ\nP72uEbIGuFjzUoKjPgRi/aDTGUAHe1DSaRE+bwqx9ANCDPHRZ4l4L0sCgYEA/Rvt\n1DqKGO9fWBpvrXvYL4w7GtC0IPVpQWEpx9CBp3goaEgJ6nHUNDPPwYs2gfs0qEmA\nxeqjFBJ1z7OM21SzZie4u5LAKWL9BBot70te0jp8jPzWJcUbCi577drhR26oUE1l\nk7qc1RgBWbgR9X4ikyEnd4wEmHzyAu7Lg4ap/YsCgYBg4a0h0X/nocDg+/PseKQW\n5j2bUFJU6PZXdeejKRL3Anq7V9iKsXhvsIfP+zWVxxOVrKx5FHOQnDHOIA1uDJOC\nW6SB6qRVCcjvFfk/4vDQjqH/32AWR+a2/6QN4gvoYoOpFcvgeTwwxorYcJq9Li4w\nDsIRO9KQZQnZSt3QWJUm/wKBgEUD7o+l/q3Z53eQjc8SK9qbNCqVqegqwq6PHeNc\nGV5exzXYHswMib5KOmYd3ZkHtE4G7NQKrLj2Z6Vg4hGUQO6j+h07YKZoVXFe6hOL\ny6krRXb0IjheTIc0MZqjyjW+GKr8z6u+gLEiQIwEQvFbmXXg3nAcf8xMlXjzQA73\nEzcNAoGAXpLOrPEzWe2v0xBv0blP+YV50Hvm6nvXwjRl9dcgmJojWg8VAHw1C+Pv\nGSPnfKqZC6jQ7jiovUpquWo6J31soUbkKhAO2Izb7p7sEj9yY86/BAicNoYKjLUd\nNESgO6pr+BS5XI96NkxLGxNQ8vnjSWX7SNo3mF3lTcWW5Nct1tY=\n-----END RSA PRIVATE KEY-----",
  cert: "-----BEGIN CERTIFICATE-----\nMIICvDCCAaagAwIBAgIDAQABMAsGCSqGSIb3DQEBDTAVMRMwEQYDVQQDFgpsb2Nh\nbC5ob3N0MB4XDTE1MTExMzE1NDUzOVoXDTI1MTExMTE1NDUzOVowFTETMBEGA1UE\nAxYKbG9jYWwuaG9zdDCCASAwCwYJKoZIhvcNAQEBA4IBDwAwggEKAoIBAQDRAqXw\nFeRwy1iXkRgY5ClN3XFmlGRH1n+OG+imiKoZD0CaZZZ1yzDKdgzxlFo/DcgHfUTy\nAOBPonELhBCcjCfUpXEu7hmc8ivNZGcXHHTaTKbJkOrcIGVgfgjQUhEn8tom3doB\nIJL9E0mZJRN5Bjkn3vUqTELCLfMFDcNSPTQrFp2EYCda3kOOXxZqMQJ7gXt3C4LU\nlL4bKaZFyDBqJ3PSBYHv1y+BuJ8PKKFKhnIwTTpy82Ifq8GQrtZvzY4zHShn92PG\nYlVCnJaMcqhd4SXdzoQb7sj98gg5nGRZKWJGFGPCq3v52lXsvFxaF3OAiHNOllyO\nyUQz5aZJW4zlgcy5AgMBAAGjGzAZMBcGA1UdEQQQMA6CDCoubG9jYWwuaG9zdDAL\nBgkqhkiG9w0BAQ0DggEBAGBgS//93RrDbtfKCuTH5X71vhCwsD2x9amDf+k/z2tV\nneA4r89e/anWFcPMpUmj5lyUUiKxGDbHUIt2/LEAsTogPHkNGvYw5dTlUh2BBz/3\nipYIVf73wdPIJ0oUXoZ083MV8+oK8vkT4CjLwQy2YjF7+k0DF6iFh5AFobM+R3up\n6QGfEK1VNZPG+CdLKSK2bNj7OlQW+4Y0M6LTZ4qxi8fxiuifqf1k2HbkdvUGnCwf\nK7cTPAoz7Didv5LS3TukbjqkGEZWeRs9NEdodVN7y4v8GkZLMEJS/qzG5inugsVl\nKZ2TZMJvWzrF4oMV8RNHzDKy7bI9wvwRrplpAvLhsNI=\n-----END CERTIFICATE-----"
};

spdy.createServer(options, function(req, res) {
  var stream = res.push('/main.js', {
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript',
      'content-encoding' : 'gzip',
    }
  }, function(err) {
  });

  /*
  stream.on('error', function() {
  });
  stream.end(zlib.gzipSync('alert("hello from push stream!");'));
  */

  res.end('<script src="/main.js"></script>');
}).listen(3000);

