package org.troot.BondSpring;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {"org.troot.BondSpring.repository"})
public class BondSpringApplication {

	public static void main(String[] args) {
		run(BondSpringApplication.class, args);
	}

}
