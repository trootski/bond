package org.troot.BondSpring.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.troot.BondSpring.domain.BondMovie;
import org.troot.BondSpring.service.BondMovieService;

import java.util.Arrays;
import java.util.List;

@RestController
public class BondMovieController {

  @Autowired
  BondMovieService bondMovieService;

  @RequestMapping(value = "/v1/bond-movies", method = RequestMethod.GET)
  @ApiOperation(value = "Get a list of all current Bond movies", notes = "Get all Bond movies current stored in data persistence" )
  public List<BondMovie> getAllMovies() {
      return bondMovieService.getAllMovies();
  }

  @RequestMapping(value = "/v1/bond-movies/{title}", method = RequestMethod.PUT)
  @ApiOperation(value = "Put a new bond movie entry", notes = "Create a new record in the database for the given bond movie" )
  public BondMovie putBondMovie(@PathVariable("title") String title, @RequestBody BondMovie bondMovie) {
    bondMovie.setTitle(title);
    return bondMovieService.createBondMovie(bondMovie);
  }
}
