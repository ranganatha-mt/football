import { create } from 'zustand';
import axios from 'axios';
import toast from "react-hot-toast";
import dayjs from "dayjs";

// 🧩 Place these at the top of matchStore.js or before the store declaration

const outfieldStatTypes = [
    "goals", "header_goals", "foot_goals", "volley_goals", "acrobatic_goals",
    "freekick_goals", "long_range_goals", "penalty", "goal_missed", "own_goal",
    "assists", "cross", "through_balls", "attack_free_kick", "corner",
    "dribbling", "shots_on_target", "shots_off_target", "throw_outs", "throw_ins",
    "passes_played", "passes_missed", "interceptions", "blocks", "tackles",
    "last_man_tackles", "head_clearances", "corners_cleared",
    "fouls", "yellow_card", "red_card", "off_side",
    "skill_novice", "skill_intermediate", "skill_proficient", 
    "skill_advanced", "skill_expert", "skill_mastery",
    "freestyle_struggling", "freestyle_capable", "freestyle_skilled", 
    "freestyle_outstanding", "freestyle_exceptional", "freestyle_top_notch",
    "dribbling_drills", "passing_accuracy", "shooting_drills", "stamina_endurance",
    "positional_awareness", "defensive_skills", "ball_control",
    "warmup_cooldown_participation", "tactical_understanding", "team_communication"
  ];
  
  const goalkeeperStatTypes = [
    "gk_own_goal", "goals_saved", "goals_conceded", "penalty_saved",
    "clean_sheets", "punches", "gk_clearances", "goal_kicks"
  ];
  

const useMatchStore = create((set) => ({

    

    matchesCount:0,  
  isLoadingMatches: false,  
  errorMatches: false,

  reviews:[],
    
    playerList: [],
    matches: [],
    totalMatches: 0,
    totalPages: 1,
    currentPage: 1,
    search: "",

    // Fetch all matches
    fetchMatches: async (page = 1, limit = 40, search = "") => {
        try {
            const response = await axios.get(`/api/matches?page=${page}&limit=${limit}&search=${search}`);
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
    setSearch: (search) => set({ search }),

    fetchMatchesByPlayerId: async (playerId, page = 1, limit = 40, search = "") => {
        set({ loading: true, matches: [] }); // Clear matches before fetching new ones
        try {
            const response = await axios.get(`/api/matches/player/${playerId}?page=${page}&limit=${limit}&search=${search}`);
            
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
    },

    fetchCounts: async (user_type,user_id) => {
      
        set({  
          isLoadingMatches: true,
         
          errorMatches: false, });
      
        try {
      
      
          //Fetch matches count
          const responseMatches = await axios.get(`/api/matches/count?user_type=`+user_type+`&user_id=`+user_id);
      
          if (responseMatches.status === 200) {
            set({ matchesCount: responseMatches.data.count, isLoadingMatches: false });
          } else {
            set({ errorMatches: true, isLoadingMatches: false });
          }
      
      
        } catch (error) {
          console.error("Error fetching user counts:", error);
          set({
           
            isLoadingMatches: false,           
            errorMatches: true,
          });
        }
      },
      fetchStats: async (player_id, match_id, stat_type) => {
        set({
            isLoadingStats: true,
            errorStats: false,
        });
    
        try {
            // Construct query parameters dynamically
            let queryParams = `player_id=${player_id}&stat_type=${stat_type}`;
            if (match_id) queryParams += `&match_id=${match_id}`;
    
            // Fetch total adjusted stat
            const response = await axios.get(`/api/players/stats?${queryParams}`);
    
            if (response.status === 200) {
                set({
                    totalAdjustedStat: response.data.total_adjusted_stat,
                    isLoadingStats: false,
                });
            } else {
                set({
                    errorStats: true,
                    isLoadingStats: false,
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            set({
                isLoadingStats: false,
                errorStats: true,
            });
        }
    },

      fetchReviews: async (player_id) => {       
        try {
          const response = await axios.get(`/api/messages/0/0/${player_id}`);
          set({ reviews: response.data });
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          
        }
      },
      // store.js or inside useMatchStore

statCards: {}, // key: stat_type, value: stat count
isLoadingStats: false,
errorStats: false,

fetchAllStats: async (player_id, match_id) => {
  
  set({
    isLoadingStats: true,
    errorStats: false,
  });

  try {
    const response = await axios.get(`/api/matches/getPlayerDetails/${player_id}`);            
  const user_type = response.data.player.position ;
    const statResults = {};
    //const statTypes = user_type === 'Goalkeeper' ? goalkeeperStatTypes : outfieldStatTypes;

    const statTypes = user_type === 'Goalkeeper'
  ? [...outfieldStatTypes, ...goalkeeperStatTypes]
  : outfieldStatTypes;

    for (const stat_type of statTypes) {
      const queryParams = `player_id=${player_id}&stat_type=${stat_type}` + (match_id ? `&match_id=${match_id}` : '');
      const response = await axios.get(`/api/players/stats?${queryParams}`);

      if (response.status === 200) {
        statResults[stat_type] = response.data.total_adjusted_stat;
      } else {
        statResults[stat_type] = 0;
      }
    }

    set({
      statCards: statResults,
      isLoadingStats: false,
    });
  } catch (error) {
    console.error("Error fetching multiple stats:", error);
    set({
      errorStats: true,
      isLoadingStats: false,
    });
  }
},
fetchPlayerDetails: async (player_id) => {  
  try {
      const response = await axios.get(`/api/matches/getPlayerDetails/${player_id}`);            
      set({ user_position: response.data.player.position });
  } catch (error) {
      console.error("Error fetching player details:", error);
      set({ user_position: null });
  }
},

}));

export default useMatchStore;
