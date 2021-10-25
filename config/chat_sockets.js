
module.exports.chatSockets = function(socketServer){
    // const io = require("socket.io")(socketServer, {
    //     cors: {
    //       origin: "http://localhost:5000",
    //       methods: ["GET", "POST"],
    //       credentials: true
    //     }
    //   });
    const io = require("socket.io")(socketServer, 
        { 
        cors: {    
          origin: "http://localhost:5000",    
          methods: ["GET", "POST"]  
        }});
    // let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('New connection received ',socket.id);

        socket.on('disconnect', function(){
            console.log('Socket Disconnected');
        });

        socket.on('join_room', function(data){
            console.log('Joining request received ', data);
            socket.join('data.chatroom');

            io.in(data.chatroom).emit('user_joined ', data);
        });

    });
}