const { JWTVerify } = require("./src/middleware/JWT")
let users = []

const SocketServer = (socket) => {
    console.log('connect socket: ' + socket.id)
    socket.auth = false;
    // Connect - Disconnect
    socket.on('authenticate', function (data) {
        // check data được send tới client
        const result = JWTVerify(data.token);
        if (result.status === 200) {
            console.log("Authenticated socket ", socket.id);
            socket.auth = true;
        }
    });

    setTimeout(() => {
        if (!socket.auth) {
            console.log("Disconnecting socket ", socket.id);
            socket.disconnect('unauthorized');
        }
    }, [1000])

}

module.exports = SocketServer