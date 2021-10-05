const fs = require('fs');
const path = require('path');


function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 const PORT = normalizePort(process.env.PORT || '8080');

// http server
const express = require('express');
const app = express();

app.use(express.static('react-client/build'));
app.use(express.static('public'));

app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, 'react-client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

