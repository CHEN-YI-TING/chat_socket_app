const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    }
});

io.on("connection",(socket)=>{
    
    console.log(`使用者以連線，Id: ${socket.id}`);

    socket.on("join_room",(clientRoomId)=>{
        socket.join(clientRoomId);
        console.log(`使用者 ${socket.id} 進入 ${clientRoomId} 聊天室`);
    })

    socket.on("send_message",(clientMessage) =>{
        socket.to(clientMessage.room).emit("receive_message",clientMessage)
    })
    
    socket.on("disconnect",()=>{
        console.log("使用者已經離開聊天室", socket.id);
    })
})

server.listen(3001,()=>{
    console.log("伺服器正在執行...");
})