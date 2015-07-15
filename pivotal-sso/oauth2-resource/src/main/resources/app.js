var Router = require("Router");

var appRouter = new Router();

var tokenRelayClient = require("http")({oauth2_relay:true});

appRouter.get("/receive_relay", function(req,res) {
  res.setBody({
    message: "Authorization Header that was recieved",
    Authorization: req.headers.authorization
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
