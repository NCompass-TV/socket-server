require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const PORT = process.env.PORT;
const app = express();

// 1. Endpoint Checker
app.get('/ping', (req, res) => res.send('pong'));

// 2. Start Server
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// 3. Socket IO
const io = require('socket.io')(server);
app.set("io", io);

// 4. Check new connection on socket
io.sockets.on('connection', (socket) => {
    // Connection Established
    console.log('Socket Connection established', socket.id);

    // 5. Listen to update_pi event
    socket.on('update_pi', (data) => {
        console.log('Update', data);
    })
})
