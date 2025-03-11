import { sequelize } from "../config/db.js";
import { DataTypes } from 'sequelize'; 
// Define the User model
export const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      position: {
        type: DataTypes.STRING(50),
      },
      user_type: {
        type: DataTypes.ENUM('Player', 'Reviewer', 'Admin'),
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
      },
      organization_club: {
        type: DataTypes.STRING,
      },
      expertise_level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Expert'),
      },
      
      modified: {
        type: DataTypes.DATE,
      },
        session_token: {
          type: DataTypes.STRING,
          allowNull: true
      },
    }, {
      tableName: 'users',
      timestamps: false, // Assuming you're managing timestamps manually
    });
  
 