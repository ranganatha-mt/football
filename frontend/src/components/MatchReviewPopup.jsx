// src/components/MatchReviewPopup.jsx
import { useEffect, useRef } from "react";
import useMatchReviewStore from "../store/matchReviewStore";
import { useAuthStore } from "../store/authUser";

const MatchReviewPopup = ({ matchId,player_id, onClose }) => {
    //console.log( matchId,player_id)
    const { user } = useAuthStore();
    const user_id = user?.user_id;
  const { reviews, messages, fetchReviews, fetchMessages, sendMessage, submitReview } = useMatchReviewStore();
  const reviewer_id = user_id; // Example reviewer ID
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchReviews(matchId,reviewer_id,player_id);
    fetchMessages(matchId,reviewer_id,player_id);
  }, [matchId,reviewer_id,player_id, fetchReviews, fetchMessages]);

  // Scroll to bottom when new messages or actions are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, reviews]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    sendMessage(matchId, reviewer_id,player_id, message);
    e.target.reset();
  };

  const handleAction = (action) => {
    submitReview(matchId, reviewer_id,player_id, action).then(() => {
        fetchReviews(matchId, reviewer_id, player_id);
      });
  };

  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96 relative">
      <button 
                onClick={onClose} 
                className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 
                            rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
                aria-label="Close"
                >
                ✕
        </button>
        <h2 className="text-lg font-bold">Match Review</h2>

        {/* Messages & Actions Section (Chat Style) */}
        <div className="border p-2 h-60 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-200 p-2 rounded-lg text-sm">
              {msg.message}
            </div>
          ))}

        {reviews.map((review, index) => {
        const actions = [];

        if (review.goals > 0) actions.push(`⚽ Goals: ${review.goals}`);
        if (review.passes > 0) actions.push(`🎯 Passes: ${review.passes}`);
        if (review.free_kicks > 0) actions.push(`🥅 Free Kicks: ${review.free_kicks}`);
        if (review.green_cards > 0) actions.push(`🟩 Green Cards: ${review.green_cards}`);
        if (review.yellow_cards > 0) actions.push(`🟨 Yellow Cards: ${review.yellow_cards}`);
        if (review.red_cards > 0) actions.push(`🟥 Red Cards: ${review.red_cards}`);

        return (
            <div key={index} className="bg-green-200 p-2 rounded-lg text-sm font-semibold">
            {actions.length > 0 ? actions.join(" | ") : "No actions recorded"}
            </div>
        );
        })}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Send Message Form */}
        <form onSubmit={handleSendMessage} className="mt-2 flex">
          <input
            type="text"
            name="message"
            className="border p-2 flex-1 rounded-lg"
            placeholder="Type a message..."
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-2 ml-2 rounded-lg">
            Send
          </button>
        </form>

        {/* Review Actions */}
        <div className="flex flex-wrap gap-2 mt-2">
          <button onClick={() => handleAction( "goals")} className="bg-blue-500 text-white px-3 py-1 rounded">
            ⚽ Goal
          </button>
          <button onClick={() => handleAction( "passes")} className="bg-green-500 text-white px-3 py-1 rounded">
            🎯 Pass
          </button>
          <button onClick={() => handleAction( "free_kicks")} className="bg-yellow-500 text-white px-3 py-1 rounded">
            🥅 Free Kick
          </button>
          <button onClick={() => handleAction( "green_cards")} className="bg-gray-500 text-white px-3 py-1 rounded">
            🟩 Green Card
          </button>
          <button onClick={() => handleAction( "yellow_cards")} className="bg-yellow-400 text-white px-3 py-1 rounded">
            🟨 Yellow Card
          </button>
          <button onClick={() => handleAction( "red_cards")} className="bg-red-500 text-white px-3 py-1 rounded">
            🟥 Red Card
          </button>
        </div>
        

        {/* Close Button */}
        {/* <button onClick={onClose} className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg">
          Close
        </button> */}
      </div>
    </div>
  );
};

export default MatchReviewPopup;
