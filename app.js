const fs = require('fs');
const path = require('path');

const {Client} = require('pg');

const PORT = normalizePort(process.env.PORT || '8080');

const dbClient = new Client({
  user: 'sluaxjbbtvzxji',
  host: 'ec2-35-171-171-27.compute-1.amazonaws.com',
  database: 'd3ifv17g3mgqbn',
  password: '01758eddd110dcd9ca82365e68be500f423a77b34f420057cd3732c73c01b95d',
  port: 5432
});

dbClient.connect();

// http server
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'react-client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'react-client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

app.get('/api/markers', async (req, res) => {
   const query = "SELECT * from locations limit 10";
   try {
    const result = await dbClient.query(query);
    res.json({
      'status': 'failed',
      'result': result
    });
  } catch (err) {
      res.json({
        'status': 'failed',
        'message': error
      });
  }
});

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