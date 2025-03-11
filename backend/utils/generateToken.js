import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndsetCookie = (user_id,res) => {
    const token = jwt.sign({user_id},ENV_VARS.jwt_secret,{expiresIn:'30d'})

    res.cookie("jwt-football",token,{
        maxAge:30 * 24 * 60 * 60 * 1000, //30 days in millisecinds
        httpOnly:true, //prevent Xss attacks cross site scription attacks,its not accessed by JS It will be accessible from browser
        sameSite:"strict",
        secure:ENV_VARS.NODE_ENV !== 'development' 
    })

    return token;
}

export const generateCookie = (cookie_name,cookie_value,res) => {
    res.cookie(cookie_name, cookie_value, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true, // Prevents XSS attacks (not accessible via JS)
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // Secure in production
    });
}