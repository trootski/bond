package org.troot.BondSpring;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import static org.springframework.boot.SpringApplication.*;

@SpringBootApplication
public class BondSpringApplication {

	public static void main(String[] args) {
		run(BondSpringApplication.class, args);
	}

}
