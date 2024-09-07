const {Sequelize} = require('sequelize')

const db = new Sequelize('hack_back', 'postgres', 'rootAdmin', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

db.authenticate()
.then(() => console.log('Database connnected'))
.catch((err) => console.log('Error ' + err))

module.exports = db;