import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 
export const MatchReview  = sequelize.define("match_review", {
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
      goals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      passes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      free_kicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      green_cards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      yellow_cards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      red_cards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
  }, {
    tableName: 'match_review',
    timestamps: false, // Assuming you're managing timestamps manually
  });

 

  