var Sequelize = require('sequelize');
var connection = require('../database.js');
var bcrypt = require('bcrypt-nodejs');

var User = connection.define('User', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  lastGeo: Sequelize.STRING
});

User.beforeCreate(function (User, options, callback) {
  bcrypt.hash(User.password, null, null, function(err, hash) {
    if (err) { return callback(err); }
    User.password = hash;
    return callback(null, User);
  });
});

module.exports = User;