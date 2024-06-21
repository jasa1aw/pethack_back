const {DataTypes} = require('sequelize');
const db = require('../config/db')

const AuthCode = db.define('AuthCode', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valid_till: {
        type: DataTypes.DATE,
        allowNull: false
    },
},{
    timestamps: false,
});

module.exports = AuthCode;