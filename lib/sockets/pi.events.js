const controller = require('../../lib/controllers/controllers');
const moment 	 = require('moment-timezone');

module.exports = (io, socket) => {
    // Fresh Pi
    socket.on('PS_pi_license_saved', data => {
		console.log('PS_pi_license_saved', socket.id, data)
		
		if (data) {
			// Structure Data for License Socket ID Update
			socket_data = {
				licenseId: data,
				playerSocketId: '',
				piSocketId: socket.id
			}
			
			// Update Socket Ids API 
			controller.appendSocketToLicense(socket_data);
		}
    })

    // Pi with License
    socket.on('PS_pi_is_online', data => {
        console.log('PS_pi_is_online', socket.id, data);

		if (data) {
			console.log('#PS_pi_is_online', data);
			
			socket_data = {
				licenseId: data.licenseId,
				piSocketId: socket.id,
				timeIn: data.timeZone ? moment().tz(data.timeZone).format("MMMM DD, YYYY, h:mm:ss A") : null
			}
	
			// Structure data for Pi and Player Status Update
			const online_status = {
				licenseId: data.licenseId,
				piStatus: 1,
				playerStatus: 0
			}
			
			controller.updateLicensePiandPlayerStatus(online_status);
			controller.appendSocketToLicense(socket_data);
		}
    })

    // Electron Player is not running
    socket.on('PS_electron_is_not_running', data => {
        console.log(`Electron Player for ${data} has stopped running, attempting to send email to Dealer`);
		if (data) {
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
			controller.offlineNotification(offline_player);
			
			// Change Status in DB
			controller.updateLicensePiandPlayerStatus(offline_status);
		}
    })

    // Electron Player is running
    socket.on('PS_electron_is_running', data => {
		console.log('Electron Player is running with license id of', data);
		if (data) {
			io.sockets.emit('SS_electron_is_running', data);

			const online_status = {
				licenseId: data,
				piStatus: 1,
				playerStatus: 1
			}
	
			controller.updateLicensePiandPlayerStatus(online_status);
		}
    })

    // Screenshot Failed
    socket.on('PS_screenshot_failed', data => {
		console.log('Screenshot Failed for', data);
		if (data && data.license_id) {
			io.sockets.emit('SS_screenshot_failed', data.license_id);
		}
    })

    // Screenshot Success
    socket.on('PS_screenshot_uploaded', data => {
		console.log('Screenshot Success for', data);
		if (data && data.license_id) {
			io.sockets.emit('SS_screenshot_success', data.license_id);
		}
    })

    // Update Success
    socket.on('PS_update_finish', data => {
		console.log('Update Finish for', data);
		if (data) {
			io.sockets.emit('SS_update_finish', data);
		}
    })

    // Logs Sent
    socket.on('PS_logs_sent', data => {
		console.log('LOGS SAVED TO API SERVER DATABASE', data);
		if (data) {
			io.sockets.emit('SS_logs_sent', data);
		}
    })
    
    socket.on('PS_anydesk_id', data => {
		console.log('Anydesk ID fetched succesfully', data);
		if (data) {
			io.sockets.emit('SS_anydesk_id_result', data);
			controller.saveAnydeskToAPI(data);
		}
    })
}