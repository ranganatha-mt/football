import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req,res,next) =>
{
    
    try {
        const token = req.cookies["jwt-football"];
        const sessionToken = req.cookies["session-token"]; // Get session_token from cookie
        //console.log(token)
        if(!token)
        {
            return res.status(401).json({sucess:false,message:"Unautorized - No Token Provided"})
        }
        const decoded = jwt.verify(token,ENV_VARS.jwt_secret);
        //console.log(decoded)
        if(!decoded)
        {
            return res.status(401).json({sucess:false,message:"Unautorized - Invalid Token"})
        }
        
        const user = await User.findOne({
            where: { user_id: decoded.user_id }, // Assuming `id` is the column for the user ID
            attributes: { exclude: ['password'] }  // Exclude password from the result
          });
        if(!user)
        {
            return res.status(404).json({sucess:false,message:"User Not Found"})
        }

        // Enforce session token check only for reviewers
        if (user.user_type === "Reviewer" && user.session_token !== sessionToken) {
            return res.status(403).json({ sucess:false,message: "Session invalid. Please log in again." });
        }

        req.user = user
        next();
        
    } catch (error) {
        console.error("Error in protectRoute Middleware",error.message)
        res.status(500).json({sucess:false,message:"Internal Server Error"})
        
    }
}