const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/login',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:4200',
    'Access-Control-Request-Method': 'POST'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
