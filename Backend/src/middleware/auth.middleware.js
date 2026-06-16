import jwt from "jsonwebtoken";


// This middleware function will be used to protect routes that require authentication. It will check for the presence of a JWT token in the request headers, verify the token, and if it's valid, it will extract the user's information from the token and attach it to the request object for use in subsequent middleware functions or route handlers. If the token is missing or invalid, it will send an appropriate error response back to the client.

export function authUser (req,res,next){
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            success:false,
            err:"No token Provided"
        });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }
    catch(err){
        return res.status(401).json({
            message:"Unauthorized",
            success:false,
            err:"Invalid token"
        });
    }

}