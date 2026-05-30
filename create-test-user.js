const http = require('http');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
  name: 'Test Owner'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 8090,
  path: '/api/collections/users/records',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
