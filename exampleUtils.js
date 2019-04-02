/*
 * Copyright (C) 2016 Ericsson AB. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

function setPeerLink(shouldIncludeLink, message) {
  var peerLinkTitle = document.querySelector('.peer-link-title')
  var peerLinkInput = document.querySelector('.peer-link-input')
  if (peerLinkTitle) {
    peerLinkTitle.textContent = message
  }
  if (peerLinkInput) {
    if (shouldIncludeLink) {
      peerLinkInput.type = 'text'
      peerLinkInput.size = 60
      peerLinkInput.value = location.href
      peerLinkInput.onclick = peerLinkInput.select
      peerLinkInput.style.display = 'initial'
    }
  }
}

function setPeerConnectionState(connectionState) {
  var connectionStateText = document.querySelector('.peer-link-connection-state')
  if (connectionStateText) {
    if (connectionState === 'connected') {
      connectionStateText.textContent = 'Connected'
      connectionStateText.style.color = '#0f0'
    } else {
      connectionStateText.textContent = 'Disconnected'
      connectionStateText.style.color = '#f00'
    }
  }
}

function PeerConnecter(client) {
  if (!(client instanceof cct.Client)) {
    throw new TypeError('PeerConnecter client must be a cct.Client')
  }
  this.client = client
  this.sessionKey = 'c3-examples-session'
  this.returnSelf = function () {return this}.bind(this)
}

PeerConnecter.prototype.saveSession = function () {
  var sessionStr = JSON.stringify(this.client.authInfo)
  window.sessionStorage.setItem(this.sessionKey, sessionStr)
}

PeerConnecter.prototype.restoreSession = function () {
  var sessionStr = window.sessionStorage.getItem(this.sessionKey)
  if (!sessionStr) {
    return null
  }
  try {
    return JSON.parse(sessionStr)
  } catch (error) {
    cct.log.error('example', 'Failed to parse stored session, ' + error)
    return null
  }
}

PeerConnecter.prototype.auth = function () {
  var authPromise
  var session = this.restoreSession()

  if (session) {
    authPromise = this.client.auth(session).catch(function () {
      cct.log.error('example', 'Failed to load session, ' + error)
      return cct.Auth.anonymous({serverUrl: getCctAddress()}).then(this.client.auth)
    })
  } else {
    authPromise = cct.Auth.anonymous({serverUrl: getCctAddress()}).then(this.client.auth)
  }
  return authPromise.then(function () {
    return this.saveSession()
  }.bind(this)).then(cct.webRtcReady).then(this.returnSelf)
}

// Creates a new room, or joins an existing one based on the url hash
PeerConnecter.prototype.joinRoom = function () {
  var roomId = window.location.hash.slice(1)
  if (roomId) {
    // If we're using a stored session the room might already be available
    var existingRoom = this.client.getRoom(roomId)
    if (existingRoom.membership === 'member') {
      if (existingRoom.creator === this.client.user) {
        cct.log.info('example', 'Found existing room as creator')
        setPeerLink(true, 'You are the initiator, send this link to a friend')
      } else {
        cct.log.info('example', 'Found existing room as peer')
        setPeerLink(false, 'You are joining an existing session')
      }
      this.room = existingRoom
      return Promise.resolve(this)
    }

    cct.log.info('example', 'Joining room as peer')
    setPeerLink(false, 'You are joining an existing session')
    return this.client.fetchRoomById(roomId).then(function (room) {
      this.room = room
      return room.join()
    }.bind(this)).then(this.returnSelf)
  } else {
    cct.log.info('example', 'Creating new room')
    return this.client.createRoom({
      joinRule: 'open',
      guestAccessRule: 'open',
      powerLevels: cct.PowerLevelsEdit.fromDefault(this.client.user).userDefault(100),
    }).then(function (room) {
      this.room = room
      history.replaceState('', '', '#' + room.id)
      setPeerLink(true, 'You are the initiator, send this link to a friend')
      return this
    }.bind(this))
  }
}

PeerConnecter.prototype.enterCall = function () {
  if (!this.room) {
    throw new Error('Must join room before entering call')
  }
  if (this.client.user === this.room.creator) {
    this.call = this.room.startPassiveCall()
  } else {
    this.call = this.room.startCall(this.room.creator)
  }
  setPeerConnectionState(this.call.connectionState)
  this.call.on('connectionState', setPeerConnectionState)
  return this
}

PeerConnecter.authedClient = function (client) {
  var connecter = new PeerConnecter(client)
  return connecter.auth().then(function () {
    return connecter
  })
}

PeerConnecter.clientInRoom = function (client) {
  window.onhashchange = function (event) {
    var oldHash = event.oldURL && event.oldURL.split('#')[1]
    if (oldHash) {
      location.reload()
    }
  }
  return PeerConnecter.authedClient(client).then(function (connecter) {
    return connecter.joinRoom()
  })
}

PeerConnecter.clientInCall = function (client) {
  return PeerConnecter.clientInRoom(client).then(function (connecter) {
    return connecter.enterCall()
  })
}

function getCctAddress() {
  var homeServerURL = localStorage.getItem('homeServerURL')
  if (!homeServerURL) {
    homeServerURL = 'https://demo.c3.ericsson.net'
  }
  return homeServerURL
}

var EXAMPLE_UTILS_ICE_SERVERS = [{
  urls: 'turn:turn.demo.c3.ericsson.net:443?transport=tcp',
  username: 'c3-turn',
  credential: 'see-three',
}, {
  urls: 'turn:turn.demo.c3.ericsson.net:443?transport=udp',
  username: 'c3-turn',
  credential: 'see-three',
}]

function createHeaderTitle() {
  var title = document.createElement('a')
  title.classList.add('header-title')
  title.href = '../index.html'

  var logo = document.createElement('img')
  logo.classList.add('header-title-logo')
  logo.src = '../resources/ECON_116px.png'

  var text = document.createElement('span')
  text.classList.add('header-title-text')
  text.textContent = 'Ericsson Contextual Communication Cloud examples'

  title.appendChild(logo)
  title.appendChild(text)
  return title
}

function createServerInput() {
  var div = document.createElement('div')
  div.classList.add('header-server-input')

  var textnode = document.createTextNode('Server: ' + getCctAddress() + ' - ')
  var reset = document.createElement('a')
  reset.text = 'reset'
  reset.href = '#'
  reset.onclick = function () {
    var homeServerURL = window.prompt('Home Server URL', getCctAddress())
    homeServerURL = homeServerURL.replace(/\/$/, '')
    localStorage.setItem('homeServerURL', homeServerURL)
    window.location.reload()
  }
  div.appendChild(textnode)
  div.appendChild(reset)
  return div
}

document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('header')
  header.appendChild(createHeaderTitle())
  header.appendChild(createServerInput())
})
