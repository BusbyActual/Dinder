var userHandler = require('../handlers/userHandler.js');
var photoHandler = require('../handlers/photoHandler.js');
var authHandler = require('../handlers/authHandler.js');
var machineHandler = require('../../machineLearning/synapticRecommendations.js');
var s3Handler = require('../handlers/s3Handler.js');

module.exports = function (app, express) {
  // this is root entry - only used for verify server, not in production app
  app.get('/', function (req, res) {
    res.json({
      message: 'hello, world v3.0.7'
    });
  });

  // // client sends code to server to get token
  // // Not currently being used
  // app.post('/uber', userHandler.getUber)

  // for getting favorited pictures for a userid
  app.get('/api/favorites', userHandler.getFavorites);

  // favorite / unfavorite a photo
  app.post('/api/favorite/:photoid', photoHandler.favorite);
  app.post('/api/unfavorite/:photoid', photoHandler.unFavorite);

  // for getting recommendations for a user at a given loc
  app.get('/api/recs/:lat/:long', userHandler.getRecommendations);

  // for getting pictures of food for user to swipe on
  app.get('/api/photo/:lat/:long/:query', userHandler.getPhotos);

  app.get('/api/sRecs', machineHandler.retrain);

  // vote yets on a photo (since it's post we can technical pass in body if we want)
  app.post('/api/yes/:photoid', photoHandler.voteYes);

  // vote no on a photo (since it's post we can technical pass in body if we want)
  app.post('/api/no/:photoid', photoHandler.voteNo);

  app.post('/api/signin', authHandler.signIn);

  app.post('/api/signup', authHandler.signUp);

  app.post('/api/s3upload', s3Handler.sendPolicy);

  app.post('/api/images', userHandler.postUserImage);

  app.get('/api/images', userHandler.getUserImage);
};