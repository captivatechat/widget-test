(function () {
    const messages = document.querySelector("#messages");
    const wsButton = document.querySelector("#wsButton");
    const wsSendButton = document.querySelector("#wsSendButton");

    function showMessage(message, payload) {
        console.log({ message, payload });
        messages.textContent += `\n${message}`;
        messages.scrollTop = messages.scrollHeight;
    }

    let ws;

    wsButton.onclick = function () {
        const webSocketUrl = document.querySelectorAll('#wssurl')[0].value;

        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket(`${webSocketUrl}`);

        ws.onerror = function (error) {
            console.log('WEBSOCKET CONNECTION ERROR', error)
            showMessage(`WebSocket error`);
        };

        /**
         * Show CH Message - this is exactly the message that will be pushed to the socket channel by CH Server
         * @param {*} message 
         */
        ws.onmessage = function (message) {
            console.log("NEW MESSAGE", { message });
            const messageData = JSON.stringify(JSON.parse(message.data))
            showMessage(`FROM CH SERVER: ${messageData}`);
        };

        ws.onopen = function (message) {
            showMessage(
                "WebSocket connection requested.",
                message
            );
        };

        ws.onclose = function () {
            showMessage("WebSocket connection closed.");
            ws = null;
        };

    };

    // SEND A HELLO TO CH SOCKET SERVER
    wsSendButton.onclick = function () {
        if (!ws) {
            showMessage("No WebSocket connection");
            return;
        }
        const msg = document.querySelectorAll('#json')[0].value;

        const json = JSON.stringify(msg);

        // or json string of event
        ws.send(JSON.parse(json));

        showMessage(`Send Message: ${JSON.parse(json)}`);
    };

})();
