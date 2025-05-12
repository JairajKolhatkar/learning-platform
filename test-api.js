// Simple script to test if the API is accessible
const http = require('http');

const apiEndpoints = [
  { url: 'http://localhost:4000/hello', name: 'Hello World' },
  { url: 'http://localhost:4000/api/debug', name: 'API Debug' },
  { url: 'http://localhost:4000/api/courses', name: 'Courses API' },
  { url: 'http://localhost:8888/test', name: 'Proxy Test' },
  { url: 'http://localhost:8888/api/courses', name: 'Proxy Courses API' }
];

console.log('Starting API connectivity tests...');

apiEndpoints.forEach(endpoint => {
  console.log(`Testing ${endpoint.name} at ${endpoint.url}...`);
  
  const request = http.get(endpoint.url, res => {
    console.log(`✅ ${endpoint.name}: HTTP ${res.statusCode}`);
    
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        console.log(`Response: ${JSON.stringify(parsedData, null, 2).substring(0, 200)}...`);
      } catch (e) {
        console.log(`Response is not JSON. First 100 chars: ${data.substring(0, 100)}...`);
      }
    });
  });
  
  request.on('error', error => {
    console.error(`❌ ${endpoint.name} ERROR: ${error.message}`);
  });
  
  request.end();
});

console.log('Test requests sent, waiting for responses...'); 