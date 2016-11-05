var express = require('express');
var config = require('../config.js');
var connection = require('./database/database.js');

var app = express();

require('./database/joins.js')(connection);
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

app.set('port', config.port);

// nuke the database by passing {force: true} inside sync()
connection.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('listening on port ', app.get('port'));
  });
}).catch(function (err) {
  console.log(err);
});

module.exports.app = app;