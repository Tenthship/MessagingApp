const WebSocket = require("ws")
const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server });

app.use(express.static("public"))

wss.on("connection", (ws) => {
    console.log("Up and running")

    ws.on("message", (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.event == "message") {
            console.log("Message recieved")
            console.log(msg)

            wss.clients.forEach((client) => {
                if (client.readyState == WebSocket.OPEN && client == ws) {
                    msgData = {
                        sent: true,
                        event: "message",
                        name: msg.name,
                        message: msg.message
                    }
                } else if (client.readyState == WebSocket.OPEN && client !== ws) {
                    msgData = {
                        sent: false,
                        event: "message",
                        name: msg.name,
                        message: msg.message
                    }
                }

                client.send(JSON.stringify(msgData))
            })
        }



    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})