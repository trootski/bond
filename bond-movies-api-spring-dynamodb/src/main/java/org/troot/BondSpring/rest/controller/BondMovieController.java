package org.troot.BondSpring.rest.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.troot.BondSpring.entity.BondMovie;
import org.troot.BondSpring.service.BondMovieService;

import java.util.List;

@RestController
public class BondMovieController {

  @Autowired
  BondMovieService bondMovieService;

  private static final Logger logger = LoggerFactory.getLogger(BondMovieController.class);

  @RequestMapping(value = "/v1/bond-movies", method = RequestMethod.GET)
  public List<BondMovie> getAllMovies() {
      logger.info("GET /v1/bond-movies");
      return bondMovieService.getAllMovies();
  }

  @RequestMapping(value = "/v1/bond-movies/{title:.+}", method = RequestMethod.GET)
  public BondMovie getBondMovie(@PathVariable(value = "title", required = true) String title) {
    logger.info("GET /v1/bond-movies/{}", title);
    List<BondMovie> bondMovies = bondMovieService.getBondMovie(title);
    if (bondMovies.isEmpty() || bondMovies.get(0) == null) {
      throw new ResponseStatusException(
        HttpStatus.NOT_FOUND, "bond movie not found"
      );
    } else {
      return bondMovies.get(0);
    }
  }

  @RequestMapping(value = "/v1/bond-movies/{title:.+}", method = RequestMethod.PUT)
  public BondMovie putBondMovie(@PathVariable("title") String title, @RequestBody BondMovie bondMovie) {
    logger.info("PUT /v1/bond-movies/{}", title);
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      String json = objectMapper.writeValueAsString(bondMovie);
      logger.info("PAYLOAD: {}", json);
    } catch (JsonProcessingException jpe) {
      logger.error("Error parsing input");
    }
    bondMovie.setTitle(title);
    return bondMovieService.createBondMovie(bondMovie);
  }
}
