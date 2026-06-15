import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../src/routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("dev"));
const allowedOrigins = [
    "http://localhost:5173",
    "https://benny-ai.netlify.app"
];

if (process.env.CLIENT_URL) {
    const urls = process.env.CLIENT_URL.split(",").map(url => url.trim().replace(/\/$/, ""));
    allowedOrigins.push(...urls);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const cleanOrigin = origin.replace(/\/$/, "");
        
        if (allowedOrigins.includes(cleanOrigin)) {
            return callback(null, true);
        } else {
            return callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

//  Health Check
app.get("/",(req,res)=>{
    res.json({
        message:"Server is running!"
    })
});

//  This is where we will add our routes for authentication and other features in the future.
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;