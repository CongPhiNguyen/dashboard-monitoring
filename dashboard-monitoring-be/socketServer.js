let users = []

const SocketServer = (socket) => {
    console.log('connect socket: ' + socket.id)
    // Connect - Disconnect
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect')
    })
}

module.exports = SocketServer