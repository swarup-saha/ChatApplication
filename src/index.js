const path = require('path');
const http = require('http');
const express = require('express');
const Filter = require('bad-words');
const socketio = require('socket.io');
const {generate, generateLocation}  = require('./utils/generate');

const app = express();

const server = http.createServer(app);
let io = socketio(server);


const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.json());
// let count = 0 ;
io.on('connection', (socket) => {
    console.log("new websocket connected");
    
    // socket.on('join', ({username, room})=>{
    //     socket.join(room);
    //     socket.emit('send', generate('welcome!'));
    //     socket.broadcast.to(room).emit('send', generate(`${username} has joined`));
    // })

    socket.on('sendMessage', (mess, callback)=>{
        let filter = new Filter();
        console.log(mess);
        console.log(filter.isProfane(mess));
        if (filter.isProfane(mess)) {
            return callback('profanity not allowed to deliver the message');
        }

        console.log(mess);
        io.emit('send', generate(mess));
        callback();
    })

    socket.on('sendLocation', (coords, callback)=>{
        io.emit('locationMessage', generateLocation(`https://www.google.com/maps/?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect', ()=>{
        io.emit('send', 'A person has left right now');
    })
    //     socket.emit('countUpdate', count);

    //     socket.on('increment', ()=>{
    //         count++;
    //         io.emit('countUpdate', count);
    //     })
})




server.listen(port, () => {

    console.log("your server is running on " + port);
})