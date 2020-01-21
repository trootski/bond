package org.troot.BondSpring.controller;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.troot.BondSpring.domain.BondMovie;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class BondMovieControllerIntegrationTests {

  @Autowired
  BondMovieController bondMovieController;

  @Test
  public void testGetAllMoviesHappyPath() {
    List<BondMovie> result = bondMovieController.getAllMovies();
    assertThat(result, is(notNullValue()));
    assertThat(result.get(0).getTitle(), is(equalTo("Dr. No")));
  }
}
