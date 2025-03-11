import { useParams,useNavigate  } from "react-router-dom";
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
  const { reviews, messages, fetchReviews, fetchMessages, sendMessage, submitReview, selectedMatch, fetchMatchById } = useMatchReviewStore();
  const reviewer_id = user_id;
  const messagesEndRef = useRef(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [centeredAction, setCenteredAction] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(30);
  const [position, setPosition] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const [warning, setWarning] = useState(null);

  useEffect(() => {
    fetchReviews(matchId, reviewer_id, player_id);
    fetchMessages(matchId, reviewer_id, player_id);
    fetchMatchById(matchId);
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
          navigate("/");
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

    sendMessage(matchId, reviewer_id, player_id, message);
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
          const actions = [];
          if (review.goals > 0) actions.push(`⚽ Goals: ${review.goals}`);
          if (review.passes > 0) actions.push(`🎯 Passes: ${review.passes}`);
          if (review.free_kicks > 0) actions.push(`🥅 Free Kicks: ${review.free_kicks}`);
          if (review.green_cards > 0) actions.push(`🟩 Green Cards: ${review.green_cards}`);
          if (review.yellow_cards > 0) actions.push(`🟨 Yellow Cards: ${review.yellow_cards}`);
          if (review.red_cards > 0) actions.push(`🟥 Red Cards: ${review.red_cards}`);

          return (
            <div key={index} className="bg-gradient-to-r from-blue-600 to-purple-500 text-white p-3 rounded-lg text-sm max-w-md shadow-xl">
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
            className={`bg-gray-800 text-white p-3 rounded-lg text-sm max-w-md shadow-lg ${
              highlightedMsgId === index ? "animate-glow-green" : ""
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
          {["goals", "passes", "free_kicks", "green_cards", "yellow_cards", "red_cards"].map((action, index) => (
            <button key={index} onClick={() => handleAction(action)} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition">
              {action === "goals" ? "⚽ Goal" : action === "passes" ? "🎯 Pass" : action === "free_kicks" ? "🥅 Free Kick" : action === "green_cards" ? "🟩 Green Card" : action === "yellow_cards" ? "🟨 Yellow Card" : "🟥 Red Card"}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MatchReviewPage;
