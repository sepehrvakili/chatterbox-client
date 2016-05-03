// YOUR CODE HERE:
var allData = [];
var getData = function(target) {
  var chat = allData;
  for (chat of allData) {
    return chat[target];
  }
};


var app = {
  server: 'https://api.parse.com/1/classes/messages',

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
        app.displayMessages(allData);
        app.populateDropdown(allData);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });

  },

  send: (message) => {
    console.log('inside send function call');
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.init();
        // allData = data.results;
        // app.displayMessages(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: () => {
    // var context = this;
    // console.log(this);
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
        // app.displayMessages(data);
        // app.populateDropdown(data);
        // console.log(data);
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
    // get invoked upon clicking submit on the input field
    // get the username
    // get the input filed
    // get the text
    // invoke send(message)
    var html = `<div>username: ${app.sanitize(message['username'])}: message: ${app.sanitize(message['text'])}</div>`;
    $('#chats').append(html);
    // app.displayMessages(message);
    // update allData
  },
  // CUSTOM FUNCTIONS //

  displayMessages: (data) => {
    for ( var chat of data ) {
      // console.log(chat);
      var html = `<div>username: ${app.sanitize(chat['username'])}: message: ${app.sanitize(chat['text'])}</div>`;
      $('#chats').append(html);
    }
  },

  populateDropdown: () => {
    var rooms = [];
    for (var chat of allData) {
      rooms.push(chat.roomname);
    }
    for (var room of _.uniq(rooms)) {
      var cleanRoom = app.sanitize(room);
      var html = `<option value="${cleanRoom}">${cleanRoom}</option>`;
      $('#dropdown').append(html);      
    }
    console.log(rooms);
  },

  addRoom: (room, message) => {
    // empty the DOM 
    // add message || "add a message to your new room!"
    // 


  },

  changeRoom: (room) => {
    var roomData = [];
    for (var chat of allData) {
      if (chat.roomname === room && chat.roomname !== undefined ) {
        roomData.push(chat);
      } 
    }
    app.clearMessages();
    app.displayMessages(roomData);
  },
  sendMessage: (textMessage) => {
    var username = window.location.search.slice(10);
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

$( document ).ready(
  app.init()
  // app.populateDropdown()
);

