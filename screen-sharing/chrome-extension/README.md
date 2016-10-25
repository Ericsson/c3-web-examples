# How to enable screen sharing in Chrome

For enabling screen sharing in Chrome browser you need to add a chromeExtensionId. The instructions bellow will guide you to generate one using chrome extensions either in development mode or as a whitelist.

### Prerequisites

You will need the contents of the current directory.

```bash
    chrome-extension/
```


### Installing in development mode

Type "chrome://extensions/" in chrome, then click on Load unpacked extensions select chrome-extensions/ directory. This will generate an ID you can now use that ID similar to how it is used bellow also you can take a look at screenSharing.html:

```javascript
  screenshareSource = new cct.ScreenSource({
    chromeExtensionId: <Here you should add the generated ID>,
    audio: false
    }
  );
```

Make sure to enable the extension you have just loaded. For more info reffer to https://developer.chrome.com/extensions/getstarted.

### Whitelist the extension
for deploying the screen sharing feature it would be much easier to just install a plugin that is already available. This can be achieved by publishing the package (the one we have loaded earlier in development mode). checkout here https://developer.chrome.com/webstore/publish.