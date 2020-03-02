package org.troot.bondmoviesapispringpostgresql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@SpringBootApplication
public class BondMoviesApiSpringPostgresqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(BondMoviesApiSpringPostgresqlApplication.class, args);
	}

	@Bean
	public InternalResourceViewResolver defaultViewResolver() {
		return new InternalResourceViewResolver();
	}

}
