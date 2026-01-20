const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            Validite: { 
                isEmail: true,
            },
        },
        password: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type:DataTypes.ENUM('patient','dentist','admin'),
            defaultValue: 'patient',
            allowNull: false,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "user",
        timestamps: true,
    }
);

module.exports = User;