var Router = require("Router");

var appRouter = new Router();

var tokenRelayClient = require("http")({oauth2_relay:true});

appRouter.get("/send_relay", function(req,res) {
  var response = tokenRelayClient.getJSON(req.baseUrl+"/receive_relay")
    .then(function(response) {
      return response.body;
    });
  res.setBody({
    "message" : "heres the response from /receive_relay",
    "relayResponse" : response
  });
});

appRouter.all('/*catchall', function(req,res) {
  res.setBody({
    links :[
    {title: 'makes a request to /receive_relay with the token of this request', href: req.baseUrl+'/send_relay'},
    {title: 'outputs the authorization header', href: req.baseUrl+'/receive_relay'}
  ]});
});


module.exports = appRouter;
