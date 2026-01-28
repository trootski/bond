package org.troot.bondmovieapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.troot.bondmovieapi.boundary.BondMovieReq;
import org.troot.bondmovieapi.entity.BondMovie;
import org.troot.bondmovieapi.service.BondMovieService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
public class BondMovieController {

  private final BondMovieService bondMovieService;

  public BondMovieController(BondMovieService bondMovieService) {
    this.bondMovieService = bondMovieService;
  }

  private static final Logger logger = LoggerFactory.getLogger(BondMovieController.class);

  @RequestMapping(value = "/v1/bond-movies", method = RequestMethod.GET)
  @Operation(
          summary = "Get a list of all current Bond movies",
          description = "Get all Bond movies current stored in data persistence")
  public List<BondMovie> getAllMovies() {
      logger.info("GET /v1/bond-movies");
      return bondMovieService.getAllMovies();
  }

  @RequestMapping(value = "/v1/bond-movies/{title:.+}", method = RequestMethod.GET)
  @Operation(
          summary = "Get a bond movie by title",
          description = "Search for a particular bond movie")
  public BondMovie getBondMovie(@PathVariable(value = "title") String title) {
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
   @Operation(
           summary = "Put a new bond movie entry",
           description = "Create a new record in the database for the given bond movie")
   public ResponseEntity<Void> putBondMovie(@PathVariable("title") String title, @Valid @RequestBody BondMovieReq bondMovieReq) {
     logger.info("PUT /v1/bond-movies/{}", title);
     bondMovieReq.setTitle(title);

     BondMovie bondMovie = convertToEntity(bondMovieReq);

     bondMovieService.createBondMovie(bondMovie);
     return ResponseEntity.noContent().build();
   }

   private BondMovie convertToEntity(BondMovieReq bondMovieReq) {
     BondMovie bondMovie = new BondMovie();
     bondMovie.setTitle(bondMovieReq.getTitle());
     bondMovie.setRuntime(bondMovieReq.getRuntime());
     bondMovie.setReview(bondMovieReq.getReview());
     bondMovie.setImdbid(bondMovieReq.getImdbid());
     bondMovie.setSynopsis(bondMovieReq.getSynopsis());
     bondMovie.setMovieType(bondMovieReq.getMovie_type() != null ? bondMovieReq.getMovie_type() : "bond");
     bondMovie.setYear(bondMovieReq.getYear());
     bondMovie.setPoster(bondMovieReq.getPoster());
     bondMovie.setCatalog_order(bondMovieReq.getCatalog_order());
     bondMovie.setActor(bondMovieReq.getActor());
     bondMovie.setDirector(bondMovieReq.getDirector());
     return bondMovie;
   }

}
