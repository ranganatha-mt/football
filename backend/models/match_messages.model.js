import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 
export const MatchMessage  = sequelize.define("match_message", {
  id: {
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reviewer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      match_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    tableName: 'match_message',
    timestamps: false, // Assuming you're managing timestamps manually
  });

 

  