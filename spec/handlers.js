var request = require('request');
var expect = require('chai').expect;
var jwt = require('jwt-simple');
var connection = require('../server/database/database.js');
var User = require('../server/database/models/user.js');
var Photo = require('../server/database/models/photo.js');
var Place = require('../server/database/models/place.js');
var UserPhotos = require('../server/database/models/userPhotos.js');
var config = require('../config.js');

require('../server/database/joins.js')(connection);

var api;
var token;
var photos;

var instances = {
  User: {
    schema: User,
    email: 'test@example.com',
    password: 'password'
  },
  Photo: {
    schema: Photo,
    info: 'test'
  }
};

describe('Database Handlers', function () {

  before(function (done) {
    api = (process.env.NODE_ENV !== 'production'
        ? 'http://localhost'
        : config.apiRoot)
        + ':'
        + config.port
        + '/api/';
    done();
  });

  after(function (done) {
    Object.keys(instances).forEach(function (model, i) {
      instances[model].schema.findOne({
        where: {
          id: instances[model].id
        }
      })
      .then(function (record) {
        if (record) {
          return record.destroy();
        }
      })
      .then(function () {
        if (i + 1 === Object.keys(instances).length) {
          done();
        }
      })
      .catch(function (err) {
        done();
      });
    });
  });

  it('should sign up users and return a JWT token', function (done) {
    request({
      method: 'POST',
      url: api + 'signup',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: instances['User'].email,
        password: instances['User'].password
      })
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      var parsed = JSON.parse(body);
      expect(parsed).to.have.ownProperty('token');
      token = parsed.token;
      instances['User'].id = jwt.decode(token, config.JWT_SECRET).id;
      done();
    });
  });

  it('should not sign up users with duplicate email addresses', function (done) {
    request({
      method: 'POST',
      url: api + 'signup',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: instances['User'].email,
        password: instances['User'].password
      })
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      var parsed = JSON.parse(body);
      expect(parsed.name).to.equal('SequelizeUniqueConstraintError');
      done();
    });
  });

  xit('should sign out users');

  xit('should sign in users and return a JWT token');

  it('should query Yelp and return photos based on user location', function (done) {
    var lat = 39.3085;
    var long = -76.6392;
    var query = 'pizza';
    var call = api + 'photo/' + lat + '/' + long + '/' + query;
    this.timeout(0);
    request({
      method: 'GET',
      url: call,
      headers: {
        'content-type': 'application/json',
        'authorization': token
      }
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      photos = JSON.parse(body);
      expect(Array.isArray(photos)).to.be.true;
      expect(photos.length).to.be.ok;
      instances['Photo'].id = photos[0].id;
      done();
    });
  });

  it('should persist user likes (swipe left/right)', function (done) {
    var call = api + 'yes/' + instances['Photo'].id;
    request({
      method: 'POST',
      url: call,
      headers: {
        'content-type': 'application/json',
        'authorization': token
      }
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      expect(res.statusCode).to.equal(201);
      done();
    });
  });

  it('should default to favorited = false for photos', function (done) {
    UserPhotos.findOne({
      where: {
        PhotoId: instances['Photo'].id
      }
    })
    .then(function (record) {
      expect(record.favorite).to.be.false;
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });

  it('should persist user favorites', function (done) {
    var call = api + 'favorite/' + instances['Photo'].id;
    request({
      method: 'POST',
      url: call,
      headers: {
        'content-type': 'application/json',
        'authorization': token
      }
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      UserPhotos.findOne({
        where: {
          PhotoId: instances['Photo'].id
        }
      })
      .then(function (record) {
        expect(record.favorite).to.be.true;
        done();
      })
      .catch(function (err) {
        done(err);
      });
    });
  });

  it('should not serve photos that the user has already touched', function (done) {
    var lat = 39.3085;
    var long = -76.6392;
    var query = 'pizza';
    var call = api + 'photo/' + lat + '/' + long + '/' + query;
    this.timeout(0);
    request({
      method: 'GET',
      url: call,
      headers: {
        'content-type': 'application/json',
        'authorization': token
      }
    }, function (err, res, body) {
      if (err) {
        done(err);
      }
      var newPhotos = JSON.parse(body);
      expect(photos.length).to.not.equal(newPhotos.length);
      expect(photos.filter(function (photo) {
        return !newPhotos.includes(photo);
      })[0].id).to.equal(instances['Photo'].id);
      done();
    });
  });

});