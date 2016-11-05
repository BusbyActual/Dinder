var request = require('request');
var requestPromise = require('request-promise');
var User = require('../database/models/user.js');
var Photo = require('../database/models/photo.js');
var Place = require('../database/models/place.js');
var Category = require('../database/models/category.js');
var UserPhotos = require('../database/models/userPhotos.js');
var Upload = require('../database/models/upload.js');
var config = require('../../config.js');

var synapticRec = require('../../machineLearning/synapticRecommendations.js');

var synaptic = require('synaptic');
var Architect = synaptic.Architect;
var Network; //defining after we get data for training

var categoryKeys = {};
var categoryNums = {};
var synapticTrainingData = [];
var orderedTraining = [];

var trainingOptions = {
  rate: 0.2,
  error: 0.005,
  iterations: 10000
};

var yelpOptions = function (options) {
  var search = typeof options === 'string' ? options
    : 'search?term='
    + options.keyword
    + '&latitude='
    + options.lat
    + '&longitude='
    + options.long;

  return {
    url: config.yelpRoot + 'businesses/' + search,
    headers: {
      'Authorization': 'Bearer ' + config.yelpKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
};

var newPlace = function (business) {
  return Place.create({
    lat: business.coordinates.latitude,
    lon: business.coordinates.longitude,
    name: business.name,
    address: business.location.address1,
    city: business.location.city,
    state: business.location.state,
    zip: business.location.zip_code,
    url: business.image_url,
    rating: business.rating,
    price: business.price,
    phone: business.phone,
    yelpid: business.id,
  })
  .then(function (place) {
    saveCategories(business.categories, place.id);
    return getNewPhotos(business.id, place.id);
  });
};

var saveCategories = function (categories, placeId) {
  categories.forEach(function (category) {
    Category.create({
      name: category.title,
      PlaceId: placeId
    })
    .catch(function (err) {
      throw err;
    });
  });
};

var getNewPhotos = function (businessId, placeId) {
  return requestPromise(yelpOptions(businessId))
  .then(function (response) {
    return JSON.parse(response).photos;
  })
  .then(function (images) {
    var promises = [];
    images.forEach(function (url) {
      promises.push(Photo.create({
        url: url,
        PlaceId: placeId
      }));
    });
    return Promise.all(promises);
  });
};

var getSavedPhotos = function (placeId) {
  return Photo.findAll({
    where: {
      PlaceId: placeId
    }
  });
};

module.exports = {

  postUserImage: function (req, res) {
    Upload.create({
      url: req.body.url,
      UserId: req.userId
    })
    .then(data => res.send(data))
    .catch(err => { throw err; } );
  },

  getUserImage: function(req, res) {
    Upload.findAll({
      where: {
        UserId: req.userId
      }
    })
    .then(urls => res.send(urls))
    .catch(err => { throw err; });
  },

  getPhotos: function (req, res) {
    var photos = [];
    var request = {
      keyword: req.params.query,
      lat: req.params.lat,
      long: req.params.long
    };
    requestPromise(yelpOptions(request))
    .then(function(data) {
      return JSON.parse(data).businesses;
    })
    .then(function(businesses) {
      var promises = [];
      businesses.forEach(function(business) {
        promises.push(Place.findOne({
          where: {
            name: business.name
          }
        })
        .then(function (record) {
          if (record) {
            return getSavedPhotos(record.id);
          } else {
            return newPlace(business);
          }
        })
        .then (function (images) {
          photos = photos.concat(images);
        }));
      });
      return Promise.all(promises);
    })
    .then(function () {
      return UserPhotos.findAll({
        where: {
          UserId: req.userId
        }
      });
    })
    .then(function (sieve) {
      res.json(photos.filter(function (photo) {
        var touched;
        for (var i = 0; i < sieve.length; i++) {
          if (sieve[i].PhotoId === photo.id) {
            touched = true;
          }
        }
        if (!touched) {
          return photo;
        }
      }));
    })
    .catch(function (err) {
      throw err;
    });
  },

  getFavorites: function (req, res) {
    User.findOne({
      where: {
        id: req.userId
      }
    })
    .then(function (user) {
      return user.getPhotos({
        joinTableAttributes: ['favorite']
      });
    })
    .then(function (photos) {
      res.json(photos.filter(function (photo) {
        return photo.UserPhotos.favorite === true;
      }));
    })
    .catch(function (err) {
      throw err;
    });
  },

  // // use this to call exchange code for token
  // // only needed if going OAuth route
  // // Not used at this time.
  // getUber: function(req, res) {
  //   console.log('getUber invoked on userHandle');
  //   console.log('ret', req.body.code);
  //   var code = req.body.code;

  //   var options = {
  //     url: 'https://login.uber.com/oauth/v2/token',
  //     form: {
  //       client_secret: config.UBER_CLIENT_SECRET,
  //       client_id: config.UBER_CLIENT_ID,
  //       grant_type: 'authorization_code',
  //       redirect_uri: 'iOSdindin://uber',
  //       code: code
  //     },
  //     method: 'POST'
  //   };

  //   request(options, function(err, response, body) {
  //     newBody = (JSON.parse(body));
  //     // add expiration date onto body to send to client
  //     var expires = new Date();
  //     expires.setSeconds(expires.getSeconds() + newBody.expires_in);
  //     newBody.expires = expires;
  //     res.status(201).send(JSON.stringify(newBody));
  //   });

  // },

  getRecommendations: function (req, res) {
    var userID = req.userId;
    return User.findOne({ where: {id: userID }})
    .then(function(data) {
      //console.log(data);
      return data.getPhotos();
    })
    .then(function(photos) {
      var training = [];
      var items = [];
      var promiseArr = [];

      //coerce photosRatings to a normalize datastract 0-1
      photos.map(function(photo) {
        var tueple = [[], 0, 0];
        if (photo.UserPhotos.dataValues.like === true) {
          if (photo.UserPhotos.dataValues.favorite === true) {
            tueple[1] = 1;
          } else {
            tueple[1] = 0.6;
          }
        } else if (photo.UserPhotos.dataValues.favorite === true ) {
          tueple[1] = 0.8;
        }
        tueple[2] = photo.PlaceId;
        training.push(tueple);

      });

      //associate categories with tueples
      training.forEach(function(item) {
        var p = Category.findAll({ attributes: ['name'], where: {PlaceId: item[2]} })
        .then(function(data) {
          data.forEach(function(cat) {
            items.push(cat.dataValues.name);
          });
          item[0] = items;
          items = [];
          return {
            category: item[0],
            weight: item[1],
            businessId: item[2]
          };
        });
        promiseArr.push(p);
      });
      return Promise.all(promiseArr).then(function(p) {
       // console.log(p)
        return p;
      });
    })
    .then(function(trainingObj) {

      //Get distinct Categories data and order it, then give me constant time lookup both ways
      orderedTraining = trainingObj.sort((a, b) => { return b.weight - a.weight; });
      Category.aggregate('name', 'DISTINCT', { plain: false })
      .then(function(data) {

        var keyObj = data.reduce(function(o, v, i) {
          o[v.DISTINCT] = i;
          return o;
        }, {});
        keyObj.length = data.length - 1;
        categoryKeys = keyObj;

        var numObj = data.reduce(function(o, v, i) {
          o[i] = v.DISTINCT;
          return o;
        }, {});
        categoryNums = numObj;

        return keyObj;
      })
      .then(function(categoryObj) {

        //make training data form tueples
        trainingObj.forEach(function(userRating) {
          var newArray = Array.apply(null, Array(categoryObj.length)).map(Number.prototype.valueOf, 0);
          userRating.category.forEach(function(categoryRating) {
            newArray[categoryObj[categoryRating]] = userRating.weight;
          });
          synapticTrainingData.push({
            input: newArray,
            output: newArray
          });
        });
        return categoryObj;
      })
      .then(function(makeTraining) {

        //start training and test neural values
        Network = new Architect.Perceptron(makeTraining.length, Math.floor(makeTraining.length * 0.2), makeTraining.length);
        Network.trainer.train(synapticTrainingData, trainingOptions);

        var newArray = Array.apply(null, Array(makeTraining.length)).map(Number.prototype.valueOf, 0);
        return module.exports.evaluate(newArray, Network);

      })
      .then(function(finalData) {
        return finalData;
      })
      .then(function(recData) {

        //begin distance associate with records
        var destArr = [];
        if (recData) {
          recData.forEach(function(rec) {
            destArr.push(rec.lat + '%2C' + rec.lon);
          });
        }

        var destStr = destArr.join('%7C');
        return requestPromise('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + req.params.lat + ',' + req.params.long + '&destinations=' + destStr + '&key=' + config.MAPS_KEY)
        // combine original data with new distance values
        .then(function(result) {
          if (recData) {
            recData.map(function(rec, idx) {
              rec.dist = JSON.parse(result).rows[0].elements[idx].distance.text;
            });
          }
          return recData;
        });
      })
      .then(function(finalData) {
        res.status(201).send(finalData);
      });
    });
  },

  findIndicesOfMax(inp, count) {
    var outp = [];
    var sortF = function(a, b) { return inp[b] - inp[a]; };
    for (var i = 0; i < inp.length; i++) {
      outp.push(i);
      if (outp.length > count) {
        outp.sort(sortF);
        outp.pop();
      }
    }
    return outp;
  },

  evaluate(userData, Network) {
    var x = Network.activate(userData);
    var y = module.exports.findIndicesOfMax(x, 3);

    return module.exports.getRestaurants([categoryNums[y[0]], categoryNums[y[1]], categoryNums[y[2]]]);
  },

  getRestaurants(restaurants) {
    var one = restaurants[0];
    var two = restaurants[1];
    var three = restaurants[2];

    var businessShops = {};
    var count = {};
    var businessIds = [];

    // order recommendations with ratings
    orderedTraining.forEach(function(item) {
      item.category.forEach(function(cat) {
        if (cat === one || cat === two || cat === three) {
          w = item.weight;
          if (!count[cat]) {
            businessShops[cat + w] = item.weight;
            count[cat] = [item.businessId];
          } else {
            if (businessShops[cat + w]) {
              count[cat].push(item.businessId);
            }
          }
        }
      });
    });

    //get 1 random from each
    for (var key in count) {
      var x = count[key];
      businessIds.push(x[Math.floor(Math.random() * x.length)]);
    }

    //return our recommendations
    return Place.findAll({
      where: {
        id: businessIds
      }
    })
    .then(function(places) {
      var placeArr = [];
      places.forEach(function(place) {
        placeArr.push(place.dataValues);
      });
      return placeArr;
    });
  }
};
