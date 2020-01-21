package org.troot.BondSpring.controller;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.troot.BondSpring.domain.BondMovie;

import java.util.List;

@RunWith(SpringRunner.class)
@WebMvcTest(BondMovieController.class)
public class BondMovieControllerUnitTests {

  @Autowired
  private MockMvc mockMvc;

  @InjectMocks
  private BondMovieController bondMovieController;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testGetMoviesHappyPath() throws Exception {
    List<BondMovie> bondMovies = bondMovieController.getAllMovies();
    assertThat(bondMovies, is(notNullValue()));
  }

}
