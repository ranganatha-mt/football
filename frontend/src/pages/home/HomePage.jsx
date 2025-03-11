import React, { Suspense, useMemo } from "react";
import { useAuthStore } from "../../store/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";


const HomePage = () => {
  const { user } = useAuthStore();
  
  // Define a mapping of user types to components
  const componentMap = useMemo(() => ({
    Admin: React.lazy(() => import("../dashboard/Admin")),
    Player: React.lazy(() => import("../dashboard/Player")),
    Reviewer: React.lazy(() => import("../dashboard/Reviewer")),
  }), []);

  // Get the appropriate component based on the user type
  const ComponentToRender = user ? componentMap[user.user_type] : null;
  return (
    <>
      {user ? (
        <HomeScreen>
           {ComponentToRender ? (
            <Suspense fallback={<div>Loading...</div>}>
              <ComponentToRender />
            </Suspense>
          ) : (
            <div>Welcome, {user.user_type}!</div> // You can customize this part as needed
          )}
        </HomeScreen>
      ) : (
        <AuthScreen />
      )}
    </>
  );
};

export default HomePage;
