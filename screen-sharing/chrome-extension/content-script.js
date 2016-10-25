var port = chrome.runtime.connect(chrome.runtime.id);

port.onMessage.addListener(function (msg) {
    window.postMessage(msg, '*');
});

window.addEventListener('message', function (event) {
    if (event.source != window) return;
    if (event.data) {
        port.postMessage(event.data);
    }
}, false);
