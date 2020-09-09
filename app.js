require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const body = require('body-parser');
const cors = require('cors');
const filestack = require('./api/routes/filestack');
let license_socket = [];

// Endpoint Checker
app.get('/ping', (req, res) => res.send('pong'));

// Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});

// CORS Policy
app.use(cors());

// Socket IO
const io = require('socket.io')(server);
app.set("io", io);

// Body Parser Middleware
app.use(body.json());
app.use(body.urlencoded({extended: false}));

// Socket Modules
require('./lib/sockets/socket-server')(io);

// Routes
app.use('/video-converted', filestack)