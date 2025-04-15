import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useMatchReviewStore from "../store/matchReviewStore";
import { useAuthStore } from "../store/authUser";
import { Layout } from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const MatchReviewPage = () => {
  const navigate = useNavigate();
  const { matchId, player_id } = useParams();
  const { user } = useAuthStore();
  const user_id = user?.user_id;
  const reviewer_name = user?.full_name;
  const { reviews, messages, fetchReviews, fetchMessages, sendMessage, submitReview, selectedMatch, fetchMatchById, fetchPlayerDetails, user_position } = useMatchReviewStore();
  const reviewer_id = user_id;
  const messagesEndRef = useRef(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [centeredAction, setCenteredAction] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(30);
  const [position, setPosition] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (player_id) {
      fetchPlayerDetails(player_id);
    }
  }, [player_id]);


  const [activeTab, setActiveTab] = useState("goals");

  const actionCategories = {
    goals: [
      { id: "goals", label: "⚽ Goals" },
      { id: "header_goals", label: "🧠 Header Goals" },
      { id: "foot_goals", label: "🦶 Foot Goals" },
      { id: "volley_goals", label: "🥎 Volley Goals" },
      { id: "acrobatic_goals", label: "🤸 Acrobatic Goals" },
      { id: "freekick_goals", label: "🥅 Freekick Goals" },
      { id: "long_range_goals", label: "📍 Long Range Goals" },
      { id: "penalty", label: "⚡ Penalty Goals" },
      { id: "goal_missed", label: "❌ Goal Missed" },
      { id: "own_goal", label: "🎯 Own Goal" }
    ],

    attacks: [
      { id: "assists", label: "🎁 Assists" },
      { id: "cross", label: "➕ Crosses" },
      { id: "through_balls", label: "🧵 Through Balls" },
      { id: "attack_free_kick", label: "🆓 Attack Free Kicks" },
      { id: "corner", label: "🌀 Corners" },
      { id: "dribbling", label: "🕺 Dribbling" },
      { id: "shots_on_target", label: "🎯 Shots on Target" },
      { id: "shots_off_target", label: "🎯❌ Shots off Target" },
      { id: "throw_outs", label: "🤾 Throw Outs" },
      { id: "throw_ins", label: "🤾‍♂️ Throw Ins" }
    ],

    defence: [
      { id: "passes_played", label: "📤 Passes Played" },
      { id: "passes_missed", label: "📥 Passes Missed" },
      { id: "interceptions", label: "🛑 Interceptions" },
      { id: "blocks", label: "🧱 Blocks" },
      { id: "tackles", label: "🦵 Tackles" },
      { id: "last_man_tackles", label: "🧍‍♂️ Last Man Tackles" },
      { id: "head_clearances", label: "🧠 Clearances (Head)" },
      { id: "corners_cleared", label: "🧹 Corners Cleared" }
    ],

    fouls: [
      { id: "fouls", label: "🚨 Fouls" },
      { id: "yellow_card", label: "🟨 Yellow Card" },
      { id: "red_card", label: "🟥 Red Card" },
      { id: "off_side", label: "🚩 Offside" }
    ],

    skills: [
      { id: "skill_novice", label: "🔰 Novice" },
      { id: "skill_intermediate", label: "⚙️ Intermediate" },
      { id: "skill_proficient", label: "📈 Proficient" },
      { id: "skill_advanced", label: "🔥 Advanced" },
      { id: "skill_expert", label: "🎯 Expert" },
      { id: "skill_mastery", label: "🏆 Mastery" }
    ],

    freestyle: [
      { id: "freestyle_struggling", label: "😬 Struggling" },
      { id: "freestyle_capable", label: "🙂 Capable" },
      { id: "freestyle_skilled", label: "🎨 Skilled" },
      { id: "freestyle_outstanding", label: "🌟 Outstanding" },
      { id: "freestyle_exceptional", label: "💎 Exceptional" },
      { id: "freestyle_top_notch", label: "👑 Top Notch" }
    ],
    training: [
      { id: "dribbling_drills", label: "🕺 Dribbling Drills" },
      { id: "passing_accuracy", label: "🎯 Passing Accuracy" },
      { id: "shooting_drills", label: "🔫 Shooting Drills" },
      { id: "stamina_endurance", label: "💪 Stamina & Endurance" },
      { id: "positional_awareness", label: "🧭 Positional Awareness" },
      { id: "defensive_skills", label: "🛡️ Defensive Skills" },
      { id: "ball_control", label: "🎮 Ball Control" },
      { id: "warmup_cooldown_participation", label: "🔥❄️ Warm-up/Cool-down" },
      { id: "tactical_understanding", label: "🧠 Tactical Understanding" },
      { id: "team_communication", label: "📢 Team Communication" }
    ],

    ...(user_position === "Goalkeeper" && {
      goalkeeper: [
        { id: "gk_own_goal", label: "🎯 GK Own Goal" },
        { id: "goals_saved", label: "🧤 Goals Saved" },
        { id: "goals_conceded", label: "🥅 Goals Conceded" },
        { id: "penalty_saved", label: "🛡️ Penalty Saved" },
        { id: "clean_sheets", label: "🧼 Clean Sheets" },
        { id: "punches", label: "👊 Punches" },
        { id: "gk_clearances", label: "🚮 GK Clearances" },
        { id: "goal_kicks", label: "🦵 Goal Kicks" }
      ]
    })
  };



  useEffect(() => {
    fetchReviews(matchId, reviewer_id, player_id);
    fetchMessages(matchId, reviewer_id, player_id);
    fetchMatchById(matchId);
    fetchPlayerDetails(player_id);
  }, [matchId, reviewer_id, player_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, reviews]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setPosition(currentScrollY === 0 ? '' : 'fixed');
      setScrollOffset(currentScrollY === 0 ? 30 : 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedMatch) return;

    const startTime = dayjs(selectedMatch.start_date);
    const endTime = startTime.add(selectedMatch.duration, "hour");

    const updateTimer = () => {
      const now = dayjs();
      if (now.isAfter(endTime)) {
        setTimeLeft("🏁 Match Over!");
        setWarning("🏁 Match Over! Your data has been saved.");

        setTimeout(() => {
          navigate("/player/" + player_id);
        }, 3000);

        return;
      }
      const remaining = dayjs.duration(endTime.diff(now));
      const minutesLeft = remaining.asMinutes();

      if (minutesLeft <= 10 && minutesLeft > 9.5) {
        setWarning("⚠️ Only 10 minutes remaining!");
      } else if (minutesLeft <= 5 && minutesLeft > 4.5) {
        setWarning("⏳ Only 5 minutes left!");
      } else {
        setWarning(null);
      }

      setTimeLeft(`${remaining.hours()}h ${remaining.minutes()}m ${remaining.seconds()}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedMatch, navigate]);

  const showCenteredAction = (text) => {
    setCenteredAction(text);
    setTimeout(() => setCenteredAction(null), 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    if (!message) return;

    sendMessage(matchId, reviewer_id, player_id, message, reviewer_name, selectedMatch.match_name);
    setHighlightedMsgId(messages.length);
    setTimeout(() => setHighlightedMsgId(null), 1000);
    e.target.reset();
  };

  const handleAction = (action) => {
    submitReview(matchId, reviewer_id, player_id, action).then(() => {
      fetchReviews(matchId, reviewer_id, player_id);
      showCenteredAction(`✅ ${action.replace("_", " ").toUpperCase()}`);
    });
  };

  return (
    <Layout>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <AnimatePresence>
          {centeredAction && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-xl font-extrabold"
            >
              {centeredAction}
            </motion.div>
          )}

          {warning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold"
            >
              {warning}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-white text-lg font-bold py-4 px-6 flex items-center justify-between bg-black bg-opacity-70 shadow-md">
        <span>⚽ Live Match Review</span>
        <span className="text-sm opacity-80">
          {timeLeft && ` ⏳ ${timeLeft}`}
        </span>
      </div>

      {/* Reviews Section */}
      <div
        className="w-full bg-opacity-80 p-4 space-y-2 rounded-b-lg shadow-lg overflow-y-auto z-50 transition-all duration-300"
        style={{ top: `${scrollOffset}px`, position: `${position}` }}
      >
        {reviews.map((review, index) => {
          const actionLabels = {
            goals: "⚽ Goals",
            header_goals: "🧠 Header Goals",
            foot_goals: "🦶 Foot Goals",
            volley_goals: "🥎 Volley Goals",
            acrobatic_goals: "🤸 Acrobatic Goals",
            freekick_goals: "🥅 Freekick Goals",
            long_range_goals: "📍 Long Range Goals",
            penalty: "⚡ Penalty Goals",
            own_goal: "🎯 Own Goal",
            goal_missed: "❌ Goal Missed",

            assists: "🎁 Assists",
            cross: "➕ Crosses",
            through_balls: "🧵 Through Balls",
            attack_free_kick: "🆓 Attack Free Kicks",
            corner: "🌀 Corners",
            dribbling: "🕺 Dribbling",
            shots_on_target: "🎯 Shots on Target",
            shots_off_target: "🎯❌ Shots off Target",
            throw_outs: "🤾 Throw Outs",
            throw_ins: "🤾‍♂️ Throw Ins",

            passes_played: "📤 Passes Played",
            passes_missed: "📥 Passes Missed",
            interceptions: "🛑 Interceptions",
            blocks: "🧱 Blocks",
            tackles: "🦵 Tackles",
            last_man_tackles: "🧍‍♂️ Last Man Tackles",
            head_clearances: "🧠 Clearances (Head)",
            corners_cleared: "🧹 Corners Cleared",

            fouls: "🚨 Fouls",
            yellow_card: "🟨 Yellow Card",
            red_card: "🟥 Red Card",
            off_side: "🚩 Offside",

            skill_novice: "🔰 Novice",
            skill_intermediate: "⚙️ Intermediate",
            skill_proficient: "📈 Proficient",
            skill_advanced: "🔥 Advanced",
            skill_expert: "🎯 Expert",
            skill_mastery: "🏆 Mastery",

            freestyle_struggling: "😬 Struggling",
            freestyle_capable: "🙂 Capable",
            freestyle_skilled: "🎨 Skilled",
            freestyle_outstanding: "🌟 Outstanding",
            freestyle_exceptional: "💎 Exceptional",
            freestyle_top_notch: "👑 Top Notch",

            gk_own_goal: "🎯 GK Own Goal",
            goals_saved: "🧤 Goals Saved",
            goals_conceded: "🥅 Goals Conceded",
            penalty_saved: "🛡️ Penalty Saved",
            clean_sheets: "🧼 Clean Sheets",
            punches: "👊 Punches",
            gk_clearances: "🚮 GK Clearances",
            goal_kicks: "🦵 Goal Kicks",

            // Training fields
            dribbling_drills: "🕺 Dribbling Drills",
            passing_accuracy: "🎯 Passing Accuracy",
            shooting_drills: "🔫 Shooting Drills",
            stamina_endurance: "💪 Stamina & Endurance",
            positional_awareness: "🧭 Positional Awareness",
            defensive_skills: "🛡️ Defensive Skills",
            ball_control: "🎮 Ball Control",
            warmup_cooldown_participation: "🔥❄️ Warm-up/Cool-down",
            tactical_understanding: "🧠 Tactical Understanding",
            team_communication: "📢 Team Communication"
          };

          const actions = [];
          for (const [key, label] of Object.entries(actionLabels)) {
            if (review[key] > 0) {
              actions.push(`${label}: ${review[key]}`);
            }
          }

          return (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-600 to-purple-500 text-white p-3 rounded-lg text-sm max-w-md shadow-xl"
            >
              {actions.length > 0 ? actions.join(" | ") : "No actions recorded"}
            </div>
          );
        })}
      </div>


      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`bg-gray-800 text-white p-3 rounded-lg text-sm max-w-md shadow-lg ${highlightedMsgId === index ? "animate-glow-green" : ""
              }`}
          >
            {msg.message}
          </motion.div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input & Actions */}
      <div className="p-4 bg-black bg-opacity-70 border-t flex flex-col items-center relative z-10">
        <form onSubmit={handleSendMessage} className="flex w-full max-w-2xl">
          <input
            type="text"
            autoComplete="off"
            name="message"
            className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
            placeholder="Type a message..."
            required
          />
          <button type="submit" className="ml-3 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition">
            Send
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3 justify-center">

          <div className="p-4">
            {/* Tab Navigation */}
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center border-b border-gray-600">
              {Object.keys(actionCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-3 py-2 text-xs sm:text-sm md:text-base text-white ${activeTab === category ? "border-b-2 border-blue-500 font-semibold" : "opacity-50"
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>


            {/* Actions under selected tab */}
            {/* Actions under selected tab */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {actionCategories[activeTab].map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg hover:scale-105 transition"
                >
                  {action.label}
                </button>
              ))}
            </div>

          </div>

          {/* {["goals", "passes", "free_kicks", "green_cards", "yellow_cards", "red_cards"].map((action, index) => (
            <button key={index} onClick={() => handleAction(action)} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition">
              {action === "goals" ? "⚽ Goal" : action === "passes" ? "🎯 Pass" : action === "free_kicks" ? "🥅 Free Kick" : action === "green_cards" ? "🟩 Green Card" : action === "yellow_cards" ? "🟨 Yellow Card" : "🟥 Red Card"}
            </button>
          ))} */}
        </div>
      </div>
    </Layout>
  );
};

export default MatchReviewPage;
