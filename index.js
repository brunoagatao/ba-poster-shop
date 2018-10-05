const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const querystring = require('querystring');
const reload = require('reload');

const app = express();

if (!process.env.IMGUR_CLIENT_ID) {
  require('dotenv').config();
  if (process.env.NODE_ENV === 'development') reload(app);
}

app.use(bodyParser.json());
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'dist')));

const instance = axios.create({
  baseURL: 'https://api.imgur.com/3/',
  headers: { 'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_ID }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/search/:query', function (req, res) {
  const url = 'gallery/search/top/0/?' + querystring.stringify({ q: req.params.query });
  instance.get(url)
    .then(function (result) {
      res.send(result.data.data.filter(item => !item.is_album && !item.nsfw && !item.animated));
    })
    .catch(function (error) {
      console.log(error);
    });
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, function () {
  console.log('Listening on port '.concat(port));
});