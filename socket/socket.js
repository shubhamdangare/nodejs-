module.exports= function(io,room){

    var chatroom =io.of('/roomlist').on('connection',function(socket){

        console.log("connection establish on server");
         //socket.emit('roomupdate', JSON.stringify(room));

        socket.on('newroom',function(data){

            room.push(data);
            socket.broadcast.emit('roomupdate',JSON.stringify(room));

            socket.emit('roomupdate',JSON.stringify(room));
        })
    })

     var chatroom =io.of('/roomlist').on('connection',function(socket){

        console.log("connection establish on chat");

        socket.on('join',function(data){

            socket.userName=data.user;
            socket.userpic=data.user;
            socket.join(data.room);
        })


        socket.on('newMessage',function(data){

            socket.broadcast.to(data.room_number).emit('messagefeed',JSON.stringify(data));
        })
     })
}