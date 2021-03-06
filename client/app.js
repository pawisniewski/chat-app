'use strict';

const socket = io();
socket.on('message', ({author, content}) => addMessage(author, content));

const loginForm = document.getElementById('welcome-form'),
  messagesSection = document.getElementById('messages-section'),
  messagesList = document.getElementById('messages-list'),
  addMessagesForm = document.getElementById('add-messages-form'),
  userNameInput = document.getElementById('username'),
  messageContentInput = document.getElementById('message-content');

let userName;

const login = function(event) {
  event.preventDefault();
  
  if(userNameInput.value) {
    userName = userNameInput.value;
    socket.emit('join', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
  else {
     window.alert('Please type your login first!');
  };
};

const addMessage = function(author, content) {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  
  if(author === userName) {
    message.classList.add('message--self');
  }
  else if (author === 'Chat Bot') {
    message.classList.add('message--bot');
  };
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

const sendMessage = function(event) {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if(messageContent) {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
  else {
    window.alert('Please type your message first!')
  }
}

loginForm.addEventListener('submit', login);
addMessagesForm.addEventListener('submit', sendMessage);
