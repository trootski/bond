package org.troot.moviemetadataapispring.boundary;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TMDBSearchResultsResponse {
    private Integer page;
    private List<TMDBMovieMetadataResponse> results;
    private Integer total_pages;
    private Integer total_results;
}
