import { create } from "zustand";
import axios from "axios";


const useUserCountStore = create((set) => ({
    playersCount: 0,
    reviewersCount: 0,
    isLoadingPlayers: false,
    isLoadingReviewers: false,
    errorPlayers: false,
    errorReviewers: false,
  
    fetchCounts: async () => {
      set({ isLoadingPlayers: true, isLoadingReviewers: true, errorPlayers: false, errorReviewers: false });
  
      try {
        // Fetch player count
        const responsePlayers = await axios.get(`/api/users/count`, {
          params: { role: "Player" },
        });
  
        if (responsePlayers.status === 200) {
          set({ playersCount: responsePlayers.data.count, isLoadingPlayers: false });
        } else {
          set({ errorPlayers: true, isLoadingPlayers: false });
        }
  
        // Fetch reviewer count
        const responseReviewers = await axios.get(`/api/users/count`, {
          params: { role: "Reviewer" },
        });
  
        if (responseReviewers.status === 200) {
          set({ reviewersCount: responseReviewers.data.count, isLoadingReviewers: false });
        } else {
          set({ errorReviewers: true, isLoadingReviewers: false });
        }
  
      } catch (error) {
        console.error("Error fetching user counts:", error);
        set({
          isLoadingPlayers: false,
          isLoadingReviewers: false,
          errorPlayers: true,
          errorReviewers: true,
        });
      }
    },
  }));
  
  export default useUserCountStore;