# Nextbus Sample

This sample demonstrates how to use API Gateway to consume an XML API and make async HTTP calls in parallel.

## Challenge

Sort the TTC Streetcar routes from most frequent to least frequent. Output the route title and frequency in minutes per vechile, ordered by most frequent. Output in JSON:

```
[{"route":"501-Queen","minutes_per_vehicle":10.3},...]
```

### Hints
List of TTC routes, you want ones in the 500’s http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc

List of stopIds for a route, pick the middle one for predictions http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=501

Current predictions for vehicles approaching that stop http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=5511

## Solution
See [src/main/resources/app.js](src/main/resources/app.js)

## Further Exploration
* Transform the Nextbus XML API to restful JSON. Most of the work is in the soultion, you just need to add request handlers. See [Router docs](http://cfmobile.github.io/docs-apigateway/module-Router-Router.html). /api/v1/agencies is already done.
* refactor the HTTP calls and transformations into CommonJS modules. See [Hello World](https://github.com/cfmobile/api-gateway-samples/tree/master/sample-hello) for an example.
