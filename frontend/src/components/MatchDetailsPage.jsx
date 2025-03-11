import { useParams, Link } from "react-router-dom";
import useMatchStore from "../store/matchStore";
import { useEffect, useState, useRef } from "react";
import { Layout } from "../components/Layout";
import dayjs from "dayjs";
import { useAuthStore } from "../store/authUser";

const MatchDetailsPage = () => {
    const { user } = useAuthStore();
    const role = user?.user_type;
    const { id } = useParams();
    const { selectedMatch, fetchMatchById } = useMatchStore();
    const [loading, setLoading] = useState(true);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        const loadMatch = async () => {
            await fetchMatchById(id);
            setLoading(false);
        };
        loadMatch();
    }, [id, fetchMatchById]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl text-gray-600">
                Loading match details...
            </div>
        );
    }

    if (!selectedMatch) {
        return (
            <div className="h-screen flex items-center justify-center text-xl text-gray-600">
                Match not found
            </div>
        );
    }

    const match = selectedMatch;
    const startTime = dayjs(match.start_date);
    const endTime = startTime.add(match.duration, "hour");
    const now = dayjs();
    const isOngoing = now.isAfter(startTime) && now.isBefore(endTime);

    return (
        <Layout>
            <div className="min-h-screen h-full flex flex-col text-white p-6">
                {/* Match Info */}
                <h2 className="text-4xl text-center mb-4">{match.match_name}</h2>
                
                <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-md flex flex-col gap-3">
                    <p className="text-lg">📍 Location: <span className="font-normal">{match.location}</span></p>
                    <p className="text-lg">⏰ Start Time: <span className="font-normal">{startTime.format("YYYY-MM-DD hh:mm A")}</span></p>
                    <p className="text-lg">⏳ Duration: <span className="font-normal">{match.duration} hours</span></p>
                    <p className="text-lg">🛑 End Time: <span className="font-normal">{endTime.format("YYYY-MM-DD hh:mm A")}</span></p>
                </div>

                {/* Players List */}
                <h3 className="text-2xl mt-6">Players</h3>
                <div className="flex flex-col gap-3 mt-3 overflow-y-auto max-h-[50vh]">
                    {match.players.length > 0 ? (
                        match.players.map((player, index) => (
                            <div 
                                key={player.player_id || `player-${index}`} 
                                className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-md p-3 rounded-md shadow-md gap-4"
                            >
                                {/* Player Avatar */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white text-blue-600 flex items-center justify-center rounded-full font-bold text-xl">
                                        {player.full_name.charAt(0)}
                                    </div>
                                    <p className="text-lg">{player.full_name}</p>
                                </div>

                                {/* Review Button */}
                                {isOngoing && role === "Reviewer" && (
                                    <Link 
                                        to={`/review/${match.match_id}/${player.player_id}`}  
                                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300 flex-shrink-0"
                                    >
                                        🎯 Review
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-200">No players added.</p>
                    )}
                </div>

                {/* Floating Bottom Action Bar */}
                {/* <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-3 flex justify-between shadow-lg">
                    <Link to="/matches" className="text-white text-lg font-semibold">⬅ Back</Link>
                </div> */}
            </div>
        </Layout>
    );
};

export default MatchDetailsPage;
