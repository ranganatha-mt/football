import express from "express";
import{messageController}  from "../controllers/match.message.controller.js";
const router = express.Router();



router.get("/:matchId/:reviewer_id/:player_id", messageController.getMessages);
router.post("/", messageController.sendMessage);

export default router;