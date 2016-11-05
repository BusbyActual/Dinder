var request = require('request');
var expect = require('chai').expect;
var config = require('../config.js');
var connection = require('../server/database/database.js');

var api;

describe('API Server', function () {
  before(function () {
    api = (process.env.NODE_ENV !== 'production'
        ? 'http://localhost'
        : config.apiRoot)
        + ':'
        + config.port
        + '/';
  });

  it('should respond to GET requests', function (done) {
    request(api, function (err, res, body) {
      if (err) {
        done(err);
      }
      expect(body).to.be.ok;
      done();
    });
  });

  it('should respond with valid JSON', function (done) {
    request(api, function (err, res, body) {
      if (err) {
        done(err);
      }
      expect(body).to.be.a('string');
      expect(JSON.parse(body)).to.be.ok;
      done();
    });
  });
});

describe('PostgreSQL Database', function () {
  it('should authenticate', function (done) {
    connection.authenticate()
    .then(function () {
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });
});