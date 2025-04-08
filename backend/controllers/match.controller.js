import { Op } from "sequelize";
import moment from "moment";
import { sequelize } from "../config/db.js";
import { Match } from "../models/matches.model.js";
import { MatchPlayers } from "../models/match_players.model.js";
import { User } from "../models/user.model.js";
import dayjs from "dayjs";

// ✅ Function to check if a player is available
async function isPlayerAvailable(player_id, start_date, duration) {
  if (!player_id) {
      console.error("Error: player_id is undefined");
      return false;
  }

  const matchStart = new Date(start_date);
  const matchEnd = new Date(matchStart.getTime() + duration * 60 * 60 * 1000);

  // Get all matches where this player is registered
  const playerMatches = await MatchPlayers.findAll({
      where: { player_id },
      attributes: ["match_id"],
  });

  if (!playerMatches.length) return true; // ✅ Player is available if they have no matches.

  const matchIds = playerMatches.map(mp => mp.match_id);

  // Find if any existing match overlaps
  const overlappingMatch = await Match.findOne({
      where: {
          match_id: { [Op.in]: matchIds },
          [Op.or]: [
              // ✅ Case 1: New match starts within an existing match's time range
              {
                  start_date: { [Op.lte]: matchStart },
                  [Op.and]: sequelize.where(
                      sequelize.fn("ADDDATE", sequelize.col("start_date"), sequelize.literal("INTERVAL duration HOUR")),
                      ">",
                      matchStart
                  ),
              },
              // ✅ Case 2: Existing match starts within the new match's time range
              {
                  start_date: { [Op.gte]: matchStart, [Op.lt]: matchEnd }
              }
          ],
      },
  });

  return !overlappingMatch; // ✅ If no conflicts, player is available.
}




