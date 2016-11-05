var synaptic = require('synaptic');
var Architect = synaptic.Architect;
var Network; //defining after we get data for training
var Category = require('../server/database/models/category.js');
var photo = require('../server/database/models/photo.js');
var place = require('../server/database/models/place.js');
var User = require('../server/database/models/user.js');

//for testing locally
// var connection = require('../server/database/database.js');
// require('../server/database/joins.js')(connection);

var categoryKeys = {};
var categoryNums = {};
var synapticTrainingData = [];
var orderedTraining = [];



var trainingOptions = {
  rate: 0.2,
  error: 0.005,
  iterations: 10000
};

module.exports = {

  retrain: function (req, res) {

    userID = req.params.userID || 21;
    User.findOne({ where: {id: userID}})  // fixMe take in dynamic userID
    .then(function(data) {
      //console.log(data);
      return data.getPhotos();
    })
    .then(function(photos) {
      var training = [];
      var items = [];
      var promiseArr = [];

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
        //console.log(categoryObj, trainingObj);
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
        Network = new Architect.Perceptron(makeTraining.length, Math.floor(makeTraining.length * 0.2), makeTraining.length);
        Network.trainer.train(synapticTrainingData, trainingOptions);

        var newArray = Array.apply(null, Array(makeTraining.length)).map(Number.prototype.valueOf, 0);
        return module.exports.evaluate(newArray, Network);

      })
      .then(function(finalData) {
        console.log(finalData);
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


    return place.findAll({
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


