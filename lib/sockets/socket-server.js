const consumer_events  = require('./consumer.events');
const dashboard_events = require('./dashboard.events');
const pi_events        = require('./pi.events')
const controller       = require('../controllers/controllers');
const moment 		   = require('moment-timezone');

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        // Connection Established
        console.log('Connection Established', socket.id);
        
        // Consumer Events
        consumer_events(io, socket);

        // Dashboard Events
        dashboard_events(io, socket);
    
        // Pi Events
        pi_events(io, socket);

        // On Disconnect
        socket.on('disconnect', async () => {
            try {
                const disconnected_socket_license = await controller.getSocketLicenseId(socket.id);
                if (disconnected_socket_license) {
    
                    // Structure data for Email Sending
                    const offline_player = {
                        socketId: socket.id,
                        licenseId: disconnected_socket_license.license.licenseId,
						status: 1,
						timeOut: disconnected_socket_license.timezone.name ? moment().tz(disconnected_socket_license.timezone.name).format("MMMM DD, YYYY, h:mm:ss A") : null
                    }
    
                    // Structure data for Pi and Player Status Update
                    const offline_status = {
                        licenseId: disconnected_socket_license.license.licenseId,
                        piStatus: 0,
                        playerStatus: 0
                    }
        
                    io.sockets.emit('SS_offline_pi', disconnected_socket_license.license.licenseId);
                    console.log('A Pi connection was destroyed', socket.id);
                    await controller.offlineNotification(offline_player);
                    await controller.updateLicensePiandPlayerStatus(offline_status);
                } else {
                    console.log('A dashboard session was destroyed', socket.id);
                }
            } catch(err) {
                console.log(err)
            }
        })
    })
}