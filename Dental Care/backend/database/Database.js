const { Sequelize } = require("sequelize");
require("dotenv").config();

// Ensure password is always a string (convert undefined/null to empty string)
const dbPassword = process.env.DB_PASS !== undefined && process.env.DB_PASS !== null 
    ? String(process.env.DB_PASS) 
    : '';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    dbPassword,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        port: process.env.DB_PORT || 5432,
    }

);

const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log("PostgresSQL connected successfully.");

    }   catch (error) {
        console.error("Unable to connect to the database:", error)
        
    }

};

module.exports = {
    sequelize,
    connectDB,
};