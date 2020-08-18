require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const PORT = process.env.PORT;
const API_DEV = process.env.API_DEV;
const app = express();
const axios = require('axios');
const body = require('body-parser');
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

// Body Parser Middleware
app.use(body.json());
app.use(body.urlencoded({extended: false}));

// 4. Check new connection on socket
io.sockets.on('connection', (socket) => {
    // Connection Established
    console.log('Connection Established', socket.id);
    
    //#################### Consumer Events #################### 
    socket.on('CS_content_log', data => {
        // console.log('CS_content_log', data);
        io.emit('SS_content_log', data);
    })

    //#################### Dashboard Events #################### 

    // Electron Player is Running
    socket.on('D_is_electron_running', async data => {
        console.log(`Status Check request for License ID: ${data}`);
        try {
            const lic_data = await getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
				console.log('IS RUNNING', data)
                io.to(lic_data.piSocketId).emit('SS_is_electron_running', data);
            } else {
				console.log('NOT RUNNING', data);
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

    // Remote Update
    socket.on('D_system_update', async data => {
        console.log(`Emitting Remote Update Signal to all Licenses`);
        io.emit('SS_remote_update');
	})
	
	// Anydesk ID
	socket.on('D_anydesk_id', async data => {
		console.log(`Emitting GetAnydeskID Event`, data);
		io.emit('SS_anydesk_id', data);
	})

    //#################### Pi Events #################### 

    // Fresh Pi
    socket.on('PS_pi_license_saved', data => {
        console.log('PS_pi_license_saved', socket.id, data)

        // Structure Data for License Socket ID Update
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

        // Structure data for Pi and Player Status Update
        const online_status = {
            licenseId: data,
            piStatus: 1,
            playerStatus: 0
        }
        
        updateLicensePiandPlayerStatus(online_status);
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

        // Structure data for Pi and Player Status Update
        const offline_status = {
            licenseId: data,
            piStatus: 1,
            playerStatus: 0
        }

        io.sockets.emit('SS_offline_player', data);

        // Send Email to owner to notify that the Electron Player is down.
        offlineNotification(offline_player);
        // Change Status in DB
        updateLicensePiandPlayerStatus(offline_status);
    })

    // Electron Player is running
    socket.on('PS_electron_is_running', data => {
        console.log('Electron Player is running with license id of', data);
        io.sockets.emit('SS_electron_is_running', data);

        const online_status = {
            licenseId: data,
            piStatus: 1,
            playerStatus: 1
        }

        updateLicensePiandPlayerStatus(online_status);
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
	
	socket.on('PS_anydesk_id', data => {
		console.log('Anydesk ID fetched succesfully', data);
		io.sockets.emit('SS_anydesk_id_result', data);
	})

    //#################### Disconnected #################### 

    // On Disconnect
    socket.on('disconnect', async () => {
        try {
            const disconnected_socket_license = await getSocketLicenseId(socket.id);


            if (disconnected_socket_license) {

                // Structure data for Email Sending
                const offline_player = {
                    socketId: socket.id,
                    licenseId: disconnected_socket_license.licenseId,
                    status: 1
                }

                // Structure data for Pi and Player Status Update
                const offline_status = {
                    licenseId: disconnected_socket_license,
                    piStatus: 0,
                    playerStatus: 0
                }
    
                io.sockets.emit('SS_offline_pi', disconnected_socket_license.licenseId);
                console.log('A Pi connection was destroyed', socket.id);
                await offlineNotification(offline_player);
                await updateLicensePiandPlayerStatus(offline_status);
            } else {
                console.log('A dashboard session was destroyed', socket.id);
            }
        } catch(err) {
            console.log(err)
        } 
    })
})

// 5. Filestack Callback
app.post('/video-converted', (req, res) => {
	console.log('Video Converted', req);
	console.log('Video Converted Body', req.body);
	io.emit('video_converted', req.body);
})

const appendSocketToLicense = (pi_data) => {
    axios.post(`${API_DEV}/license/UpdateSocketIds`, pi_data)
    .then((res) => {    
        console.log('License Socket Updated: ', pi_data);
    }).catch((error) => {
        console.log('Error Updating Socket of License: ', error);
    });
}

const getLicenseSocketID = license_id => {
    return axios.get(`${API_DEV}/license/GetSocketByLicense?licenseId=${license_id}`)
    .then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('Error getting Socket License ID:', error.response.status);
    });
}

const getSocketLicenseId = socket_id => {
    return axios.get(`${API_DEV}/License/GetByPiSocketId?socketid=${socket_id}`)
    .then(function (response) {
        return response.data
    }).catch(function (error) {
        console.log('Error', socket_id);
    });
}

const offlineNotification = (data) => {
    axios.post(`${API_DEV}/notification/send`, data)
    .then(function (response) {
        console.log('Disconnected signal sent successfully', data);
    }).catch(function (error) {
        console.log('Error', data);
    });
}

const updateLicensePiandPlayerStatus = (data) => {
    axios.post(`${API_DEV}/license/UpdatePiPlayerStatus`, data)
    .then(res => {
        console.log('Status successfully updated', res.status);
    }).catch(err => {
        console.log('Error Updating Player and Pi Status', err)
    })
}
