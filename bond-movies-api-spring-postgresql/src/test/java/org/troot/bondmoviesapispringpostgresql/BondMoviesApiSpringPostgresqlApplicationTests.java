package org.troot.bondmoviesapispringpostgresql;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BondMoviesApiSpringPostgresqlApplicationTests {

	@Autowired
	BondMoviesApiSpringPostgresqlApplication bondMoviesApiSpringPostgresqlApplication;

	@Test
	void contextLoads() {
		System.out.println(bondMoviesApiSpringPostgresqlApplication.toString());
	}

}
