import axios from "axios";
import toast from "react-hot-toast";
import {create} from "zustand";

let isAuthChecked = false;
export const useAuthStore = create((set) => ({
    user:null,
    isSigningUp:false,
    isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	isRequestingOtp: false,
    isVerifyingOtp: false,
    otp: null,
    signup: async (credentials) => {
        set({ isSigningUp: true });
      
        try {
          const response = await axios.post("/api/auth/signup", credentials, {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          });
      
          set({
            user: response.data.user,
            isSigningUp: false
          });
      
          toast.success("Account Created Successfully");
      
          window.location.reload();
      
        } catch (error) {
          // If error.response is undefined, fallback message
          const errorMessage = error.response?.data?.message || "An error occurred";
          toast.error(errorMessage);
      
          set({ isSigningUp: false, user: null });
        }
      },
      
    login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post("/api/auth/login", credentials);            
			set({ user: response.data.user, isLoggingIn: false });
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response.data.message || "Login failed");
		}
	},
	requestOtp: async (phoneNumber) => {
        set({ isRequestingOtp: true });
        try {
            const response = await axios.post("/api/auth/request-otp", { contact_phone: phoneNumber });
            set({ otp: response.data.otp, isRequestingOtp: false });
            toast.success("OTP sent successfully!");
			return true;
        } catch (error) {
            set({ isRequestingOtp: false });
            toast.error(error.response.data.message || "OTP request failed");
			return false;
        }
    },

    verifyOtp: async (phoneNumber, otp) => {
        set({ isVerifyingOtp: true });
        try {
            const response = await axios.post("/api/auth/verify-otp", { contact_phone: phoneNumber, otp });
            set({ user: response.data.user, isVerifyingOtp: false });
            toast.success("OTP verified successfully");
			return true;
        } catch (error) {
            set({ isVerifyingOtp: false });
            toast.error(error.response.data.message || "OTP verification failed");
			return false;
        }
    },
	logout: async (user_id) => {
		set({ isLoggingOut: true });
		try {
			await axios.post("/api/auth/logout",{user_id});
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		//if (isAuthChecked) return;  // Prevent multiple calls
    	//isAuthChecked = true;
		//set({ isCheckingAuth: true });
		try {
			const response = await axios.get("/api/auth/authCheck");            
			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
      
			// toast.error(error.response.data.message || "An error occurred");
		}
	},
}));