const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});

req.on('error', e => console.error('Error:', e));
req.end();
