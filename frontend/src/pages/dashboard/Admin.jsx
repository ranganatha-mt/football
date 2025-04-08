import React, { Suspense,  useEffect, useRef,useState  } from "react";
const Card = React.lazy(() => import("../../components/Card.jsx"));
import useUserCountStore from "../../store/useUserCountStore";
import { useAuthStore } from "../../store/authUser";
import CreateMatch from "../../components/CreateMatch.jsx";
const Admin = () => {
  const { user } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const {
    playersCount,
    reviewersCount,
    matchesCount,
    isLoadingPlayers,
    isLoadingReviewers,
    isLoadingMatches,
    errorPlayers,
    errorReviewers,
    errorMatches,
    fetchCounts,
  } = useUserCountStore();

  const initialRender = useRef(true);
  useEffect(() => {
   /* if (initialRender.current) {
      initialRender.current = false;
      return;
    }*/
    

    fetchCounts(user.user_type);
  }, []);


  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <Suspense fallback={<div className="loader">Loading...</div>}>
            <Card type="Players Registered" count={playersCount}  isLoading={isLoadingPlayers} error={errorPlayers} />
            <Card type="Reviewers Registered" count={reviewersCount} isLoading={isLoadingReviewers} error={errorReviewers}/>
            <Card type="Total Matches" count={matchesCount} isLoading={isLoadingMatches} error={errorMatches} />
            <div className="flex justify-center items-center rounded-2xl bg-white/20 backdrop-blur-md p-4 flex-1 min-w-[130px] cursor-pointer shadow-lg border border-white/30 hover:bg-white/30 transition" onClick={() => setShowPopup(true)}>
          <h2 className="capitalize text-sm font-medium text-white">Create Match</h2>
        </div>
        {/* Show Create Match Popup */}
      {showPopup && <CreateMatch onClose={() => setShowPopup(false)} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};


export default Admin;
