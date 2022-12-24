package org.troot.bondmovieapi.controller;

import org.apache.camel.EndpointInject;
import org.apache.camel.ProducerTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.troot.bondmovieapi.route.BondMovieRouteBuilder;
import org.troot.bondmovieapi.boundary.BondMovieRequest;

//import javax.validation.Valid;

import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
public class BondMovieController {

    @Autowired
    @EndpointInject(uri = BondMovieRouteBuilder.QUEUE_BOND_MOVIE_ROUTE)
    private ProducerTemplate producerTemplate;

    @PostMapping("/v1/bond-movie-events/review-updates/enqueue")
    @ResponseStatus(NO_CONTENT)
    public String enqueueBondMovie(@RequestBody BondMovieRequest bondMovieRequest) {

        producerTemplate.requestBodyAndHeaders(BondMovieRouteBuilder.QUEUE_BOND_MOVIE_ROUTE, bondMovieRequest, null, String.class);
        return "";
    }
}
