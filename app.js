const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

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