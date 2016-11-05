var Sequelize = require('sequelize');
var connection = require('../database.js');

var Photo = connection.define('Photo', {
  info: Sequelize.STRING,
  url: Sequelize.STRING
});


module.exports = Photo;