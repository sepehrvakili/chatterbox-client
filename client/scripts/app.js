// YOUR CODE HERE:
var allData = [];
var friends = {};

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  currentRoom: 'lobby',
  currentUser: window.location.search.slice(10),
  // TEST SPEC FUNCTIONS //

  init: () => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      data: {
        format: 'json'
      },      
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        allData = data.results;
        // app.displayMessages(allData);
        app.populateDropdown(allData);
        app.changeRoom(app.currentRoom);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });

  },

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
        // app.populateDropdown();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: () => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      data: {
        format: 'json'
      },      
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        allData = data.results;
        app.changeRoom(app.currentRoom);
        app.populateDropdown();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  clearMessages: () => {
    $('#chats').empty();
  },

  addMessage: (message) => {
    var html = `<div class="chat"><span class="username">
    <a href="#" class="addFriend">${app.sanitize(message['username'])}</a>
    </span>: ${app.sanitize(message['text'])}</div>`;
    $('#chats').append(html);
  },
  // CUSTOM FUNCTIONS //
  addFriend: (friend) => {
    friends[app.currentUser] = friends[app.currentUser] || [];
    friends[app.currentUser].push(friend);
  },

  clearDropDown: () => {
    $('#dropdown').empty();
  },

  displayMessages: (data) => {
    for ( var chat of data ) {
      app.addMessage(chat);
    }
    $('.addFriend').on('click', function () {
      var friend = $(this).text();
      app.addFriend(friend);
    });
  },

  populateDropdown: () => {
    app.clearDropDown();
    var rooms = [];
    for (var chat of allData) {
      rooms.push(chat.roomname);
    }
    for (var room of _.uniq(rooms)) {
      var cleanRoom = app.sanitize(room);
      var html = `<option value="${cleanRoom}">${cleanRoom}</option>`;
      if ( cleanRoom === app.currentRoom ) {
        html = `<option selected="selected" value="${cleanRoom}">${cleanRoom}</option>`;
      }
      $('#dropdown').append(html);      
    }
  },

  addRoom: (room) => {
    // pull room input value into dropdown
    var cleanRoom = app.sanitize(room);
    app.currentRoom = cleanRoom;
    var html = `<option  selected="selected" value="${cleanRoom}">${cleanRoom}</option>`;
    // empty the DOM 
    app.clearMessages();
    // update the drop down value
    $('#dropdown').append(html);
  },

  changeRoom: (room) => {
    app.clearMessages();
    var cleanRoom = app.sanitize(room);
    app.currentRoom = cleanRoom;
    var roomData = [];
    for (var chat of allData) {
      if (chat.roomname === room && chat.roomname !== undefined ) {
        roomData.push(chat);
      } 
    }
    app.displayMessages(roomData);
  },
  sendMessage: (textMessage) => {
    var username = app.currentUser;
    var room = $('#dropdown option:selected').text();
    var messageObject = {
      username: username,
      text: textMessage,
      roomname: room
    };
    app.send(messageObject);
  },

  sanitize: (str, config) => {
    try {
      var n = document.createElement('div');
      n.innerHTML = str;
      var s = new Sanitize(config || Sanitize.Config.RESTRICTED);
      var c = s.clean_node(n);
      var o = document.createElement('div');
      o.appendChild(c.cloneNode(true));
      return o.innerHTML;
    }
    catch (e) {
      return _.escape(str);
    }
  }

};


$(document).ready(function() {
  app.init();
});








