
module.exports = (io, socket) => {
    socket.on('CS_content_log', data => {
        io.emit('SS_content_log', data);
    })
}
