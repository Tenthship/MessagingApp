// const WebSocket = require("ws"); // REMOVED - not needed in browser
// const readline = require("readline");
const chatContainer = document.querySelector("#chatDiv")
const chatSendButton = document.querySelector("#chatSendButton") // Added # here too
const chatInput = document.querySelector("#chatInput")
const nameInput = document.querySelector("#nameInput")

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);
// const { Command } = require("commander");
// const program = new Command();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

let userName = "Anonymous"

nameInput.addEventListener("change", () => {
    userName = nameInput.value
})
// let changingName = false
// let messageCount = 0

ws.onopen = () => {

    // rl.setPrompt("> ");
    // rl.prompt();

    // rl.on("line", (line) => {
        
        // const trimmed = line.trim();

        // if (trimmed === "/quit") {
        //   ws.close();
        //   rl.close();
        //   return;
        // }

        // if (changingName) {
        //     userName = trimmed
        //     changingName = false
        // }

        // if (trimmed === "/changeName") {
        //     messageCount = 1
        //     event = "changeName"
        //     changingName = true
        //     console.log("Enter your new name: ")
        // }

        chatSendButton.addEventListener("click", () => {
            if (chatInput.value == "") {
                return
            } else {
                data = {
                    event: "message",
                    name: userName,
                    message: chatInput.value // Changed from trimmed
                }

                ws.send(JSON.stringify(data));
                chatInput.value = ""
            }

        })



    //     rl.prompt();
    // })



    
}

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data) // Changed from data.toString() to event.data
    // readline.clearLine(process.stdout, 0)
    // readline.cursorTo(process.stdout, 0)
    if (msg.sent) {
        chatContainer.innerHTML += `<p id="chatMessageRight">${msg.name}: ${msg.message}</p>`
    } else {
        chatContainer.innerHTML += `<p id="chatMessageLeft">${msg.name}: ${msg.message}</p>`
    }
    
    console.log(`${msg.name}: ${msg.message}`)
    // rl.prompt()
}


// function handleMessage(msgData) {
//     const msg = JSON.parse(msgData.toString())
//     console.log(`${msg.name} has sent the message: ${msg.message}`)
// }