class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        // For Hosting
        this.socket = io.connect('https://mernbook.shubhamgoel24.me:5000');
        
        // For Development
        // this.socket = io.connect("http://localhost:5000");

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

        // $('#send-message').click(function(){
        //     let msg = $('#chat-message-input').val();
        //     if(msg != ''){
        //         self.socket.emit('send_message',{
        //             message: msg,
        //             user_email: self.userEmail,
        //             chatroom: 'mernbook'
        //         });
        //     }
        // });
        

        self.socket.on('receive_message', function(data){
            let newMessage = $('<li>');
            let messageType = 'other-message';

            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($('<sub>',{
                'html': data.user_email
            }));
            newMessage.append($('<span>',{
                'html': data.message
            }));
            
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            var elem = document.getElementById('chat-messages-list');
            elem.scrollTop = elem.scrollHeight;
        });
    }
    send_message(e){
        e.preventDefault();
        let msg = $('#chat-message-input').val();
        $('#chat-message-input').val('');
        if(msg != ''){
            this.socket.emit('send_message',{
                message: msg,
                user_email: this.userEmail,
                chatroom: 'mernbook'
            });
        }
        return false;
    }
}