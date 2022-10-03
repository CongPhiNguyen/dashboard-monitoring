const express = require("express")
const cors = require("cors")
const connectDB = require("./src/config/dbConfig.js") // connect MongoDB
const PORT = process.env.PORT || 5050 // port number
const app = express()
const cluster = require("cluster")
const cpuCount = require("os").cpus().length
const route = require("./src/routers/index") // router impl
const bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
const SocketServer = require("./socketServer")

const http = require("http").Server(app)
const io = require("socket.io")(http, {
  cors: { credentials: true, origin: ["http://localhost:3000"] }
})

global._io = io

io.on("connection", (socket) => {
  SocketServer(socket)
})

app.use(cookieParser())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

connectDB()

route(app)
http.listen(PORT, () => {
  console.log("Server is running at port " + PORT)
})
// if (cluster.isMaster) {
//   for (var i = 0; i < cpuCount; i++) {
//     cluster.fork()
//   }
//   cluster.on("exit", function (worker, code, signal) {
//     console.log("worker " + worker.process.pid + " died")
//   })
// } else {
 
// }
