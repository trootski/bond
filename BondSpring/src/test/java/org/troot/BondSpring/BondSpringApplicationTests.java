package org.troot.BondSpring;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringRunner;
import org.troot.BondSpring.repository.PagingBondMovieRepository;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
public class BondSpringApplicationTests {

  @Autowired
  BondSpringApplication bondSpringApplication;

	@Test
	public void contextLoads() {
	  System.out.println(bondSpringApplication.toString());
	}

}

