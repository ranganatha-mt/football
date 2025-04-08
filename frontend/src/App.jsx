import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Logout from "./pages/Logout";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import PlayersListPage from './pages/dashboard/PlayersListPage';
import ReviewersListPage from './pages/dashboard/ReviewersListPage';
import NotFoundPage from "./pages/404";

// Match Management Pages
import MatchListPage from "./components/MatchList";
import MatchDetailsPage from "./components/MatchDetailsPage";
import PlayerStatsPage from "./components/PlayerStats";
import MatchReviewPage from "./components/MatchReview";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();
  const location = useLocation(); // 👈 track route changes

  useEffect(() => {
    authCheck(); // 👈 run auth check on every route change
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className='h-screen'>
        <div className='flex justify-center items-center bg-black h-full'>
          <Loader className='animate-spin text-red-600 size-10' />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/"} />} />

        <Route path="/list/players" element={user ? <PlayersListPage /> : <Navigate to={"/login"} />} />
        <Route path="/list/reviewers" element={user ? <ReviewersListPage /> : <Navigate to={"/login"} />} />

        <Route path="/matches" element={user ? <MatchListPage /> : <Navigate to={"/login"} />} />
        <Route path="/matches/:id" element={user ? <MatchDetailsPage /> : <Navigate to={"/login"} />} />

        <Route path="/player/:id" element={user ? <PlayerStatsPage /> : <Navigate to={"/login"} />} />
        <Route path="/review/:matchId/:player_id" element={user ? <MatchReviewPage /> : <Navigate to={"/login"} />} />

        <Route path="/logout" element={<Logout />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
