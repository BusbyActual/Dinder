const User = require('../database/models/user.js');
const config = require('../../config');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = {

  signUp(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    // PostgreSQL performs error checking on the user model

    User.create ({
      email: email,
      password: password
    })
    .then(newUser => res.json({
      token: jwt.encode({
        id: newUser.id
      }, config.JWT_SECRET)
    }))
    .catch(err => {
      res.status(500).json(err);
    });
  },

  signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
      where: {
        email: email
      }
    })
    .then(user => {
      if (!user) {
        return next(new Error('No user Found!'));
      }
      bcrypt.compare(password, user.password, function(err, match) {
        if (match) {
          console.log('login successful');
          res.json({
            token: jwt.encode({
              id: user.id
            }, config.JWT_SECRET)
          });
        } else if (err) {
          console.log('login error');
        } else {
          console.log('no match');
        }
      });
    })
    .catch(error => {
      res.sendStatus(500);
      console.log(error);
    });
  },

  authorize(req, res, next) {
    var token = req.headers.authorization;
    var path = req.originalUrl.indexOf('/api/') > -1
             ? req.originalUrl.replace('/api/', '')
             : req.path;
    if (path === '/' || path === 'signin' || path === 'signup' || path.indexOf('uber') > -1) {
      next();
    } else if (!token) {
      res.sendStatus(401);
    } else {
      req.userId = jwt.decode(token, config.JWT_SECRET).id;
      next();
    }
  }
};
