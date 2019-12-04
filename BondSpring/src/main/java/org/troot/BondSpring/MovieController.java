package org.troot.BondSpring;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovieController {

    @RequestMapping("/v1/bond-movies")
    public BondMovie[] getAllMovies() {
        BondMovie[] allMovies = new BondMovie[] {new BondMovie()};
        return allMovies;
    }
}
