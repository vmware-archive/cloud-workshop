# Enable the discovery client

The Spring Cloud Services Service Registry starter adds the Eureka discovery client to the project so that the service can automatically register itself and periodically renew its registration with a Eureka server.
The starter also adds the Spring Cloud Pivotal connector, which enables the application to connect to the Eureka server as a service that is bound to the application in Cloud Foundry.
The service has the Greeting resource representation class as the "hello world" service itself:

1 Change to Service directory
 
    $ cd $COURSE_HOME/gs-service

2 Inspect the classes with your IDE of choice or just print in the console

    $ cat src/main/java/demo/Greeting.java
    $ cat src/main/java/demo/GreetingController.java
    
3 Enable the discovery client by annotating DemoApplication with @EnableDiscoveryClient.

    $ src/main/java/demo/DemoApplication.java

The `@EnableDiscoveryClient` annotation enables a Eureka discovery client that will register the "hello world" REST service with the bound Eureka service so that other applications can discover and consume it.
By default, the service will be registered in Eureka as "bootstrap". But since this name is too generic to be of any practical use, you’ll want to set the spring.application.name property so that the service will be registered with a meaningful name.
You can do that by creating an application.yml file with the following entries:

    $ src/main/resources/application.yml

4 Build the application:

    $ gradle assemble

5 Push to Cloud Foundry:

    $ cf push gs-service -p build/libs/gs-service-0.0.1.jar --random-route

Here the application is given the name "gs-service" in Cloud Foundry. You are welcome to name it whatever you wish, but remember the name, because you’ll need it when you bind the application to the Eureka service.
By using --random-route, you’re asking Cloud Foundry to assign a random route. This will prevent domain name collisions with others who are working through this guide.

    Binding gs-service-unfocusing-moistness.apj.fe.pivotal.io to gs-service...
    OK

6 Create an instance of the Eureka service. The Eureka service is known as "p-service-registry" in the service marketplace and only offers a single service plan named "standard". Using the cf CLI, create an instance of the service named "Eureka":

    $ cf create-service p-service-registry standard registry Eureka
    
7 Now you can bind the Eureka service instance to the application:

    $ cf bind-service gs-service registry
    $ cf restage gs-service

Note that it’s important to restage the application after binding the service so that the environment variables pertaining to the service binding are reflected in the application.

At this point you have a simple "hello world" REST service deployed to Cloud Foundry and bound to a Eureka service discovery instance.
The REST service is enabled with a discovery client so that it will automatically register itself to the Eureka service. It is now eligible for discovery and consumption:

    curl http://gs-service-unfocusing-moistness.apj.fe.pivotal.io/greeting
    {"id":1,"content":"Hello, World!"}

## Discover and consume the service

For the client of the "hello world" REST service, you’ll build another REST service that discovers the "hello world" service via a bound Eureka service and consumes the /greeting endpoint.

1 Change to Service directory
    
     cd $COURSE_HOME/gs-client
    
2 The client service has the same Greeting resource representation class as the "hello world" service itself. The only key difference is that the constructor is annotated with `@JsonCreator` and its arguments with `@JsonProperty` so that it can be created from the results of invoking the "hello world" service:

    src/main/java/demo/Greeting.java
    src/main/java/demo/GreetingClientController.java

`GreetingClientController` is injected with a `RestTemplate` via the constructor. What’s significant to notice is that the URL given to getForObject() has a host name of "GreetingService"--the name that the "hello world" service is registered as in Eureka.
In this way, the client doesn’t need to know the actual URL of the "hello world" service and only references it by the name it is registered as in Eureka.

3 The client application also includes a bootstrap class named `DemoApplication` that is identical to the same class in the "hello world" service application:

    src/main/java/demo/DemoApplication.java

4 Build the application:

    $ gradle assemble

5 Push to Cloud Foundry:

    $ cf push gs-client -p build/libs/gs-client-0.0.1.jar --random-route

Here, the name of the application is "gs-client". As with the service application, you can choose any application name you want.

    Binding gs-client-transsepulchral-whisky.apj.fe.pivotal.io to gs-client...
    OK

