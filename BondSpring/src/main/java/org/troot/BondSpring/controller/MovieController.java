package org.troot.BondSpring.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.troot.BondSpring.domain.BondMovie;
import org.springframework.data.domain.Page;
import org.troot.BondSpring.repository.PagingBondMovieRepository;

import java.util.Arrays;
import java.util.List;

@RestController
public class MovieController {

  @Autowired
  PagingBondMovieRepository pagingBondMovieRepository;

  @RequestMapping(value = "/v1/bond-movies", method = RequestMethod.GET)
  @ApiOperation(value = "Get a list of all current Bond movies", notes = "Get all Bond movies current stored in data persistence" )
  public List<BondMovie> getAllMovies() {
      BondMovie[] allMovies = new BondMovie[] { new BondMovie() };
      BondMovie b = new BondMovie();
      b.setMovieTitle("Dr. No");
      b.setTitle("Dr. No");
      // List<BondMovie> allDBMovies = pagingBondMovieRepository.findAll();
      List<BondMovie> newMovies = Arrays.asList(b);
      return newMovies;
  }
}
