import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize';

export const MatchReview = sequelize.define("match_review", {
  match_review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  match_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // GOALS
  goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  header_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  foot_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  volley_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  acrobatic_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  freekick_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  long_range_goals: { type: DataTypes.INTEGER, defaultValue: 0 },
  penalty: { type: DataTypes.INTEGER, defaultValue: 0 },
  goal_missed: { type: DataTypes.INTEGER, defaultValue: 0 },
  own_goal: { type: DataTypes.INTEGER, defaultValue: 0 },

  // ATTACKS
  assists: { type: DataTypes.INTEGER, defaultValue: 0 },
  cross: { type: DataTypes.INTEGER, defaultValue: 0 },
  through_balls: { type: DataTypes.INTEGER, defaultValue: 0 },
  attack_free_kick: { type: DataTypes.INTEGER, defaultValue: 0 },
  corner: { type: DataTypes.INTEGER, defaultValue: 0 },
  dribbling: { type: DataTypes.INTEGER, defaultValue: 0 },
  shots_on_target: { type: DataTypes.INTEGER, defaultValue: 0 },
  shots_off_target: { type: DataTypes.INTEGER, defaultValue: 0 },
  throw_outs: { type: DataTypes.INTEGER, defaultValue: 0 },
  throw_ins: { type: DataTypes.INTEGER, defaultValue: 0 },

  // DEFENCE
  passes_played: { type: DataTypes.INTEGER, defaultValue: 0 },
  passes_missed: { type: DataTypes.INTEGER, defaultValue: 0 },
  interceptions: { type: DataTypes.INTEGER, defaultValue: 0 },
  blocks: { type: DataTypes.INTEGER, defaultValue: 0 },
  tackles: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_man_tackles: { type: DataTypes.INTEGER, defaultValue: 0 },
  head_clearances: { type: DataTypes.INTEGER, defaultValue: 0 },
  corners_cleared: { type: DataTypes.INTEGER, defaultValue: 0 },

  // FOULS
  fouls: { type: DataTypes.INTEGER, defaultValue: 0 },
  yellow_card: { type: DataTypes.INTEGER, defaultValue: 0 },
  red_card: { type: DataTypes.INTEGER, defaultValue: 0 },
  off_side: { type: DataTypes.INTEGER, defaultValue: 0 },

  // SKILLS
  skill_novice: { type: DataTypes.INTEGER, defaultValue: 0 },
  skill_intermediate: { type: DataTypes.INTEGER, defaultValue: 0 },
  skill_proficient: { type: DataTypes.INTEGER, defaultValue: 0 },
  skill_advanced: { type: DataTypes.INTEGER, defaultValue: 0 },
  skill_expert: { type: DataTypes.INTEGER, defaultValue: 0 },
  skill_mastery: { type: DataTypes.INTEGER, defaultValue: 0 },

  // FREESTYLE
  freestyle_struggling: { type: DataTypes.INTEGER, defaultValue: 0 },
  freestyle_capable: { type: DataTypes.INTEGER, defaultValue: 0 },
  freestyle_skilled: { type: DataTypes.INTEGER, defaultValue: 0 },
  freestyle_outstanding: { type: DataTypes.INTEGER, defaultValue: 0 },
  freestyle_exceptional: { type: DataTypes.INTEGER, defaultValue: 0 },
  freestyle_top_notch: { type: DataTypes.INTEGER, defaultValue: 0 },

    // TRAINING
    dribbling_drills: { type: DataTypes.INTEGER, defaultValue: 0 },
    passing_accuracy: { type: DataTypes.INTEGER, defaultValue: 0 },
    shooting_drills: { type: DataTypes.INTEGER, defaultValue: 0 },
    stamina_endurance: { type: DataTypes.INTEGER, defaultValue: 0 },
    positional_awareness: { type: DataTypes.INTEGER, defaultValue: 0 },
    defensive_skills: { type: DataTypes.INTEGER, defaultValue: 0 },
    ball_control: { type: DataTypes.INTEGER, defaultValue: 0 },
    warmup_cooldown_participation: { type: DataTypes.INTEGER, defaultValue: 0 },
    tactical_understanding: { type: DataTypes.INTEGER, defaultValue: 0 },
    team_communication: { type: DataTypes.INTEGER, defaultValue: 0 },

  // GOALKEEPER
  gk_own_goal: { type: DataTypes.INTEGER, defaultValue: 0 },
  goals_saved: { type: DataTypes.INTEGER, defaultValue: 0 },
  goals_conceded: { type: DataTypes.INTEGER, defaultValue: 0 },
  penalty_saved: { type: DataTypes.INTEGER, defaultValue: 0 },
  clean_sheets: { type: DataTypes.INTEGER, defaultValue: 0 },
  punches: { type: DataTypes.INTEGER, defaultValue: 0 },
  gk_clearances: { type: DataTypes.INTEGER, defaultValue: 0 },
  goal_kicks: { type: DataTypes.INTEGER, defaultValue: 0 }

}, {
  tableName: 'match_review',
  timestamps: false,
});
