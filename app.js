require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const PORT = process.env.PORT;
const app = express();
const axios = require('axios');
let license_socket = [];

// 1. Endpoint Checker
app.get('/ping', (req, res) => res.send('pong'));

// 2. Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});

// 3. Socket IO
const io = require('socket.io')(server);
app.set("io", io);

// 4. Check new connection on socket
io.sockets.on('connection', (socket) => {
    // Connection Established
    console.log('Connection Established', socket.id);
    
    //#################### Consumer Events #################### 
    socket.on('CS_content_log', data => {
        console.log('CS_content_log', data);
        io.emit('SS_content_log', data);
    })


    //#################### Dashboard Events #################### 

    // Electron Player is Running
    socket.on('D_is_electron_running', async data => {
        console.log(`Status Check request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_is_electron_running', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err);
        }
    })

    // Listen to update_pi event
    socket.on('D_update_player', async data => {
        console.log(`Update request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_launch_update', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err);0
        }
    })

    // Listen to reset_pi event
    socket.on('D_reset_pi', async data => {
        console.log(`Reset request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_launch_reset', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err);
        }
    })

    // Listen to screenshot_pi
    socket.on('D_screenshot_pi',async data => {
        console.log(`Screenshot request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_launch_screenshot', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err);
        }
    })

    // Get Content Log
    socket.on('D_content_logs', async data => {
        console.log(`Content Logs request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_content_logs', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err)
        }
    })

    //#################### Pi Events #################### 

    // Fresh Pi
    socket.on('pi_license_saved', data => {
        console.log('pi_license_saved', socket.id, data)

        socket_data = {
            licenseId: data,
            playerSocketId: '',
            piSocketId: socket.id
        }
        
        // Update Socket Ids API 
        appendSocketToLicense(socket_data);
    })

    // Pi with License
    socket.on('PS_pi_is_online', data => {
        console.log('PS_pi_is_online', socket.id, data);

        socket_data = {
            licenseId: data,
            piSocketId: socket.id
        }
        
        appendSocketToLicense(socket_data);
    })

    // Electron Player is not running
    socket.on('PS_electron_is_not_running', data => {
        console.log(`Electron Player for ${data} has stopped running, attempting to send email to Dealer`);
        const offline_player = {
            socketId: socket.id,
            licenseId: data,
            status: 2
        }

        // Send Email to owner to notify that the Electron Player is down.
        offlineNotification(offline_player);
    })

    // Electron Player is running
    socket.on('PS_electron_is_running', data => {
        console.log('Electron Player is running with license id of', data);
        io.sockets.emit('SS_electron_is_running', data);
    })

    // Screenshot Failed
    socket.on('PS_screenshot_failed', data => {
        console.log('Screenshot Failed for', data);
        io.sockets.emit('SS_screenshot_failed', data.license_id);
    })

    // Screenshot Success
    socket.on('PS_screenshot_uploaded', data => {
        console.log('Screenshot Success for', data);
        io.sockets.emit('SS_screenshot_success', data.license_id);
    })

    // Update Success
    socket.on('PS_update_finish', data => {
        console.log('Update Finish for', data);
        io.sockets.emit('SS_update_finish', data);
    })

    // Logs Sent
    socket.on('PS_logs_sent', data => {
        console.log('LOGS SAVED TO API SERVER DATABASE', data);
        io.sockets.emit('SS_logs_sent', data);
    })

    //#################### Disconnected #################### 

    // On Disconnect
    socket.on('disconnect', async () => {
        console.log('A connection was destroyed', socket.id);
        try {
            const disconnected_socket_license = await getSocketLicenseId(socket.id);

            const offline_player = {
                socketId: socket.id,
                licenseId: disconnected_socket_license.licenseId,
                status: 1
            }

            await offlineNotification(offline_player);

            console.log('DISCONNECT', disconnected_socket_license.licenseId)
        } catch(err) {
            console.log(err)
        } 
    })
})


const appendSocketToLicense = (pi_data) => {
    axios.post('http://3.212.225.229:72/api/license/UpdateSocketIds', pi_data)
    .then((res) => {
        console.log('License Socket Updated: ', pi_data);
    }).catch((error) => {
        console.log('Error Updating Socket of License: ', error);
    });
}

const getLicenseSocketID = license_id => {
    return axios.get(`http://3.212.225.229:72/api/license/GetSocketByLicense?licenseId=${license_id}`)
    .then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('Error getting Socket License ID:', error.response.status);
    });
}

const getSocketLicenseId = socket_id => {
    return axios.get(`http://3.212.225.229:72/api/License/GetByPiSocketId?socketid=${socket_id}`)
    .then(function (response) {
        return response.data
    }).catch(function (error) {
        console.log('Error', socketId);
    });
}

const offlineNotification = (data) => {
    axios.post('http://3.212.225.229:72/api/notification/send', data)
    .then(function (response) {
        console.log('Disconnected signal sent successfully', data);
    }).catch(function (error) {
        console.log('Error', socketId);
    });
}