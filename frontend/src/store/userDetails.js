import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useStore = create((set) => ({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    userType: "Player", // "player" or "reviewer"
    fetchData: async (page = 1, limit = 10, search = "", user_type = "Player") => {
      try {
        const url = `/api/list/users?page=${page}&limit=${limit}&search=${search}&user_type=${user_type}`;
        const response = await axios.get(url);
        set({ data: response.data.users, total: response.data.totalUsers, page, limit });
        
      } catch (error) {
        toast.error(error.response.data.message || "An error occured")
      }
      
      
    },
    setSearch: (search) => set({ search }),
    setUserType: (userType) => set({ userType }),
    setPage: (newPage) => set({ page: newPage }),
    
  }));
  
  export { useStore };
