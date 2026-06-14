import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectToDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

// import {testAi} from "./src/services/ai.service.js";

const PORT = process.env.PORT || 3000;


const httpSeerver = http.createServer(app);

initSocket(httpSeerver);

connectToDB().then(()=>{
    httpSeerver.listen(PORT,()=>{
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("MongoDB connection failed",err);
    process.exit(1);
});
