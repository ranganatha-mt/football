//import { useState, useEffect, useRef } from "react";
import React, { Suspense, useEffect, useRef, useState } from "react";
const Card = React.lazy(() => import("../components/Card.jsx"));

import useMatchStore from "../store/matchStore";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import Pagination from "../components/Pagination";
import dayjs from "dayjs";
import { useAuthStore } from "../store/authUser";

import TableSearch from "../components/TableSearch";
//import MatchReviewPopup from "../components/MatchReviewPopup";

import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { motion } from "framer-motion";

/*
const data = [
  { name: "Match 1", goals: 2 },
  { name: "Match 2", goals: 3 },
  { name: "Match 3", goals: 1 },
  { name: "Match 4", goals: 4 },
  { name: "Match 5", goals: 2 },
];


const ChartData = [
    { name: "Goals", value: 10, color: "#4CAF50" },
    { name: "Matches", value: 20, color: "#2196F3" },
    { name: "Passes", value: 50, color: "#FFC107" },
    { name: "Free Kicks", value: 5, color: "#FF5722" },
    { name: "Goals Saved", value: 8, color: "#9C27B0" },
    { name: "Red Cards", value: 2, color: "#F44336" },
    { name: "Yellow Cards", value: 4, color: "#FFEB3B" }
  ];

 
  

  
  const reviews = [
    { match_id: "1", match: "Team A vs Team B", reviewer: "Rahul Sharma",  comment: "Great player! Always gives 100% on the field." },
    { match_id: "1", match: "Team A vs Team B", reviewer: "Rahul Sharma",  comment: "Needs to work on consistency." },
    { match_id: "2", match: "Team C vs Team D", reviewer: "Sophia Lee",  comment: "An outstanding talent with amazing skills!" },
    { match_id: "2", match: "Team C vs Team D", reviewer: "Michael Johnson",  comment: "Very consistent performance, reliable player." },
    { match_id: "1", match: "Team A vs Team B", reviewer: "Sophia Lee",  comment: "Truly a game-changer on the field!" }
  ];
  
 */

