package com.demo;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.security.oauth2.resource.EnableOAuth2Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@SpringBootApplication
@EnableOAuth2Resource
public class Application extends com.pivotal.mss.apigateway.Application {
	
	public static void main(String[] args) {
	    SSLValidationDisabler.disableSSLValidation();
		runApplication(Application.class, args);
	}
	
	@Bean
	ResourceServerConfigurerAdapter resourceServerConfigurerAdapter(Environment environment) {
	    return new ResourceServerConfigurerAdapter() {
	        @Override
	        public void configure(HttpSecurity http) throws Exception {
	            http.requestMatchers().antMatchers("/" + environment.getProperty("baseApiPath") + "/**")
	                .and().authorizeRequests().anyRequest().authenticated();
	            
	        }
	    };
	}

}
