//import { useState, useEffect, useRef } from "react";

import React, { Suspense,  useEffect, useRef,useState  } from "react";
const Card = React.lazy(() => import("../../components/Card.jsx"));

import useMatchStore from "../../store/matchStore";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/authUser";


import { PieChart, Pie, Cell,   Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { motion } from "framer-motion";

const data = [
  { name: "Match 1", goals: 2 },
  { name: "Match 2", goals: 3 },
  { name: "Match 3", goals: 1 },
  { name: "Match 4", goals: 4 },
  { name: "Match 5", goals: 2 },
];

const data_pie_chart = [
    { name: "Goals", value: 10, color: "#4CAF50" },
    { name: "Matches", value: 20, color: "#2196F3" },
    { name: "Passes", value: 50, color: "#FFC107" },
    { name: "Free Kicks", value: 5, color: "#FF5722" },
    { name: "Goals Saved", value: 8, color: "#9C27B0" },
    { name: "Red Cards", value: 2, color: "#F44336" },
    { name: "Yellow Cards", value: 4, color: "#FFEB3B" }
  ];

  const reviews = [
    { match: "Team A vs Team B", reviewer: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=1", rating: 4.5, comment: "Great player! Always gives 100% on the field." },
    { match: "Team A vs Team B", reviewer: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=1", rating: 4, comment: "Needs to work on consistency." },
    { match: "Team C vs Team D", reviewer: "Sophia Lee", avatar: "https://i.pravatar.cc/150?img=2", rating: 5, comment: "An outstanding talent with amazing skills!" },
    { match: "Team C vs Team D", reviewer: "Michael Johnson", avatar: "https://i.pravatar.cc/150?img=3", rating: 4, comment: "Very consistent performance, reliable player." },
    { match: "Team A vs Team B", reviewer: "Sophia Lee", avatar: "https://i.pravatar.cc/150?img=2", rating: 5, comment: "Truly a game-changer on the field!" }
  ];
  
  // Group reviews by match name
  const groupedReviews = reviews.reduce((acc, { match, reviewer, avatar, rating, comment }) => {
    if (!acc[match]) acc[match] = {};
    if (!acc[match][reviewer]) acc[match][reviewer] = { avatar, reviews: [] };
    
    acc[match][reviewer].reviews.push({ rating, comment });
    return acc;
  }, {});

const PlayerStatsPage = () => {
    const { user } = useAuthStore();
    const role = user?.user_type;
    const id = user?.user_id; // Fixed destructuring

    const { matches, fetchMatchesByPlayerId, totalMatches } = useMatchStore();



    const {     
      matchesCount,     
      isLoadingMatches,      
      errorMatches,
      fetchCounts,
    } = useMatchStore();
  


    const [page, setPage] = useState(1);
    const limit = 10;
    const initialRender = useRef(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        if (!id) return; // Ensure id is valid before making API call

        setLoading(true);
        fetchMatchesByPlayerId(id, page, limit).finally(() => setLoading(false));
        fetchCounts(user.user_type,id);
    }, [id, page, fetchMatchesByPlayerId]);

    return (
      

        <div className="p-4 rounded-lg flex-1 text-white min-h-screen">

          <div className="p-4 flex gap-4 flex-col md:flex-row">
                <div className="w-full lg:w-2/3 flex flex-col gap-8">
                  <div className="flex gap-4 justify-between flex-wrap">
                    <Suspense fallback={<div className="loader">Loading...</div>}>
                      <Card type="Number Of Matches Played" count={matchesCount} isLoading={isLoadingMatches} error={errorMatches}   />
                      <Card type="Number Of Goals Scored" count="10"   />
                    </Suspense>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center   p-4">
                    <motion.div 
                        className="w-full  p-4 bg-white rounded-2xl shadow-xl" 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-bold text-gray-800 text-center mb-3">Matches vs Goals</h2>
                        <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                            <YAxis tick={{ fill: "#6b7280" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "none", padding: "10px" }} />
                            <Bar dataKey="goals" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                    </div>


                    <div className="flex items-center justify-center   p-6">
      <motion.div 
        className="w-full  p-5 bg-white rounded-3xl shadow-2xl relative overflow-hidden" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">Player Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data_pie_chart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data_pie_chart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "10px", border: "none", padding: "10px" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>


    <div className="p-4 bg-gray-100 rounded-2xl shadow-md  flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
    {Object.entries(groupedReviews).map(([match, reviewers]) => (
        <div key={match} className="p-4 rounded-2xl shadow-md bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{match}</h2>

          {Object.entries(reviewers).map(([reviewer, {  reviews }]) => (
            <div key={reviewer} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex gap-4 items-center">
                
                <div className="font-semibold text-lg text-gray-800">{reviewer}</div>
              </div>
              <div className="mt-2 space-y-2">
                {reviews.map(({  comment }, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-3">
                    <div className="flex items-center text-yellow-500">
                     
                    </div>
                    <p className="text-gray-600  mt-1">{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>



   



            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                <h2 className="text-3xl font-extrabold tracking-wide text-white">⚽  Matches List</h2>
            </div>

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
                                    <div className="flex-1 min-w-0">
                                        <span className="text-lg block text-gray-100 w-50 sm:w-96">
                                            {match.match_name}
                                        </span>
                                        <span className="text-gray-400 text-sm block">
                                            {dayjs(match.start_date).format("YYYY-MM-DD hh:mm A")}
                                        </span>
                                    </div>

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

                    <Pagination page={page} total={totalMatches} limit={limit} setPage={setPage} />
                </>
            ) : (
                <p className="text-center text-gray-400 text-lg mt-4">No matches available</p>
            )}
        </div>
    );
};

export default PlayerStatsPage;
