const {DataTypes} = require('sequelize');
const db = require('../config/db')

const User = db.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        timestamps: false,// Отключение автоматических полей createdAt и updatedAt
    });

module.exports = User;