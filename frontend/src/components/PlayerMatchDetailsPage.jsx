import React, { Suspense, useEffect,  useState } from "react";
import { useParams, Link } from "react-router-dom";
import useMatchStore from "../store/matchStore";

import { Layout } from "../components/Layout";
import dayjs from "dayjs";
import { useAuthStore } from "../store/authUser";



const Card = React.lazy(() => import("../components/Card.jsx"));






import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { motion } from "framer-motion";

const PlayerMatchDetailsPage = () => {
   
    const { matchId,player_id } = useParams();
    const { selectedMatch, fetchMatchById } = useMatchStore();
    const [loading, setLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState("GOALS");
    const {  fetchPlayerDetails, user_position, player_details } = useMatchStore();
 

    

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

    useEffect(() => {
       /* if (initialRender.current) {
            initialRender.current = false;
            return;
        }*/
        const loadMatch = async () => {
            await fetchMatchById(matchId);
            setLoading(false);
        };
        loadMatch();

        
    
    fetchAllStats(player_id, matchId);
    fetchReviews(player_id,matchId);

    fetchPlayerDetails(player_id);

    }, [matchId, fetchMatchById]);

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

    if (!user_position) {
        return <div className="h-screen flex items-center justify-center text-xl text-gray-600">
        Loading Stats..
    </div>;
      }

    const match = selectedMatch;
    const startTime = dayjs(match.start_date);
    const endTime = startTime.add(match.duration, "hour");
    const now = dayjs();
    const isOngoing = now.isAfter(startTime) && now.isBefore(endTime);


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    
    
    
    
    
      // Group reviews by match_id
      const groupeReviews = reviews.reduce((acc, { match_id, match_name, reviewer_name, message }) => {
        if (!acc[match_id]) acc[match_id] = { match_name, reviewers: {} };
        if (!acc[match_id].reviewers[reviewer_name]) acc[match_id].reviewers[reviewer_name] = { reviews: [] };
    
        acc[match_id].reviewers[reviewer_name].reviews.push({ comment: message });
        return acc;
      }, {});
    
      const groupedReviews = Object.entries(groupeReviews)
        .reverse()
        .map(([match_id, data]) => ({ match_id, ...data }));
    
    
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
    
    
      if (!player_details) {
        return (
          <div className="text-center py-10 text-gray-600">
            Loading player details...
          </div>
        );
      }
      const {
        full_name,
        age,
        gender,
        contact_email,
        contact_phone,
        profile_picture,
      } = player_details;
    
      function ProfileField({ label, value }) {
        return (
          <div>
            <span className="block text-xs text-gray-500">{label}</span>
            <span className="font-medium">{value || "—"}</span>
          </div>
        );
      }

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

                <div className="p-4 flex gap-4 flex-col md:flex-row">
                          <div className="w-full lg:w-2/3 flex flex-col gap-8">
                            <div className="flex gap-4 justify-between flex-wrap">
                              <Suspense fallback={<div className="loader">Loading...</div>}>
                                
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
                            {activeTab} ACTIONS 
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

                {/* Floating Bottom Action Bar */}
                {/* <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-3 flex justify-between shadow-lg">
                    <Link to="/matches" className="text-white text-lg font-semibold">⬅ Back</Link>
                </div> */}
            </div>
        </Layout>
    );
};

export default PlayerMatchDetailsPage;
