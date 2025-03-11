import { useState, useEffect, useRef } from "react";
import useMatchStore from "../store/matchStore";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import Pagination from "../components/Pagination";
import dayjs from "dayjs";
import { useAuthStore } from "../store/authUser";
//import MatchReviewPopup from "../components/MatchReviewPopup";

const PlayerStatsPage = () => {
    const { user } = useAuthStore();
    const role = user?.user_type;

    const { id } = useParams(); // Player ID
    const { matches, fetchMatchesByPlayerId, totalMatches } = useMatchStore();

    const [page, setPage] = useState(1);
    const limit = 10;
    const initialRender = useRef(true);
    const [loading, setLoading] = useState(true);
    // const [showPopup, setShowPopup] = useState(false);
    // const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        setLoading(true);
        fetchMatchesByPlayerId(id, page, limit).finally(() => setLoading(false));
    }, [id, page]);

    return (
        <Layout>
            <div className="p-4 rounded-lg flex-1 text-white min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                    <h2 className="text-3xl font-extrabold tracking-wide text-white">⚽ Player Matches</h2>
                </div>

                {/* Show Loading State */}
                {loading ? (
                    <p className="text-center text-gray-400 text-lg mt-4 animate-pulse">Loading matches...</p>
                ) : matches.length > 0 ? (
                    <>
                        <ul className="mt-4 space-y-6">
                            {matches.map((match) => {
                                const startTime = dayjs(match.start_date);
                                const endTime = startTime.add(match.duration, "hour");
                                const now = dayjs();
                                const isOngoing = now.isAfter(startTime) && now.isBefore(endTime);

                                return (
                                    <li
                                    key={match.match_id}
                                    className="flex items-center justify-between bg-gray-800/80 p-5 rounded-xl shadow-lg border border-gray-700 backdrop-blur-md transition hover:scale-[1.02]"
                                >
                                    {/* Match Details */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-lg  block text-gray-100  w-50 sm:w-96">
                                            {match.match_name}
                                        </span>
                                        <span className="text-gray-400 text-sm block">
                                            {dayjs(match.start_date).format("YYYY-MM-DD hh:mm A")}
                                        </span>
                                    </div>
                                
                                    {/* Review Button - Always Compact */}
                                    {isOngoing && role === "Reviewer" && (
                                        <Link 
                                            to={`/review/${match.match_id}/${id}`} 
                                            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300 flex-shrink-0 max-w-xs"
                                        >
                                            🎯 Review
                                        </Link>
                                    )}
                                </li>
                                
                                );
                            })}
                        </ul>

                        {/* Pagination Component */}
                        <Pagination
                            page={page}
                            total={totalMatches}
                            limit={limit}
                            setPage={setPage}
                        />
                    </>
                ) : (
                    <p className="text-center text-gray-400 text-lg mt-4">No matches available</p>
                )}

                {/* Match Review Popup */}
                {/* {showPopup && selectedMatch && (
                    <MatchReviewPopup
                        matchId={selectedMatch}
                        player_id={id}
                        onClose={() => setShowPopup(false)}
                    />
                )} */}
            </div>
        </Layout>
    );
};

export default PlayerStatsPage;
