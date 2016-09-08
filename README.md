# C3 Web Examples

The easist way to get started developing on top of Ericsson Contextual Communication Cloud (C3) is to look
at a few <code>C3 Web SDK</code> example applications. But if you have not yet
read the <a href="https://ericsson.github.io/c3-web-guide/">introduction</a> we strongly
encourage you to do so first.

## WebRTC calling
* <a href="webrtc/localCall.html">Local Call</a> - Sets up a 2-way audio/video call inside the same web page.
  
* <a href="webrtc/multiClientCall.html">Multi Client Call</a> - Sets up a 2-way audio/video by asking two users to enter the same unique URL.

## WebRTC recording

* <a href="recording/recordLocal.html">Record local</a> - Previews video from a camera and allows recording of it to WebM format. When stopped the recording is previewed and can be downloaded.


## WebRTC media device access

* <a href="webrtc/audioDetector.html">Audio Detector</a> - Handles errors that can occur when accessing user media devices, and verifies that audio is received from the microphone.
* <a href="webrtc/audioMeter.html">Audio Meter</a> - Accesses the microphone and show the current volume as both raw and filtered values.

## Sharing data

* <a href="data/sharedCursor.html">Shared Cursor</a> - Share the mouse cursor position between two clients with really low latency.

* <a href="data/fileDropShare.html">File Sharing</a> - Share arbitrary files between two clients.

* <a href="data/shareInput.html">Share Input</a> - Shows how to sync user input in different <code>&lt;form&gt;</code> types and <code>&lt;textarea&gt;</code>.

* <a href="data/supportChat.html">Support Chat</a> - Shows how to display a real-time preview of what other users are typing in a chat.

## User management
* <a href="users/registerUsers.html">Register Users</a> - A simple form for registering new users.

## Experimental
*WARNING!* These examples show unstable or upcoming features that might change or are not production ready.

* <a href="experimental/conferenceCall.html">Conference Call</a> - Sets up a 3-way video call inside the same web page where you can select active speaker manually.

* <a href="experimental/multiClientConferenceCall.html">Multi Client Conference Call</a> - Sets up a multi-party conference between anyone who enters the page. The active speaker is switched using voice activation.
