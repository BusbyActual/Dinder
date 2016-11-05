var bodyParser = require('body-parser');
var authHandler = require('../handlers/authHandler.js');

module.exports = function (app, express) {

  app.use(authHandler.authorize);
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

};