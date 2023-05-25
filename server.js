const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const PORT = 3000 || process.env.PORT;
// const socket = require('socket.io')
const formatMessage = require('./utils/messages');
const bot = 'ChatCord Bot';
// const { username, room } = require('./public/js/main')
const { userJoin, getCurrentUser, userLeave, getUserRooms } = require('./utils/users');


app.use('/', express.static(__dirname + '/public'));
io.on('connection', (socket) => {
    
    socket.on('join_room', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(bot, `welcome ${user.username} to ChatCord!!`));

        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has Joined the chat`));

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getUserRooms(user.room),
          });
        

        socket.on('chatMessage', (message) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, message));
        })
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
    
        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage(bot, `${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getUserRooms(user.room),
          });
        }
      });

    });


server.listen(PORT, () => {
    console.log('connected to PORT', PORT);
})