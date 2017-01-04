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
      } else {
        cct.log.info('example', 'Found existing room as peer')
      }
      this.room = existingRoom
      return Promise.resolve(this)
    }

    cct.log.info('example', 'Joining room as peer')
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
  return this
}

PeerConnecter.clientInRoom = function (client) {
  window.onhashchange = function (event) {
    var oldHash = event.oldURL.split('#')[1]
    if (oldHash) {
      location.reload()
    }
  }
  var connecter = new PeerConnecter(client)
  return connecter.auth().then(function () {
    return connecter.joinRoom()
  })
}

PeerConnecter.clientInCall = function (client) {
  return PeerConnecter.clientInRoom(client).then(function (connecter) {
    return connecter.enterCall()
  })
}

function Peer2Peer(opts) {
  this.session = opts.session || ''
  this.client = opts.client || ''
  this.room = null
  this.hash = ''
  this.name = opts.preferredName || ''

  this._setupRoom = this._setupRoom.bind(this)
  this._identifySession = this._onIdentifySession.bind(this)
  this._onRoomCreated = this._onRoomCreated.bind(this)
  this.setupCall = this.setupCall.bind(this)
}
Peer2Peer.prototype = {
  constructor: Peer2Peer,

  _setupRoom: function (test) {
    var self = this
    if (this.session) {
      return this.client.fetchRoomById(this.session)
        .then(function (room) {
          return room.join()
        }, function (error) {
          logError('Failed to fetch room by id, trying to fetch by alias!' + error)
          return self.client.fetchRoomByAlias(self.session)
            .then(function (room) {
              return room.join()
            }, function (error) {
              throw new Error('Failed to fetch room by alias: ' + error)
            })
        })
    } else {
      var powerLevels = cct.PowerLevelsEdit.fromDefault(this.client.user)
        .addState(0)
        .userDefault(100)
        .eventDefault(0)
        .event('cct.room.data.share', 0)
      if (this.name) {
        this.session = this.name
        return this.client.createRoom({
          joinRule: 'open',
          alias: this.name,
          powerLevels: powerLevels,
        })
      } else {
        return this.client.createRoom({
          joinRule: 'open',
          powerLevels: powerLevels,
        })
      }
    }
  },

  _onIdentifySession: function () {
    this.hash = window.location.hash
    if (this.hash) {
      this.session = this.hash.slice(1)
      log('Assigned sessionId: ', this.session)
    }
  },

  _onRoomCreated: function (room) {
    this.room = room
    if (this.session) {
      window.location.hash = this.session
    } else {
      window.location.hash = this.room.id
    }
    return this
  },
}

Peer2Peer.prototype.start = function (client) {
  return cct.Auth.anonymous({serverUrl: getCctAddress()})
    .then(this.client.auth, function (error) {
      cct.log.error('error', error)
      logError('Failed to authenticate client')
      throw error
    })
    .then(cct.webRtcReady)
    .then(this._identifySession)
    .then(this._setupRoom)
    .then(this._onRoomCreated)
    .catch(function (error) {
      cct.log.error('error', error)
      logError('Failed to setup call')
    })
}

Peer2Peer.prototype.setupCall = function () {
  var members = this.room.otherMembers.slice()
  members.sort(function (a, b) {
    return b.lastActive - a.lastActive
  })
  return this.room.startCall(members[0])
}

var body = document.getElementsByTagName('body')

function toggleLog() { // eslint-disable-line no-unused-vars
  var toggleLog = document.getElementById('toggleLog')
  var footer = document.getElementById('footer')
  if (toggleLog.value === 'show log') {
    footer.style.height = '500px'
    toggleLog.value = 'hide log'

    setTimeout(function () {
      var counter = 0
      var scrollDown = setInterval(function () {
        body[0].scrollTop += 25
        counter += 1
        if (counter > 20) {
          clearInterval(scrollDown)
        }
      }, 5)
    }, 30)
  } else {
    footer.style.height = ''
    toggleLog.value = 'show log'
  }
}

function showLog() {
  var toggleLog = document.getElementById('toggleLog')
  var footer = document.getElementById('footer')
  if (toggleLog.value === 'show log') {
    footer.style.height = '500px'
    toggleLog.value = 'hide log'
  }
}

function clientsInARoom(url, count) { // eslint-disable-line no-unused-vars
  if (!count) {
    count = 2
  }

  var clients = []
  for (var i = 0; i < count; i += 1) {
    clients[i] = new cct.Client()
  }

  return Promise.all(clients.map(function (client) {
    return cct.Auth.anonymous({serverUrl: url}).then(client.auth)
  })).then(function (clients) {
    var rest = clients.slice(0, -1)
    return Promise.all(rest.map(function (client) {
      return client.once('invite').then(function (room) {
        return room.join()
      })
    }).concat(clients[clients.length - 1].createRoom({
      invite: rest.map(function (client) {
        return client.user
      }),
    }))).then(function (rooms) {
      return {
        rooms: rooms,
        clients: clients,
      }
    })
  })
}

function logP(label) { // eslint-disable-line no-unused-vars
  return function (ret) {
    log(label, ret)
    return ret
  }
}

function logPE(label) { // eslint-disable-line no-unused-vars
  return function (ret) {
    log(label + ' error', ret)
    showLog()
    throw ret
  }
}

function log(label, ret) {
  var div = document.createElement('div')
  var tag = document.createElement('div')
  var content = document.createElement('pre')
  var str = ret
  if (typeof (str) !== 'string') {
    str = JSON.stringify(str, null, '\u00a0\u00a0\u00a0\u00a0')
  }
  str = str.replace(/(?:\\r)?\\n/g, '\n')
  tag.textContent = label
  content.textContent = str
  console.log(label + ': ' + str)
  div.appendChild(tag)
  div.appendChild(content)
  if (document.getElementById('log')) {
    document.getElementById('log').appendChild(div)
  }
  return ret
}

function logError(ret) {
  log('error', ret)
  showLog()
}

function getCctAddress() { // eslint-disable-line no-unused-vars
  var homeServerURL = localStorage.getItem('homeServerURL')
  if (!homeServerURL) {
    homeServerURL = 'https://demo.c3.ericsson.net'
  }
  return homeServerURL
}

var EXAMPLE_UTILS_ICE_SERVERS = [ // eslint-disable-line no-unused-vars
  {
    urls: 'stun:mmt-stun.verkstad.net',
  },
  {
    urls: 'turn:static.verkstad.net:443?transport=tcp',
    username: 'openwebrtc',
    credential: 'secret',
  },
]

document.addEventListener('DOMContentLoaded', function () {
  var div = document.getElementById('homeServerBanner')
  var textnode = document.createTextNode('Using Home Server: ' + getCctAddress() + ' - ')
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
})
