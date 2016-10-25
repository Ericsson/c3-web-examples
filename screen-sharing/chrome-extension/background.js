var data_sources = ['screen', 'window'],
    desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        if (msg.message === 'requestChromeMediaSourceId') {
            requestScreenSharing(port, msg);
        }
        if (msg.message === 'getInstalledStatus') {
            isInstalled(port, msg);
        }
        if (msg.message === 'extensionId') {
            extentionIsInstalled(port, msg);
        }
    });
});

function isInstalled(port, msg) {
    msg.extensionId = chrome.runtime.id;
    msg.message = 'extensionIsInstalled';
    port.postMessage(msg);
}

function requestScreenSharing(port, msg) {
    desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
        data_sources, port.sender.tab, function (streamId) {
        if (streamId) {
            msg.extensionId = chrome.runtime.id;
            msg.message = 'chromeMediaSourceId';
            msg.content = streamId
        }
        port.postMessage(msg);
    });
}
