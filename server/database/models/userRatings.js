var Sequelize = require('sequelize');
var connection = require('../database.js');

var UserRatings = connection.define('UserRatings', {
  rating: Sequelize.INTEGER
});

module.exports = UserRatings;