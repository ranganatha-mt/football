import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 
export const Match = sequelize.define("Match", {
    match_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    match_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Scheduled", "Ongoing", "Completed"),
      defaultValue: "Scheduled",
    },
    added_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'matches',
    timestamps: false, // Assuming you're managing timestamps manually
  });

 

  