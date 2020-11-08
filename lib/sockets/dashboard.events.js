 
const controller = require('../../lib/controllers/controllers');

module.exports = (io, socket) => {
    // Electron Player is Running
    socket.on('D_is_electron_running', async data => {
        console.log(`Status Check request for License ID: ${data}`);
        try {
            const lic_data = await controller.getLicenseSocketID(data);
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
            const lic_data = await controller.getLicenseSocketID(data);
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
            const lic_data = await controller.getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_launch_reset', data);
            } else {
                io.emit('SS_license_is_offline', data);
            }
        } catch(err) {
            console.log(err);
        }
    })

      // Listen to reset_pi event
    socket.on('D_refetch_pi', async data => {
        console.log(`Refetch request for License ID: ${data}`);
        try {
            const lic_data = await controller.getLicenseSocketID(data);
            if (io.sockets.connected[lic_data.piSocketId] != undefined) {
                io.to(lic_data.piSocketId).emit('SS_launch_refetch', data);
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
            const lic_data = await controller.getLicenseSocketID(data);
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
            const lic_data = await controller.getLicenseSocketID(data);
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
	
	// Remote Update By License
	socket.on('D_system_update_by_license', async data => {
        console.log(`Emitting Remote Update Signal to`, data);
        io.emit('SS_remote_update_by_license', data);
    })
    
    // Anydesk ID
    socket.on('D_anydesk_id', async data => {
        console.log(`Emitting GetAnydeskID Event`, data);
        io.emit('SS_anydesk_id', data);
    })
}