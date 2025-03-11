import { create } from "zustand";
import axios from "axios";


const useUserCountStore = create((set) => ({
    playersCount: 0,
    reviewersCount: 0,
    matchesCount:0,
    isLoadingPlayers: false,
    isLoadingReviewers: false,
    isLoadingMatches:false,
    errorPlayers: false,
    errorReviewers: false,
    errorMatches:false,
  
    fetchCounts: async (user_type) => {
      
      set({ isLoadingPlayers: true, isLoadingReviewers: true,isLoadingMatches:true, errorPlayers: false, errorReviewers: false, errorMatches:false });
  
      try {
        // Fetch player count
        const responsePlayers = await axios.get(`/api/users/count`, {
          params: { role: "Player",user_type },
        });
  
        if (responsePlayers.status === 200) {
          set({ playersCount: responsePlayers.data.count, isLoadingPlayers: false });
        } else {
          set({ errorPlayers: true, isLoadingPlayers: false });
        }
  
        // Fetch reviewer count
        const responseReviewers = await axios.get(`/api/users/count`, {
          params: { role: "Reviewer",user_type },
        });
  
        if (responseReviewers.status === 200) {
          set({ reviewersCount: responseReviewers.data.count, isLoadingReviewers: false });
        } else {
          set({ errorReviewers: true, isLoadingReviewers: false });
        }


        //Fetch matches count
        const responseMatches = await axios.get(`/api/matches/count?user_type=`+user_type);
  
        if (responseMatches.status === 200) {
          set({ matchesCount: responseMatches.data.count, isLoadingMatches: false });
        } else {
          set({ errorMatches: true, isLoadingMatches: false });
        }

  
      } catch (error) {
        console.error("Error fetching user counts:", error);
        set({
          isLoadingPlayers: false,
          isLoadingReviewers: false,
          isLoadingMatches: false,
          errorPlayers: true,
          errorReviewers: true,
          errorMatches: true,
        });
      }
    },
  }));
  
  export default useUserCountStore;