// ✅ Match Controller
export const matchController = {

    // 🔹 Create Match API
    createMatch: async (req, res) => {
        try {
            const { match_name, location, start_date, duration, created_by, players } = req.body;

            if (!players || players.length === 0) {
                return res.status(400).json({ success: false, message: "At least one player must be added." });
            }

            // Convert start_date to proper format
            const formattedStartDate = dayjs(start_date).format("YYYY-MM-DD HH:mm:ss");

            // Validate all players before checking availability
            for (const player of players) {
                if (!player.user_id || !player.full_name) {
                    return res.status(400).json({ success: false, message: "Invalid player data provided." });
                }
            }

            // Check if all selected players are available
            for (const player of players) {
                const available = await isPlayerAvailable(player.user_id, formattedStartDate, duration);
                if (!available) {
                    return res.status(400).json({ success: false, message: `Player ${player.full_name} is already in a match.` });
                }
            }

            // ✅ Create the match
            const match = await Match.create({ 
                match_name, 
                location, 
                start_date: formattedStartDate, 
                duration, 
                created_by 
            });

            // ✅ Add players to the match
            const matchPlayers = players.map(player => ({
                match_id: match.match_id,
                player_id: player.user_id,
                player_name: player.full_name,
                created_by,
            }));

            await MatchPlayers.bulkCreate(matchPlayers);

            return res.status(201).json({ success: true, message: "Match created successfully!", match });
        } catch (error) {
            console.error("Error creating match:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // 🔹 Delete Match API
    deleteMatch: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { match_id } = req.params;

            // Check if the match exists
            const match = await Match.findByPk(match_id, { transaction: t });
            if (!match) {
                await t.rollback();
                return res.status(404).json({ success: false, message: "Match not found" });
            }

            // Delete all players associated with the match
            await MatchPlayers.destroy({ where: { match_id }, transaction: t });

            // Delete the match itself
            await Match.destroy({ where: { match_id }, transaction: t });

            await t.commit();
            return res.status(200).json({ success: true, message: "Match deleted successfully" });
        } catch (error) {
            await t.rollback();
            console.error("Error deleting match:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    // 🔹 Get Matches API (Manually Fetching Players & Users)
    getMatches: async (req, res) => {
        try {
            let { page, limit,search = '' } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;
    
            const todayStart = moment().startOf("day").toDate();
            const todayEnd = moment().endOf("day").toDate();
            
    
            // Total matches count for pagination
            const totalMatches = await Match.count({
                where: { status: ['Scheduled', 'Ongoing'],
                    match_name: {
                      [Op.like]: `%${search}%`,
                    }, },
            });
    
            // Fetch today's matches first
            const todaysMatches = await Match.findAll({
                where: {
                    status: ['Scheduled', 'Ongoing'],
                    start_date: {
                        [Op.between]: [todayStart, todayEnd],
                    },
                    
                    match_name: {
                      [Op.like]: `%${search}%`,
                    },
                },
                order: [["start_date", "ASC"]],
            });
    
            // Fetch other matches (excluding today's)
            const otherMatches = await Match.findAll({
                where: {
                    status: ['Scheduled', 'Ongoing'],
                    start_date: {
                        [Op.notBetween]: [todayStart, todayEnd],
                    },
                    
                    match_name: {
                      [Op.like]: `%${search}%`,
                    },
                },
                order: [["start_date", "DESC"]],
                limit,
                offset,
            });
    
            const combinedMatches = [...todaysMatches, ...otherMatches];
    
            // Fetch players for each match
            const matchesWithPlayers = await Promise.all(
                combinedMatches.map(async (match) => {
                    const matchPlayers = await MatchPlayers.findAll({
                        where: { match_id: match.match_id },
                    });
    
                    const players = await Promise.all(
                        matchPlayers.map(async (mp) => {
                            const user = await User.findOne({
                                where: { user_id: mp.player_id },
                                attributes: ["full_name", "contact_email"],
                            });
    
                            return {
                                player_id: mp.player_id,
                                player_name: mp.player_name,
                                full_name: user?.full_name || "Unknown",
                                contact_email: user?.contact_email || "Unknown",
                            };
                        })
                    );
    
                    return { ...match.dataValues, players };
                })
            );
    
            return res.status(200).json({
                success: true,
                matches: matchesWithPlayers,
                totalMatches,
                totalPages: Math.ceil(totalMatches / limit),
                currentPage: page,
            });
    
        } catch (error) {
            console.error("Error fetching matches:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    getMatchesByPlayerId: async (req, res) => {
        try {
            const { player_id } = req.params;
            let { page, limit, search } = req.query;
    
            // Set default values
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;
            search = search || ""; // fallback to empty string if no search input
    
            // Define today's date range
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
    
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
    
            // Get match_ids for the player
            const matchPlayerRecords = await MatchPlayers.findAll({
                where: { player_id },
                attributes: ['match_id']
            });
    
            if (!matchPlayerRecords.length) {
                return res.status(404).json({
                    success: false,
                    message: "No matches found for this player."
                });
            }
    
            const matchIds = matchPlayerRecords.map(record => record.match_id);
    
            // Fetch today's matches (unpaginated)
            const todaysMatches = await Match.findAll({
                where: {
                    match_id: { [Op.in]: matchIds },
                    start_date: {
                        [Op.between]: [todayStart, todayEnd],
                    },
                    status: ['Scheduled', 'Ongoing'],
                    match_name: {
                        [Op.like]: `%${search}%`
                    }
                },
                order: [['start_date', 'ASC']],
            });
    
            // Fetch other matches (paginated)
            const { rows: otherMatches, count } = await Match.findAndCountAll({
                where: {
                    match_id: { [Op.in]: matchIds },
                    start_date: {
                        [Op.notBetween]: [todayStart, todayEnd],
                    },
                    status: ['Scheduled', 'Ongoing'],
                    match_name: {
                        [Op.like]: `%${search}%`
                    }
                },
                order: [['start_date', 'DESC']],
                limit,
                offset,
            });
    
            const matches = [...todaysMatches, ...otherMatches];
    
            res.json({
                matches,
                count: count + todaysMatches.length,
                totalPages: Math.ceil((count + todaysMatches.length) / limit),
                currentPage: page
            });
    
        } catch (error) {
            console.error("Error fetching matches by player ID:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
    ,
    // ✅ Get Match by ID API
    getMatchById: async (req, res) => {
        try {
            const { match_id } = req.params;
    
            // Fetch the match details
            const match = await Match.findOne({
                where: { match_id }
            });
    
            if (!match) {
                return res.status(404).json({ success: false, message: "Match not found" });
            }
    
            // Fetch players for the match
            const matchPlayers = await MatchPlayers.findAll({
                where: { match_id }
            });
    
            // Fetch user details for each player
            const players = await Promise.all(
                matchPlayers.map(async (mp) => {
                    const user = await User.findOne({
                        where: { user_id: mp.player_id },
                        attributes: ["user_id", "full_name", "contact_email"]
                    });
    
                    return {
                        player_id: mp.player_id,
                        full_name: user?.full_name || "Unknown",
                        contact_email: user?.contact_email || "Unknown"
                    };
                })
            );
    
            return res.status(200).json({
                success: true,
                match: { ...match.dataValues, players }
            });
    
        } catch (error) {
            console.error("Error fetching match details:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    getPlayerDetails: async (req, res) => {
        try {
            const { player_id } = req.params;
    
            // Fetch the match details
            const player = await User.findOne({
                where: { user_id: player_id }
            });
    
            if (!player) {
                return res.status(404).json({ success: false, message: "Player not found" });
            }
    
            
    
            return res.status(200).json({
                success: true,
                player
            });
    
        } catch (error) {
            console.error("Error fetching player details:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    matchesCount: async (req, res) => {
        try {
            const { user_type, user_id } = req.query;
            let matchCount = 0;
    
            if (user_type === 'Admin') {
                matchCount = await Match.count();
            }

            if (user_type === 'Reviewer') {
                matchCount = await Match.count({
                    where: { created_by: user_id }
                });
            }

            if (user_type === 'Player') {
                matchCount = await MatchPlayers.count({
                    where: { player_id: user_id }
                });
            }
    
            res.json({ count: matchCount });
        } catch (error) {
            console.error("Error fetching matches count:", error);
            res.status(500).json({ success: false, message: 'Error fetching matches count' });
        }
    },
    getTotalAdjustedStat : async (req, res) => {
        try {
            const { player_id, match_id, stat_type } = req.query;
    
            if (!player_id) {
                return res.status(400).json({ success: false, message: "Player ID is required" });
            }
    
            // Validate the stat_type to prevent SQL injection
            //const validStats = ["goals", "passes", "free_kicks", "green_cards", "yellow_cards", "red_cards"];
            const validStats = [
                // GOALS
                "goals", "header_goals", "foot_goals", "volley_goals", "acrobatic_goals",
                "freekick_goals", "long_range_goals", "penalty", "goal_missed", "own_goal",
              
                // ATTACKS
                "assists", "cross", "through_balls", "attack_free_kick", "corner",
                "dribbling", "shots_on_target", "shots_off_target", "throw_outs", "throw_ins",
              
                // DEFENCE
                "passes_played", "passes_missed", "interceptions", "blocks", "tackles",
                "last_man_tackles", "head_clearances", "corners_cleared",
              
                // FOULS
                "fouls", "yellow_card", "red_card", "off_side",
              
                // SKILLS
                "skill_novice", "skill_intermediate", "skill_proficient", 
                "skill_advanced", "skill_expert", "skill_mastery",
              
                // FREESTYLE
                "freestyle_struggling", "freestyle_capable", "freestyle_skilled", 
                "freestyle_outstanding", "freestyle_exceptional", "freestyle_top_notch",
              
                // GOALKEEPER
                "gk_own_goal", "goals_saved", "goals_conceded", "penalty_saved",
                "clean_sheets", "punches", "gk_clearances", "goal_kicks"
              ];
              
            if (!stat_type || !validStats.includes(stat_type)) {
                return res.status(400).json({ success: false, message: "Invalid stat type" });
            }
    
            const whereCondition = match_id ? "AND match_id = :match_id" : "";
    
            const query = `
                SELECT 
                    SUM(adjusted_stat) AS total_adjusted_stat
                FROM (
                    SELECT 
                        CEIL(SUM(${stat_type}) / 
                            CASE 
                                WHEN COUNT(DISTINCT reviewer_id) > 1 THEN COUNT(DISTINCT reviewer_id) 
                                ELSE 1 
                            END
                        ) AS adjusted_stat
                    FROM match_review
                    WHERE player_id = :player_id ${whereCondition}
                    GROUP BY match_id
                ) AS subquery;
            `;
    
            const [result] = await sequelize.query(query, {
                replacements: { player_id, match_id },
                type: sequelize.QueryTypes.SELECT
            });
    
            res.json({ total_adjusted_stat: result.total_adjusted_stat || 0 });
        } catch (error) {
            console.error("Error fetching total adjusted stat:", error);
            res.status(500).json({ success: false, message: 'Error fetching total adjusted stat' });
        }
    },
    
    

};
