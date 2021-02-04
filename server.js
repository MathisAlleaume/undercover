const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(3000, ()=>{
    console.log('listening on ort 3000');
})

io.on("connection", socket =>{
    socket.on("connection", ()=>{
        console.log("new user connected");

        socket.on("disconnect", ()=>{
            console.log("as user disconnecyted");
        });

        socket.on("messageSent", msg => {

            io.emit("messageSent", msg);
        });
    });
});