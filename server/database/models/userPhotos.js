var Sequelize = require('sequelize');
var connection = require('../database.js');

var UserPhotos = connection.define('UserPhotos', {
  like: Sequelize.BOOLEAN,
  favorite: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = UserPhotos;