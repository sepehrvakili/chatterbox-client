// YOUR CODE HERE:
var allData = [];
var getData = function(target) {
  var chat = allData;
  for (chat of allData) {
    return chat[target];
  }
};

var app = {

  // state: {

  // }

  init: () => {

  },
  server: 'https://api.parse.com/1/classes/messages',
  send: (message) => {
    // var context
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
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
        app.displayMessages();
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
  displayMessages: () => {
    console.log(allData[23]['text']);
    for ( var chat of allData ) {
      console.log(chat);
      var html = `<div>username: ${chat['username']}: message: ${chat['text']}</div>`;
      $('#chats').append(html);
    }
  },
  populateDropdown: (data) => {

    // var rooms = [];
    // for (var chat of chats) {
    //   rooms.push(chat.roomname);
    // }
    // for (var room of _.uniq(rooms)) {
    //   // var chat['room'] = chat.roomname;
    //   var html = `<option value="${room}">${room}</option>`;
    //   $('#dropdown').append(html);      
    // }
  },

  changeRoom: (value) => {
    // show chats for just a specific room
    // manipulate the DOM where the ID is chats
    // pull/show different room from server

    // $(show).(chat.rommname.value)
    // if chat.roomname === value
      // show messages
    // loop through data, find roomnames matching target value
      // display those messages

  }

};
$( document ).ready(
  app.fetch()
);

