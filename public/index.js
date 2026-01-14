const chatContainer = document.querySelector("#chatDiv")
const chatSendButton = document.querySelector("#chatSendButton")
const chatInput = document.querySelector("#chatInput")
const nameInput = document.querySelector("#nameInput")
const userCount = document.querySelector("#userCount")

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

let userName = "Anonymous"

nameInput.addEventListener("change", () => {
    userName = nameInput.value
})

ws.onopen = () => {
    ws.send(JSON.stringify({ event: "userJoined" }))
    chatSendButton.addEventListener("click", sendMessage)
    document.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            sendMessage()
        }
    })
}

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    
    if (msg.event == "userJoined") {
        userCount.innerHTML = `<h3 id="userCount">Users in the room: ${msg.userCount}</h3>`
    }
    else if (msg.event == "message"){
        const safeName = escapeHtml(msg.name);
        const safeMessage = escapeHtml(msg.message);
        
        if (msg.sent) {
            chatContainer.innerHTML += `<div class="messageWrapper sent">
                                            <p id="chatMessageRight">${safeName}: ${safeMessage}</p>
                                            <p class="timeStamp">${msg.dateTime}</p>
                                        </div>`
        } else {
            chatContainer.innerHTML += `<div class="messageWrapper">
                                            <p id="chatMessageLeft">${safeName}: ${safeMessage}</p>
                                            <p class="timeStamp">${msg.dateTime}</p>
                                        </div>`
        }

        chatContainer.scrollTop = chatContainer.scrollHeight
        
        console.log(`${msg.name}: ${msg.message}`)
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sendMessage() {
    if (chatInput.value == "") {
        return
    } else {
        const date = new Date()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()
        data = {
            event: "message",
            name: userName,
            message: chatInput.value,
            dateTime: `${hours}:${minutes}:${seconds}`
        }

        ws.send(JSON.stringify(data));
        chatInput.value = ""
    }
}