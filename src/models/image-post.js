const sequelize = require('../db');
const {DataTypes, Model} = require('sequelize');
const User = require('./user');
const {URL} = require('url');
const {HOST} = require('../constants');

class ImagePost extends Model {
  toJSON() {
    const values = super.toJSON();
    values.imageUrl = new URL(values.imagePath, HOST);
    delete values.imagePath;
    return values;
  }
}

ImagePost.init({
  imagePath: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT
}, {sequelize});

ImagePost.belongsTo(User);

module.exports = ImagePost;