import express from "express";

import {users,usersCount} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/users", users)
router.get("/count", usersCount)

export default router;
