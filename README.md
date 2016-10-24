# C3 Web Examples

The easist way to get started developing on top of Ericsson Contextual Communication Cloud (C3) is to look
at a few <code>C3 Web SDK</code> example applications. But if you have not yet
read the <a href="https://ericsson.github.io/c3-web-guide/">introduction</a> we strongly
encourage you to do so first.

All examples are available live at https://ericsson.github.io/c3-web-examples/

## WebRTC calling
* **Local Call** - (<a href="webrtc/localCall.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/webrtc/localCall.html">live</a>) - Sets up a 2-way audio/video call inside the same web page.
  
* **Multi Client Call** - (<a href="webrtc/multiClientCall.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/webrtc/multiClientCall.html">live</a>) - Sets up a 2-way audio/video by asking two users to enter the same unique URL.

## WebRTC recording

* **Record Local** - (<a href="recording/recordLocal.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/recording/recordLocal.html">live</a>) - Previews video from a camera and allows recording of it to WebM format. When stopped the recording is previewed and can be downloaded.

## WebRTC media device access

* **Audio Detector** - (<a href="webrtc/audioDetector.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/webrtc/audioDetector.html">live</a>) - Handles errors that can occur when accessing user media devices, and verifies that audio is received from the microphone.
* **Audio Meter** - (<a href="webrtc/audioMeter.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/webrtc/audioMeter.html">live</a>) - Accesses the microphone and show the current volume as both raw and filtered values.

## Sharing data

* **Shared Cursor** - (<a href="data/sharedCursor.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/data/sharedCursor.html">live</a>) - Share the mouse cursor position between two clients with really low latency.

* **File Sharing** - (<a href="data/fileDropShare.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/data/fileDropShare.html">live</a>) - Share arbitrary files between two clients.

* **Share Input** - (<a href="data/shareInput.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/data/shareInput.html">live</a>) - Shows how to sync user input in different <code>&lt;form&gt;</code> types and <code>&lt;textarea&gt;</code>.

* **Support Chat** - (<a href="data/supportChat.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/data/supportChat.html">live</a>) - Shows how to display a real-time preview of what other users are typing in a chat.

## User management
* **Register Users** - (<a href="users/registerUsers.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/users/registerUsers.html">live</a>) - A simple form for registering new users.

* **Pin Session Setup** - (<a href="users/pinSession.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/users/pinSession.html">live</a>) - A simple session setup example using pin codes.

* **Session Handling** - (<a href="users/sessionHandling.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/users/sessionHandling.html">live</a>) - Shows how to create, save, load, and clear sessions.

## Experimental
*WARNING!* These examples show unstable or upcoming features that might change or are not production ready.

* **Conference Call** - (<a href="experimental/conferenceCall.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/experimental/conferenceCall.html">live</a>) - Sets up a 3-way video call inside the same web page where you can select active speaker manually.

* **Multi Client Conference Call** - (<a href="experimental/multiClientConferenceCall.html">code</a> | <a href="https://ericsson.github.io/c3-web-examples/experimental/multiClientConferenceCall.html">live</a>) - Sets up a multi-party conference between anyone who enters the page. The active speaker is switched using voice activation.
