const socket = io();
const form = document.getElementById('send_container');
const message_input = document.getElementById('message_inp');
const message_container = document.querySelector('.container');

const append  = (message, position) => {
    const message_element = document.createElement('div');
    message_element.innerText = message;
    message_element.classList.add('message');
    message_element.classList.add(position);
    message_container.append(message_element);
}

const name = prompt('Enter your name to join the group chat');
socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (name) => {
    append(`${name} left the chat`, 'right');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = message_input.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    message_input.value = '';
});