package org.troot.BondSpring.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.troot.BondSpring.entity.BondMovie;

import java.util.Arrays;
import java.util.List;

@RestController
public class MovieController {

    @RequestMapping(value = "/v1/bond-movies", method = RequestMethod.GET)
    @ApiOperation(value = "Get a list of all current Bond movies", notes = "Get all Bond movies current stored in data persistence" )
    public List<BondMovie> getAllMovies() {
        BondMovie[] allMovies = new BondMovie[] { new BondMovie() };
        List<BondMovie> newMovies = Arrays.asList(new BondMovie());
        return newMovies;
    }
}
