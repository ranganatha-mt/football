import { useState, useEffect, useRef } from "react";
import useMatchStore from "../store/matchStore";
import CreateMatch from "../components/CreateMatch";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import Pagination from "../components/Pagination";
import dayjs from "dayjs";
import { PlusCircle } from "lucide-react"; // Icon for FAB
import TableSearch from "../components/TableSearch";
import { useAuthStore } from "../store/authUser";

const MatchListPage = () => {
    const { matches, fetchMatches, totalMatches,search,setSearch } = useMatchStore();
    const [showPopup, setShowPopup] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 50;
    const initialRender = useRef(true);
    const { user } = useAuthStore();
    const role = user?.user_type;

    useEffect(() => {
       /* if (initialRender.current) {
            initialRender.current = false;
            return;
        }*/
        fetchMatches(page, limit,search);
    }, [page, limit,search,fetchMatches]);

    return (
        <Layout>
            {/* Full-Height Page Background */}
            <div className=" min-h-screen h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-white">⚽ Matches List</h2>
                </div>

                <div className="flex justify-between items-center mb-6">
            {/* <h1 className="hidden md:block text-lg font-semibold text-white">Players List</h1> */}
            
            <TableSearch search={search} setSearch={setSearch} />
          </div>

                {/* Match List Container */}
                <div className="flex-1 flex flex-col">
                    {matches.length > 0 ? (
                        <ul className="space-y-4">
                            {matches.map((match) => (
                                <li
                                    key={match.match_id}
                                    className=" flex items-center justify-between bg-gray-700/80 p-5 rounded-xl shadow-lg border border-gray-900 backdrop-blur-md transition hover:scale-[1.02]"
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

                                    {/* Match Link */}
                                    <Link 
                                        to={`/matches/${match.match_id}`} 
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                                    >
                                        View Match
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-white text-lg mt-10">No matches available</p>
                    )}

                    {/* Pagination */}
                    <Pagination page={page} total={totalMatches} limit={limit} setPage={setPage} />
                </div>

                {role !== "Reviewer" && (
                    <>
                        {/* Floating Create Match Button */}
                        <button 
                            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-teal-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2"
                            onClick={() => setShowPopup(true)}
                        >
                            <PlusCircle size={24} />
                            <span className="hidden sm:inline">Create Match</span>
                        </button>

                        {/* Create Match Popup */}
                        {showPopup && <CreateMatch onClose={() => setShowPopup(false)} />}
                    </>
                )}


                
            </div>
        </Layout>
    );
};

export default MatchListPage;
