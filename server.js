const {
    message
} = require('statuses');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


var rooms = [];
var users= [];


http.listen(3000, () => {
    console.log('listening on port 3000');
})

io.on("connection", socket => {

    console.log("new user connected");

    socket.on("disconnect", () => {
        console.log("as user disconnected");
    });

    socket.on("messageSent", data => {
        console.log(data.usr + " : " + data.msg)

        io.to(data.room).emit("messageSent", {
            message: data.usr + " : " + data.msg
        });
    });

    socket.on("userConnected", data => {
        console.log(data.username + " arrived" + " in " + data.roomname);

        socket.join(data.roomID);

        const room = rooms.find(element => element.ID == data.roomID);

        if (room) {
            /* rooms contains the element we're looking for */
            console.log("room"+data.roomID+"  found")

            var roomOwner = room.owner;
            
        }else{
            rooms.push({
                ID: data.roomID,
                Name: data.roomname,
                owner: data.owner
            })
            console.log(rooms);
        }
        io.to(data.roomID).emit("loggedIn", {
            message: "user connected, it is " + data.username + " in " + data.roomname + "!",
            user: data.username,
            owner: roomOwner
        });


        // socket.emit("loggedIn", {
        //     message: "user connected, it is " + data.username + "!"
        // });

    })

});