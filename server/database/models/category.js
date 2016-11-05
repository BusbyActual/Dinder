var Sequelize = require('sequelize');
var connection = require('../database.js');

var Category = connection.define('Category', {
  name: Sequelize.STRING

});


module.exports = Category;