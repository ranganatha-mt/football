//const express = require('express')(If package type is commonJS then we have to use like this)
import express from 'express';
import cookieParser from 'cookie-parser';

import bodyParser from 'body-parser';


import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";

import matchRoutes from "./routes/match.route.js";

import messageRoutes from "./routes/matchMessage.route.js";
import reviewRoutes from "./routes/matchReviews.route.js";



import { ENV_VARS } from './config/envVars.js';
import { protectRoute } from './middleware/protectRoute.js';

import cors  from 'cors';
// Enable CORS with specific options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allows cookies or authentication information to be sent
  };
  
  


const app = express();

app.use(cors(corsOptions));

const PORT = ENV_VARS.port

// Middleware to parse JSON request body
app.use(express.json());
// Serve uploaded images
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/auth",authRoutes)



//protect used for without login we can't access
app.use("/api/list", protectRoute, usersRoutes)
app.use("/api/users", protectRoute, usersRoutes)

app.use("/api/matches", protectRoute, matchRoutes)

app.use("/api/players", protectRoute, matchRoutes)

app.use("/api/messages", protectRoute,messageRoutes);
app.use("/api/reviews", protectRoute,reviewRoutes);




app.listen(PORT, () => {
    console.log("Server started at http://localhost:"+PORT);    
})