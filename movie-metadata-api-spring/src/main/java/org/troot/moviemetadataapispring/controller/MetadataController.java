package org.troot.moviemetadataapispring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.troot.moviemetadataapispring.boundary.MovieMetadataResponse;
import org.troot.moviemetadataapispring.service.MetadataService;

@Controller
public class MetadataController {

    @Autowired
    private MetadataService metadataService;

    @RequestMapping("/api/v1/movies/{title:.+}")
    public ResponseEntity<MovieMetadataResponse> getMovieMetadata(@PathVariable("title") String title) {
        MovieMetadataResponse movieMetadataResponse = metadataService.getMovieMetadata(title)
                .orElseThrow(() -> new RuntimeException("No movie found"));
        return ResponseEntity.status(HttpStatus.OK).body(movieMetadataResponse);
    }

}
