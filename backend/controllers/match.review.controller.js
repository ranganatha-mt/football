

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
    //const validActions = ["goals", "passes", "free_kicks", "green_cards", "yellow_cards", "red_cards"];
    const validActions = [
      // GOALS
      "goals", "header_goals", "foot_goals", "volley_goals", "acrobatic_goals",
      "freekick_goals", "long_range_goals", "penalty", "goal_missed", "own_goal",
    
      // ATTACKS
      "assists", "cross", "through_balls", "attack_free_kick", "corner",
      "dribbling", "shots_on_target", "shots_off_target", "throw_outs", "throw_ins",
    
      // DEFENCE
      "passes_played", "passes_missed", "interceptions", "blocks", "tackles",
      "last_man_tackles", "head_clearances", "corners_cleared",
    
      // FOULS
      "fouls", "yellow_card", "red_card", "off_side",
    
      // SKILLS
      "skill_novice", "skill_intermediate", "skill_proficient",
      "skill_advanced", "skill_expert", "skill_mastery",
    
      // FREESTYLE
      "freestyle_struggling", "freestyle_capable", "freestyle_skilled",
      "freestyle_outstanding", "freestyle_exceptional", "freestyle_top_notch",
    
      // GOALKEEPER ACTIONS
      "gk_own_goal", "goals_saved", "goals_conceded", "penalty_saved",
      "clean_sheets", "punches", "gk_clearances", "goal_kicks"
    ];
    
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
      
        // GOALS
        goals: 0,
        header_goals: 0,
        foot_goals: 0,
        volley_goals: 0,
        acrobatic_goals: 0,
        freekick_goals: 0,
        long_range_goals: 0,
        penalty: 0,
        goal_missed: 0,
        own_goal: 0,
      
        // ATTACKS
        assists: 0,
        cross: 0,
        through_balls: 0,
        attack_free_kick: 0,
        corner: 0,
        dribbling: 0,
        shots_on_target: 0,
        shots_off_target: 0,
        throw_outs: 0,
        throw_ins: 0,
      
        // DEFENCE
        passes_played: 0,
        passes_missed: 0,
        interceptions: 0,
        blocks: 0,
        tackles: 0,
        last_man_tackles: 0,
        head_clearances: 0,
        corners_cleared: 0,
      
        // FOULS
        fouls: 0,
        yellow_card: 0,
        red_card: 0,
        off_side: 0,
      
        // SKILLS
        skill_novice: 0,
        skill_intermediate: 0,
        skill_proficient: 0,
        skill_advanced: 0,
        skill_expert: 0,
        skill_mastery: 0,
      
        // FREESTYLE
        freestyle_struggling: 0,
        freestyle_capable: 0,
        freestyle_skilled: 0,
        freestyle_outstanding: 0,
        freestyle_exceptional: 0,
        freestyle_top_notch: 0,
      
        // GOALKEEPER
        gk_own_goal: 0,
        goals_saved: 0,
        goals_conceded: 0,
        penalty_saved: 0,
        clean_sheets: 0,
        punches: 0,
        gk_clearances: 0,
        goal_kicks: 0
      },
/*      
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
      },*/
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

reviewedCount: async (req, res) => {
  try {
      const { user_type, user_id, type } = req.query;

      if (user_type !== 'Reviewer') {
          return res.json({ count: 0 });
      }

      const column = type === 'Matches' ? 'match_id' :
                     type === 'Players' ? 'player_id' : null;

      if (!column) {
          return res.status(400).json({ success: false, message: 'Invalid type parameter' });
      }

      const count = await MatchReview.count({
          distinct: true,
          col: column,
          where: { reviewer_id: user_id }
      });

      res.json({ count });
  } catch (error) {
      console.error("Error fetching count:", error);
      res.status(500).json({ success: false, message: 'Error fetching count' });
  }
},





};
