class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');
        // const io = require("socket.io-client");
        // this.socket = io("http://localhost:5000", {
        // withCredentials: true,
        // });

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log('Connection Established using Sockets..');

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'mernbook'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined', data);
            });
        });
    }
}