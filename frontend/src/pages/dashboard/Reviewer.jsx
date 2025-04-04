import React, { Suspense, useState,useRef ,useEffect} from "react";
import useMatchReviewStore from "../../store/matchReviewStore.js";
import CreateMatch from "../../components/CreateMatch.jsx";
import { useAuthStore } from "../../store/authUser";
const Card = React.lazy(() => import("../../components/Card.jsx"));

const Reviewer = () => {
  const { user } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);

  const {
    playersReviewCount,
    matchesReviewCount,
    matchesCount,
    isLoadingPlayersReview,
    isLoadingMatchesReview,
    isLoadingMatches,
    errorPlayersReview,
    errorMatchesReview,
    errorMatches,
    fetchCounts,
  } = useMatchReviewStore();

  const initialRender = useRef(true);
  useEffect(() => {
    /*if (initialRender.current) {
      initialRender.current = false;
      return;
    }*/
    

    fetchCounts(user.user_type,user.user_id);
  }, []);


  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <Suspense fallback={<div className="loader">Loading...</div>}>
          <Card type="Total Matches Created" count={matchesCount} isLoading={isLoadingMatches} error={errorMatches} />
            <Card type="Total Matches Reviewed"count={matchesReviewCount} isLoading={isLoadingMatchesReview} error={errorMatchesReview} />
            <Card type="Total Players Reviewed" count={playersReviewCount} isLoading={isLoadingPlayersReview} error={errorPlayersReview} />
          </Suspense>

          {/* Create Match Button - Separate from Suspense */}
          {/* <div 
            className="flex justify-center items-center rounded-2xl odd:bg-indigo-200 even:bg-yellow-300 p-4 flex-1 min-w-[130px] cursor-pointer"
            onClick={() => setShowPopup(true)}
          >
            <h2 className="capitalize text-sm font-medium text-gray-500">Create Match</h2>
          </div> */}

          <div className="flex justify-center items-center rounded-2xl bg-white/20 backdrop-blur-md p-4 flex-1 min-w-[130px] cursor-pointer shadow-lg border border-white/30 hover:bg-white/30 transition" onClick={() => setShowPopup(true)}>
          <h2 className="capitalize text-sm font-medium text-white">Create Match</h2>
        </div>



        </div>
      </div>

      {/* Show Create Match Popup */}
      {showPopup && <CreateMatch onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Reviewer;
