const PORT = 80;
const fs = require('fs');
const path = require('path');

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

