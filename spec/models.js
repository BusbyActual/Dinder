var expect = require('chai').expect;
var connection = require('../server/database/database.js');
var User = require('../server/database/models/user.js');
var Photo = require('../server/database/models/photo.js');
var Place = require('../server/database/models/place.js');
var Category = require('../server/database/models/category.js');


var models = [
  {
    schema: User,
    options: {
      email: 'test@example.com'
    }
  },
  {
    schema: Photo,
    options: {
      info: 'test'
    }
  },
  {
    schema: Place,
    options: {
      name: 'example'
    }
  },
  {
    schema: Category,
    options: {
      name: 'pizza'
    }
  }
];

describe('Database Models', function () {

  before(function (done, next) {
    models.forEach(function (m, i) {
      m.schema.findOne({
        where: m.options
      })
      .then(function (record) {
        if (!record) {
          return m.schema.create(m.options);
        }
      })
      .then(function () {
        if (i + 1 === models.length) {
          done();
        }
      })
      .catch(function (err) {
        done(err);
      });
    });
  });

  after(function (done) {
    models.forEach(function (m, i) {
      m.schema.findOne({
        where: m.options
      })
      .then(function (record) {
        if (record) {
          return record.destroy();
        }
      })
      .then(function () {
        if (i + 1 === models.length) {
          done();
        }
      })
      .catch(function (err) {
        done();
      });
    });
  });

  it('should persist user records', function (done) {

    User.findOne({
      where: {
        email: 'test@example.com'
      }
    })
    .then(function (record) {
      expect(record).to.exist;
      done();
    })
    .catch(function (err) {
      done(err);
    });

  });

  it('should not persist duplicate user records', function (done) {

    User.create({
      email: 'test@example.com'
    })
    .catch(function (err) {
      expect(err).to.be.ok;
      done();
    });

  });

  it('should persist photo records', function (done) {

    Photo.findOne({
      where: {
        info: 'test'
      }
    })
    .then(function (record) {
      expect(record).to.exist;
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });

  it('should persist place records', function (done) {

    Place.findOne({
      where: {
        name: 'example'
      }
    })
    .then(function (record) {
      expect(record).to.exist;
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });

  it('should persist category records', function (done) {

    Category.findOne({
      where: {
        name: 'pizza'
      }
    })
    .then(function (record) {
      expect(record).to.exist;
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });
});