import {Server, Socket} from "socket.io";

let io;

export function initSocket(httpServer){
    const allowedOrigins = [
        "http://localhost:5173",
        "https://benny-ai.netlify.app"
    ];

    if (process.env.CLIENT_URL) {
        const urls = process.env.CLIENT_URL.split(",").map(url => url.trim().replace(/\/$/, ""));
        allowedOrigins.push(...urls);
    }

    io = new Server(httpServer,{
        cors:{
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                const cleanOrigin = origin.replace(/\/$/, "");
                if (allowedOrigins.includes(cleanOrigin)) {
                    return callback(null, true);
                } else {
                    return callback(new Error(`Origin ${origin} not allowed by CORS`));
                }
            },
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