import express from "express";

import{matchController}  from "../controllers/match.controller.js";
const router = express.Router();

// Route to create a match
router.post('/create', matchController.createMatch);

// Route to get all matches
router.get('/', matchController.getMatches);

router.delete("/delete/:match_id", matchController.deleteMatch);

router.get("/getMatchDetails/:match_id", matchController.getMatchById);

router.get("/player/:player_id", matchController.getMatchesByPlayerId);

router.get("/count", matchController.matchesCount)

export default router;


