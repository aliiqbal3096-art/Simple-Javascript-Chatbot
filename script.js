function sendMessage() {

    let input = document.getElementById("userInput");
    let message = input.value;

    if (message === "") return;

    let chatBox = document.getElementById("chatBox");

    // USER MESSAGE
    let userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

    // BOT RESPONSE
    let botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");

    if (message.toLowerCase().includes("hello")) {
        botMsg.innerText = "Come to the point 👋";
    }
    else if (message.toLowerCase().includes("how are you")) {
        botMsg.innerText = "I'm not fine as you😊";
    }
    else if (message.toLowerCase().includes("bye")) {
        botMsg.innerText = "Stay here and talk to me... Ayesha has made me for you.... 👋";
    }
    else {
        botMsg.innerText = "Please talk like humans";
    }

    chatBox.appendChild(botMsg);

    input.value = "";

    // auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;
}