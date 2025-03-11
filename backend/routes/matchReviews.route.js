import express from "express";
import{reviewController}  from "../controllers/match.review.controller.js";
const router = express.Router();



router.get("/:matchId/:reviewer_id/:player_id", reviewController.getReviews);
router.post("/", reviewController.submitReview);

export default router;