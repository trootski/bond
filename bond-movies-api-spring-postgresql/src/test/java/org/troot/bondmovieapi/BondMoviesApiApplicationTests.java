package org.troot.bondmovieapi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BondMoviesApiApplicationTests {

	@Autowired
	BondMoviesApiApplication bondMoviesApiApplication;

	@Test
	void contextLoads() {
		System.out.println(bondMoviesApiApplication.toString());
	}
}
