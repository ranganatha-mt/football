import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 
// Define the Otp model
export const OTP = sequelize.define('OTP', {
    otp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    }, {
      tableName: 'otp_details',
      timestamps: false,
      
    });
  
 