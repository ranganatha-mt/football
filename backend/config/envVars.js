import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5000,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: process.env.DB_CHARSET,
    jwt_secret: process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    TWILIO_ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER
}