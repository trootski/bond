package org.troot.BondSpring;

import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
public class BondSpringApplication {

	public static void main(String[] args) {
		run(BondSpringApplication.class, args);
	}

}
