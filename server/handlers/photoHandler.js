var Photo = require('../database/models/photo.js');
var UserPhotos = require('../database/models/userPhotos.js');

// get a reference to the relation, if it exists
var getUserPhoto = function (UserId, PhotoId) {
  return UserPhotos.findOne({
    where: {
      UserId: UserId,
      PhotoId: PhotoId
    }
  });
};

// update an existing record
// favorite is unchanged
var modLike = function (UserId, PhotoId, like) {
  return UserPhotos.update({
    like: like
  }, {
    where: {
      UserId: UserId,
      PhotoId: PhotoId
    }
  });
};

// create a new record
// like = like, favorite defaults to false
var newLike = function (UserId, PhotoId, like) {
  return UserPhotos.create({
    UserId: UserId,
    PhotoId: PhotoId,
    like: like
  });
};

// update an existing record
// like is unchanged
var modFave = function (UserId, PhotoId, favorite) {
  return UserPhotos.update({
    favorite: favorite
  }, {
    where: {
      UserId: UserId,
      PhotoId: PhotoId
    }
  });
};

// create a new record
// like = null
var newFave = function (UserId, PhotoId, favorite) {
  return UserPhotos.create({
    UserId: UserId,
    PhotoId: PhotoId,
    favorite: favorite
  });
};

module.exports = {

  voteYes: function (req, res) {
    var UserId = req.userId;
    var PhotoId = req.params.photoid;

    getUserPhoto(UserId, PhotoId)
    .then(function (record) {
      if (record) {
        modLike(UserId, PhotoId, true)
        .then(function () {
          res.sendStatus(200);
        });
      } else {
        newLike(UserId, PhotoId, true)
        .then(function () {
          res.sendStatus(201);
        });
      }
    })
    .catch(function (err) {
      throw err;
    });
  },

  voteNo: function (req, res) {
    var UserId = req.userId;
    var PhotoId = req.params.photoid;

    getUserPhoto(UserId, PhotoId)
    .then(function (record) {
      if (record) {
        modLike(UserId, PhotoId, false)
        .then(function () {
          res.sendStatus(200);
        });
      } else {
        newLike(UserId, PhotoId, false)
        .then(function () {
          res.sendStatus(201);
        });
      }
    })
    .catch(function (err) {
      throw err;
    });
  },

  favorite: function (req, res) {
    var UserId = req.userId;
    var PhotoId = req.params.photoid;
    getUserPhoto(UserId, PhotoId)
    .then(function (record) {
      if (record) {
        modFave(UserId, PhotoId, true)
        .then(function () {
          res.sendStatus(200);
        });
      } else {
        newFave(UserId, PhotoId, true)
        .then(function () {
          res.sendStatus(201);
        });
      }
    })
    .catch(function (err) {
      throw err;
    });
  },

  unFavorite: function (req, res) {
    var UserId = req.userId;
    var PhotoId = req.params.photoid;
    getUserPhoto(UserId, PhotoId)
    .then(function (record) {
      if (record) {
        modFave(UserId, PhotoId, false)
        .then(function () {
          res.sendStatus(200);
        });
      } else {
        newFave(UserId, PhotoId, false)
        .then(function () {
          res.sendStatus(201);
        });
      }
    })
    .catch(function (err) {
      throw err;
    });
  },
};