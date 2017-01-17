'use strict'

var DEFAULT_SOURCE_TYPES = ['screen', 'window']

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        if (message.message === 'requestChromeMediaSourceId') {
            requestScreenSharing(port, message);
        }
        if (message.message === 'getInstalledStatus') {
            isInstalled(port, message);
        }
        if (message.message === 'extensionId') {
            extentionIsInstalled(port, message);
        }
    });
});

function isInstalled(port, message) {
    port.postMessage({
        extensionId: chrome.runtime.id,
        message: 'extensionIsInstalled',
    });
}

function requestScreenSharing(port, message) {
    var sourceTypes = message.sourceTypes || DEFAULT_SOURCE_TYPES
    chrome.desktopCapture.chooseDesktopMedia(sourceTypes, port.sender.tab, function (sourceId) {
        port.postMessage({
            extensionId: chrome.runtime.id,
            message: 'chromeMediaSourceId',
            content: sourceId || null,
        });
    });
}
