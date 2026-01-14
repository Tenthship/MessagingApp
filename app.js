const WebSocket = require("ws")
const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server });
let userCount = 0

app.use(express.static("public"))

wss.on("connection", (ws) => {
    console.log("Up and running")

    ws.on("message", (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.event == "userJoined") {
            userCount += 1
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "userJoined",
                       userCount: userCount
                    }))
                }
            })

        }
        
        if (msg.event == "message") {
            console.log("Message recieved")
            console.log(msg)

            wss.clients.forEach((client) => {
                if (client.readyState == WebSocket.OPEN && client == ws) {
                    msgData = {
                        sent: true,
                        event: "message",
                        name: msg.name,
                        message: msg.message,
                        dateTime: msg.dateTime
                        
                    }
                } else if (client.readyState == WebSocket.OPEN && client !== ws) {
                    msgData = {
                        sent: false,
                        event: "message",
                        name: msg.name,
                        message: msg.message,
                        dateTime: msg.dateTime
            
                    }
                }

                client.send(JSON.stringify(msgData))
            })
        }



    })

    ws.on("close", () => {
        userCount -= 1
        wss.clients.forEach((client) => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify({ event: "userJoined",
                       userCount: userCount
                    }))
            }
        })
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})