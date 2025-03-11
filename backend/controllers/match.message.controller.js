import { MatchMessage  } from "../models/match_messages.model.js";

export const messageController = {
// Get all messages for a match
getMessages : async (req, res) => {
    try {
      const { matchId,reviewer_id,player_id } = req.params;
      const messages = await MatchMessage.findAll({ where: { match_id: matchId,reviewer_id:reviewer_id , player_id:player_id} });
      res.json(messages);
    } catch (error) {
      res.status(500).json({success: false, error: "Error fetching messages" });
    }
  },
  
  // Send a message
  sendMessage : async (req, res) => {
    try {
      let { match_id, reviewer_id,player_id, message } = req.body;
      
      match_id = parseInt(match_id, 10);
    reviewer_id = parseInt(reviewer_id, 10);
    player_id = parseInt(player_id, 10);

      const newMessage = await MatchMessage.create({ match_id, reviewer_id,player_id, message });
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ success: false,error: "Error sending message" });
    }
  },

};