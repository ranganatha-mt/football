import { create } from 'zustand';
import axios from 'axios';
import toast from "react-hot-toast";
import dayjs from "dayjs";

const useMatchStore = create((set) => ({
    
    playerList: [],
    matches: [],
    totalMatches: 0,
    totalPages: 1,
    currentPage: 1,

    // Fetch all matches
    fetchMatches: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`/api/matches?page=${page}&limit=${limit}`);
            set({
                matches: response.data.matches,
                totalMatches: response.data.totalMatches,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage
            });
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    },

    fetchMatchesByPlayerId: async (playerId, page = 1, limit = 10) => {
        set({ loading: true, matches: [] }); // Clear matches before fetching new ones
        try {
            const response = await axios.get(`/api/matches/player/${playerId}?page=${page}&limit=${limit}`);
            
            set({
                matches: response.data.matches || [],
                totalMatches: response.data.count || 0,
                totalPages: response.data.totalPages || 1,
                currentPage: response.data.currentPage || 1,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching matches by player ID:", error);
            toast.error(error.response?.data?.message || "Failed to fetch matches.");
            
            set({ matches: [], loading: false }); // Ensure cache is cleared on error
        }
    },
    
    

    // Create a new match
    createMatch: async (matchData) => {
        try {
            const formattedMatchData = { ...matchData };
            const response = await axios.post("/api/matches/create", formattedMatchData);
    
            set((state) => ({ matches: [...state.matches, response.data.match] }));
            toast.success("Match created successfully!");
    
            return response.data; // ✅ Return the response to indicate success
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create match.");
            console.error("Error creating match:", error);
            return null; // ✅ Return null on failure
        }
    },
    

    deleteMatch: async (match_id) => {
        try {
            await axios.delete(`/api/matches/delete/${match_id}`);
            set((state) => ({
                matches: state.matches.filter((match) => match.match_id !== match_id),
            }));
            toast.success("Match deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete match.");
            console.error("Error deleting match:", error);
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

    // Search players dynamically
    searchPlayers: async (query) => {
        if (!query) {
            set({ playerList: [] });
            return;
        }

        try {
            const { data } = await axios.get(`/api/list/users?user_type=Player&search=${query}`); 
            //console.log(data.users)          
            set({ playerList: data.users });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
}));

export default useMatchStore;
