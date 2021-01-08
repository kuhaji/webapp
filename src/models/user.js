const sequelize = require('../db');
const {DataTypes, Model} = require('sequelize');

class User extends Model {
  toJSON() {
    const {password, ...values} = super.toJSON();
    return values;
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: DataTypes.STRING,
  role: DataTypes.STRING
}, {sequelize});

module.exports = User;
