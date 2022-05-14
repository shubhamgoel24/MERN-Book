
module.exports.chatSockets = function(socketServer){
    const io = require("socket.io")(socketServer, 
        { 
        cors: {    
        //   origin: "https://mernbook.shubhamgoel.tech"
            origin: "http://localhost:8000"
        }});
    // let io = require('socket.io')(socketServer);

    io.on('connection', function(socket){
        console.log('New connection received ',socket.id);

        socket.on('disconnect', function(){
            console.log('Socket Disconnected');
        });

        socket.on('join_room', function(data){
            console.log('Joining request received ', data);
            socket.join('data.chatroom');

            io.emit('user_joined', data);
            // io.to(data.chatroom).emit('user_joined', data); (Original)
        });
        socket.on('send_message', function(data){
            io.emit('receive_message',data);
            // io.in(data.chatroom).emit('receive_message',data);
        })

    });
}