const {
    message
} = require('statuses');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


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

        io.emit("messageSent", {
            message: data.usr + " : " + data.msg
        });
    });

    socket.on("userConnected", text => {
        console.log(text + " arrived");

        socket.emit("loggedIn", {
            message: "user connected, it is " + text + "!"
        });

    })

});