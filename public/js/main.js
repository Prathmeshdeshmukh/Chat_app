const socket = io();

const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true,
})

// console.log(username, room);
// console.log(typeof(room));

socket.emit('join_room', {username , room})

socket.on('roomUsers', ({room , users})=>{
    roomName.innerText = room;

    outputUsers(users);
} )



socket.on('message', message => {
    outputMessage(message);
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var textMessage = e.target.elements.msg.value;
    // console.log(textMessage);
    socket.emit('chatMessage', textMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight;

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message) {
    let div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username}<span>${" "}${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `;

    document.querySelector('.chat-messages').appendChild(div);

}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
