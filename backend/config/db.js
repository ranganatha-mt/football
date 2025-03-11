import { Sequelize, DataTypes } from "sequelize";
import { ENV_VARS } from "../config/envVars.js";
export const sequelize = new Sequelize(
    ENV_VARS.database, ENV_VARS.user, ENV_VARS.password, {
    host: ENV_VARS.host,
    dialect: 'mysql',
    timezone: "+05:30",
});


