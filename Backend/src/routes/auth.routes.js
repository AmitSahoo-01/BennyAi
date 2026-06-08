import  {Router} from 'express';

// Importing the necessary controller functions and middleware for handling authentication-related routes. These functions will handle the logic for user registration, login, email verification, and fetching the logged-in user's information. The validators will ensure that the input data for registration and login is valid before processing the requests.
import { register,login,getMe } from "../controllers/auth.controller.js";
import { verifyEmail } from "../controllers/auth.controller.js";
import { registerValidator,loginValidator } from "../validators/auth.validators.js";
import {authUser} from "../middleware/auth.middleware.js";


const authRouter = Router();


// Register route
//  This route will handle user registration. It will validate the input data and then call the register controller function to create a new user.
authRouter.post("/register", registerValidator, register);


// Login route
// This route will handle user login. It will validate the input data and then call the login controller function to authenticate the user and generate a JWT token for session management.
authRouter.post("/login",loginValidator,login);


//get-me route
//Private route to get the logged in user's information. It will require authentication and will return the user's information based on the JWT token provided in the request headers.
authRouter.get("/get-me",authUser,getMe);


// Email verification route
// This route will handle email verification. It will take the token from the query parameters and call the verifyEmail controller function to verify the user's email address. The token will be generated during the registration process and sent to the user's email address. When the user clicks on the verification link, this route will be triggered to verify the token and update the user's verified status in the database.    
authRouter.get("/verify-email",verifyEmail);

export default authRouter;