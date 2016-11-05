var request = require('request');
var requestPromise = require('request-promise');
var Place = require('../database/models/place.js');
var Photo = require('../database/models/photo.js');
var config = require('../../config.js');

var stuff1 = [];
var stuff2 = [];

// default values
var keyword = 'delis';
var lat = 37.786882;
var lon = -122.399972;

module.exports = {

  yelpOptions: function (query, branch) {

    branch = branch || '';
    query = query || 'search?term='
          + keyword
          + '&latitude='
          + lat
          + '&longitude='
          + lon;

    return {
      url: config.yelpRoot + branch + query,
      headers: {
        'Authorization': 'Bearer ' + config.yelpKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  },


// the following methods were combined and moved to userHandler.js


  allImages: function (businessID) {
    businessID.forEach(function(business) {
      requestPromise(module.exports.yelpOptions(businessID, 'businesses/'))
       .then(function(item) {
         var info = JSON.parse(item);
         var newArray = [info.id];
         if (info.photos.length > 0) {

           info.photos.forEach(function(picture) {
             Photo.create({
               info: '',
               url: picture
             });
           });
         }

         stuff2.push(newArray);
         console.log(newArray, info.photos);
       })
       .then(console.log(stuff1, stuff2));
    });
  },

  someImages: function(options) {
    return requestPromise(options)
    .then(function(data) {
      return JSON.parse(data);
    })
    .then(function(data) {

      return data.businesses.map(function(business, count) {

        var photos = [];

        Place.findOne({
          where: {
            name: business.name
          }
        })
        .then(function(place) {
          if (!place) {
            return Place.create({
              lat: business.coordinates.latitude || 0,
              lon: business.coordinates.longitude || 0,
              name: business.name,
              address: business.location.address1,
              city: business.location.city,
              state: business.location.state,
              zip: business.location.zip_code,
              url: business.image_url
            });
          }
        })
        .then(function(newPlace) {
          return requestPromise(module.exports.yelpOptions(business.id, 'businesses/'))
          .then(function (data) {
            return JSON.parse(data);
          })
          .then(function (businessInfo) {

            return businessInfo.photos.map(function (url) {
              var item = {
                info: '',
                url: url,
                PlaceId: newPlace.id
              };
              Photo.create(item);
              return item;
            });

          });

        });

      });
    })
    .catch(function (err) {
      throw err;
    });
  }
};