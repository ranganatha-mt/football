import {User} from "../models/user.model.js";
import {OTP} from "../models/otp.model.js";
import { ENV_VARS } from '../config/envVars.js';
import bcryptjs from "bcryptjs";

import { v4 as uuidv4 } from "uuid";

//For Email 
//import nodemailer from "nodemailer";
import twilio from "twilio";
import { parsePhoneNumberFromString } from"libphonenumber-js";

import { generateTokenAndsetCookie,generateCookie } from "../utils/generateToken.js";
import { Op } from 'sequelize';

//Normal Function
export async function signup(req,res)
{
    try {
        const {
            full_name,
            contact_phone,
            contact_email,
            password,
            position,
            user_type,
            age,
            gender,
            organization_club,
            expertise_level
          } = req.body;

        if(!full_name)
        {
             res.status(400).json({ success:false,message: "Mandatory fiilds are requied" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if(!emailRegex.test(contact_email))
        {
             res.status(400).json({ success:false,message: "Invalid Email" });
        }

        const emailExists = await User.findOne({where: {contact_email: contact_email}});
        if (emailExists) {
          res.status(400).json({ success:false,message: "Email already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const newUser = new User({
            full_name: full_name ,
            contact_phone: contact_phone ,
            contact_email: contact_email ,
            password: hashedPassword ,
            position: position || null,
            user_type: user_type ,
            age: age || null,
            gender: gender || null,
            organization_club: organization_club || null,
            expertise_level: expertise_level || null,
            profile_picture: req.file ? `/uploads/${req.file.filename}`: null,
        })

        
        
        await newUser.save();

        generateTokenAndsetCookie(newUser.user_id,res);

        // If user is a reviewer, restrict multiple logins
        let sessionToken = null;
        if (newUser.user_type === "Reviewer") {
            if (newUser.session_token) {
                return res.status(403).json({ success:false,message: "You are already logged in on another system" });
            }
            sessionToken = uuidv4();
            newUser.session_token = sessionToken;
            await newUser.save();
        }

        // Set HTTP-only Cookie for session_token (only for reviewers)
        if (sessionToken) {
            generateCookie("session-token", sessionToken,res);
        }

        const userData = newUser.toJSON(); // Convert Sequelize instance to a plain object
        delete userData.password;

        //Remove Password from the response
        res.status(201).json({ success:true,user: {userData} });
        
        
    } catch (error) {
        console.error('Error in signup controller:', error.message);
        res.status(500).json({ success:false,message: "Internal Server Error" });
    }
    
}

//Arrow Function
export const login = async(req,res) =>
{
   try {
     const {username,password} = req.body;
     
     if(!username || !password)
     {
        return res.status(400).json({ success:false,message: "All fields are required" });
     }
     
     const user = await User.findOne({ where: { [Op.or]: [{ contact_email: username },, { contact_phone: username }] } });
    if(!user)
    {
        return res.status(404).json({ success:false,message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password,user.password)
    if(!isPasswordCorrect)
    {
        return res.status(404).json({ success:false,message: "Invalid Credentials" });
    }

    

    generateTokenAndsetCookie(user.user_id,res);

    // If user is a reviewer, restrict multiple logins
    let sessionToken = null;
    if (user.user_type === "Reviewer") {
        if (user.session_token) {
            return res.status(403).json({ success:false,message: "You are already logged in on another system" });
        }
        sessionToken = uuidv4();
        user.session_token = sessionToken;
        await user.save();
    }

    

    // Set HTTP-only Cookie for session_token (only for reviewers)
    if (sessionToken) {
        generateCookie("session-token", sessionToken,res);
    }
       
    const userData = user.toJSON(); // Convert Sequelize instance to a plain object
    delete userData.password; // Remove password field
    //Remove Password from the response
    res.status(200).json({ success:true,user: userData });
        


   } catch (error) {
    console.error('Error in login controller',error.message);
    res.status(500).json({ success:false,message: "Internal Server Error" });
   }
}



export const requestotp = async(req,res) =>
{
   const { contact_phone } = req.body;
  

   if (!contact_phone) {
    return res.status(400).json({ sucess:false,message: "Contact information is required." });
  }

  const contact = '+91' + contact_phone; 

  if (!isValidPhoneNumber(contact)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
} 

    const user = await User.findOne({ where: { [Op.or]: [ { contact_phone: contact_phone }] } });
    if(!user)
    {
        return res.status(404).json({ success:false,message: "Phone number is not Exist" });
    }
    
     
    try {
        const client = twilio(ENV_VARS.TWILIO_ACCOUNT_SID, ENV_VARS.TWILIO_AUTH_TOKEN);
    
        const otp = generateOTP();
        // Save OTP to the database
        await OTP.upsert({ contact:contact_phone, otp, createdAt: new Date() });
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: ENV_VARS.TWILIO_PHONE_NUMBER,
            to: contact,
        });

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        OTP.destroy({ where: { contact:contact_phone } })
        res.status(500).json({ success: false, message: "Failed to send OTP", error });
    }      
    
}

export const verifyotp = async(req,res) =>
{
    const { contact_phone, otp } = req.body;

    if (!contact_phone || !otp) {
        return res.status(400).json({ sucess:false,message: "Contact and OTP are required." });
    }

    try {
        const otpRecord = await OTP.findOne({ where: { contact:contact_phone } });
        

        if (otpRecord && otpRecord.otp === otp) {
            await OTP.destroy({ where: { contact:contact_phone } }); // Clear OTP after successful verification
            const user = await User.findOne({ where: { [Op.or]: [ { contact_phone: contact_phone }] } });

            

            generateTokenAndsetCookie(user.user_id,res);

            // If user is a reviewer, restrict multiple logins
            let sessionToken = null;
            if (user.user_type === "Reviewer") {
                if (user.session_token) {
                    return res.status(403).json({ success:false,message: "You are already logged in on another system" });
                }
                sessionToken = uuidv4();
                user.session_token = sessionToken;
                await user.save();
            }

            // Set HTTP-only Cookie for session_token (only for reviewers)
            if (sessionToken) {
                generateCookie("session-token", sessionToken,res);
            }

            const userData = user.toJSON(); // Convert Sequelize instance to a plain object
            delete userData.password; // Remove password field
            //Remove Password from the response
            return res.status(200).json({ success:true,user: userData });
        //return res.status(200).json({ sucess:true,message: "OTP verified successfully." });
        }

        res.status(400).json({ sucess:false,message: "Invalid or expired OTP." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sucess:false,message: "Failed to verify OTP." });
    }
}


export async function logout(req,res) {
    const { user_id } = req.body;
   try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ success:false,message: "User not found" });
        res.clearCookie("jwt-football")
        // Only clear session token for reviewers
        if (user.user_type === "Reviewer") {
            user.session_token = null;
            await user.save();
        }

        res.clearCookie("session-token"); // Clear session token cookie
        res.status(200).json({ success:true,message: "Logged Out Sucessfully" });
   } catch (error) {
        console.error('Error in logout controller',error.message);
        res.status(500).json({ success:false,message: "Internal Server Error" });
   }
}


export async function authCheck(req,res)
{    
    try {
        res.status(200).json({ success:true,user: req.user });
    } catch (error) {
        console.log("Error in authcheck controller",error.message)
        res.status(500).json({ sucess:false,message: "Internal Server Error" });
    }
}

// Create a transporter using your email service and credentials


// 📲 Validate Phone Number
const isValidPhoneNumber = (phone) => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber && phoneNumber.isValid();
}
// Helper function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


