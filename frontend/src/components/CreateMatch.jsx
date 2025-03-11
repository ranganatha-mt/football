import { useState } from "react";
import useMatchStore from "../store/matchStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authUser";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const CreateMatch = ({ onClose }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { createMatch, searchPlayers, playerList } = useMatchStore();

    const [matchDetails, setMatchDetails] = useState({ 
        match_name: "", 
        location: "", 
        start_date: "", 
        duration: 1 
    });

    const [players, setPlayers] = useState([]);
    const [searchValue, setSearchValue] = useState(""); 
    const [errors, setErrors] = useState({}); 

    const handleChange = (e) => {
        setMatchDetails({ ...matchDetails, [e.target.name]: e.target.value });
    };

    const handleAddPlayer = (player) => {
        if (!players.some((p) => p.user_id === player.user_id)) {
            setPlayers([...players, player]);
        }
        setSearchValue(""); 
    };

    const handleRemovePlayer = (playerId) => {
        setPlayers(players.filter((p) => p.user_id !== playerId));
    };

    const validateForm = () => {
        const newErrors = {};
        const now = dayjs();
        const selectedDate = dayjs(matchDetails.start_date);

        if (!matchDetails.match_name || matchDetails.match_name.trim().length < 3) {
            newErrors.match_name = "Match name must be at least 3 characters.";
        }

        if (!matchDetails.location || matchDetails.location.trim().length < 3) {
            newErrors.location = "Location must be at least 3 characters.";
        }

        if (!matchDetails.start_date) {
            newErrors.start_date = "Start date & time is required.";
        } else if (selectedDate.isBefore(now, "minute")) {
            newErrors.start_date = "Start date & time must be in the future.";
        }

        if (!matchDetails.duration || isNaN(matchDetails.duration) || matchDetails.duration < 1 || matchDetails.duration > 10) {
            newErrors.duration = "Duration must be between 1 and 10 hours.";
        }

        if (players.length === 0) {
            newErrors.players = "At least one player must be added.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateMatch = async () => {
        const formattedStartDate = dayjs(matchDetails.start_date).format("YYYY-MM-DD HH:mm:ss");

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        const created_by = user.user_id;
        const response = await createMatch({ 
            ...matchDetails, 
            start_date: formattedStartDate, 
            players, 
            created_by 
        });

        if (response) {  
            onClose();
            navigate("/matches");
        }
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setSeconds(0, 0); 
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 relative flex flex-col max-h-[90vh] overflow-y-auto">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-200 transition"
                    aria-label="Close"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">🎯 Create Match</h2>

                {/* Form Fields */}
                <div className="space-y-4">
                    <input 
                        className="w-full bg-gray-100 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        placeholder="🏆 Match Name" 
                        name="match_name"
                        onChange={handleChange} 
                        required 
                    />
                    {errors.match_name && <p className="text-red-500 text-sm">{errors.match_name}</p>}

                    <input 
                        className="w-full bg-gray-100 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        placeholder="📍 Location" 
                        name="location"
                        onChange={handleChange} 
                        required 
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

                    <input 
                        className="w-full bg-gray-100 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        type="datetime-local" 
                        name="start_date"
                        onChange={handleChange} 
                        required 
                        min={getCurrentDateTime()} 
                    />
                    {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}

                    <input 
                        className="w-full bg-gray-100 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        type="number" 
                        placeholder="⏳ Duration (hours)" 
                        name="duration"
                        onChange={handleChange} 
                        required 
                    />
                    {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                </div>

                {/* Player Search */}
                <div className="relative mt-4">
                    <input 
                        className="w-full bg-gray-100 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        placeholder="🔍 Search Players"
                        value={searchValue} 
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            searchPlayers(e.target.value);
                        }} 
                    />
                    
                    {searchValue && (
                        <div className="absolute w-full bg-white shadow-md rounded-xl mt-2 max-h-40 overflow-y-auto">
                            {playerList.map((player) => (
                                <div key={player.user_id} 
                                    onClick={() => handleAddPlayer(player)}
                                    className="cursor-pointer p-4 hover:bg-gray-200 border-b">
                                    {player.full_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Players */}
                <div className="mt-4">
                    {players.map((player) => (
                        <div key={player.user_id} className="flex justify-between items-center p-4 bg-gray-200 rounded-xl mb-2">
                            {player.full_name}
                            <button onClick={() => handleRemovePlayer(player.user_id)} className="text-red-500 text-sm">Remove</button>
                        </div>
                    ))}
                </div>
                {errors.players && <p className="text-red-500 text-sm">{errors.players}</p>}

                {/* Save Match Button */}
                <button 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-full mt-6 text-lg font-bold shadow-lg hover:opacity-90 transition"
                    onClick={handleCreateMatch}>
                    🚀 Save Match
                </button>
            </div>
        </div>
    );
};

export default CreateMatch;
