

/*
express : framework of web  // it is all routing
socket.io : framework deals with sockets 
moment : to format date and time
nodemon for dev dependencies : npm install -D nodemon
cmd : npm run dev : for saving further modified content by ctrl+s  (works by nodemon library)
*/

// path module : node js core module
//  

// to set up server for socket .io
// const server = require('http').createServer(app)
// var io = require('socket.io')(server);
// then call  function io.on('event',parameter ()=>{code..})
// then link with site in html by : <script src="/socket.io/socket.io.js"></script>
const path = require('path')
const express = require('express')
const http  = require('http')
const app = express()
const socketio = require('socket.io');
const PORT = 3000 || process.env.PORT;
const botName = 'ChatCord bot'

// create socket.io server
const server = http.createServer(app)
const io = socketio(server);

// capture message object or capture from another js module
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave,getRoomUsers} = require('./utils/users');  // after that beow join room use it


// css is static not dynamic thus we add through middle ware 
// middle work as after request and before response and it is also common for each page
// syntax app.use('/css',express.static('foldername'));
app.use('/css',express.static('css'))
app.use('/js',express.static('js'));

//set static folde
//__dirname+'/html' : name of folder we want
app.use(express.static(path.join(__dirname,'/html')))

//run when client connects
// io.on will listen some kind of events or action and then run a function with socket as a parameter
io.on('connection',socket =>{
    //catch that emitted
    socket.on('joinroom',({username,room})=>{
        // socket.id comes from socket paramemter of io.on event
        let user = userJoin(socket.id,username,room);
        socket.join(user.room);
        
        // to emit event from back and forth (server->client)
        socket.emit('message',formatMessage(botName,'Welcome to ChatCord!'));
        //broadcast when user connects : it will emit to evrybody except the user
        //io.emit() to all the include user
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(botName,`A ${user.username} has joined the chat`));

        // send user and room details
        
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        }); 

    });
    
    //catch the chat message or listen chat message
    socket.on('chatMessage',(msg)=>{
        //emit to everybody
        let user = getCurrentUser( socket.id);
        // to(user.room) will emit to every room
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    })

    //disconnect
    socket.on('disconnect',()=>{

        // socket.id to et the user
        let user = userLeave(socket.id);
        console.log(user);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`A ${user.username} has left the chat`));
            
        // send user and room details
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        }); 
        }
        
    })

});



// listen to run a server
// to start server type command in terminal :npm run dev
server.listen(PORT, () =>{
    console.log('server started on http://localhost:3000')
    console.log(`server started at ${PORT}`);
})