const PlayerStatsPage = () => {


  const { user } = useAuthStore();
  const role = user?.user_type;

  const { id } = useParams(); // Player ID
  const { matches, fetchMatchesByPlayerId, totalMatches, search, setSearch, fetchPlayerDetails, user_position } = useMatchStore();


  useEffect(() => {
    if (id) {
      fetchPlayerDetails(id);
    }
  }, [id]);

  const {
    matchesCount,
    isLoadingMatches,
    errorMatches,
    fetchCounts,
  } = useMatchStore();

  const {
    reviews,
    fetchReviews,
  } = useMatchStore();



  const {
    statCards,
    isLoadingStats,
    errorStats,
    fetchAllStats,
  } = useMatchStore();

  const [page, setPage] = useState(1);
  const limit = 50;
  const initialRender = useRef(true);
  const [loading, setLoading] = useState(true);
  // const [showPopup, setShowPopup] = useState(false);
  // const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    /*if (initialRender.current) {
        initialRender.current = false;
        return;
    }*/
    setLoading(true);
    fetchMatchesByPlayerId(id, page, limit, search, setSearch).finally(() => setLoading(false));
    fetchCounts('Player', id);
    //fetchStats(id,'','goals');

    fetchAllStats(id, '');


    fetchReviews(id);
  }, [id, page, search, fetchMatchesByPlayerId, limit]);







  // Group reviews by match_id
  const groupedReviews = reviews.reduce((acc, { match_id, match_name, reviewer_name, message }) => {
    if (!acc[match_id]) acc[match_id] = { match_name, reviewers: {} };
    if (!acc[match_id].reviewers[reviewer_name]) acc[match_id].reviewers[reviewer_name] = { reviews: [] };

    acc[match_id].reviewers[reviewer_name].reviews.push({ comment: message });
    return acc;
  }, {});


  const statCategories = {
    GOALS: [
      "goals", "header_goals", "foot_goals", "volley_goals", "acrobatic_goals",
      "freekick_goals", "long_range_goals", "penalty", "goal_missed", "own_goal"
    ],
    ATTACKS: [
      "assists", "cross", "through_balls", "attack_free_kick", "corner",
      "dribbling", "shots_on_target", "shots_off_target", "throw_outs", "throw_ins"
    ],
    DEFENCE: [
      "passes_played", "passes_missed", "interceptions", "blocks", "tackles",
      "last_man_tackles", "head_clearances", "corners_cleared"
    ],
    FOULS: [
      "fouls", "yellow_card", "red_card", "off_side"
    ],
    SKILLS: [
      "skill_novice", "skill_intermediate", "skill_proficient",
      "skill_advanced", "skill_expert", "skill_mastery"
    ],
    FREESTYLE: [
      "freestyle_struggling", "freestyle_capable", "freestyle_skilled",
      "freestyle_outstanding", "freestyle_exceptional", "freestyle_top_notch"
    ],
    ...(user_position === "Goalkeeper" && {
      GOALKEEPER: [
        "gk_own_goal", "goals_saved", "goals_conceded", "penalty_saved",
        "clean_sheets", "punches", "gk_clearances", "goal_kicks"
      ]
    }),
    TRAINING: [
      "dribbling_drills", "passing_accuracy", "shooting_drills", "stamina_endurance",
      "positional_awareness", "defensive_skills", "ball_control",
      "warmup_cooldown_participation", "tactical_understanding", "team_communication"
    ]
  };

  const [activeTab, setActiveTab] = useState("GOALS");

  const colors = [
    "#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0",
    "#F44336", "#FFEB3B", "#00BCD4", "#8BC34A", "#E91E63"
  ];

  const getDataForCategory = (category) => {
    const keys = statCategories[category];
    return keys
      .map((key, index) => ({
        name: key.replace(/_/g, ' ').toUpperCase(),
        value: parseInt(statCards[key] || 0),
        color: colors[index % colors.length]
      }))
      .filter(item => item.value > 0);
  };

  const pieChartData = getDataForCategory(activeTab);


  const getBarChartDataForCategory = (category) => {
    const keys = statCategories[category];
    let data = keys.map((key) => ({
      name: key.replace(/_/g, ' ').toUpperCase(),
      value: parseInt(statCards[key] || 0),
    }));

    return [
      {
        name: category,
        ...data.reduce((acc, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {}),
      },
    ];
  };
  const barChartData = getBarChartDataForCategory(activeTab);


  return (
    <Layout>
      <div className="p-4 rounded-lg flex-1 text-white min-h-screen">
        <div className="p-4 flex gap-4 flex-col md:flex-row">
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="flex gap-4 justify-between flex-wrap">
              <Suspense fallback={<div className="loader">Loading...</div>}>
                <Card type="Number Of Matches Played" count={matchesCount} isLoading={isLoadingMatches} error={errorMatches} />
                {/* <Card type="Number Of Goals Scored" count={totalAdjustedStat}  isLoading={isLoadingStats} error={errorStats} /> */}
                {Object.entries(statCards).map(([type, value]) => (
                  <Card
                    key={type}
                    type={type.replace(/_/g, ' ').toUpperCase()}
                    count={value}
                    isLoading={isLoadingStats}
                    error={errorStats}
                  />
                ))
                }

              </Suspense>
            </div>
          </div>
        </div>


        {/*<div className="flex items-center justify-center   p-4">
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
        </div>*/}



        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.keys(statCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === category
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stacked Bar Chart */}

        <motion.div
          className="w-full p-4 bg-white rounded-3xl shadow-lg mb-5"
          key={`${activeTab}-bar-chart`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
            {activeTab} ACTIONS - Matches: {matchesCount}
          </h3>
          <div className="w-full h-[400px] sm:h-[500px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "none", padding: "10px" }} />
                {Object.keys(barChartData[0]).map((key, index) =>
                  key !== "name" ? (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={colors[index % colors.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ) : null
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>


        {/* Pie Chart */}
        {pieChartData.length > 0 ? (
          <motion.div
            className="w-full p-4 bg-white rounded-3xl shadow-lg mb-5"
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              {activeTab} STATS
            </h3>
            <div className="w-full h-[500px] sm:h-[600px] md:h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth < 640 ? 100 : 200} // small on mobile, bigger otherwise
                    label={pieChartData.length <= 12}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${activeTab}-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      color: "#fff",
                      borderRadius: "5px",
                      border: "none",
                      padding: "5px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center text-center text-gray-500 p-6 bg-white rounded-xl shadow-inner mt-6 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-5xl mb-3">📊</div>
            <p className="text-lg font-semibold">No data available</p>
            <p className="text-sm text-gray-400">There are no stats recorded for this category yet.</p>
          </motion.div>


        )}





        <div className="p-4 bg-gray-100 rounded-2xl shadow-md flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
          {Object.entries(groupedReviews).map(([matchId, { match_name, reviewers }]) => (
            <div key={matchId} className="p-4 rounded-2xl shadow-md bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{match_name}</h2>
              {/* <p className="text-sm text-gray-500 mb-3">Match ID: {matchId}</p> */}

              {Object.entries(reviewers).map(([reviewer, { reviews }]) => (
                <div key={reviewer} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex gap-4 items-center">
                    <div className="font-semibold text-lg text-gray-800">{reviewer}</div>
                  </div>
                  <div className="mt-2 space-y-2">
                    {reviews.map(({ comment }, index) => (
                      <div key={index} className="border-l-4 border-yellow-500 pl-3">
                        <p className="text-gray-600 mt-1">{comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>



        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-3xl font-extrabold tracking-wide text-white">⚽  Matches List</h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="hidden md:block text-lg font-semibold text-white">Players List</h1> */}

          <TableSearch search={search} setSearch={setSearch} />
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

                    <Link
                      to={`/matches/${match.match_id}`}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                      View Match
                    </Link>



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
