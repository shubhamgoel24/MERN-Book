class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // this.socket = io.connect('https://mernbook.shubhamgoel.tech:5000');
        // this.socket = io.connect('http://localhost:5000');
        // const io = require("socket.io-client");
        this.socket = io.connect("http://localhost:5000", {
        withCredentials: true,
        });

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
                console.log('a user joined!', data);
            });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if(msg != ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'mernbook'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log(data);

            let newMessage = $('<li>');
            let messageType = 'other-message';

            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }));
            newMessage.append($('<sub>',{
                'html': data.user_email
            }));
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}