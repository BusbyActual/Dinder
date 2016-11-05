var User = require('./models/user.js');
var Place = require('./models/place.js');
var Photo = require('./models/photo.js');
var Category = require('./models/category.js');
var UserPhotos = require('./models/userPhotos.js');
var UserRatings = require('./models/userRatings.js');
var Upload = require('./models/upload.js');

module.exports = function (connection) {

  User.belongsToMany(Photo, {
    through: UserPhotos
  });

  Photo.belongsToMany(User, {
    through: UserPhotos
  });

  User.belongsToMany(Place, {
    through: UserRatings
  });

  Place.belongsToMany(User, {
    through: UserRatings
  });

  User.hasMany(Upload);
  Place.hasMany(Photo);
  Place.hasMany(Category);

};



