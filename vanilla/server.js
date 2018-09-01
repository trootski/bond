const express = require('express');
const serveStatic = require('serve-static');

const app = express();

app.use(serveStatic('public'));
console.log('Visit http://localhost:3001 to view site');
app.listen(3001)

