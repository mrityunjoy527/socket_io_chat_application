const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/static', express.static('./src/static'));
app.use('/', (req, res) => res.sendFile(path.join(__dirname, 'src/index.html')));

const users = {};

io.on("connection", (socket) => {
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', (name) =>{ 
        // console.log(name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', (message) =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', (message) =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));