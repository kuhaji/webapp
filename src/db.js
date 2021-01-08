const {Sequelize} = require('sequelize');
const {
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost'
} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mariadb'
});

module.exports = sequelize;
