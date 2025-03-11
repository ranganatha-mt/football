import { useEffect } from "react";
import { useAuthStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { user,logout } = useAuthStore(); // Assuming you have a logout function in Zustand store
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    if (user && user.user_id) {
      // Send user_id to logout function
      logout(user.user_id); // Clears authentication data from the Zustand store
    } // This clears the authentication data from the Zustand store
    
    // Optional: You can also clear any stored tokens from localStorage or sessionStorage
    localStorage.removeItem("jwt-football");
    sessionStorage.removeItem("jwt-football");

    // Redirect to login page
    navigate("/");

    // Trigger a hard refresh to reset the app state
    window.location.reload();
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
