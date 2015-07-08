


## 6. Cloning the repository

Clone the GIT repository to your local machine. On the command line issue the following command:

```git clone https://github.com/dpinto-pivotal/cf-SpringBootTrader.git```

This command will copy the code in the repository to your local machine, creating a directory named `cf-SpringBootTrader`. All actions will now be done inside this directory.

Once you have cloned the repository, it is important to build it to create the application artifacts.

The projects use [gradle](http://gradle.org) as the build tool with gradle wrapper. Thus, all it is required to build all the microservices is:

```
./gradlew build
```

You can also build individual services by naming them, for example:
```
./gradlew :springboottrades-quotes:build
```


## 7. Login to Cloud Foundry

Login to your instance of **Cloud Foundry**. Instructions on how to do this can be found at http://docs.pivotal.io/pivotalcf/devguide/installcf/whats-new-v6.html#login

# Summary

At the end of this lab, you should have an environment setup to enable you to deploy applications to **Cloud Foundry**. You will also have the code required for the rest of the labs.

In order to check that all is setup correctly, you should have something similar to the following:

```
Penguin:cf-SpringBootTrader dpinto$ cf target

API endpoint:   https://CF-URI (API version: 2.23.0)
User:           dpinto
Org:            dpinto-org
Space:          development
```

Now you can go to [next lab](lab_registryserver.md)
