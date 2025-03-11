import React, { Suspense,  useEffect, useRef  } from "react";
const Card = React.lazy(() => import("../../components/Card.jsx"));
import useUserCountStore from "../../store/useUserCountStore";
const Admin = () => {
  const {
    playersCount,
    reviewersCount,
    isLoadingPlayers,
    isLoadingReviewers,
    errorPlayers,
    errorReviewers,
    fetchCounts,
  } = useUserCountStore();

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    

    fetchCounts();
  }, []);


  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <Suspense fallback={<div className="loader">Loading...</div>}>
            <Card type="Players Registered" count={playersCount}  isLoading={isLoadingPlayers} error={errorPlayers} />
            <Card type="Reviewers Registered" count={reviewersCount} isLoading={isLoadingReviewers} error={errorReviewers}/>
            <Card type="Total Matches Conducted" count="0" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Admin;
