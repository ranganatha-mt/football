import express from 'express';
import multer from 'multer';
import path from 'path';


import {logout, signup,login,requestotp,verifyotp,authCheck} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/protectRoute.js"

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory for saving uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with a unique name
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpeg, .png, and .gif files are allowed!'));
      }
    },
  });

router.post("/signup", upload.single('profile_picture'),signup)
router.post("/login", login)
router.post("/request-otp", requestotp)
router.post("/verify-otp", verifyotp)
router.post("/logout", logout)




router.get("/authCheck", protectRoute , authCheck)

export default router;