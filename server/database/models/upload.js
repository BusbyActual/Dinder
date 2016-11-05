var Sequelize = require('sequelize');
var connection = require('../database.js');

var Upload = connection.define('Upload', {
  url: Sequelize.STRING
});

module.exports = Upload;