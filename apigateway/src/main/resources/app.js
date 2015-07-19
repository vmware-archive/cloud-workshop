var Router = require("Router");
var _ = require("lodash");

var appRouter = new Router();

var nextBusClient = require('http')({
  socketTimeout: 5000,
  readTimeout: 5000
});

var XML = require('XML');

appRouter.get("/frequency/", function(req,res) {
  var result = getRoutes("ttc")
    .then(function(routes) {
      return _.filter(routes, isStreetcarRoute);
    })
    .then(function(streetcarRoutes) {
      var frequencyPromises = _.map(streetcarRoutes, function(route) {
        return getStops("ttc",route.id)
          .then(function(stops) {
            // the stop at the begnning or end of the route sometimes doesn't have
            // any predicitions at certain times of day,
            // so pick the stop in the middle of the route
            var middleStop = Math.floor(stops.length/2);
            return getPredictions("ttc", stops[middleStop].id)
              .then(function(predictions) {
                var frequency = _.max(predictions) / 60 / predictions.length ;
                return {route: route.title, minutes_per_vehicle: frequency} ;
              })
          });
      });
      return frequencyPromises;
    })
    .then(function(frequencies){
      return _.chain(frequencies)
        .filter(function(frequency) {
          return frequency.minutes_per_vehicle > 0;
        })
        .sortBy("minutes_per_vehicle","desc")
        .value();
    }); 
  res.setBody(result)
});

appRouter.get("/agencies/", function(req,res) {
  res.setBody(getAgencies());
});

function getAgencies() {
  return nextBusClient
    .get("http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList")
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.map(xml.agency,function(agency) {
        return {
          id : agency['@tag'],
          title : agency['@title'],
        };
      });
    });
}

function getRoutes(agency) {
  return nextBusClient
    .get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc")
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.map(xml.route,function(route) {
        return {
          id : route['@tag'],
          title : route['@title'],
        };
      });
    });
}

function isStreetcarRoute(route) {
  return route.id.substring(0,1) == "5" && route.id.length == 3;
}

function getStops(agency,route) {
  return nextBusClient.get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a="
        +agency+"&r="+route)
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.map(xml.route.stop,function(stop) {
        return {
          id : stop['@stopId'],
          title : stop['@title'],
        };
      });
    }); 
}

function getPredictions(agency,stop) {
  return nextBusClient.get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a="
        +agency+"&stopId="+stop)
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.chain(xml.predictions)
        .map(function(prediction) {
          return prediction.direction 
            && _.map(prediction.direction.prediction, function(vehicle) {
              return _.parseInt(vehicle['@seconds']);
            });
        })
        .flatten()
        .compact()
        .sortBy()
        .value();
    }); 
}

module.exports = appRouter;
