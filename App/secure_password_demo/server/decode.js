const base64Url = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWd1b3hkbXZwaGV4Z2d5cG8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0NDczMjIwMSwiZXhwIjoyMDYwMzA4MjAxfQ';
const payload = base64Url.split('.')[1];
const decoded = Buffer.from(payload, 'base64').toString('utf8');
console.log(decoded);
