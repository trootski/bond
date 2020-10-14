package org.troot.BondSpring.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.troot.BondSpring.domain.BondMovie;
import org.troot.BondSpring.service.BondMovieService;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(BondMovieController.class)
public class BondMovieControllerUnitTests {

  @MockBean
  private BondMovieService bondMovieService;

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void getAllMoviesNoMovies() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    given(bondMovieService.getAllMovies()).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies"))
      .andExpect(status().isOk())
      .andExpect(content().string("[]"));
  }

  @Test
  public void getAllMoviesOneMovie() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    BondMovie mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("Test Bond Movie Title");
    mockBondMovie.setType("movie");
    mockBondMovie.setReview("Test Bond Movie Review");

    mockBondMovies.add(mockBondMovie);
    given(bondMovieService.getAllMovies()).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.[0].title", is("Test Bond Movie Title")))
      .andExpect(jsonPath("$.[0].type", is("movie")))
      .andExpect(jsonPath("$.[0].review", is("Test Bond Movie Review")));
  }

  @Test
  public void getAllMoviesMultipleMovies() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    BondMovie mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("Test Bond Movie Title 1");
    mockBondMovie.setType("movie");
    mockBondMovie.setReview("Test Bond Movie Review 1");

    mockBondMovies.add(mockBondMovie);

    mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("Test Bond Movie Title 2");
    mockBondMovie.setType("movie");
    mockBondMovie.setReview("Test Bond Movie Review 2");

    mockBondMovies.add(mockBondMovie);

    given(bondMovieService.getAllMovies()).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.[0].title", is("Test Bond Movie Title 1")))
      .andExpect(jsonPath("$.[0].type", is("movie")))
      .andExpect(jsonPath("$.[0].review", is("Test Bond Movie Review 1")))
      .andExpect(jsonPath("$.[1].title", is("Test Bond Movie Title 2")))
      .andExpect(jsonPath("$.[1].type", is("movie")))
      .andExpect(jsonPath("$.[1].review", is("Test Bond Movie Review 2")));
  }

  @Test
  public void getBondMovieMovieNotFound() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    BondMovie mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("Test Bond Movie Title 1");
    mockBondMovie.setType("movie");
    mockBondMovie.setReview("Test Bond Movie Review 1");

    mockBondMovies.add(mockBondMovie);

    mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("Test Bond Movie Title 2");
    mockBondMovie.setType("movie");
    mockBondMovie.setReview("Test Bond Movie Review 2");

    mockBondMovies.add(mockBondMovie);

    given(bondMovieService.getAllMovies()).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.[0].title", is("Test Bond Movie Title 1")))
      .andExpect(jsonPath("$.[0].type", is("movie")))
      .andExpect(jsonPath("$.[0].review", is("Test Bond Movie Review 1")))
      .andExpect(jsonPath("$.[1].title", is("Test Bond Movie Title 2")))
      .andExpect(jsonPath("$.[1].type", is("movie")))
      .andExpect(jsonPath("$.[1].review", is("Test Bond Movie Review 2")));
  }

  @Test
  public void getBondMovieBytTitleNotFoundWithNullInList() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    mockBondMovies.add(null);

    given(bondMovieService.getBondMovie("GoldenEye")).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies/GoldenEye"))
      .andExpect(status().isNotFound())
      .andExpect(status().reason("bond movie not found"));
  }

  @Test
  public void getBondMovieBytTitleFound() throws Exception {
    List<BondMovie> mockBondMovies = new ArrayList<>();

    BondMovie mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("GoldenEye");
    mockBondMovie.setImdbid("imdbid1");

    mockBondMovies.add(mockBondMovie);

    given(bondMovieService.getBondMovie("GoldenEye")).willReturn(mockBondMovies);

    this.mockMvc.perform(get("/v1/bond-movies/GoldenEye"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.title", is("GoldenEye")))
      .andExpect(jsonPath("$.imdbid", is("imdbid1")));
  }

  @Test
  public void putBondMovieByTitle() throws Exception {
    BondMovie mockBondMovie = new BondMovie();
    mockBondMovie.setTitle("GoldenEye");

    given(bondMovieService.createBondMovie(mockBondMovie)).willReturn(mockBondMovie);

    this.mockMvc.perform(put("/v1/bond-movies/GoldenEye")
        .contentType(MediaType.APPLICATION_JSON)
        .characterEncoding("UTF-8")
        .content("{\"title\":\"GoldenEye\"}")
      )
      .andExpect(status().isOk())
      .andExpect(content().string(""));
  }
}
