import { MatchMessage  } from "../models/match_messages.model.js";

export const messageController = {
// Get all messages for a match
getMessages: async (req, res) => {
  try {
    let { matchId, reviewer_id, player_id } = req.params;
    matchId = parseInt(matchId, 10);
    reviewer_id = parseInt(reviewer_id, 10);
    
    let messages;
    if (matchId !== 0 && reviewer_id !== 0) {
      messages = await MatchMessage.findAll({ where: { match_id: matchId, reviewer_id: reviewer_id, player_id: player_id }
       });
    } else {
      messages = await MatchMessage.findAll({ where: { player_id: player_id } ,
        order: [['createdAt', 'DESC']] 
      
      });
    }
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching messages" });
  }
},

  
  // Send a message
  sendMessage : async (req, res) => {
    try {
      let { match_id, reviewer_id,player_id, message,reviewer_name,match_name } = req.body;
      
      match_id = parseInt(match_id, 10);
    reviewer_id = parseInt(reviewer_id, 10);
    player_id = parseInt(player_id, 10);

      const newMessage = await MatchMessage.create({ match_id, reviewer_id,player_id, message,reviewer_name,match_name });
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ success: false,error: "Error sending message" });
    }
  },

};