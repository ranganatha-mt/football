import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 

export const MatchPlayers = sequelize.define("MatchPlayers", {
    match_players_id: {
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
    player_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'match_players',
    timestamps: false, // Assuming you're managing timestamps manually
  });

  