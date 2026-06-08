import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

import {testAi} from "./src/services/ai.service.js";

const PORT = process.env.PORT || 3000;

connectToDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("MongoDB connection failed",err);
    process.exit(1);
});

// testAi();