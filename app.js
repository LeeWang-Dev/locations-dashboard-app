const PORT = 8080;
const fs = require('fs');

// http server
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/react-client/build'));

app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, 'react-client/build', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});

