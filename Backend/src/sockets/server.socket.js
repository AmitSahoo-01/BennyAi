import {Server, Socket} from "socket.io";

let io;

export function initSocket(httpServer){
    io = new Server(httpServer,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })

    console.log("Socket.IO is running");

    io.on("connection",(socket)=>{
        console.log("A connection is creatred",+ socket.id);
    })

}

export function getIo(){
    if(!io){
        throw new Error("Socket io is not intialized");
    }

    return io;
}