6 Next, bind the Eureka service instance created earlier to the client application and restage the application to pick up the environment variables pertaining to the binding:

    $ cf bind-service gs-client registry
    $ cf restage gs-client
    
7 Now you should be able to test out the client application by visiting the path "/hello" at the domain that the application is bound to. Given the domain route from above:

    $ curl http://gs-client-transsepulchral-whisky.apj.fe.pivotal.io/hello

The response should be "Hello, World!".

## Enable Circuit Breaker to the client code.

The Spring Cloud Services Circuit Breaker starter starter adds the Hystrix circuit breaker library to the project so that methods can be designated as being protected by a circuit breaker.
The starter also adds Hystrix AMQP, which enables support for publishing circuit breaker metrics via AMQP for display in the circuit breaker dashboard.

1 Next, you’ll need to enable the circuit breaker capability by annotating `DemoApplication` with `@EnableCircuitBreaker`.

    src/main/java/demo/DemoApplication.java

The `@EnableCircuitBreaker` annotation enables Hystrix beans in the application that support circuit breaker behavior.
This will enable you to annotate methods with `@HystrixCommand` to designate them as being protected by a circuit breaker.

2 As an example, the `hello()` method in `GreetingClientController` makes a REST call to the greeting service.
If the service is unavailable, the `hello()` method could fail. To protect the method, annotate it with `@HystrixCommand`:

    src/main/java/demo/GreetingClientController.java

4 Build the application:

    $ gradle assemble

5 Push to Cloud Foundry:

    $ cf push gs-client -p build/libs/gs-client-0.0.1.jar --random-route

6 Create an instance of the Circuit Breaker Dashboard service. This service is known as "p-circuit-breaker-dashboard" in the service marketplace and only offers a single service plan named "standard". Using the cf CLI, create an instance of the service named "Hystrix":
   
    $ cf create-service p-circuit-breaker-dashboard standard Hystrix

7 Now you can bind the Circuit Breaker Dashboard service instance to the application:

    $ cf bind-service gs-client Hystrix
    $ cf restage gs-client

8 Now stop the greeting service application:

    $ cf stop gs-service

With the greeting service unable to response to requests from the client, the `hello()` method in `GreetingClientController` will fail.
The circuit breaker will detect the failure and the `goodbye()` method will be called instead. If you restart the gs-service application, the original behavior will resume.


## Viewing the Circuit Breaker Dashboard

In addition to offering failover behavior, circuit breakers also publish a stream of metrics concerning the health of the protected methods. You can view this information in the circuit breaker dashboard.

To view the circuit breaker dashboard, sign into the Cloud Foundry console application and click on the "Manage" link below the "Hystrix" service:
Click on the "Circuit Breaker Dashboard" link to bring up the Circuit Breaker Dashboard:
In the dashboard, you’ll see only one circuit breaker—the one for the hello() method. If there were more circuit breaker protected methods in greetingclient or any other application bound to the Circuit Breaker Dashboard service they would appear here, too.

## Summary

Congratulations! You have just registered a REST service with a Eureka server in Cloud Foundry and written a client application that discovers and consumes that service.

At this point you have a simple "hello world" REST service deployed to Cloud Foundry and bound to a Eureka service discovery instance.
You have just enabled circuit breaker protection in a REST service and viewed its status in the Circuit Breaker Dashboard in Cloud Foundry.


TBD Samples Demo https://github.com/spring-cloud-samples/customers-stores

## REST based micro-services sample

- Three Spring Boot based Maven projects that are standalone applications:
  - Stores (MongoDB, exposing a few Starbucks shops across north america, geo-spatial functionality)
  - Customers (JPA)
  - Customers UI (Angular and Spring Boot CLI backend)
- The customers application tries to discover a search-by-location-resource and periodically verifying it's still available (see `StoreIntegration`).
- If the remote system is found the customers app includes a link to let clients follow to the remote system and thus find stores near the customer.
- Hystrix is used to monitor the availability of the remote system, so if it fails to connect 20 times in 5 seconds (by default) the circuit will open and no more attempts will be made until after a timeout.

