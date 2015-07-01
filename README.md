# cloud-workshop
Cloud Workshop

## Agenda
1. Building Twelve-Factor Apps with Spring Boot
    - Getting Started with *Spring Boot*, Initialiser, CLI
    - Deploying a Web Application with an Embedded Container
    - Externalizing Configuration with Spring Boot
    - Introspection, Monitoring, and Metrics using Spring Boot Actuator
    - Build a Hypermedia-Driven RESTful Web Service with Spring Data REST
2. Cloud-Native Architecture Overview
    - Operating Twelve-Factor Apps with Cloud Foundry
    - From Zero to Pushing Your First Application
    - Binding to Cloud Foundry Services
3. Connecting the dots with Spring Cloud Services
    - Deploying and Using Spring Cloud Config Server to manage external configuration
    - Using Service Discovery for loosely coupled distributed systems
    - Building and monitoring resilient distributed systems with Circuit Breaker
4. Securing Cloud-Native Applications
    - Intro to OAuth2 and Open ID Connect
    - Using the UAA to secure internal applications (where users are developers)
    - Using Pivotal SSO to secure end user applications (where users are within or outside of the organization)
    - Securing app to app communication with the multi-tenancy features of UAA
5. Deliver Mobile Capability with Pivotal Mobile Services
    - Keep users engaged with Push Notification Service 
    - Aggregate and transform legacy backends for mobile consumption with API Gateway
    - Use Data Sync for seamless multi-device user experiences
    - Release mobile apps to internal users early and often with App Distribution
    
    
## Prerequisites
- Install [Oracle Java SDK 1.8+] (http://www.oracle.com/technetwork/java/javase/downloads/index.html)
- Install GVM:
```
$ curl -s get.gvmtool.net | bash
```
- Before try to run the services, make sure you have Rabbitmq Server, Redis and MongoDB running on localhost.
```
$ brew install mongodb rabbitmq redis
```
- Make sure you have [Spring Boot for Groovy installed] (http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#getting-started-gvm-cli-installation)
- Make sure [Spring Cloud CLI is installed] (https://github.com/spring-cloud/spring-cloud-cli)
- Familiarity with link:http://www.spring.io[Spring IO]
- Check Maven is installed and repo is downloaded [TODO]