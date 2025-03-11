// src/store/matchReviewStore.js
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useMatchReviewStore = create((set) => ({
  reviews: [],
  messages: [],
  loading: false,

  fetchReviews: async (matchId,reviewer_id,player_id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/reviews/${matchId}/${reviewer_id}/${player_id}`);
      set({ reviews: response.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (matchId,reviewer_id,player_id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/messages/${matchId}/${reviewer_id}/${player_id}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (matchId, reviewerId,player_id, message) => {
    try {
      const newMessage = { match_id: matchId, reviewer_id: reviewerId,player_id:player_id, message };
      await axios.post("/api/messages", newMessage);
      set((state) => ({ messages: [...state.messages, newMessage] })); // Instantly update UI
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Error sending message.");
    }
  },

  submitReview: async (matchId, reviewerId, playerId, action) => {
    try {
      // Send API request to update review
      const response = await axios.post("/api/reviews", {
        match_id: matchId,
        reviewer_id: reviewerId,
        player_id: playerId,
        action,
      });
  
      const updatedReview = response.data; // Get updated review from the server
  
      set((state) => {
        let updatedReviews = [...state.reviews];
  
        // Find the review for this player
        const existingReviewIndex = updatedReviews.findIndex(
          (review) => review.player_id === playerId && review.match_id === matchId
        );
  
        if (existingReviewIndex !== -1) {
          // Update the existing review
          updatedReviews[existingReviewIndex] = updatedReview;
        } else {
          // Add a new review if not found
          updatedReviews.push(updatedReview);
        }
  
        return { reviews: updatedReviews };
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Error submitting review.");
    }
  },
  fetchMatchById: async (matchId) => {
    try {
        const response = await axios.get(`/api/matches/getMatchDetails/${matchId}`);
        set({ selectedMatch: response.data.match });
    } catch (error) {
        console.error("Error fetching match details:", error);
        set({ selectedMatch: null });
    }
},
  
  
}));

export default useMatchReviewStore;
