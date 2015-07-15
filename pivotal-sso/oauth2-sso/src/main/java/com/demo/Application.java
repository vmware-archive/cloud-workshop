package com.demo;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.security.oauth2.sso.EnableOAuth2Sso;
import org.springframework.cloud.security.oauth2.sso.OAuth2SsoConfigurerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;

@SpringBootApplication
@EnableOAuth2Sso
public class Application extends com.pivotal.mss.apigateway.Application {
	
	public static void main(String[] args) {
	    SSLValidationDisabler.disableSSLValidation();
		runApplication(Application.class, args);
	}
	
	

}
