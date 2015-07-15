# Securing API Gateway with OAuth2
How to secure API Gateway with Pivotal SSO and relay the token to backend services calls.

## Steps

1. Grab and run the [UAA](https://github.com/cloudfoundry/uaa) locally. The latest release of the war can be found on [Maven Central](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.cloudfoundry.identity%22%20AND%20a%3A%22cloudfoundry-identity-uaa%22).
2. Run oauth2-sso locally with mvn spring-boot:run
3. Run [oauth2-resource](../oauth2-resource) locally with mvn spring-boot:run
4. Hit the /api/send_relay endpoint on oauth2-sso http://localhost:8081/api/send_relay. You'll be forced to authenticate with UAA.
5. Enter marissa koala and the username and password. You'll be redirected back to http://localhost:8081/api/send_relay.
6. An authenticated session is now established with oauth2-sso. The application will then make a call to oauth2-resource's /api/receive relay endpoint http://localhost:8082/api/receive_relay with the token that UAA gave oauth2-sso via Authorization Code grant.
7. Try to hit http://localhost:8082/api/receive_relay with your browser. Because there's no token in the request, you'll get back a 401.

## Further Exploration

* Launch oauth2-sso and oauth2-resource on PCF with [Pivotal SSO](http://docs.pivotal.io/p-identity/) installed. 
  * Create a new plan, service instance, and then bind both apps to the service instance.
  * You'll need to define environment variables for AUTH_DOMAIN, SPRING_OAUTH2_CLIENT_CLIENTID, and SPRING_OAUTH2_CLIENT_CLIENTSECRET for both applications (we'll have a connector for p-identity soon so you don't have to do this).
  * You'll need to create a new user via the sign-up link in the login screen.