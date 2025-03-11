

import { MatchReview } from "../models/match_reviews.model.js";

export const reviewController = {

// Get all review actions for a match
getReviews : async (req, res) => {
  try {
    const { matchId,reviewer_id,player_id } = req.params;
    const reviews = await MatchReview.findAll({ where: { match_id: matchId,reviewer_id:reviewer_id,player_id:player_id } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false,error: "Not Data" });
  }
},

// Submit a review action
submitReview: async (req, res) => {
  try {
    //console.log("Incoming Request Body:", req.body); // Debugging

    let { match_id, reviewer_id, player_id, action } = req.body;

    // Convert IDs to numbers
    match_id = parseInt(match_id, 10);
    reviewer_id = parseInt(reviewer_id, 10);
    player_id = parseInt(player_id, 10);

    if (isNaN(match_id) || isNaN(reviewer_id) || isNaN(player_id)) {
      return res.status(400).json({ success: false, error: "Invalid IDs provided" });
    }

    // Validate action type
    const validActions = ["goals", "passes", "free_kicks", "green_cards", "yellow_cards", "red_cards"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action type" });
    }

    // Find or create review entry
    let [review, created] = await MatchReview.findOrCreate({
      where: { match_id, reviewer_id, player_id },
      defaults: {
        match_id,
        reviewer_id,
        player_id,
        goals: 0,
        passes: 0,
        free_kicks: 0,
        green_cards: 0,
        yellow_cards: 0,
        red_cards: 0,
      },
    });

    //console.log("Review Found or Created:", review?.toJSON()); // Debugging

    // If record was found, update action count
    let updateFields = {};
    updateFields[action] = review[action] + 1;

    await review.update(updateFields);

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Review Submission Error:", error);
    res.status(500).json({ success: false, error: "Error submitting review action" });
  }
},




};
